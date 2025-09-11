# React Conduit

> ### React TypeScript codebase for the RealWorld example application (Medium.com clone)

This is a React TypeScript implementation that serves as the foundation for migrating from the Angular RealWorld example application. It provides a clean, well-structured starting point that matches the original Angular application's TypeScript configuration and build setup.

## Project Overview

This project is a **Medium.com clone** called "Conduit" built with:

- **React 19.1.1** with TypeScript
- **Vite** as the build tool (replacing Angular CLI)
- **TypeScript 5.8.3** (matching the original Angular version)
- **ESLint** for code linting
- **Modern ES2022** target with strict TypeScript configuration

## Project Structure

The project follows a feature-based architecture similar to the original Angular application:

```
src/
├── components/          # Reusable UI components
├── features/           # Feature modules
│   ├── article/        # Article management
│   ├── profile/        # User profiles
│   ├── settings/       # User settings
│   ├── home/          # Home page
│   └── editor/        # Article editor
├── core/              # Core functionality
│   ├── auth/          # Authentication
│   ├── interceptors/  # HTTP interceptors
│   ├── models/        # Data models
│   └── layout/        # Layout components
├── shared/            # Shared utilities
│   ├── services/      # Shared services
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
└── assets/           # Static assets
```

## Getting Started

### Prerequisites

- Node.js ^20.11.1 (matching the original Angular application)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:

   ```bash
   cd react-conduit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
# or
npm start
```

The application will be available at `http://localhost:3000` and will automatically reload when you make changes.

### Building for Production

Build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory with:

- Source maps enabled
- Vendor chunks separated for better caching
- Optimized bundle sizes

### Code Quality

Run linting:

```bash
npm run lint
```

Fix linting issues automatically:

```bash
npm run lint:fix
```

Type checking:

```bash
npm run type-check
```

## Build Configuration

### Vite Configuration

The Vite configuration (`vite.config.ts`) provides:

- **Path aliases**: `@/` maps to `src/` directory
- **Development server**: Runs on port 3000 with auto-open
- **Build optimization**: Vendor chunk splitting and source maps
- **TypeScript support**: Full TypeScript compilation

### TypeScript Configuration

The TypeScript setup matches the original Angular application with:

- **Strict mode** enabled with comprehensive type checking
- **ES2022** target for modern JavaScript features
- **Path mapping** for clean imports (`@/` alias)
- **Source maps** for debugging
- **Consistent casing** enforcement

Key TypeScript compiler options:

- `strict: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `forceConsistentCasingInFileNames: true`
- `esModuleInterop: true`

## Migration Notes

This React project is designed to facilitate migration from the Angular RealWorld application:

1. **TypeScript Compatibility**: Uses the same TypeScript version (5.8.3) and similar strict configuration
2. **Build System**: Vite replaces Angular CLI with equivalent development and production builds
3. **Project Structure**: Mirrors the Angular feature-based organization
4. **Development Experience**: Similar development server with hot reload

## Next Steps

This foundation is ready for implementing the RealWorld application features:

1. Set up routing with React Router
2. Implement authentication system
3. Create article management features
4. Add user profile functionality
5. Implement the editor interface
6. Add API integration

## Scripts Reference

| Script               | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Start development server     |
| `npm start`          | Alias for dev command        |
| `npm run build`      | Build for production         |
| `npm run lint`       | Run ESLint                   |
| `npm run lint:fix`   | Fix ESLint issues            |
| `npm run preview`    | Preview production build     |
| `npm run type-check` | Run TypeScript type checking |

## License

MIT License - matching the original Angular application.
