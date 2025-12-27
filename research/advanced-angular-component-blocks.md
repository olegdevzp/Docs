# Advanced Component Blocks in Angular

A comprehensive guide to building sophisticated, reusable, and enterprise-grade component blocks using modern Angular patterns and best practices.

## 🏗️ Component Architecture Patterns

### 1. Atomic Design Methodology

#### Atoms - Basic Building Blocks
```typescript
// Button Atom
@Component({
  selector: 'app-button',
  template: `
    <button 
      [class]="buttonClasses"
      [disabled]="disabled"
      [type]="type"
      (click)="onClick($event)">
      <ng-container *ngIf="loading; else content">
        <app-spinner [size]="'sm'"></app-spinner>
      </ng-container>
      <ng-template #content>
        <ng-content></ng-content>
      </ng-template>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SpinnerComponent]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return [
      'btn',
      `btn--${this.variant}`,
      `btn--${this.size}`,
      this.disabled ? 'btn--disabled' : '',
      this.loading ? 'btn--loading' : ''
    ].filter(Boolean).join(' ');
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}

// Input Atom
@Component({
  selector: 'app-input',
  template: `
    <div class="input-wrapper" [class.input-wrapper--error]="hasError">
      <label *ngIf="label" [for]="inputId" class="input-label">
        {{ label }}
        <span *ngIf="required" class="required">*</span>
      </label>
      
      <div class="input-container">
        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readonly]="readonly"
          [value]="value"
          [class]="inputClasses"
          (input)="onInput($event)"
          (blur)="onBlur($event)"
          (focus)="onFocus($event)"
          #inputElement>
        
        <div class="input-actions" *ngIf="hasActions">
          <ng-content select="[slot=actions]"></ng-content>
        </div>
      </div>
      
      <div class="input-feedback" *ngIf="hasError || hint">
        <span class="error-message" *ngIf="hasError">{{ errorMessage }}</span>
        <span class="hint-message" *ngIf="hint && !hasError">{{ hint }}</span>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type: InputType = 'text';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() hint?: string;
  @Input() errorMessage?: string;
  
  inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  value = '';
  hasError = false;
  hasActions = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit(): void {
    this.hasActions = !!this.elementRef.nativeElement.querySelector('[slot=actions]');
  }

  get inputClasses(): string {
    return [
      'input',
      this.hasError ? 'input--error' : '',
      this.disabled ? 'input--disabled' : '',
      this.readonly ? 'input--readonly' : ''
    ].filter(Boolean).join(' ');
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(event: FocusEvent): void {
    this.onTouched();
  }

  onFocus(event: FocusEvent): void {
    // Focus logic
  }
}
```

#### Molecules - Component Combinations
```typescript
// Search Box Molecule
@Component({
  selector: 'app-search-box',
  template: `
    <div class="search-box">
      <app-input
        [placeholder]="placeholder"
        [value]="searchTerm"
        [disabled]="disabled"
        (valueChange)="onSearchTermChange($event)">
        <div slot="actions">
          <app-button 
            variant="ghost" 
            size="sm"
            [disabled]="!searchTerm"
            (clicked)="clearSearch()">
            <app-icon name="x"></app-icon>
          </app-button>
          <app-button 
            variant="primary" 
            size="sm"
            [loading]="searching"
            (clicked)="performSearch()">
            <app-icon name="search"></app-icon>
          </app-button>
        </div>
      </app-input>
      
      <!-- Search Results Dropdown -->
      <div class="search-results" *ngIf="showResults && results.length > 0">
        <div 
          class="search-result-item"
          *ngFor="let result of results; trackBy: trackByResult"
          (click)="selectResult(result)">
          <app-avatar [src]="result.avatar" [alt]="result.name"></app-avatar>
          <div class="result-content">
            <span class="result-title">{{ result.name }}</span>
            <span class="result-subtitle">{{ result.subtitle }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, InputComponent, ButtonComponent, IconComponent, AvatarComponent]
})
export class SearchBoxComponent {
  @Input() placeholder = 'Search...';
  @Input() disabled = false;
  @Input() debounceTime = 300;
  @Output() search = new EventEmitter<string>();
  @Output() resultSelected = new EventEmitter<SearchResult>();

