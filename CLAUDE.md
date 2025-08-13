# Claude AI Assistant Guidelines

This document provides instructions for Claude (or any AI assistant) when working on the Caddy codebase.

## Essential Reading

**BEFORE making any code changes, you MUST read:**
1. `CONTRIBUTING.md` - Our development standards and housekeeping rules
2. `docs/stories/` - Current story being implemented
3. This file (CLAUDE.md)

## Core Development Rules

### 🚫 NEVER Do These:
- **NEVER** create versioned files (ComponentV2, component.old, enhanced-component)
- **NEVER** duplicate existing code - always update in place
- **NEVER** comment out code - delete it (git tracks history)
- **NEVER** use relative imports beyond one level - use path aliases (@/...)
- **NEVER** put files in wrong folders - follow the structure in CONTRIBUTING.md
- **NEVER** hardcode configuration values - use environment variables
- **NEVER** implement business logic on client side - use Convex functions

### ✅ ALWAYS Do These:
- **ALWAYS** read CONTRIBUTING.md before making changes
- **ALWAYS** update files in place rather than creating new versions
- **ALWAYS** use path aliases for imports (@/components, @/lib, etc.)
- **ALWAYS** place files in correct folders per our structure
- **ALWAYS** run `npm run typecheck` before considering task complete
- **ALWAYS** delete dead code instead of commenting it out
- **ALWAYS** check if a component already exists before creating new ones

## File Organization Reference

```
src/
  ├── routes/         # Pages ONLY (TanStack Start routes)
  ├── components/
  │   ├── ui/        # Generic, reusable components (Button, Card, etc.)
  │   ├── features/  # Feature-specific components (ParticipantCard, etc.)
  │   └── layouts/   # Layout wrappers (AppLayout, DashboardLayout, etc.)
  ├── lib/
  │   ├── hooks/     # Custom React hooks (useUser, usePermissions, etc.)
  │   ├── utils/     # Pure utility functions (formatDate, calculateAge, etc.)
  │   └── types/     # Shared TypeScript types
  └── convex/        # ALL backend logic (never put business logic in frontend)
```

## Working with Stories

When implementing a story:
1. Read the ENTIRE story file first
2. Check all tasks and subtasks
3. Update ONLY the sections you're authorized to modify:
   - Dev Agent: Tasks checkboxes, Dev Agent Record sections
   - QA Agent: QA Results section only
4. Mark tasks complete ([x]) as you finish them
5. Update the File List with all modified/created files

## Code Style Enforcement

Our pre-commit hooks automatically handle:
- Code formatting (Prettier)
- Import organization
- TypeScript type checking

**You don't need to worry about formatting** - focus on logic and structure.

## Import Standards

```typescript
// ✅ CORRECT - Use path aliases
import { Button } from '@/components/ui/Button'
import { useUser } from '@/lib/hooks/useUser'
import { formatDate } from '@/lib/utils/date'

// ❌ WRONG - Don't use relative paths
import { Button } from '../../../components/ui/Button'
import { useUser } from '../../lib/hooks/useUser'
```

## Component Creation Checklist

Before creating a new component:
1. ✅ Check if it already exists in `components/ui/` or `components/features/`
2. ✅ Determine correct location:
   - Generic/reusable → `components/ui/`
   - Feature-specific → `components/features/`
3. ✅ Use PascalCase for component names
4. ✅ Create an index.ts for clean exports
5. ✅ Co-locate tests if creating them

## Refactoring Protocol

When refactoring code:
1. **Update in place** - modify the existing file
2. **Don't create new versions** - no FileV2 or FileOld
3. **Ensure tests pass** before and after
4. **One type of change per commit** - structure OR logic, not both

## Environment Variables

- All config goes in `.env.local`
- Never hardcode API keys or URLs
- Use VITE_ prefix for client-side variables
- Document new variables in README.md

## Testing

Tests are co-located with components:
```
components/
  └── Button/
      ├── Button.tsx
      ├── Button.test.tsx  # Test file here, not in separate folder
      └── index.ts
```

## Git Commit Messages

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding missing tests
- `chore:` - Changes to build process or auxiliary tools

Reference story number when applicable:
```
feat: implement user authentication (Story 1.2)
```

## Commands to Run

Before marking any task complete:
```bash
npm run typecheck  # Must pass
npm run format     # Auto-formats code
npm run lint       # Checks for issues
```

## Working with Convex

- Schema defined in `convex/schema.ts`
- All backend logic in `convex/` folder
- Let Convex generate TypeScript types
- Never duplicate type definitions

## Quick Decision Tree

**"Should I create a new file or update existing?"**
→ Always update existing unless it's genuinely new functionality

**"Where does this file belong?"**
→ Check CONTRIBUTING.md section 2 for folder structure

**"Should I comment out this code?"**
→ No, delete it. Git tracks history.

**"Should I create ComponentV2?"**
→ No, update the original component.

**"Where should business logic go?"**
→ In Convex functions, never in React components.

## Final Checklist

Before completing any task:
- [ ] All files in correct folders per CONTRIBUTING.md
- [ ] No duplicate/versioned files created
- [ ] All imports use path aliases
- [ ] No commented-out code remains
- [ ] TypeScript compilation passes
- [ ] Story tasks marked complete
- [ ] File List updated in story

---

**Remember:** When in doubt, check CONTRIBUTING.md or ask for clarification rather than creating new patterns.