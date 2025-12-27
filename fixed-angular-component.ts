import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush, // Added OnPush strategy
  template: `
    <h1>Hello from {{ name }}!</h1>
    <a target="_blank" href="https://angular.dev/overview">
      Learn more about Angular
    </a>
    <button (click)="refreshData()">Load Users</button>
    <ul>
      @for (user of users; track user.id) {
        <li>User ID: {{user.id}}</li>
      }
    </ul>
  `,
})
export class App implements OnInit { // Added OnInit interface
  name = 'Angular';
  users: any[] = []; // Fixed type annotation
  
  constructor(private cdr: ChangeDetectorRef) {
    console.log('Component initialized');
  }
  
  ngOnInit() {
    // Load users on component initialization
    this.refreshData();
  }
  
  loadUsers(): Observable<any[]> { // Fixed return type
    const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
    return of(arr);
  }
  
  refreshData() {
    this.loadUsers().subscribe((users) => {
      this.users = [...users]; // New reference (good for OnPush)
      console.log('users loaded:', users);
      this.cdr.detectChanges(); // Manual trigger for OnPush
    });
  }
}

bootstrapApplication(App);




