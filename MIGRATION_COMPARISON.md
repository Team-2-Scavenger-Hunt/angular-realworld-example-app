# FooterComponent Migration: Angular → React

## Original Angular Implementation

### footer.component.ts

```typescript
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-layout-footer",
  templateUrl: "./footer.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, RouterLink],
})
export class FooterComponent {
  today: number = Date.now();
}
```

### footer.component.html

```html
<footer>
  <div class="container">
    <a class="logo-font" routerLink="/">conduit</a>
    <span class="attribution">
      &copy; {{ today | date: "yyyy" }}. An interactive learning project from
      <a href="https://github.com/gothinkster/realworld">RealWorld OSS Project</a>. Code licensed under MIT.
    </span>
  </div>
</footer>
```

## React Implementation

### Footer.jsx

```jsx
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <Link className="logo-font" to="/">
          conduit
        </Link>
        <span className="attribution">
          &copy; {currentYear}. An interactive learning project from <a href="https://github.com/gothinkster/realworld">RealWorld OSS Project</a>. Code licensed under MIT.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
```

## Key Migration Patterns

### 1. Component Declaration

- **Angular**: `@Component` decorator with metadata
- **React**: Simple function export

### 2. Template vs JSX

- **Angular**: Separate HTML template file
- **React**: JSX returned from function

### 3. Data Binding

- **Angular**: `{{ today | date: "yyyy" }}` with pipes
- **React**: `{currentYear}` with JavaScript expressions

### 4. Routing

- **Angular**: `routerLink="/"`
- **React**: `<Link to="/">`

### 5. Class vs Attributes

- **Angular**: `class="container"`
- **React**: `className="container"`

### 6. State Management

- **Angular**: Class properties (`today: number`)
- **React**: Local variables or hooks (`const currentYear`)

### 7. Imports

- **Angular**: Framework-specific imports
- **React**: Standard ES6 imports

## Benefits of This Migration Pattern

1. **Simpler**: No decorators or metadata
2. **More Direct**: Logic and template in same file
3. **Standard JavaScript**: Uses native Date methods instead of pipes
4. **Functional**: Pure function component
5. **Flexible**: Easy to add hooks for state if needed

## Next Steps

This pattern can be applied to other components:

- Replace `@Component` with function exports
- Convert templates to JSX
- Replace Angular pipes with JavaScript
- Convert `routerLink` to React Router `Link`
- Replace class properties with hooks or local variables
