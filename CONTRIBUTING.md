# Contributing to Caddy - Development Standards

This document outlines our development standards and housekeeping rules to maintain a clean, efficient, and maintainable codebase.

## Core Principles

### 1. Single Source of Truth
- **NO versioned files**: Never create `ComponentV2`, `enhanced-component`, or `component.old`
- **Replace, don't duplicate**: Always update existing files in place
- **Git is our history**: Use git for version tracking, not file naming
- **One component, one file**: Each component/function has exactly one implementation

### 2. File Organization

#### Project Structure
```
docs/
  ├── stories/         # User stories ONLY
  ├── architecture/    # Technical decisions
  ├── adr/            # Architecture Decision Records
  └── prd/            # Product requirements

src/
  ├── routes/         # Pages/routes ONLY (TanStack Start)
  ├── components/
  │   ├── ui/        # Generic, reusable UI components
  │   ├── features/  # Feature-specific components
  │   └── layouts/   # Layout wrappers
  ├── lib/
  │   ├── hooks/     # Custom React hooks
  │   ├── utils/     # Pure utility functions
  │   └── types/     # Shared TypeScript types
  └── convex/        # ALL backend logic
      ├── _generated/  # Auto-generated (DO NOT EDIT)
      └── *.ts        # Backend functions
```

### 3. Component Guidelines
- **Clear hierarchy**: Generic components in `ui/`, feature-specific in `features/`
- **Co-location**: Keep component + its specific styles/tests together
- **Index exports**: Use index.ts for clean imports from folders
- **Naming convention**: PascalCase for components, camelCase for utilities

### 4. Import Standards
- **Use path aliases**: `@/components` not `../../../components`
- **Import ordering** (enforced by ESLint):
  1. External packages
  2. Internal aliases (@/...)
  3. Relative imports
  4. Type imports
- **No circular dependencies**: Will be caught by ESLint

### 5. Documentation Rules
- **Co-located docs**: Component documentation lives with component
- **README per feature**: Each feature folder gets a README explaining its purpose
- **No orphan docs**: Documentation must reference living code
- **Story-driven**: All features must trace back to a story in `docs/stories/`

### 6. Code Hygiene
- **Delete dead code**: Don't comment out code, remove it (git has history)
- **No TODO graveyards**: Address TODOs immediately or track in stories
- **Clean imports**: Unused imports are automatically removed on save
- **No console.logs**: Use proper logging utilities or remove before commit

### 7. Testing Organization
```
src/
  ├── components/
  │   └── Button/
  │       ├── Button.tsx
  │       ├── Button.test.tsx    # Co-located unit tests
  │       └── index.ts           # Exports
```

### 8. Environment Configuration
- **Single .env.local**: All environment variables in one place
- **Type-safe config**: Environment variables must be validated
- **No hardcoded values**: All configuration through environment
- **Required variables**: Must be documented in README

### 9. Database & Backend Rules
- **Schema-first**: Define Convex schema before implementation
- **One source for types**: Let Convex generate TypeScript types
- **No client-side business logic**: Business rules belong in Convex functions
- **Consistent naming**: Use consistent naming between frontend and backend

### 10. Development Workflow

#### Branch Naming
- Format: `story/[story-number]-[brief-description]`
- Example: `story/1.2-clerk-auth`

#### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- Reference story number when applicable: `feat: implement user login (Story 1.2)`

#### Pull Requests
- One story = one PR maximum
- PR title should reference the story
- Must pass all automated checks

### 11. Refactoring Protocol
- **Refactor in place**: Update existing files, don't create new versions
- **Test before refactor**: Ensure tests pass before and after
- **One refactor type per commit**: Separate structure changes from logic changes
- **No "temporary" solutions**: If it's worth doing, do it right

### 12. Dependency Management
- **Justify every package**: Document why each dependency exists
- **Prefer platform features**: Use native browser/Node APIs before adding libraries
- **Regular audits**: Remove unused dependencies in each sprint
- **Lock versions**: Use exact versions in package.json for consistency

## Automated Enforcement

### Pre-commit Hooks
The following checks run automatically before each commit:
- TypeScript compilation check
- ESLint (with auto-fix)
- Prettier formatting
- Import organization

### IDE Configuration
Configure your IDE to use the project's settings:
- Format on save
- Organize imports on save
- ESLint auto-fix on save

See `.vscode/settings.json` for VSCode configuration.

## Definition of Done

For any task to be considered complete:
- [ ] Code follows all housekeeping rules
- [ ] No duplicate files or components created
- [ ] Files are in correct folders per structure
- [ ] All imports use path aliases
- [ ] No commented-out code remains
- [ ] Tests are co-located and passing
- [ ] Documentation is updated if needed
- [ ] Pre-commit hooks pass

## Quick Reference

### DO ✅
- Update files in place
- Use path aliases
- Delete unused code
- Co-locate related files
- Follow the folder structure
- Write tests alongside code

### DON'T ❌
- Create V2/enhanced versions
- Use relative imports beyond one level
- Comment out code
- Leave TODOs without tracking
- Put files in wrong folders
- Hardcode configuration values

## Questions?

If you're unsure about where something belongs or how to structure it, ask in the team channel before creating new patterns.

Remember: **Consistency > Perfection**. Follow existing patterns even if you think you have a better way—propose changes through team discussion.