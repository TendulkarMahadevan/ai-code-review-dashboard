# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies
```bash
cd ai-code-review-dashboard
npm install
```

This will install all required dependencies including React, TypeScript, Tailwind CSS, React Query, Zustand, and development tools.

### 2. Start Development Server
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```

Production build will be in the `dist/` directory.

## First Steps

1. **Select a Repository**: Use the dropdown at the top to choose from available repositories
2. **Browse Files**: Navigate the file tree on the left side
3. **View Diffs**: Click any file to see its code changes
4. **Review Comments**: AI-generated comments appear inline with the code
5. **Filter & Search**: Use the filters to find specific issues

## Keyboard Shortcuts

- `↑` or `k` - Navigate to previous file
- `↓` or `j` - Navigate to next file
- `Tab` - Move through interactive elements
- `Enter` - Select/activate focused element

## Mock Data

The application comes with realistic mock data:
- 3 repositories
- Multiple files with various comment counts
- 4 files with detailed diffs
- 10 AI review comments across different severity levels

All data is in `src/mocks/` and can be easily extended.

## Project Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm test         # Run tests
```

## Customization

### Adding New Repositories
Edit `src/mocks/repos.json`:
```json
{
  "id": "repo-4",
  "name": "your-repo-name",
  "owner": "your-org",
  "description": "Description here",
  "branch": "main"
}
```

### Adding Files
Edit `src/mocks/files.json` and add your file structure under the repository ID.

### Adding Diffs
Edit `src/mocks/diffs.json` with your diff hunks and lines.

### Adding Comments
Edit `src/mocks/reviews.json` with AI-generated review comments.

## Technology Overview

- **React 18** - Component library
- **TypeScript** - Type safety
- **Vite** - Build tool (extremely fast HMR)
- **Tailwind CSS** - Styling
- **React Query** - Data fetching & caching
- **Zustand** - State management
- **Jest** - Testing

## Troubleshooting

### Port Already in Use
If port 3000 is occupied, Vite will automatically use the next available port.

### TypeScript Errors
Run `npm run build` to see all TypeScript errors. The dev server may still work with type errors.

### Missing Dependencies
Delete `node_modules` and `package-lock.json`, then run `npm install` again.

## Next Steps

1. Explore the codebase structure in `src/`
2. Check out the comprehensive README for architecture details
3. Run tests with `npm test`
4. Try customizing the mock data
5. Experiment with the filtering and search features

Enjoy building with the AI Code Review Dashboard! 🚀