  searchTerm = '';
  searching = false;
  showResults = false;
  results: SearchResult[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.performSearch();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchTermChange(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  performSearch(): void {
    if (!this.searchTerm.trim()) return;
    
    this.searching = true;
    this.search.emit(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.results = [];
    this.showResults = false;
    this.cdr.markForCheck();
  }

  selectResult(result: SearchResult): void {
    this.resultSelected.emit(result);
    this.showResults = false;
  }

  trackByResult(index: number, result: SearchResult): string {
    return result.id;
  }
}
```

#### Organisms - Complex Component Groups
```typescript
// Data Table Organism
@Component({
  selector: 'app-data-table',
  template: `
    <div class="data-table-container">
      <!-- Table Header with Actions -->
      <div class="table-header">
        <div class="table-title">
          <h3>{{ title }}</h3>
          <span class="table-count">{{ totalCount }} items</span>
        </div>
        
        <div class="table-actions">
          <app-search-box 
            [placeholder]="'Search ' + title.toLowerCase()"
            (search)="onSearch($event)">
          </app-search-box>
          
          <app-button 
            variant="secondary"
            (clicked)="exportData()">
            <app-icon name="download"></app-icon>
            Export
          </app-button>
          
          <app-button 
            variant="primary"
            (clicked)="addNew()">
            <app-icon name="plus"></app-icon>
            Add New
          </app-button>
        </div>
      </div>

      <!-- Filters -->
      <div class="table-filters" *ngIf="filters.length > 0">
        <app-filter-chip
          *ngFor="let filter of activeFilters; trackBy: trackByFilter"
          [filter]="filter"
          (remove)="removeFilter(filter)">
        </app-filter-chip>
        
        <app-dropdown>
          <app-button variant="ghost" size="sm" dropdownTrigger>
            <app-icon name="filter"></app-icon>
            Add Filter
          </app-button>
          <div dropdownContent>
            <app-filter-option
              *ngFor="let filter of availableFilters"
              [filter]="filter"
              (apply)="applyFilter($event)">
            </app-filter-option>
          </div>
        </app-dropdown>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="data-table" [class.table--loading]="loading">
          <thead>
            <tr>
              <th *ngIf="selectable" class="select-column">
                <app-checkbox
                  [checked]="isAllSelected"
                  [indeterminate]="isPartiallySelected"
                  (change)="toggleSelectAll($event)">
                </app-checkbox>
              </th>
              <th 
                *ngFor="let column of columns; trackBy: trackByColumn"
                [class]="getColumnClasses(column)"
                (click)="onSort(column)">
                <div class="column-header">
                  <span>{{ column.label }}</span>
                  <app-icon 
                    *ngIf="column.sortable"
                    [name]="getSortIcon(column)"
                    class="sort-icon">
                  </app-icon>
                </div>
              </th>
              <th *ngIf="hasActions" class="actions-column">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            <tr 
              *ngFor="let item of paginatedData; trackBy: trackByItem; let i = index"
              [class.row--selected]="isSelected(item)"
              (click)="onRowClick(item)">
              
              <td *ngIf="selectable" class="select-column">
                <app-checkbox
                  [checked]="isSelected(item)"
                  (change)="toggleSelection(item, $event)">
                </app-checkbox>
              </td>
              
              <td 
                *ngFor="let column of columns; trackBy: trackByColumn"
                [class]="getCellClasses(column, item)">
                <ng-container [ngSwitch]="column.type">
                  <!-- Text Cell -->
                  <span *ngSwitchCase="'text'">
                    {{ getCellValue(item, column) }}
                  </span>
                  
                  <!-- Badge Cell -->
                  <app-badge 
                    *ngSwitchCase="'badge'"
                    [variant]="getBadgeVariant(item, column)"
                    [text]="getCellValue(item, column)">
                  </app-badge>
                  
                  <!-- Avatar Cell -->
                  <app-avatar 
                    *ngSwitchCase="'avatar'"
                    [src]="getCellValue(item, column)"
                    [alt]="getAvatarAlt(item, column)">
                  </app-avatar>
                  
                  <!-- Date Cell -->
                  <span *ngSwitchCase="'date'">
                    {{ getCellValue(item, column) | date: column.format }}
                  </span>
                  
                  <!-- Custom Cell -->
                  <ng-container *ngSwitchCase="'custom'">
                    <ng-container 
                      *ngTemplateOutlet="column.template; context: { $implicit: item, column: column }">
                    </ng-container>
                  </ng-container>
                </ng-container>
              </td>
              
              <td *ngIf="hasActions" class="actions-column">
                <app-dropdown>
                  <app-button variant="ghost" size="sm" dropdownTrigger>
                    <app-icon name="more-vertical"></app-icon>
                  </app-button>
                  <div dropdownContent>
                    <app-menu-item
                      *ngFor="let action of getRowActions(item)"
                      [disabled]="action.disabled"
                      (click)="executeAction(action, item)">
                      <app-icon [name]="action.icon"></app-icon>
                      {{ action.label }}
                    </app-menu-item>
                  </div>
                </app-dropdown>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Loading State -->
        <div class="table-loading" *ngIf="loading">
          <app-spinner></app-spinner>
          <span>Loading data...</span>
        </div>
        
        <!-- Empty State -->
        <div class="table-empty" *ngIf="!loading && data.length === 0">
          <app-icon name="inbox" size="lg"></app-icon>
          <h4>No data found</h4>
          <p>{{ emptyMessage }}</p>
          <app-button variant="primary" (clicked)="addNew()">
            Add First Item
          </app-button>
        </div>
      </div>

      <!-- Pagination -->
      <app-pagination
        *ngIf="totalCount > pageSize"
        [currentPage]="currentPage"
        [totalItems]="totalCount"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)">
      </app-pagination>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule, 
    SearchBoxComponent, 
    ButtonComponent, 
    CheckboxComponent,
    BadgeComponent,
    AvatarComponent,
    DropdownComponent,
    MenuItemComponent,
    FilterChipComponent,
    PaginationComponent,
    SpinnerComponent,
    IconComponent
  ]
})
export class DataTableComponent<T = any> implements OnInit {
  @Input() title = 'Data Table';
  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading = false;
  @Input() selectable = false;
  @Input() emptyMessage = 'No items to display';
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [10, 25, 50, 100];
  
  @Output() search = new EventEmitter<string>();
  @Output() sort = new EventEmitter<SortEvent>();
  @Output() rowClick = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();
  @Output() actionExecute = new EventEmitter<ActionEvent<T>>();
  @Output() addNew = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();

  // Internal state
  currentPage = 1;
  sortColumn?: string;
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedItems = new Set<T>();
  activeFilters: Filter[] = [];
  availableFilters: Filter[] = [];

  get totalCount(): number {
    return this.data.length;
  }

  get paginatedData(): T[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.data.slice(start, end);
  }

  get isAllSelected(): boolean {
    return this.selectedItems.size === this.data.length && this.data.length > 0;
  }

  get isPartiallySelected(): boolean {
    return this.selectedItems.size > 0 && this.selectedItems.size < this.data.length;
  }

  get hasActions(): boolean {
    return this.columns.some(col => col.actions && col.actions.length > 0);
  }

  // Implementation methods...
  onSort(column: TableColumn): void {
    if (!column.sortable) return;
    
    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }
    
    this.sort.emit({
      column: column.key,
      direction: this.sortDirection
    });
  }

  toggleSelection(item: T, checked: boolean): void {
    if (checked) {
      this.selectedItems.add(item);
    } else {
      this.selectedItems.delete(item);
    }
    this.selectionChange.emit(Array.from(this.selectedItems));
  }

  // ... other methods
}
```

### 2. Smart vs Presentational Components

#### Smart Component (Container)
```typescript
@Component({
  selector: 'app-user-management',
  template: `
    <app-page-header
      title="User Management"
      [breadcrumbs]="breadcrumbs">
      <div slot="actions">
        <app-button 
          variant="primary"
          (clicked)="openCreateUserModal()">
          <app-icon name="plus"></app-icon>
          Add User
        </app-button>
      </div>
    </app-page-header>

    <app-data-table
      title="Users"
      [data]="users$ | async"
      [columns]="userTableColumns"
      [loading]="loading$ | async"
      [selectable]="true"
      (search)="onSearch($event)"
      (sort)="onSort($event)"
      (rowClick)="onUserClick($event)"
      (actionExecute)="onUserAction($event)"
      (addNew)="openCreateUserModal()">
    </app-data-table>

    <!-- User Detail Modal -->
    <app-modal 
      [(visible)]="showUserModal"
      title="User Details"
      size="lg">
      <app-user-form
        [user]="selectedUser$ | async"
        [loading]="userFormLoading$ | async"
        (save)="onUserSave($event)"
        (cancel)="closeUserModal()">
      </app-user-form>
    </app-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    PageHeaderComponent,
    DataTableComponent,
    ModalComponent,
    UserFormComponent,
    ButtonComponent,
    IconComponent
  ]
})
export class UserManagementComponent implements OnInit {
  // Observables from store/service
  users$ = this.userService.users$;
  loading$ = this.userService.loading$;
  selectedUser$ = this.userService.selectedUser$;
  userFormLoading$ = this.userService.userFormLoading$;

  // Component state
  showUserModal = false;
  breadcrumbs = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Users', route: '/users' }
  ];

  userTableColumns: TableColumn[] = [
    {
      key: 'avatar',
      label: 'Avatar',
      type: 'avatar',
      sortable: false
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      sortable: true
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      sortable: true
    },
    {
      key: 'role',
      label: 'Role',
      type: 'badge',
      sortable: true
    },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      sortable: true
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      type: 'date',
      format: 'medium',
      sortable: true
    }
  ];

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userService.loadUsers();
  }

  onSearch(term: string): void {
    this.userService.searchUsers(term);
  }

  onSort(event: SortEvent): void {
    this.userService.sortUsers(event.column, event.direction);
  }

  onUserClick(user: User): void {
    this.userService.selectUser(user.id);
    this.showUserModal = true;
  }

  onUserAction(event: ActionEvent<User>): void {
    switch (event.action.key) {
      case 'edit':
        this.editUser(event.item);
        break;
      case 'delete':
        this.deleteUser(event.item);
        break;
      case 'activate':
        this.activateUser(event.item);
        break;
      case 'deactivate':
        this.deactivateUser(event.item);
        break;
    }
  }

  openCreateUserModal(): void {
    this.userService.clearSelectedUser();
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.userService.clearSelectedUser();
  }

  onUserSave(userData: Partial<User>): void {
    this.userService.saveUser(userData).subscribe({
      next: () => {
        this.notificationService.success('User saved successfully');
        this.closeUserModal();
      },
      error: (error) => {
        this.notificationService.error('Failed to save user');
      }
    });
  }

  private editUser(user: User): void {
    this.userService.selectUser(user.id);
    this.showUserModal = true;
  }

  private deleteUser(user: User): void {
    this.modalService.confirm({
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.name}?`,
      confirmText: 'Delete',
      confirmVariant: 'danger'
    }).subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteUser(user.id);
      }
    });
  }

  private activateUser(user: User): void {
    this.userService.updateUserStatus(user.id, 'active');
  }

  private deactivateUser(user: User): void {
    this.userService.updateUserStatus(user.id, 'inactive');
  }
}
```

#### Presentational Component
```typescript
@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div class="form-grid">
        <!-- Personal Information -->
        <div class="form-section">
          <h4>Personal Information</h4>
          
          <div class="form-row">
            <app-input
              label="First Name"
              placeholder="Enter first name"
              formControlName="firstName"
              [required]="true"
              [errorMessage]="getFieldError('firstName')">
            </app-input>
            
            <app-input
              label="Last Name"
              placeholder="Enter last name"
              formControlName="lastName"
              [required]="true"
              [errorMessage]="getFieldError('lastName')">
            </app-input>
          </div>
          
          <app-input
            label="Email"
            type="email"
            placeholder="Enter email address"
            formControlName="email"
            [required]="true"
            [errorMessage]="getFieldError('email')">
          </app-input>
          
          <app-input
            label="Phone"
            type="tel"
            placeholder="Enter phone number"
            formControlName="phone"
            [errorMessage]="getFieldError('phone')">
          </app-input>
        </div>

        <!-- Role & Permissions -->
        <div class="form-section">
          <h4>Role & Permissions</h4>
          
          <app-select
            label="Role"
            placeholder="Select user role"
            formControlName="roleId"
            [options]="roleOptions"
            [required]="true"
            [errorMessage]="getFieldError('roleId')">
          </app-select>
          
          <app-select
            label="Department"
            placeholder="Select department"
            formControlName="departmentId"
            [options]="departmentOptions"
            [errorMessage]="getFieldError('departmentId')">
          </app-select>
          
          <div class="permissions-section">
            <label class="section-label">Permissions</label>
            <div class="permission-grid">
              <app-checkbox
                *ngFor="let permission of availablePermissions"
                [label]="permission.label"
                [value]="permission.id"
                [checked]="hasPermission(permission.id)"
                (change)="onPermissionChange(permission.id, $event)">
              </app-checkbox>
            </div>
          </div>
        </div>

        <!-- Account Settings -->
        <div class="form-section">
          <h4>Account Settings</h4>
          
          <app-toggle
            label="Account Active"
            formControlName="isActive"
            hint="Inactive users cannot log in">
          </app-toggle>
          
          <app-toggle
            label="Email Notifications"
            formControlName="emailNotifications"
            hint="Send email notifications to user">
          </app-toggle>
          
          <app-toggle
            label="Two-Factor Authentication"
            formControlName="twoFactorEnabled"
            hint="Require 2FA for login">
          </app-toggle>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <app-button
          type="button"
          variant="secondary"
          (clicked)="onCancel()">
          Cancel
        </app-button>
        
        <app-button
          type="submit"
          variant="primary"
          [disabled]="userForm.invalid || loading"
          [loading]="loading">
          {{ isEditMode ? 'Update User' : 'Create User' }}
        </app-button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    ToggleComponent,
    ButtonComponent
  ]
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() user?: User;
  @Input() loading = false;
  @Input() roleOptions: SelectOption[] = [];
  @Input() departmentOptions: SelectOption[] = [];
  @Input() availablePermissions: Permission[] = [];
  
  @Output() save = new EventEmitter<Partial<User>>();
  @Output() cancel = new EventEmitter<void>();

  userForm!: FormGroup;
  selectedPermissions = new Set<string>();

  get isEditMode(): boolean {
    return !!this.user?.id;
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.userForm) {
      this.updateFormWithUser();
    }
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[\d\s-()]+$/)]],
      roleId: ['', Validators.required],
      departmentId: [''],
      isActive: [true],
      emailNotifications: [true],
      twoFactorEnabled: [false]
    });

    if (this.user) {
      this.updateFormWithUser();
    }
  }

  private updateFormWithUser(): void {
    if (!this.user) return;

    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone,
      roleId: this.user.roleId,
      departmentId: this.user.departmentId,
      isActive: this.user.isActive,
      emailNotifications: this.user.emailNotifications,
      twoFactorEnabled: this.user.twoFactorEnabled
    });

    this.selectedPermissions = new Set(this.user.permissions || []);
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: Partial<User> = {
        ...formValue,
        permissions: Array.from(this.selectedPermissions)
      };

      if (this.isEditMode) {
        userData.id = this.user!.id;
      }

      this.save.emit(userData);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  hasPermission(permissionId: string): boolean {
    return this.selectedPermissions.has(permissionId);
  }

  onPermissionChange(permissionId: string, checked: boolean): void {
    if (checked) {
      this.selectedPermissions.add(permissionId);
    } else {
      this.selectedPermissions.delete(permissionId);
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field && field.invalid && field.touched) {
      const errors = field.errors;
      if (errors?.['required']) return `${fieldName} is required`;
      if (errors?.['email']) return 'Invalid email format';
      if (errors?.['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required`;
      if (errors?.['pattern']) return 'Invalid format';
    }
    return '';
  }
}
```

## 3. Advanced Component Patterns

### Compound Components Pattern
```typescript
// Tab Group Compound Component
@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs">
      <div class="tab-list" role="tablist">
        <ng-content select="app-tab"></ng-content>
      </div>
      <div class="tab-panels">
        <ng-content select="app-tab-panel"></ng-content>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
  providers: [TabsService]
})
export class TabsComponent implements OnInit, AfterContentInit {
  @Input() defaultTab?: string;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Output() tabChange = new EventEmitter<string>();

  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  @ContentChildren(TabPanelComponent) panels!: QueryList<TabPanelComponent>;

