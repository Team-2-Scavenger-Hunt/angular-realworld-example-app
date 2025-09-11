# Angular to React Migration Playbook

## Overview

This playbook provides a systematic approach for migrating Angular applications to React, based on analysis of the Angular RealWorld example app. It includes step-by-step processes, code patterns, and best practices.

## Table of Contents

1. [Pre-Migration Assessment](#pre-migration-assessment)
2. [Migration Strategy](#migration-strategy)
3. [Phase-by-Phase Implementation](#phase-by-phase-implementation)
4. [Component Migration Patterns](#component-migration-patterns)
5. [Service to Hook Conversion](#service-to-hook-conversion)
6. [Routing Migration](#routing-migration)
7. [State Management Migration](#state-management-migration)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Considerations](#deployment-considerations)
10. [Common Pitfalls and Solutions](#common-pitfalls-and-solutions)

## Pre-Migration Assessment

### 1. Codebase Analysis Checklist

- [ ] **Component Count**: Identify all Angular components (`@Component` decorators)
- [ ] **Service Dependencies**: Map all services (`@Injectable` decorators)
- [ ] **Routing Complexity**: Analyze route guards, lazy loading, nested routes
- [ ] **Form Handling**: Identify Reactive Forms vs Template-driven forms
- [ ] **State Management**: Document RxJS usage, observables, subjects
- [ ] **Third-party Dependencies**: List Angular-specific libraries to replace
- [ ] **Custom Directives**: Identify structural and attribute directives
- [ ] **Pipes**: Document custom and built-in pipe usage

### 2. Complexity Assessment Matrix

| Component Type         | Complexity | Migration Priority | Estimated Effort |
| ---------------------- | ---------- | ------------------ | ---------------- |
| Layout Components      | Low        | High               | 1-2 days         |
| Static Pages           | Low        | High               | 1-2 days         |
| Form Components        | Medium     | Medium             | 3-5 days         |
| Data-heavy Components  | High       | Low                | 5-10 days        |
| Components with Guards | High       | Low                | 3-7 days         |

## Migration Strategy

### Recommended Approach: **Incremental Migration**

1. **Start Small**: Begin with simple, standalone components
2. **Build Foundation**: Establish React architecture patterns
3. **Progressive Enhancement**: Gradually migrate complex features
4. **Parallel Development**: Run both versions during transition
5. **Feature Parity**: Ensure complete functionality before switching

### Technology Stack Recommendations

| Angular Feature  | React Equivalent        | Rationale                            |
| ---------------- | ----------------------- | ------------------------------------ |
| Angular CLI      | Vite / Create React App | Faster builds, modern tooling        |
| Angular Router   | React Router v6         | Industry standard                    |
| Reactive Forms   | React Hook Form         | Better performance, less boilerplate |
| RxJS Observables | React Query + SWR       | Better caching, simpler API calls    |
| Angular Services | Custom Hooks + Context  | More React-idiomatic                 |
| Angular Pipes    | Utility Functions       | Direct JavaScript approach           |
| Angular Guards   | Route Loaders/Actions   | React Router v6 pattern              |

## Phase-by-Phase Implementation

### Phase 1: Project Setup (Week 1)

#### 1.1 Initialize React Project

```bash
# Option A: Vite (Recommended)
npm create vite@latest realworld-react -- --template react-ts

# Option B: Create React App
npx create-react-app realworld-react --template typescript
```

#### 1.2 Install Core Dependencies

```bash
npm install react-router-dom react-query axios react-hook-form
npm install -D @types/react @types/react-dom
```

#### 1.3 Project Structure Setup

```
src/
├── components/          # Reusable UI components
├── pages/              # Route-level components
├── hooks/              # Custom hooks (converted services)
├── context/            # Global state management
├── utils/              # Utility functions (converted pipes)
├── types/              # TypeScript type definitions
├── api/                # API layer (converted services)
└── styles/             # Global styles
```

### Phase 2: Core Infrastructure (Week 2)

#### 2.1 API Layer Setup

```typescript
// api/client.ts
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.realworld.show/api",
});

// Request interceptor (replaces Angular token interceptor)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (replaces Angular error interceptor)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwtToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

#### 2.2 Authentication Context

```typescript
// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/user';
import apiClient from '../api/client';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/users/login', { user: credentials });
    const { user: userData } = response.data;
    localStorage.setItem('jwtToken', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Phase 3: Component Migration (Weeks 3-6)

#### 3.1 Migration Priority Order

1. **Layout Components** (FooterComponent, HeaderComponent)
2. **Static Pages** (Home page structure)
3. **Authentication Forms** (Login, Register)
4. **Article Components** (List, Preview, Detail)
5. **User Profile Components**
6. **Editor Components**

#### 3.2 Component Migration Template

```typescript
// Original Angular Component Pattern
/*
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [CommonModule, RouterModule]
})
export class ExampleComponent implements OnInit {
  data$ = this.service.getData();

  constructor(private service: ExampleService) {}

  ngOnInit() {
    // Initialization logic
  }

  handleClick() {
    // Event handler
  }
}
*/

// React Equivalent
import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useExampleData } from '../hooks/useExampleData';

export const ExampleComponent: React.FC = () => {
  const { data, isLoading, error } = useExampleData();

  const handleClick = () => {
    // Event handler
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* JSX template */}
      <Link to="/path">Navigation</Link>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};
```

## Component Migration Patterns

### Pattern 1: Simple Display Components

**Angular Footer Component:**

```typescript
@Component({
  selector: "app-layout-footer",
  template: `
    <footer>
      <div class="container">
        <a routerLink="/">conduit</a>
        <span>&copy; {{ today | date: "yyyy" }}</span>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  today = Date.now();
}
```

**React Equivalent:**

```tsx
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <Link to="/">conduit</Link>
        <span>&copy; {currentYear}</span>
      </div>
    </footer>
  );
};
```

### Pattern 2: Components with State and Services

**Angular Article List Component:**

```typescript
@Component({
  selector: "app-article-list",
  template: `
    <div *ngFor="let article of articles$ | async">
      {{ article.title }}
    </div>
  `,
})
export class ArticleListComponent implements OnInit {
  articles$ = this.articlesService.getArticles();

  constructor(private articlesService: ArticlesService) {}
}
```

**React Equivalent:**

```tsx
import { useQuery } from "react-query";
import { articlesApi } from "../api/articles";

export const ArticleList: React.FC = () => {
  const { data: articles, isLoading } = useQuery("articles", articlesApi.getArticles);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {articles?.map((article) => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
};
```

### Pattern 3: Form Components

**Angular Auth Component:**

```typescript
@Component({
  template: `
    <form [formGroup]="authForm" (ngSubmit)="submitForm()">
      <input formControlName="email" type="email" />
      <input formControlName="password" type="password" />
      <button type="submit">Submit</button>
    </form>
  `,
})
export class AuthComponent {
  authForm = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });

  submitForm() {
    if (this.authForm.valid) {
      // Submit logic
    }
  }
}
```

**React Equivalent:**

```tsx
import { useForm } from "react-hook-form";

interface AuthFormData {
  email: string;
  password: string;
}

export const AuthForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = (data: AuthFormData) => {
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email", { required: "Email is required" })} type="email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register("password", { required: "Password is required" })} type="password" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

## Service to Hook Conversion

### Angular Service Pattern

```typescript
@Injectable({ providedIn: "root" })
export class ArticlesService {
  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<{ articles: Article[] }>("/articles").pipe(map((response) => response.articles));
  }

  createArticle(article: Partial<Article>): Observable<Article> {
    return this.http.post<{ article: Article }>("/articles", { article }).pipe(map((response) => response.article));
  }
}
```

### React Hook Equivalent

```typescript
// hooks/useArticles.ts
import { useQuery, useMutation, useQueryClient } from "react-query";
import apiClient from "../api/client";

export const useArticles = () => {
  return useQuery("articles", async () => {
    const response = await apiClient.get("/articles");
    return response.data.articles;
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (article: Partial<Article>) => {
      const response = await apiClient.post("/articles", { article });
      return response.data.article;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("articles");
      },
    },
  );
};
```

## Routing Migration

### Angular Router Configuration

```typescript
const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: AuthComponent, canActivate: [AuthGuard] },
  { path: "article/:slug", component: ArticleComponent },
  { path: "profile/:username", loadChildren: () => import("./profile/profile.module") },
];
```

### React Router Equivalent

```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "login",
        element: (
          <ProtectedRoute requireAuth={false}>
            <Auth />
          </ProtectedRoute>
        ),
      },
      { path: "article/:slug", element: <Article /> },
      {
        path: "profile/:username",
        lazy: () => import("./pages/Profile"),
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;
```

### Protected Route Component

```tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const { isAuthenticated } = useAuth();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

## State Management Migration

### RxJS to React Query Migration

**Angular Pattern:**

```typescript
// Service with BehaviorSubject
@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  setUser(user: User) {
    this.currentUserSubject.next(user);
  }
}
```

**React Pattern:**

```typescript
// Context + React Query
const UserContext = createContext<{
  user: User | null;
  setUser: (user: User) => void;
}>({});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
```

## Testing Strategy

### Component Testing Migration

**Angular Testing:**

```typescript
describe("FooterComponent", () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
    });
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
  });

  it("should display current year", () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain("2024");
  });
});
```

**React Testing (Jest + React Testing Library):**

```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './Footer';

