# AI Code Review Dashboard

A production-quality frontend application for visualizing code diffs and AI-generated review comments. Built with performance, accessibility, and maintainability as core principles.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## ✨ Features

### Core Functionality
- **Repository Selection**: Dropdown selector with repository metadata display
- **Interactive File Explorer**: Tree view with comment count badges and keyboard navigation
- **Advanced Diff Viewer**: Unified diff display with syntax highlighting and line numbers
- **AI Review Comments**: Inline comments with severity levels, categories, and AI confidence scores
- **Smart Filtering**: Filter by severity, search by keyword, and show only files with issues
- **Real-time Updates**: React Query powered data fetching with automatic caching

### Developer Experience
- **Full TypeScript**: Type-safe codebase with comprehensive type definitions
- **Keyboard Navigation**: Arrow keys (↑/↓) or vim-style (j/k) for file navigation
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Loading States**: Skeleton screens for better perceived performance
- **Error Handling**: Graceful error states with user-friendly messages

## 🛠 Tech Stack

### Core Libraries
- **React 18.2** - UI library with concurrent features
- **TypeScript 5.2** - Type safety and enhanced developer experience
- **Vite 5.0** - Fast build tool and development server

### State Management
- **Zustand 4.4** - Lightweight state management for UI and filters
- **React Query 5.17** - Server state management, caching, and data synchronization

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Custom Design System** - Distinctive typography and color palette
  - Primary font: DM Sans
  - Monospace: JetBrains Mono
  - Display: Outfit

### Development Tools
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── RepoSelector/   # Repository dropdown selector
│   ├── FileTree/       # Hierarchical file explorer
│   ├── DiffViewer/     # Code diff visualization
│   ├── ReviewComment/  # AI comment display
│   ├── SeverityBadge/  # Severity level indicator
│   ├── SearchInput/    # Debounced search input
│   ├── Skeleton/       # Loading state components
│   └── UI/             # Reusable UI primitives (Button, Card, Badge)
├── hooks/              # Custom React hooks
│   ├── useRepos.ts     # Repository data fetching
│   ├── useFiles.ts     # File tree data fetching
│   ├── useDiff.ts      # Diff and review data fetching
│   └── useKeyboardNavigation.ts  # Keyboard shortcuts
├── pages/              # Page-level components
│   └── Dashboard.tsx   # Main dashboard page
├── store/              # Zustand state management
│   └── reviewStore.ts  # Global review state
├── services/           # API and data services
│   └── api.ts          # Mock API with realistic delays
├── mocks/              # Mock data (JSON)
│   ├── repos.json      # Repository data
│   ├── files.json      # File tree structures
│   ├── diffs.json      # Diff hunks and lines
│   └── reviews.json    # AI review comments
├── utils/              # Utility functions
│   └── diffHelpers.ts  # Diff formatting and syntax highlighting
├── types/              # TypeScript type definitions
│   └── index.ts        # All application types
└── __tests__/          # Test files
    ├── FileTree.test.tsx
    ├── DiffViewer.test.tsx
    └── severityFilter.test.ts
```

## 🏗 Architecture Decisions

### State Management Strategy

**Zustand for UI State**
- Repository and file selection
- Filter configurations
- UI-specific state
- Simple, performant, and type-safe

**React Query for Server State**
- Data fetching and caching
- Automatic refetching and invalidation
- Loading and error states
- Optimistic updates

This separation provides clear boundaries between client and server state, improving maintainability and testability.

### Component Design Patterns

**Composition Over Inheritance**
- Small, focused components
- Reusable UI primitives
- Clear prop interfaces

**Memoization Strategy**
- `React.memo` for expensive list items (DiffLine)
- `useMemo` for derived data (filtered reviews, file counts)
- `useCallback` for event handlers passed to children

**Accessibility First**
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader announcements

### Performance Optimizations

1. **Code Splitting**: Lazy loading ready (currently single-page app)
2. **Debounced Search**: 300ms delay to reduce unnecessary renders
3. **Virtual Scrolling Ready**: File tree structure supports future virtualization
4. **Memoized Renders**: DiffLine components are memoized to prevent re-renders
5. **Optimistic Updates**: React Query configuration for instant UI feedback

## ♿ Accessibility Features

### Keyboard Navigation
- **Arrow Keys (↑/↓)**: Navigate between files
- **Vim-style (j/k)**: Alternative navigation for power users
- **Tab**: Focus management through interactive elements
- **Enter/Space**: Activate buttons and toggle states

### Screen Reader Support
- ARIA labels on all interactive elements
- Semantic HTML structure
- Status announcements for loading/error states
- Descriptive button labels

### Visual Accessibility
- WCAG AA compliant color contrast
- Focus indicators on all interactive elements
- Clear visual hierarchy
- Resizable text support

### Keyboard-Only Operation
All features fully accessible without a mouse:
- Repository selection
- File navigation
- Comment filtering
- Search functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Development Server
The app will be available at `http://localhost:3000`

## 🧪 Testing

### Test Coverage
- **FileTree Component**: Rendering, interaction, and state updates
- **DiffViewer Component**: Diff display and comment integration
- **Severity Filters**: State management and filter logic

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🎨 Design Philosophy

### Typography Hierarchy
- **Display**: Outfit (headings, emphasis)
- **Body**: DM Sans (readable, modern)
- **Code**: JetBrains Mono (monospace, developer-friendly)

### Color Palette
- **Primary**: Blue tones for interactive elements
- **Severity Colors**:
  - Info: Blue (#0ea5e9)
  - Warning: Amber (#f59e0b)
  - Critical: Red (#ef4444)
- **Neutrals**: Gray scale for backgrounds and text

### Visual Language
- Clean, minimal developer-focused UI
- Subtle shadows and borders
- Generous whitespace
- Color used purposefully for severity and status

## 📊 Performance Considerations

### Bundle Size
- Tree-shaking enabled via Vite
- No unnecessary dependencies
- Tailwind CSS purged in production

### Runtime Performance
- Virtualization-ready file tree structure
- Memoized expensive computations
- Debounced user inputs
- Lazy loading preparation

### Network Optimization
- React Query caching (5-minute stale time)
- Minimal re-fetching
- Optimistic UI updates
- Mock delays simulate real network conditions

## 🔮 Future Enhancements

### Potential Features
- [ ] Virtual scrolling for large file trees
- [ ] Side-by-side diff view
- [ ] Comment threading and replies
- [ ] Export review reports
- [ ] Dark mode
- [ ] AI model confidence visualization
- [ ] Code suggestion acceptance workflow
- [ ] Real-time collaboration

### Technical Improvements
- [ ] E2E testing with Playwright
- [ ] Storybook component documentation
- [ ] Performance monitoring
- [ ] Progressive Web App (PWA)

## 📝 Code Style

This project uses:
- **ESLint** for code quality
- **Prettier** for formatting
- **TypeScript strict mode** for type safety

Configuration files:
- `.eslintrc.cjs` - ESLint rules
- `.prettierrc` - Prettier formatting
- `tsconfig.json` - TypeScript configuration

## 🤝 Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Ensure all tests pass before submitting

## 📄 License

MIT License - feel free to use this project for learning or as a foundation for your own applications.

## 🙏 Acknowledgments

- Design inspiration from modern code review tools (GitHub, GitLab, Gerrit)
- Tailwind CSS for the excellent utility-first framework
- React Query team for robust server state management
- Zustand for simple yet powerful state management

---

**Built with ❤️ for developers, by developers**
