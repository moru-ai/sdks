# Moru SDKs

This repository contains all Moru SDKs (JS, Python, CLI) managed as a pnpm workspace.

## Version Management with Changesets

**We use [Changesets](https://github.com/changesets/changesets) for automated version management and releases.**

### Core Principle: Flexible

**You just need changesets before releasing.** Commit freely during development, and add changesets when you're ready to release.

### When Changesets Are Needed

The following changes require changesets **when included in a release:**

- ✅ **Features**: New functionality
- ✅ **Bug Fixes**: Bug corrections
- ✅ **Breaking Changes**: Changes that break API compatibility
- ✅ **Performance**: Performance improvements
- ✅ **Dependencies**: Dependency updates affecting users

### When Changesets Are NOT Needed

Skip changesets for:

- ❌ Documentation-only changes (README, comments)
- ❌ Test-only changes
- ❌ CI/CD configuration changes
- ❌ Internal tooling changes

### Workflow (Flexible Approach)

#### Approach 1: Add as you develop (Recommended - won't forget)

```bash
# 1. Make code changes
git add <files>
git commit -m "feat: add new feature X"

# 2. Add changeset
pnpm changeset
# - Which packages? (select with spacebar)
# - Version type? (patch/minor/major)
# - Summary? (description for CHANGELOG)

git add .changeset/
git commit -m "chore: add changeset"
git push
```

#### Approach 2: Add later (More flexible)

```bash
# 1. Commit multiple changes freely
git commit -m "feat: add feature A"
git commit -m "fix: bug B"
git commit -m "feat: add feature C"
git push

# 2. Add changeset before release
git log --oneline -10  # Review recent changes

pnpm changeset  # "Add features A and C, fix bug B"
git add .changeset/
git commit -m "chore: add changeset for v0.3.3"
git push
```

**Either approach works. Choose what fits your team/personal preference.**

### Choosing the Right Version Type

Follow [Semantic Versioning](https://semver.org/):

#### **patch** (0.3.1 → 0.3.2)
- Bug fixes with no API changes
- Performance improvements
- Internal refactoring
- Documentation updates affecting functionality
- Dependency patches

**Examples:**
```
- Fix: CLI crash when template name contains spaces
- Perf: Reduce sandbox startup time by 30%
- Fix: Memory leak in websocket connection
```

#### **minor** (0.3.1 → 0.4.0)
- New features (backward compatible)
- New API methods
- New configuration options
- Deprecations (with backward compatibility)
- Dependency minor updates

**Examples:**
```
- Add: Support for custom Docker registries
- Add: New `sandbox.pause()` method
- Add: --verbose flag to CLI commands
```

#### **major** (0.3.1 → 1.0.0)
- Breaking changes (API removed or changed)
- Renamed methods/parameters
- Changed behavior that breaks existing code
- Removed deprecated features
- Changed minimum supported versions

**Examples:**
```
- BREAKING: Remove deprecated `createSandbox()` method
- BREAKING: Change `timeout` parameter from seconds to milliseconds
- BREAKING: Require Node.js 20+ (drop Node 18 support)
```

### Writing Good Changeset Messages

**Good changeset messages:**
- ✅ Start with a verb (Add, Fix, Update, Remove, Change)
- ✅ Be specific about what changed
- ✅ Focus on user impact, not implementation
- ✅ One change per changeset (if logically separate)

**Examples:**

```markdown
✅ GOOD:
---
"@moru-ai/cli": minor
---

Add support for environment variables in templates

✅ GOOD:
---
"@moru-ai/core": patch
---

Fix sandbox cleanup hanging when network disconnects

❌ BAD:
---
"@moru-ai/cli": patch
---

Updated code

❌ BAD:
---
"@moru-ai/core": minor
---

Changed some stuff in sandbox.ts
```

### Handling Multiple Changes

**Combine into one changeset or split into multiple - your choice.**

```bash
# Option 1: Combine (simpler)
pnpm changeset
# Summary: "Add validation, quiet flag, and fix help text"

# Option 2: Split (better changelog readability)
pnpm changeset  # "Add template validation"
pnpm changeset  # "Add --quiet flag"
pnpm changeset  # "Fix help text typo"
```

**When to split:**
- Logically independent changes
- Important features users should know about separately

**When to combine:**
- Related small changes
- Multiple commits for one feature

### Release Process

**Only maintainers perform releases:**

1. **Trigger Release Workflow**
   ```bash
   # Go to GitHub Actions
   # Actions → Release → Run workflow
   ```

2. **What Happens Automatically:**
   - ✅ All changesets are processed
   - ✅ `package.json` versions updated
   - ✅ `CHANGELOG.md` generated
   - ✅ Packages published to npm/PyPI
   - ✅ GitHub release created
   - ✅ CLI binaries built and attached
   - ✅ Changesets deleted

3. **After Release:**
   ```bash
   git pull  # Get updated versions and CHANGELOG
   ```

### Real-World Examples

#### Example 1: Simple Bug Fix

```bash
git commit -m "fix(cli): handle empty template names"
pnpm changeset  # patch, "Fix crash with empty template names"
git add .changeset/
git commit -m "chore: add changeset"
git push
```

#### Example 2: Multiple Commits, One Changeset

```bash
# Develop with multiple commits
git commit -m "feat: start implementing pause/resume"
git commit -m "refactor: improve state management"
git commit -m "test: add tests for pause/resume"
git push

# Add changeset later
pnpm changeset  # minor, "Add sandbox.pause() and sandbox.resume()"
git add .changeset/
git commit -m "chore: add changeset"
git push
```

#### Example 3: Multi-Package Change

```bash
git commit -m "feat: add custom registry support to CLI and SDK"
pnpm changeset
# → Select both @moru-ai/cli AND @moru-ai/core (spacebar)
# → Choose minor for each
# → Summary: "Add custom Docker registry support"
git add .changeset/
git commit -m "chore: add changeset"
git push
```

### Commit Message Convention

Use conventional commits:

**Format:** `<type>(<scope>): <description>`

**IMPORTANT: Always include the type prefix (feat, fix, chore, etc.) in commit messages. Never skip it.**

**Types:**
- `feat`: New feature (usually needs changeset)
- `fix`: Bug fix (usually needs changeset)
- `refactor`: Code refactoring (changeset if behavior changes)
- `perf`: Performance improvement (usually needs changeset)
- `docs`: Documentation only (NO changeset)
- `test`: Tests only (NO changeset)
- `ci`: CI/CD changes (NO changeset)
- `chore`: Maintenance tasks (NO changeset)

**Examples:**
```bash
✅ feat(cli): add template validation
✅ fix(sdk): prevent memory leak in websocket
✅ perf(sdk): reduce sandbox startup time by 30%
✅ refactor(cli): simplify command parser
✅ docs: update README with new examples
✅ test(sdk): add integration tests for pause/resume
✅ ci: enable changesets automation for CLI
```

### Tips and Gotchas

**✅ Good habits:**
- Check for changesets before releasing (`ls .changeset/`)
- Write clear, user-focused changeset messages
- Ask teammates if unsure

**⚠️ Watch out:**
- No changeset = no version bump on release
- docs/test/ci changes don't need changesets
- Wrong version type can be fixed later (edit the file)

### FAQ

**Q: I forgot to create a changeset. What now?**
```bash
# Just add it later
pnpm changeset
git add .changeset/
git commit -m "chore: add changeset"
git push
```

**Q: I chose the wrong version type**
```bash
# Changesets are just markdown files - edit directly
vim .changeset/<filename>.md
# Or delete and recreate
rm .changeset/<filename>.md
pnpm changeset
```

**Q: What if multiple people create changesets?**
No problem. All changesets accumulate and get processed together at release time.

**Q: How often should we release?**
- When important bug fixes are ready
- When new features are complete
- When a reasonable number of changesets accumulate (3-5+)

---

## Development

### Setup

```bash
# Install dependencies
pnpm install

# Run tests for all packages
pnpm test

# Run specific package tests
pnpm --filter @moru-ai/cli test
pnpm --filter @moru-ai/core test
```

### Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @moru-ai/cli build
```

### Package Structure

```
packages/
├── cli/              # @moru-ai/cli - CLI tool
├── js-sdk/           # @moru-ai/core - JavaScript/TypeScript SDK
└── python-sdk/       # moru - Python SDK
```

---

Whenever you change this file, update AGENTS.md with the same content.
