# Junior React Developer Interview Questions - Comprehensive Guide

## Table of Contents

### Core React Concepts
1. [React Fundamentals](#react-fundamentals) - Questions 1-10
2. [Components](#components) - Questions 11-20
3. [Props and State](#props-and-state) - Questions 21-30
4. [Event Handling](#event-handling) - Questions 31-35
5. [Conditional Rendering](#conditional-rendering) - Questions 36-40

### React Hooks
6. [useState Hook](#usestate-hook) - Questions 41-45
7. [useEffect Hook](#useeffect-hook) - Questions 46-55
8. [Other Basic Hooks](#other-basic-hooks) - Questions 56-60

### Advanced Concepts
9. [Forms and Controlled Components](#forms-and-controlled-components) - Questions 61-70
10. [Lists and Keys](#lists-and-keys) - Questions 71-75
11. [React Router](#react-router) - Questions 76-80
12. [State Management](#state-management) - Questions 81-85

### Best Practices & Testing
13. [Best Practices](#best-practices) - Questions 86-90
14. [Testing](#testing) - Questions 91-95
15. [Performance](#performance) - Questions 96-100

---

## React Fundamentals

### 1. What is React and what are its main features?
**Answer:** React is a JavaScript library for building user interfaces, particularly web applications. Main features:
- **Component-based architecture**: Build encapsulated components that manage their own state
- **Virtual DOM**: Efficient updating and rendering of components
- **JSX**: JavaScript syntax extension for writing HTML-like code
- **Unidirectional data flow**: Data flows down from parent to child components
- **Declarative**: Describe what the UI should look like for any given state

### 2. What is JSX?
**Answer:** JSX (JavaScript XML) is a syntax extension for JavaScript that allows you to write HTML-like code within JavaScript. It gets transpiled to regular JavaScript function calls.

```jsx
// JSX
const element = <h1>Hello, World!</h1>;

// Transpiled JavaScript
const element = React.createElement('h1', null, 'Hello, World!');
```

### 3. What is the Virtual DOM?
**Answer:** The Virtual DOM is a programming concept where a "virtual" representation of the UI is kept in memory and synced with the "real" DOM. Benefits:
- **Performance**: Only updates parts of the DOM that actually changed
- **Predictability**: Makes the UI more predictable and easier to debug
- **Batching**: Groups multiple updates together for efficiency

### 4. What's the difference between React elements and React components?
**Answer:**
- **React Element**: A plain object describing what should appear on screen. Immutable.
- **React Component**: A function or class that returns React elements. Can accept props and manage state.

```jsx
// Element
const element = <div>Hello</div>;

// Component
function Welcome(props) {
  return <div>Hello {props.name}</div>;
}
```

### 5. What are the differences between functional and class components?
**Answer:**
- **Functional Components**: 
  - Simpler syntax
  - Use hooks for state and lifecycle
  - Preferred in modern React
- **Class Components**:
  - Use `this.state` and `this.setState()`
  - Have lifecycle methods
  - More verbose syntax

```jsx
// Functional Component
function Welcome({ name }) {
  return <h1>Hello, {name}</h1>;
}

// Class Component
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 6. What is the purpose of `React.Fragment`?
**Answer:** React.Fragment allows you to group multiple elements without adding an extra DOM node.

```jsx
// Without Fragment (adds extra div)
function App() {
  return (
    <div>
      <h1>Title</h1>
      <p>Description</p>
    </div>
  );
}

// With Fragment (no extra DOM node)
function App() {
  return (
    <React.Fragment>
      <h1>Title</h1>
      <p>Description</p>
    </React.Fragment>
  );
}

// Short syntax
function App() {
  return (
    <>
      <h1>Title</h1>
      <p>Description</p>
    </>
  );
}
```

### 7. What is the significance of keys in React?
**Answer:** Keys help React identify which items have changed, been added, or removed. They should be unique among siblings.

```jsx
// Good - using unique IDs
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// Bad - using array index
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

### 8. What is the difference between controlled and uncontrolled components?
**Answer:**
- **Controlled Components**: Form data is handled by React component state
- **Uncontrolled Components**: Form data is handled by the DOM itself

```jsx
// Controlled Component
function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

// Uncontrolled Component
function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    console.log(inputRef.current.value);
  };
  
  return <input ref={inputRef} />;
}
```

### 9. What are React Hooks?
**Answer:** Hooks are functions that let you "hook into" React state and lifecycle features from functional components. They start with "use" and allow you to reuse stateful logic.

### 10. What is the difference between `createElement` and `cloneElement`?
**Answer:**
- **createElement**: Creates a new React element
- **cloneElement**: Clones an existing element and returns a new element

```jsx
// createElement
const element = React.createElement('div', {className: 'container'}, 'Hello');

// cloneElement
const clonedElement = React.cloneElement(element, {id: 'new-id'});
```

---

## Components

### 11. How do you create a functional component in React?
**Answer:**
```jsx
// Arrow function
const MyComponent = () => {
  return <div>Hello World</div>;
};

// Regular function
function MyComponent() {
  return <div>Hello World</div>;
}

// With props
const Greeting = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};
```

### 12. How do you pass data between components?
**Answer:**
- **Parent to Child**: Via props
- **Child to Parent**: Via callback functions
- **Between siblings**: Lift state up to common parent

```jsx
// Parent to Child
function Parent() {
  return <Child message="Hello from parent" />;
}

function Child({ message }) {
  return <p>{message}</p>;
}

// Child to Parent
function Parent() {
  const [message, setMessage] = useState('');
  
  return (
    <div>
      <p>{message}</p>
      <Child onSendMessage={setMessage} />
    </div>
  );
}

function Child({ onSendMessage }) {
  return (
    <button onClick={() => onSendMessage('Hello from child')}>
      Send Message
    </button>
  );
}
```

### 13. What is component composition?
**Answer:** Component composition is a pattern where you combine smaller components to build larger ones, promoting reusability and separation of concerns.

```jsx
// Composition example
function Card({ children }) {
  return <div className="card">{children}</div>;
}

function CardHeader({ title }) {
  return <div className="card-header">{title}</div>;
}

function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
}

// Usage
function App() {
  return (
    <Card>
      <CardHeader title="My Card" />
      <CardBody>
        <p>Card content goes here</p>
      </CardBody>
    </Card>
  );
}
```

### 14. What are Higher-Order Components (HOCs)?
**Answer:** HOCs are functions that take a component and return a new component with additional functionality.

```jsx
// HOC example
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// Usage
const MyComponent = ({ data }) => <div>{data}</div>;
const MyComponentWithLoading = withLoading(MyComponent);
```

### 15. What is the children prop?
**Answer:** The children prop contains the content between the opening and closing tags of a component.

```jsx
function Container({ children }) {
  return <div className="container">{children}</div>;
}

// Usage
<Container>
  <h1>Title</h1>
  <p>Content</p>
</Container>
```

### 16. How do you conditionally render components?
**Answer:** You can use JavaScript expressions within JSX for conditional rendering.

```jsx
function Greeting({ isLoggedIn, user }) {
  // Using ternary operator
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back, {user.name}!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  );
}

// Using && operator
function Notification({ hasNotifications, count }) {
  return (
    <div>
      {hasNotifications && <span>You have {count} notifications</span>}
    </div>
  );
}

// Using if statements
function UserProfile({ user }) {
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return <div>Welcome, {user.name}</div>;
}
```

### 17. What are prop types and why are they useful?
**Answer:** PropTypes provide type checking for React props, helping catch bugs during development.

```jsx
import PropTypes from 'prop-types';

function UserCard({ name, age, email, isActive }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      {isActive && <span>Active</span>}
    </div>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string.isRequired,
  isActive: PropTypes.bool
};

UserCard.defaultProps = {
  age: 0,
  isActive: false
};
```

### 18. What is component lifecycle in React?
**Answer:** Component lifecycle refers to the sequence of methods that are invoked in different stages of a component's existence. In functional components, we use hooks like useEffect to handle lifecycle events.

```jsx
// Class component lifecycle
class MyComponent extends React.Component {
  componentDidMount() {
    // Called after component is mounted
  }
  
  componentDidUpdate(prevProps, prevState) {
    // Called after component updates
  }
  
  componentWillUnmount() {
    // Called before component is unmounted
  }
  
  render() {
    return <div>My Component</div>;
  }
}

// Functional component equivalent using hooks
function MyComponent() {
  useEffect(() => {
    // componentDidMount
    console.log('Component mounted');
    
    return () => {
      // componentWillUnmount
      console.log('Component will unmount');
    };
  }, []);
  
  useEffect(() => {
    // componentDidUpdate (runs after every render)
    console.log('Component updated');
  });
  
  return <div>My Component</div>;
}
```

### 19. How do you handle errors in React components?
**Answer:** React provides Error Boundaries to catch JavaScript errors in component trees.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### 20. What are React Fragments and when should you use them?
**Answer:** React Fragments let you group multiple elements without adding extra DOM nodes.

```jsx
// Problem: Extra div wrapper
function Table() {
  return (
    <table>
      <tr>
        <Columns />
      </tr>
    </table>
  );
}

function Columns() {
  return (
    <div> {/* This div breaks table structure */}
      <td>Hello</td>
      <td>World</td>
    </div>
  );
}

// Solution: Using Fragment
function Columns() {
  return (
    <React.Fragment>
      <td>Hello</td>
      <td>World</td>
    </React.Fragment>
  );
}

// Short syntax
function Columns() {
  return (
    <>
      <td>Hello</td>
      <td>World</td>
    </>
  );
}
```

---

## Props and State

### 21. What are props in React?
**Answer:** Props (properties) are read-only inputs passed from parent to child components. They allow data to flow down the component tree.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Or using destructuring
function Welcome({ name, age }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  );
}

// Usage
<Welcome name="John" age={25} />
```

### 22. What is state in React?
**Answer:** State is a JavaScript object that stores component data that can change over time. When state changes, the component re-renders.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}
```

### 23. What's the difference between props and state?
**Answer:**
- **Props**: Passed from parent, read-only, external data
- **State**: Internal to component, mutable, triggers re-renders when changed

```jsx
// Props example
function ChildComponent({ title, description }) {
  // title and description are props - read-only
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

// State example
function ParentComponent() {
  const [title, setTitle] = useState('Default Title');
  
  return (
    <div>
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ChildComponent title={title} description="Some description" />
    </div>
  );
}
```

### 24. How do you update state in React?
**Answer:** In functional components, use the state setter function from useState. Never mutate state directly.

```jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    // Correct: Create new array
    setTodos([...todos, { id: Date.now(), text: inputValue }]);
    setInputValue('');
  };

  const removeTodo = (id) => {
    // Correct: Filter creates new array
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodo = (id, newText) => {
    // Correct: Map creates new array
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  return (
    <div>
      <input 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 25. What is prop drilling and how can you avoid it?
**Answer:** Prop drilling occurs when you pass props through multiple component layers to reach a deeply nested component.

```jsx
// Problem: Prop drilling
function App() {
  const user = { name: 'John', email: 'john@example.com' };
  return <Header user={user} />;
}

function Header({ user }) {
  return <Navigation user={user} />;
}

function Navigation({ user }) {
  return <UserMenu user={user} />;
}

function UserMenu({ user }) {
  return <div>Welcome, {user.name}</div>;
}

// Solution 1: Context API
const UserContext = React.createContext();

function App() {
  const user = { name: 'John', email: 'john@example.com' };
  return (
    <UserContext.Provider value={user}>
      <Header />
    </UserContext.Provider>
  );
}

function UserMenu() {
  const user = useContext(UserContext);
  return <div>Welcome, {user.name}</div>;
}
```

### 26. How do you pass functions as props?
**Answer:** Functions can be passed as props to allow child components to communicate with parents.

```jsx
function Parent() {
  const [message, setMessage] = useState('');

  const handleChildMessage = (childMessage) => {
    setMessage(`Child says: ${childMessage}`);
  };

  return (
    <div>
      <p>{message}</p>
      <Child onSendMessage={handleChildMessage} />
    </div>
  );
}

function Child({ onSendMessage }) {
  const handleClick = () => {
    onSendMessage('Hello from child!');
  };

  return <button onClick={handleClick}>Send Message</button>;
}
```

### 27. What are default props?
**Answer:** Default props provide default values for props when they're not passed by the parent.

```jsx
// Using defaultProps (legacy)
function Greeting({ name, age }) {
  return <div>Hello {name}, you are {age} years old</div>;
}

Greeting.defaultProps = {
  name: 'Guest',
  age: 0
};

// Using default parameters (modern approach)
function Greeting({ name = 'Guest', age = 0 }) {
  return <div>Hello {name}, you are {age} years old</div>;
}
```

### 28. How do you handle complex state objects?
**Answer:** When dealing with complex state, be careful to update immutably.

```jsx
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      notifications: true
    }
  });

  const updateName = (newName) => {
    setUser(prevUser => ({
      ...prevUser,
      name: newName
    }));
  };

  const updatePreferences = (newPrefs) => {
    setUser(prevUser => ({
      ...prevUser,
      preferences: {
        ...prevUser.preferences,
        ...newPrefs
      }
    }));
  };

  return (
    <div>
      <input 
        value={user.name}
        onChange={(e) => updateName(e.target.value)}
        placeholder="Name"
      />
      <label>
        <input
          type="checkbox"
          checked={user.preferences.notifications}
          onChange={(e) => updatePreferences({ notifications: e.target.checked })}
        />
        Enable notifications
      </label>
    </div>
  );
}
```

### 29. What is the purpose of the key prop in React lists?
**Answer:** Keys help React identify which items have changed, been added, or removed in lists.

```jsx
// Good: Using unique, stable keys
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <input type="checkbox" checked={todo.completed} />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

// Bad: Using array index as key
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <li key={index}> {/* This can cause issues */}
          <input type="checkbox" checked={todo.completed} />
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

### 30. How do you validate props in React?
**Answer:** Use PropTypes for runtime type checking in development.

```jsx
import PropTypes from 'prop-types';

function UserCard({ user, onEdit, isEditable }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      {isEditable && (
        <button onClick={() => onEdit(user.id)}>Edit</button>
      )}
    </div>
  );
}

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func,
  isEditable: PropTypes.bool
};

UserCard.defaultProps = {
  isEditable: false,
  onEdit: () => {}
};
```

---

## Event Handling

### 31. How do you handle events in React?
**Answer:** React uses SyntheticEvents, which wrap native events and provide consistent behavior across browsers.

```jsx
function Button() {
  const handleClick = (event) => {
    event.preventDefault();
    console.log('Button clicked!');
    console.log('Event type:', event.type);
  };

  const handleMouseEnter = () => {
    console.log('Mouse entered!');
  };

  return (
    <button 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      Click me
    </button>
  );
}
```

### 32. What are SyntheticEvents in React?
**Answer:** SyntheticEvents are React's wrapper around native events, providing consistent API across different browsers.

```jsx
function InputComponent() {
  const handleChange = (event) => {
    // SyntheticEvent properties
    console.log('Value:', event.target.value);
    console.log('Event type:', event.type);
    console.log('Current target:', event.currentTarget);
    
    // Access native event if needed
    console.log('Native event:', event.nativeEvent);
  };

  return (
    <input 
      type="text" 
      onChange={handleChange}
      placeholder="Type something..."
    />
  );
}
```

### 33. How do you pass parameters to event handlers?
**Answer:** You can pass parameters using arrow functions or the bind method.

```jsx
function TodoList({ todos, onToggle, onDelete }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <span>{todo.text}</span>
          {/* Method 1: Arrow function */}
          <button onClick={() => onToggle(todo.id)}>
            Toggle
          </button>
          {/* Method 2: Using bind */}
          <button onClick={onDelete.bind(null, todo.id)}>
            Delete
          </button>
          {/* Method 3: Custom handler */}
          <button onClick={(e) => handleEdit(e, todo.id)}>
            Edit
          </button>
        </li>
      ))}
    </ul>
  );

  function handleEdit(event, todoId) {
    event.stopPropagation();
    console.log('Editing todo:', todoId);
  }
}
```

### 34. What is event bubbling and how do you prevent it?
**Answer:** Event bubbling is when an event propagates up through the DOM tree. Use `stopPropagation()` to prevent it.

```jsx
function NestedComponents() {
  const handleParentClick = () => {
    console.log('Parent clicked');
  };

  const handleChildClick = (event) => {
    event.stopPropagation(); // Prevents bubbling to parent
    console.log('Child clicked');
  };

  const handlePreventDefault = (event) => {
    event.preventDefault(); // Prevents default browser behavior
    console.log('Form submitted');
  };

  return (
    <div onClick={handleParentClick}>
      <button onClick={handleChildClick}>
        Child Button
      </button>
      <form onSubmit={handlePreventDefault}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
```

### 35. How do you handle form submissions in React?
**Answer:** Handle form submissions using the onSubmit event and prevent default browser behavior.

```jsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page refresh
    
    // Validation
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Submit data
    console.log('Form submitted:', formData);
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Conditional Rendering

### 36. What are the different ways to conditionally render components in React?
**Answer:** There are several ways to conditionally render components in React:

```jsx
function ConditionalRendering({ user, isLoading, hasError, items }) {
  // 1. If-else statements
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (hasError) {
    return <div>Error occurred!</div>;
  }

  // 2. Ternary operator
  return (
    <div>
      {user ? (
        <h1>Welcome, {user.name}!</h1>
      ) : (
        <h1>Please log in</h1>
      )}

      {/* 3. Logical AND (&&) operator */}
      {items.length > 0 && (
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}

      {/* 4. Logical OR (||) operator */}
      {user?.avatar || <div>No avatar</div>}

      {/* 5. Switch-like pattern with object */}
      {(() => {
        const statusMessages = {
          loading: <div>Loading...</div>,
          success: <div>Success!</div>,
          error: <div>Error!</div>
        };
        return statusMessages[status] || <div>Unknown status</div>;
      })()}
    </div>
  );
}
```

### 37. When should you use the logical AND (&&) operator for conditional rendering?
**Answer:** Use && when you want to render something or nothing. Be careful with falsy values.

```jsx
function NotificationBadge({ count, isVisible }) {
  return (
    <div>
      {/* Good: Boolean condition */}
      {isVisible && <span>Notifications</span>}

      {/* Dangerous: Can render 0 */}
      {count && <span>{count} notifications</span>}

      {/* Better: Explicit boolean conversion */}
      {count > 0 && <span>{count} notifications</span>}
      {Boolean(count) && <span>{count} notifications</span>}
      {!!count && <span>{count} notifications</span>}
    </div>
  );
}
```

### 38. How do you handle multiple conditions in React?
**Answer:** Use nested ternary operators, multiple && operators, or helper functions.

```jsx
function UserStatus({ user, isOnline, isTyping }) {
  // Method 1: Nested ternary
  return (
    <div>
      {user ? (
        isOnline ? (
          isTyping ? (
            <span>🟢 {user.name} is typing...</span>
          ) : (
            <span>🟢 {user.name} is online</span>
          )
        ) : (
          <span>⚫ {user.name} is offline</span>
        )
      ) : (
        <span>No user selected</span>
      )}
    </div>
  );

  // Method 2: Helper function
  const getUserStatus = () => {
    if (!user) return 'No user selected';
    if (!isOnline) return `⚫ ${user.name} is offline`;
    if (isTyping) return `🟢 ${user.name} is typing...`;
    return `🟢 ${user.name} is online`;
  };

  return <div>{getUserStatus()}</div>;

  // Method 3: Multiple conditions with &&
  return (
    <div>
      {!user && <span>No user selected</span>}
      {user && !isOnline && <span>⚫ {user.name} is offline</span>}
      {user && isOnline && !isTyping && <span>🟢 {user.name} is online</span>}
      {user && isOnline && isTyping && <span>🟢 {user.name} is typing...</span>}
    </div>
  );
}
```

### 39. What is the difference between null and undefined in conditional rendering?
**Answer:** Both null and undefined prevent rendering, but they have different meanings.

```jsx
function ConditionalComponent({ shouldRender, data }) {
  // Returning null prevents rendering but component stays mounted
  if (!shouldRender) {
    return null;
  }

  // Returning undefined also prevents rendering
  if (!data) {
    return undefined;
  }

  // JSX expressions that evaluate to null/undefined don't render
  return (
    <div>
      {null} {/* Renders nothing */}
      {undefined} {/* Renders nothing */}
      {false} {/* Renders nothing */}
      {true} {/* Renders nothing */}
      {0} {/* Renders "0" */}
      {''} {/* Renders nothing */}
      <span>{data.name}</span>
    </div>
  );
}
```

### 40. How do you conditionally apply CSS classes in React?
**Answer:** Use template literals, ternary operators, or libraries like classnames.

```jsx
import classNames from 'classnames'; // npm install classnames

function Button({ variant, size, disabled, active, children }) {
  // Method 1: Template literals
  const className1 = `btn btn-${variant} btn-${size} ${disabled ? 'disabled' : ''} ${active ? 'active' : ''}`;

  // Method 2: Ternary operators
  const className2 = `btn ${variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`;

  // Method 3: Array join
  const classes = ['btn', `btn-${variant}`, `btn-${size}`];
  if (disabled) classes.push('disabled');
  if (active) classes.push('active');
  const className3 = classes.join(' ');

  // Method 4: classNames library (recommended)
  const className4 = classNames('btn', {
    [`btn-${variant}`]: variant,
    [`btn-${size}`]: size,
    disabled: disabled,
    active: active
  });

  return (
    <button className={className4} disabled={disabled}>
      {children}
    </button>
  );
}

// Conditional styles
function Alert({ type, message }) {
  const alertStyles = {
    padding: '10px',
    borderRadius: '4px',
    backgroundColor: type === 'error' ? '#ffebee' : '#e8f5e8',
    color: type === 'error' ? '#c62828' : '#2e7d32',
    border: `1px solid ${type === 'error' ? '#ef5350' : '#66bb6a'}`
  };

  return (
    <div style={alertStyles}>
      {message}
    </div>
  );
}
```

---

## useState Hook

### 41. What is the useState hook and how do you use it?
**Answer:** useState is a Hook that allows you to add state to functional components.

```jsx
import { useState } from 'react';

function Counter() {
  // Declare state variable with initial value
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [user, setUser] = useState({ name: '', email: '' });
  const [items, setItems] = useState([]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(prev => prev + 1)}>Increment (functional)</button>
      
      <input 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
    </div>
  );
}
```

### 42. What's the difference between setting state directly vs using a function?
**Answer:** Use functional updates when the new state depends on the previous state.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    // Direct update - can cause issues with multiple updates
    setCount(count + 1);
    setCount(count + 1); // This won't work as expected
  };

  const handleIncrementCorrect = () => {
    // Functional update - always uses latest state
    setCount(prev => prev + 1);
    setCount(prev => prev + 1); // This works correctly
  };

  const handleMultipleUpdates = () => {
    // These will be batched in React 18+
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Wrong Way</button>
      <button onClick={handleIncrementCorrect}>Correct Way</button>
      <button onClick={handleMultipleUpdates}>Multiple Updates</button>
    </div>
  );
}
```

### 43. How do you handle complex state with useState?
**Answer:** For complex state, consider using multiple useState calls or useReducer.

```jsx
function UserForm() {
  // Option 1: Single state object
  const [user, setUser] = useState({
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      notifications: true
    }
  });

  const updateUser = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updatePreferences = (preference, value) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  // Option 2: Separate state variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);

  return (
    <form>
      <input
        value={user.name}
        onChange={(e) => updateUser('name', e.target.value)}
        placeholder="Name"
      />
      <input
        value={user.email}
        onChange={(e) => updateUser('email', e.target.value)}
        placeholder="Email"
      />
      <select
        value={user.preferences.theme}
        onChange={(e) => updatePreferences('theme', e.target.value)}
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </form>
  );
}
```

### 44. What happens when you call setState with the same value?
**Answer:** React uses Object.is() comparison to determine if the state has changed. If the value is the same, React will skip the re-render.

```jsx
function OptimizedComponent() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'John' });

  console.log('Component rendered');

  const handleSameValue = () => {
    setCount(0); // No re-render if count is already 0
  };

  const handleSameObject = () => {
    setUser({ name: 'John' }); // Will re-render (new object reference)
  };

  const handleSameObjectReference = () => {
    setUser(prev => prev); // No re-render (same reference)
  };

  return (
    <div>
      <p>Count: {count}</p>
      <p>User: {user.name}</p>
      <button onClick={handleSameValue}>Set Same Count</button>
      <button onClick={handleSameObject}>Set Same Object</button>
      <button onClick={handleSameObjectReference}>Set Same Reference</button>
    </div>
  );
}
```

### 45. How do you initialize state with expensive computations?
**Answer:** Use lazy initial state to avoid running expensive computations on every render.

```jsx
function ExpensiveComponent({ userId }) {
  // Bad: Expensive function runs on every render
  const [data, setData] = useState(expensiveComputation(userId));

  // Good: Lazy initialization - runs only once
  const [data, setData] = useState(() => expensiveComputation(userId));

  // Example with localStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : getDefaultSettings();
  });

  // Example with complex calculation
  const [processedData, setProcessedData] = useState(() => {
    return processLargeDataset(initialData);
  });

  return <div>{/* Component JSX */}</div>;
}

function expensiveComputation(id) {
  console.log('Running expensive computation...');
  // Simulate expensive operation
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i;
  }
  return { id, result };
}
```

---

## useEffect Hook

### 46. What is the useEffect hook and when do you use it?
**Answer:** useEffect lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in class components.

```jsx
import { useState, useEffect } from 'react';

function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Effect runs after every render
  useEffect(() => {
    console.log('Component rendered');
  });

  // Effect runs only once (on mount)
  useEffect(() => {
    fetchData();
  }, []);

  // Effect runs when dependencies change
  useEffect(() => {
    if (data) {
      document.title = `Data loaded: ${data.length} items`;
    }
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Data Component</h1>
      {data && <p>Loaded {data.length} items</p>}
    </div>
  );
}
```

### 47. What is the dependency array in useEffect?
**Answer:** The dependency array controls when the effect runs. It contains values that the effect depends on.

```jsx
function EffectDependencies({ userId, theme }) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // No dependency array - runs after every render
  useEffect(() => {
    console.log('Runs after every render');
  });

  // Empty dependency array - runs only once (mount)
  useEffect(() => {
    console.log('Runs only on mount');
    setupGlobalListeners();
    
    return () => {
      console.log('Cleanup on unmount');
      cleanupGlobalListeners();
    };
  }, []);

  // Dependency array with values - runs when dependencies change
  useEffect(() => {
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]); // Runs when userId changes

  useEffect(() => {
    fetchUserPosts(userId);
  }, [userId]); // Separate effect for posts

  useEffect(() => {
    applyTheme(theme);
  }, [theme]); // Runs when theme changes

  // Multiple dependencies
  useEffect(() => {
    if (user && theme) {
      saveUserPreferences(user.id, theme);
    }
  }, [user, theme]); // Runs when either user or theme changes

  return <div>{/* Component JSX */}</div>;
}
```

### 48. How do you clean up effects in useEffect?
**Answer:** Return a cleanup function from useEffect to handle cleanup tasks.

```jsx
function TimerComponent() {
  const [count, setCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Timer cleanup
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Event listener cleanup
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Subscription cleanup
  useEffect(() => {
    const subscription = subscribeToUpdates((data) => {
      console.log('Received update:', data);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Async cleanup (be careful with this pattern)
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        
        if (!cancelled) {
          setData(data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true; // Prevent state updates if component unmounts
    };
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Window width: {windowWidth}px</p>
    </div>
  );
}
```
