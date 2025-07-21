# React Burger Builder

A modern React application for building custom burgers with drag-and-drop functionality. Built with React, Redux, and react-dnd for an interactive user experience.
Try it here [React Space Burger](https://react-space-burger.vercel.app/)

## Features

- 🍔 Interactive burger builder with drag-and-drop interface
- 🧱 Component-based architecture with reusable UI elements
- 📱 Responsive design for all device sizes
- ⚡ State management with Redux
- 🎨 Custom CSS modules for styling
- 🔄 Loading states and error handling

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd react-burger-builder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Development Workflow

### Code Quality Tools

The project includes automated code quality checks that run before each commit. To ensure smooth development:

**Recommended workflow:**
```bash
npm run check  # Run all checks before committing
```

**Individual commands:**
- `npm run lint` - Run ESLint and auto-fix issues
- `npm run stylelint:fix` - Check and fix CSS/SCSS styling issues  
- `npm run format` - Format code with Prettier

**Committing changes:**
```bash
npm run commit  # Interactive commit with conventional commit format
```

This ensures your commit messages follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standards.

### IDE Setup

Configure your IDE to automatically run formatting and linting on save for the best development experience.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── burger-ingredients/
│   ├── burger-constructor/
│   └── preloader/
├── pages/              # Page components
│   └── home.jsx
├── utils/              # Utility functions and services
└── styles/             # Global styles and CSS modules
```

## Import Aliases

The project uses path aliases for cleaner imports:

```javascript
// Instead of: import Component from '../../../components/component'
import Component from '@components/component';
```

Available aliases:
- `@` → `./src`
- `@components` → `./src/components`
- `@services` → `./src/services`
- `@pages` → `./src/pages`
- `@utils` → `./src/utils`

## Technologies Used

- **React** - UI library
- **Redux** - State management
- **React DnD** - Drag and drop functionality
- **CSS Modules** - Scoped styling
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Stylelint** - CSS linting

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run check` - Run all quality checks
- `npm run lint` - Lint JavaScript files
- `npm run stylelint:fix` - Lint and fix CSS files
- `npm run format` - Format code with Prettier
- `npm run commit` - Interactive commit tool