  constructor(private tabsService: TabsService) {}

  ngOnInit(): void {
    this.tabsService.tabChange$.subscribe(tabId => {
      this.tabChange.emit(tabId);
    });
  }

  ngAfterContentInit(): void {
    // Initialize tabs and panels
    this.setupTabsAndPanels();
    
    // Set default active tab
    const activeTab = this.defaultTab || this.tabs.first?.tabId;
    if (activeTab) {
      this.tabsService.setActiveTab(activeTab);
    }
  }

  private setupTabsAndPanels(): void {
    this.tabs.forEach(tab => {
      tab.tabsService = this.tabsService;
    });

    this.panels.forEach(panel => {
      panel.tabsService = this.tabsService;
    });
  }
}

@Component({
  selector: 'app-tab',
  template: `
    <button
      class="tab"
      [class.tab--active]="isActive"
      [class.tab--disabled]="disabled"
      [disabled]="disabled"
      (click)="onClick()"
      role="tab"
      [attr.aria-selected]="isActive"
      [attr.aria-controls]="tabId + '-panel'">
      <ng-content></ng-content>
    </button>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TabComponent implements OnInit, OnDestroy {
  @Input() tabId!: string;
  @Input() disabled = false;

  tabsService!: TabsService;
  isActive = false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.tabsService.activeTab$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(activeTabId => {
      this.isActive = activeTabId === this.tabId;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClick(): void {
    if (!this.disabled) {
      this.tabsService.setActiveTab(this.tabId);
    }
  }
}

@Component({
  selector: 'app-tab-panel',
  template: `
    <div
      *ngIf="isActive"
      class="tab-panel"
      role="tabpanel"
      [attr.aria-labelledby]="tabId">
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class TabPanelComponent implements OnInit, OnDestroy {
  @Input() tabId!: string;

  tabsService!: TabsService;
  isActive = false;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.tabsService.activeTab$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(activeTabId => {
      this.isActive = activeTabId === this.tabId;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// Usage
/*
<app-tabs defaultTab="profile" (tabChange)="onTabChange($event)">
  <app-tab tabId="profile">Profile</app-tab>
  <app-tab tabId="settings">Settings</app-tab>
  <app-tab tabId="security">Security</app-tab>

  <app-tab-panel tabId="profile">
    <app-user-profile [user]="user"></app-user-profile>
  </app-tab-panel>
  
  <app-tab-panel tabId="settings">
    <app-user-settings [settings]="settings"></app-user-settings>
  </app-tab-panel>
  
  <app-tab-panel tabId="security">
    <app-security-settings [user]="user"></app-security-settings>
  </app-tab-panel>
</app-tabs>
*/
```

### Render Props Pattern (Angular Version)
```typescript
// Data Provider Component with Template Outlet
@Component({
  selector: 'app-data-provider',
  template: `
    <ng-container 
      *ngTemplateOutlet="template; context: templateContext">
    </ng-container>
  `,
  standalone: true,
  imports: [CommonModule]
})
export class DataProviderComponent<T> implements OnInit {
  @Input() dataSource!: (params: any) => Observable<T[]>;
  @Input() template!: TemplateRef<any>;
  @Input() params: any = {};
  @Input() refreshInterval?: number;

  data: T[] = [];
  loading = false;
  error: string | null = null;

  get templateContext() {
    return {
      $implicit: {
        data: this.data,
        loading: this.loading,
        error: this.error,
        refresh: () => this.loadData(),
        retry: () => this.retry()
      }
    };
  }

  ngOnInit(): void {
    this.loadData();
    
    if (this.refreshInterval) {
      interval(this.refreshInterval).subscribe(() => {
        this.loadData();
      });
    }
  }

  private loadData(): void {
    this.loading = true;
    this.error = null;

    this.dataSource(this.params).subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  private retry(): void {
    this.loadData();
  }
}

// Usage with template
/*
<app-data-provider 
  [dataSource]="userDataSource"
  [params]="{ departmentId: selectedDepartment }"
  [refreshInterval]="30000"
  [template]="userListTemplate">
</app-data-provider>

<ng-template #userListTemplate let-state>
  <div *ngIf="state.loading">Loading users...</div>
  <div *ngIf="state.error" class="error">
    {{ state.error }}
    <button (click)="state.retry()">Retry</button>
  </div>
  <app-user-list 
    *ngIf="!state.loading && !state.error"
    [users]="state.data"
    (refresh)="state.refresh()">
  </app-user-list>
</ng-template>
*/
```

### Higher-Order Component Pattern
```typescript
// With Loading HOC
export function withLoading<T extends object>(
  component: Type<T>
): Type<T & { loading: boolean }> {
  
  @Component({
    selector: 'app-with-loading',
    template: `
      <div class="loading-wrapper">
        <div class="loading-overlay" *ngIf="loading">
          <app-spinner></app-spinner>
          <span>{{ loadingMessage }}</span>
        </div>
        <ng-content></ng-content>
      </div>
    `,
    standalone: true,
    imports: [CommonModule, SpinnerComponent]
  })
  class WithLoadingComponent {
    @Input() loading = false;
    @Input() loadingMessage = 'Loading...';
  }

  return WithLoadingComponent as any;
}

// With Error Boundary HOC
export function withErrorBoundary<T extends object>(
  component: Type<T>
): Type<T & { error: string | null }> {
  
  @Component({
    selector: 'app-with-error-boundary',
    template: `
      <div class="error-boundary">
        <div class="error-message" *ngIf="error">
          <app-icon name="alert-triangle" class="error-icon"></app-icon>
          <div class="error-content">
            <h4>Something went wrong</h4>
            <p>{{ error }}</p>
            <app-button variant="secondary" (clicked)="onRetry()">
              Try Again
            </app-button>
          </div>
        </div>
        <ng-content *ngIf="!error"></ng-content>
      </div>
    `,
    standalone: true,
    imports: [CommonModule, IconComponent, ButtonComponent]
  })
  class WithErrorBoundaryComponent {
    @Input() error: string | null = null;
    @Output() retry = new EventEmitter<void>();

    onRetry(): void {
      this.error = null;
      this.retry.emit();
    }
  }

  return WithErrorBoundaryComponent as any;
}
```

## 4. Advanced Form Components

### Dynamic Form Builder
```typescript
// Form Field Configuration
interface FormFieldConfig {
  key: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  validators?: ValidatorFn[];
  options?: SelectOption[];
  hint?: string;
  dependencies?: string[];
  conditionalDisplay?: (formValue: any) => boolean;
  customTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-dynamic-form',
  template: `
    <form [formGroup]="dynamicForm" (ngSubmit)="onSubmit()">
      <div class="form-fields">
        <div 
          *ngFor="let field of visibleFields; trackBy: trackByField"
          class="form-field"
          [class]="getFieldClasses(field)">
          
          <ng-container [ngSwitch]="field.type">
            <!-- Text Input -->
            <app-input
              *ngSwitchCase="'text'"
              [label]="field.label"
              [placeholder]="field.placeholder"
              [required]="field.required"
              [disabled]="field.disabled"
              [hint]="field.hint"
              [errorMessage]="getFieldError(field.key)"
              [formControlName]="field.key">
            </app-input>

            <!-- Select -->
            <app-select
              *ngSwitchCase="'select'"
              [label]="field.label"
              [placeholder]="field.placeholder"
              [required]="field.required"
              [disabled]="field.disabled"
              [hint]="field.hint"
              [options]="field.options || []"
              [errorMessage]="getFieldError(field.key)"
              [formControlName]="field.key">
            </app-select>

            <!-- Checkbox -->
            <app-checkbox
              *ngSwitchCase="'checkbox'"
              [label]="field.label"
              [disabled]="field.disabled"
              [hint]="field.hint"
              [formControlName]="field.key">
            </app-checkbox>

            <!-- Custom Field -->
            <ng-container *ngSwitchDefault>
              <ng-container 
                *ngTemplateOutlet="field.customTemplate; context: { 
                  $implicit: field, 
                  control: dynamicForm.get(field.key),
                  form: dynamicForm 
                }">
              </ng-container>
            </ng-container>
          </ng-container>
        </div>
      </div>

      <div class="form-actions">
        <app-button
          type="button"
          variant="secondary"
          (clicked)="onReset()">
          Reset
        </app-button>
        
        <app-button
          type="submit"
          variant="primary"
          [disabled]="dynamicForm.invalid || submitting"
          [loading]="submitting">
          {{ submitLabel }}
        </app-button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    ButtonComponent
  ]
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() fields: FormFieldConfig[] = [];
  @Input() initialValues: any = {};
  @Input() submitLabel = 'Submit';
  @Input() submitting = false;
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formChange = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();

  dynamicForm!: FormGroup;
  visibleFields: FormFieldConfig[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.setupFormValueChanges();
    this.updateVisibleFields();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    const formControls: { [key: string]: FormControl } = {};

    this.fields.forEach(field => {
      const validators = field.validators || [];
      if (field.required) {
        validators.push(Validators.required);
      }

      const initialValue = this.initialValues[field.key] || this.getDefaultValue(field.type);
      
      formControls[field.key] = new FormControl({
        value: initialValue,
        disabled: field.disabled || false
      }, validators);
    });

    this.dynamicForm = this.fb.group(formControls);
  }

  private setupFormValueChanges(): void {
    this.dynamicForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300)
    ).subscribe(value => {
      this.updateVisibleFields();
      this.formChange.emit(value);
    });
  }

  private updateVisibleFields(): void {
    const formValue = this.dynamicForm.value;
    
    this.visibleFields = this.fields.filter(field => {
      if (field.conditionalDisplay) {
        return field.conditionalDisplay(formValue);
      }
      return true;
    });

    this.cdr.markForCheck();
  }

  private getDefaultValue(type: string): any {
    switch (type) {
      case 'checkbox':
        return false;
      case 'number':
        return 0;
      default:
        return '';
    }
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit(this.dynamicForm.value);
    }
  }

  onReset(): void {
    this.dynamicForm.reset();
    this.formReset.emit();
  }

  getFieldError(fieldKey: string): string {
    const control = this.dynamicForm.get(fieldKey);
    if (control && control.invalid && control.touched) {
      const errors = control.errors;
      if (errors?.['required']) return `${fieldKey} is required`;
      if (errors?.['email']) return 'Invalid email format';
      if (errors?.['min']) return `Minimum value is ${errors['min'].min}`;
      if (errors?.['max']) return `Maximum value is ${errors['max'].max}`;
      // Add more error messages as needed
    }
    return '';
  }

  getFieldClasses(field: FormFieldConfig): string {
    const control = this.dynamicForm.get(field.key);
    return [
      `form-field--${field.type}`,
      control?.invalid && control?.touched ? 'form-field--error' : '',
      field.disabled ? 'form-field--disabled' : ''
    ].filter(Boolean).join(' ');
  }

  trackByField(index: number, field: FormFieldConfig): string {
    return field.key;
  }
}
```

### Advanced File Upload Component
```typescript
@Component({
  selector: 'app-file-upload',
  template: `
    <div class="file-upload" 
         [class.file-upload--dragover]="isDragOver"
         (dragover)="onDragOver($event)"
         (dragleave)="onDragLeave($event)"
         (drop)="onDrop($event)">
      
      <!-- Upload Area -->
      <div class="upload-area" *ngIf="!files.length || multiple">
        <input
          #fileInput
          type="file"
          [accept]="accept"
          [multiple]="multiple"
          (change)="onFileSelect($event)"
          class="file-input">
        
        <div class="upload-content" (click)="fileInput.click()">
          <app-icon name="upload-cloud" size="lg"></app-icon>
          <h4>{{ uploadText }}</h4>
          <p>{{ uploadSubtext }}</p>
          <app-button variant="secondary" size="sm">
            Choose Files
          </app-button>
        </div>
      </div>

      <!-- File List -->
      <div class="file-list" *ngIf="files.length > 0">
        <div 
          class="file-item"
          *ngFor="let file of files; trackBy: trackByFile"
          [class.file-item--error]="file.error"
          [class.file-item--success]="file.status === 'completed'">
          
          <!-- File Preview -->
          <div class="file-preview">
            <img 
              *ngIf="file.preview && isImage(file.file)"
              [src]="file.preview"
              [alt]="file.file.name"
              class="file-thumbnail">
            
            <app-icon 
              *ngIf="!file.preview || !isImage(file.file)"
              [name]="getFileIcon(file.file)"
              class="file-icon">
            </app-icon>
          </div>

          <!-- File Info -->
          <div class="file-info">
            <div class="file-name">{{ file.file.name }}</div>
            <div class="file-size">{{ formatFileSize(file.file.size) }}</div>
            
            <!-- Progress Bar -->
            <div class="file-progress" *ngIf="file.status === 'uploading'">
              <div 
                class="progress-bar"
                [style.width.%]="file.progress">
              </div>
            </div>
            
            <!-- Error Message -->
            <div class="file-error" *ngIf="file.error">
              {{ file.error }}
            </div>
          </div>

          <!-- File Actions -->
          <div class="file-actions">
            <app-button
              *ngIf="file.status === 'pending'"
              variant="ghost"
              size="sm"
              (clicked)="uploadFile(file)">
              <app-icon name="upload"></app-icon>
            </app-button>
            
            <app-button
              *ngIf="file.status === 'uploading'"
              variant="ghost"
              size="sm"
              (clicked)="cancelUpload(file)">
              <app-icon name="x"></app-icon>
            </app-button>
            
            <app-button
              variant="ghost"
              size="sm"
              (clicked)="removeFile(file)">
              <app-icon name="trash"></app-icon>
            </app-button>
          </div>
        </div>
      </div>

      <!-- Upload All Button -->
      <div class="upload-actions" *ngIf="hasPendingFiles">
        <app-button
          variant="primary"
          (clicked)="uploadAllFiles()"
          [disabled]="uploading">
          Upload All Files
        </app-button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent]
})
export class FileUploadComponent implements OnInit {
  @Input() accept = '*/*';
  @Input() multiple = true;
  @Input() maxFileSize = 10 * 1024 * 1024; // 10MB
  @Input() maxFiles = 10;
  @Input() uploadUrl!: string;
  @Input() uploadText = 'Drop files here or click to upload';
  @Input() uploadSubtext = 'Support for single or bulk upload';
  
  @Output() filesSelected = new EventEmitter<File[]>();
  @Output() fileUploaded = new EventEmitter<UploadedFile>();
  @Output() uploadComplete = new EventEmitter<UploadedFile[]>();
  @Output() uploadError = new EventEmitter<string>();

  files: FileUpload[] = [];
  isDragOver = false;
  uploading = false;

  get hasPendingFiles(): boolean {
    return this.files.some(f => f.status === 'pending');
  }

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    this.handleFiles(files);
  }

  onFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    this.handleFiles(files);
    target.value = ''; // Reset input
  }

  private handleFiles(files: File[]): void {
    const validFiles = files.filter(file => this.validateFile(file));
    
    if (validFiles.length === 0) return;

    // Check max files limit
    if (this.files.length + validFiles.length > this.maxFiles) {
      this.uploadError.emit(`Maximum ${this.maxFiles} files allowed`);
      return;
    }

    const fileUploads: FileUpload[] = validFiles.map(file => ({
      id: this.generateId(),
      file,
      status: 'pending',
      progress: 0,
      preview: this.generatePreview(file)
    }));

    this.files = [...this.files, ...fileUploads];
    this.filesSelected.emit(validFiles);
    this.cdr.markForCheck();
  }

  private validateFile(file: File): boolean {
    // File size validation
    if (file.size > this.maxFileSize) {
      this.uploadError.emit(`File ${file.name} is too large. Maximum size: ${this.formatFileSize(this.maxFileSize)}`);
      return false;
    }

    // File type validation
    if (this.accept !== '*/*') {
      const acceptedTypes = this.accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileName.endsWith(type);
        }
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return fileType.startsWith(baseType);
        }
        return fileType === type;
      });

      if (!isAccepted) {
        this.uploadError.emit(`File type not supported: ${file.name}`);
        return false;
      }
    }

    return true;
  }

  private generatePreview(file: File): string | null {
    if (this.isImage(file)) {
      return URL.createObjectURL(file);
    }
    return null;
  }

  uploadFile(fileUpload: FileUpload): void {
    fileUpload.status = 'uploading';
    fileUpload.progress = 0;

    const formData = new FormData();
    formData.append('file', fileUpload.file);

    const uploadRequest = this.http.post<UploadedFile>(this.uploadUrl, formData, {
      reportProgress: true,
      observe: 'events'
    });

    fileUpload.subscription = uploadRequest.subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          fileUpload.progress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          fileUpload.status = 'completed';
          fileUpload.uploadedFile = event.body!;
          this.fileUploaded.emit(event.body!);
        }
        this.cdr.markForCheck();
      },
      error: (error) => {
        fileUpload.status = 'error';
        fileUpload.error = error.message || 'Upload failed';
        this.cdr.markForCheck();
      }
    });
  }

  uploadAllFiles(): void {
    const pendingFiles = this.files.filter(f => f.status === 'pending');
    pendingFiles.forEach(file => this.uploadFile(file));
  }

  cancelUpload(fileUpload: FileUpload): void {
    if (fileUpload.subscription) {
      fileUpload.subscription.unsubscribe();
    }
    fileUpload.status = 'pending';
    fileUpload.progress = 0;
    this.cdr.markForCheck();
  }

  removeFile(fileUpload: FileUpload): void {
    if (fileUpload.subscription) {
      fileUpload.subscription.unsubscribe();
    }
    if (fileUpload.preview) {
      URL.revokeObjectURL(fileUpload.preview);
    }
    
    this.files = this.files.filter(f => f.id !== fileUpload.id);
    this.cdr.markForCheck();
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  getFileIcon(file: File): string {
    const type = file.type;
    if (type.includes('pdf')) return 'file-pdf';
    if (type.includes('word')) return 'file-word';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'file-excel';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'file-powerpoint';
    if (type.includes('zip') || type.includes('rar')) return 'file-archive';
    if (type.includes('video')) return 'file-video';
    if (type.includes('audio')) return 'file-audio';
    return 'file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  trackByFile(index: number, file: FileUpload): string {
    return file.id;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
```

## 5. Performance Optimization Patterns

### Virtual Scrolling Component
```typescript
@Component({
  selector: 'app-virtual-scroll',
  template: `
    <div class="virtual-scroll-container" 
         [style.height.px]="containerHeight"
         (scroll)="onScroll($event)">
      
      <!-- Spacer for items above viewport -->
      <div [style.height.px]="offsetY"></div>
      
      <!-- Visible items -->
      <div 
        *ngFor="let item of visibleItems; trackBy: trackByItem"
        class="virtual-scroll-item"
        [style.height.px]="itemHeight">
        <ng-container 
          *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: getItemIndex(item) }">
        </ng-container>
      </div>
      
      <!-- Spacer for items below viewport -->
      <div [style.height.px]="totalHeight - offsetY - (visibleItems.length * itemHeight)"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule]
})
export class VirtualScrollComponent<T> implements OnInit, OnChanges {
  @Input() items: T[] = [];
  @Input() itemHeight = 50;
  @Input() containerHeight = 400;
  @Input() buffer = 5; // Extra items to render outside viewport
  @Input() itemTemplate!: TemplateRef<any>;
  @Input() trackByFn?: TrackByFunction<T>;

  visibleItems: T[] = [];
  offsetY = 0;
  totalHeight = 0;
  
  private startIndex = 0;
  private endIndex = 0;
  private viewportHeight = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.calculateVisibleItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['itemHeight'] || changes['containerHeight']) {
      this.calculateVisibleItems();
    }
  }

  onScroll(event: Event): void {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    this.calculateVisibleItems(scrollTop);
  }

  private calculateVisibleItems(scrollTop = 0): void {
    this.totalHeight = this.items.length * this.itemHeight;
    this.viewportHeight = this.containerHeight;
    
    // Calculate which items should be visible
    this.startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
    this.endIndex = Math.min(
      this.items.length - 1,
      Math.ceil((scrollTop + this.viewportHeight) / this.itemHeight) + this.buffer
    );

    // Update visible items and offset
    this.visibleItems = this.items.slice(this.startIndex, this.endIndex + 1);
    this.offsetY = this.startIndex * this.itemHeight;

    this.cdr.markForCheck();
  }

  trackByItem(index: number, item: T): any {
    return this.trackByFn ? this.trackByFn(index, item) : index;
  }

  getItemIndex(item: T): number {
    return this.items.indexOf(item);
  }
}
```

### Infinite Scroll Component
```typescript
@Component({
  selector: 'app-infinite-scroll',
  template: `
    <div class="infinite-scroll-container">
      <ng-content></ng-content>
      
      <!-- Loading indicator -->
      <div class="infinite-scroll-loading" *ngIf="loading">
        <app-spinner></app-spinner>
        <span>{{ loadingText }}</span>
      </div>
      
      <!-- End message -->
      <div class="infinite-scroll-end" *ngIf="hasReachedEnd && !loading">
        {{ endMessage }}
      </div>
      
      <!-- Intersection observer target -->
      <div #trigger class="infinite-scroll-trigger"></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SpinnerComponent]
})
export class InfiniteScrollComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() loading = false;
  @Input() hasReachedEnd = false;
  @Input() threshold = 0.1;
  @Input() loadingText = 'Loading more...';
  @Input() endMessage = 'No more items to load';
  @Input() disabled = false;
  
  @Output() loadMore = new EventEmitter<void>();

  @ViewChild('trigger', { static: true }) trigger!: ElementRef;

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver(): void {
    if (!this.trigger) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !this.loading && !this.hasReachedEnd && !this.disabled) {
          this.loadMore.emit();
        }
      },
      { threshold: this.threshold }
    );

    this.observer.observe(this.trigger.nativeElement);
  }
}
```

## 6. Accessibility-First Components

### Accessible Modal Component
```typescript
@Component({
  selector: 'app-modal',
  template: `
    <div 
      class="modal-overlay"
      *ngIf="visible"
      [class.modal-overlay--closing]="closing"
      (click)="onOverlayClick($event)"
      [@fadeInOut]>
      
      <div 
        class="modal"
        [class]="modalClasses"
        role="dialog"
        [attr.aria-labelledby]="titleId"
        [attr.aria-describedby]="contentId"
        aria-modal="true"
        (click)="$event.stopPropagation()"
        [@slideInOut]>
        
        <!-- Modal Header -->
        <div class="modal-header" *ngIf="title || closable">
          <h2 [id]="titleId" class="modal-title" *ngIf="title">
            {{ title }}
          </h2>
          
          <app-button
            *ngIf="closable"
            variant="ghost"
            size="sm"
            class="modal-close"
            (clicked)="close()"
            [attr.aria-label]="closeAriaLabel">
            <app-icon name="x"></app-icon>
          </app-button>
        </div>

        <!-- Modal Content -->
        <div [id]="contentId" class="modal-content">
          <ng-content></ng-content>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer" *ngIf="hasFooter">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconComponent],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'scale(0.9) translateY(-10px)', opacity: 0 }),
        animate('150ms ease-out', style({ transform: 'scale(1) translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'scale(0.9) translateY(-10px)', opacity: 0 }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() visible = false;
  @Input() title?: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closable = true;
  @Input() closeOnOverlayClick = true;
  @Input() closeOnEscape = true;
  @Input() closeAriaLabel = 'Close modal';
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() close = new EventEmitter<void>();
  @Output() open = new EventEmitter<void>();

  titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
  contentId = `modal-content-${Math.random().toString(36).substr(2, 9)}`;
  closing = false;
  hasFooter = false;
  
  private previousActiveElement?: HTMLElement;
  private focusableElements: HTMLElement[] = [];

  get modalClasses(): string {
    return [
      'modal',
      `modal--${this.size}`,
      this.closing ? 'modal--closing' : ''
    ].filter(Boolean).join(' ');
  }

  constructor(
    private elementRef: ElementRef,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.hasFooter = !!this.elementRef.nativeElement.querySelector('[slot=footer]');
  }

  ngOnDestroy(): void {
    this.restoreFocus();
    this.removeEventListeners();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.visible) return;

    switch (event.key) {
      case 'Escape':
        if (this.closeOnEscape) {
          event.preventDefault();
          this.close();
        }
        break;
      case 'Tab':
        this.handleTabKey(event);
        break;
    }
  }

  onOverlayClick(event: MouseEvent): void {
    if (this.closeOnOverlayClick) {
      this.close();
    }
  }

  open(): void {
    if (this.visible) return;
    
    this.visible = true;
    this.closing = false;
    
    // Store currently focused element
    this.previousActiveElement = document.activeElement as HTMLElement;
    
    // Setup focus management
    setTimeout(() => {
      this.setupFocusManagement();
      this.focusFirstElement();
    });
    
    // Add body class to prevent scrolling
    document.body.classList.add('modal-open');
    
    this.visibleChange.emit(true);
    this.open.emit();
    this.cdr.markForCheck();
  }

  close(): void {
    if (!this.visible) return;
    
    this.closing = true;
    
    // Animate out then hide
    setTimeout(() => {
      this.visible = false;
      this.closing = false;
      
      // Remove body class
      document.body.classList.remove('modal-open');
      
      // Restore focus
      this.restoreFocus();
      
      this.visibleChange.emit(false);
      this.close.emit();
      this.cdr.markForCheck();
    }, 150);
  }

  private setupFocusManagement(): void {
    const modal = this.elementRef.nativeElement.querySelector('.modal');
    if (!modal) return;

    this.focusableElements = Array.from(modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )).filter(el => !el.hasAttribute('disabled')) as HTMLElement[];
  }

  private focusFirstElement(): void {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }

  private handleTabKey(event: KeyboardEvent): void {
    if (this.focusableElements.length === 0) return;

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  private restoreFocus(): void {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = undefined;
    }
  }

  private removeEventListeners(): void {
    // Cleanup any event listeners if needed
  }
}
```

This comprehensive guide covers advanced Angular component blocks with:

1. **Atomic Design Patterns** - Building from atoms to organisms
2. **Smart vs Presentational Components** - Separation of concerns
3. **Advanced Component Patterns** - Compound components, render props, HOCs
4. **Dynamic Form Components** - Flexible form builders
5. **Performance Optimization** - Virtual scrolling, infinite scroll
6. **Accessibility-First Design** - WCAG compliant components

Each pattern demonstrates enterprise-level component architecture with proper TypeScript typing, change detection optimization, and modern Angular features like standalone components and signals where applicable.

---

**Last Updated: September 22, 2025**