const renderFooter = () => {
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};

describe('Footer', () => {
  it('should display current year', () => {
    renderFooter();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it('should have link to home', () => {
    renderFooter();
    expect(screen.getByRole('link', { name: /conduit/i })).toHaveAttribute('href', '/');
  });
});
```

## Deployment Considerations

### Build Configuration

**Angular (angular.json):**

```json
{
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
      "outputPath": "dist/angular-realworld",
      "index": "src/index.html",
      "main": "src/main.ts"
    }
  }
}
```

**React (Vite config):**

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 3000,
  },
});
```

### Environment Variables

**Angular:**

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: "https://api.realworld.show/api",
};
```

**React:**

```typescript
// .env
VITE_API_URL=https://api.realworld.show/api

// config.ts
export const config = {
  apiUrl: import.meta.env.VITE_API_URL
};
```

## Common Pitfalls and Solutions

### 1. Over-Engineering the Migration

**Problem:** Trying to migrate everything at once
**Solution:** Start with simple components, establish patterns, then scale

### 2. Direct Translation Without Optimization

**Problem:** Converting Angular patterns 1:1 without leveraging React strengths
**Solution:** Embrace React patterns (hooks, composition, functional components)

### 3. State Management Complexity

**Problem:** Recreating complex RxJS flows in React
**Solution:** Use React Query for server state, Context for client state

### 4. Routing Confusion

**Problem:** Trying to replicate Angular guards exactly
**Solution:** Use React Router loaders and protected route components

### 5. Form Handling Overhead

**Problem:** Missing Angular Reactive Forms validation
**Solution:** Use React Hook Form for similar developer experience

## Migration Checklist

### Pre-Migration

- [ ] Complete codebase analysis
- [ ] Identify migration complexity
- [ ] Set up React project structure
- [ ] Configure build tools and dependencies

### During Migration

- [ ] Migrate layout components first
- [ ] Establish authentication patterns
- [ ] Convert services to hooks
- [ ] Migrate routing configuration
- [ ] Update form handling
- [ ] Convert pipes to utility functions

### Post-Migration

- [ ] Update tests
- [ ] Performance optimization
- [ ] Bundle size analysis
- [ ] Accessibility audit
- [ ] Documentation updates

### Quality Assurance

- [ ] Feature parity verification
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] Performance benchmarking
- [ ] Security review

## Timeline Estimation

| Phase                  | Duration | Components      | Effort   |
| ---------------------- | -------- | --------------- | -------- |
| Setup & Infrastructure | 1 week   | N/A             | 40 hours |
| Layout Components      | 1 week   | 2-3 components  | 40 hours |
| Authentication         | 1 week   | 2-3 components  | 40 hours |
| Article Features       | 2 weeks  | 8-10 components | 80 hours |
| Profile Features       | 1 week   | 4-5 components  | 40 hours |
| Testing & Polish       | 1 week   | All components  | 40 hours |

**Total Estimated Duration:** 7-8 weeks
**Total Estimated Effort:** 280-320 hours

## Success Metrics

- [ ] **Functional Parity:** All Angular features work in React
- [ ] **Performance:** Bundle size ≤ Angular version
- [ ] **Developer Experience:** Faster build times, better debugging
- [ ] **Maintainability:** Cleaner code structure, better testability
- [ ] **User Experience:** No regression in UX/UI

## Resources and References

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [React Query Documentation](https://tanstack.com/query/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Testing Library Documentation](https://testing-library.com/)
- [Vite Documentation](https://vitejs.dev/)

---

_This playbook is based on analysis of the Angular RealWorld example application and represents best practices for Angular to React migration projects._
