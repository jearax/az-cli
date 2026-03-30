---
name: az-cli
description: Scaffold production-ready TypeScript CLI tools with Bun. Use when creating new CLI projects, command-line utilities, or npm packages with CLI interface. Automatically sets up citty, consola, figlet banner, ESM/CJS builds, and version/help flags.
license: MIT
argument-hint: "[cli-name] [description]"
metadata:
  author: jjuidev
  version: "1.0.0"
---

# az-cli

Scaffold a production-ready TypeScript CLI tool using Bun as the package manager and build tool.

## When to Use

Activate this skill when:
- Creating a new CLI tool from scratch
- Scaffolding a command-line npm package
- Setting up a TypeScript CLI with citty framework
- User mentions "CLI", "command-line tool", "scaffold CLI", "new CLI project"

## Quick Start

```bash
# User invokes the skill
/az-cli my-cli "A CLI tool for XYZ"
```

## Workflow

### 1. Gather Requirements

Use `AskUserQuestion` to collect:

- **CLI name** (required): kebab-case, e.g. `my-cli`
- **Description** (required): Short description for package.json
- **Scope** (optional): npm scope, e.g. `@jjuidev`
- **Author** (optional): Author name/email
- **Commands** (optional): Initial commands to scaffold beyond `ls`

### 2. Validate Input

- CLI name must be kebab-case: `^[a-z][a-z0-9-]*$`
- Description should be < 100 chars
- Scope should start with `@` if provided

### 3. Scaffold Template

Copy all files from `assets/template/` to target directory:

```
target-dir/
├── .github/
│   └── workflows/
│       └── release.yml     # Changesets CI: auto version PR + npm publish
├── .changeset/
│   ├── config.json         # Changesets config (access: public, baseBranch: main)
│   └── README.md           # Changeset usage guide
├── src/
│   ├── cli.ts              # CLI entry point with citty
│   ├── index.ts            # Library exports
│   ├── build.ts            # Bun build script
│   ├── commands/
│   │   ├── index.ts
│   │   └── ls/
│   │       └── index.ts    # ls command placeholder
│   └── utils/
│       ├── constants.ts    # CLI_META with placeholders
│       ├── logger.ts       # Consola logger wrapper
│       └── banner.ts       # Figlet ASCII banner
├── package.json            # With replaced placeholders
├── tsconfig.json           # Base TypeScript config
├── tsconfig.cjs.json       # CJS build config
├── tsconfig.esm.json       # ESM build config
├── tsconfig.cli.json       # CLI build config
└── tsconfig.types.json     # Types generation config
```

### 4. Replace Placeholders

In copied files, replace:

| Placeholder | Replacement | Files |
|-------------|-------------|-------|
| `TOOL_NAME` | CLI display name (Title Case) | package.json, src/utils/constants.ts, .github/workflows/release.yml |
| `TOOL_DESCRIPTION` | User-provided description | package.json |
| `COMMAND_NAME` | CLI command name (kebab-case) | package.json |
| `@scope` | npm scope (or remove if none) | package.json |

### 5. Post-Scaffold

1. Run `bun install` in target directory
2. Run `bun run build` to verify build works
3. Run `./dist/cli/cli.js --version` to verify CLI
4. Inform user of CI/npm publish setup:
   - Add `NPM_TOKEN` secret in GitHub repo → Settings → Secrets → Actions
   - First publish manually: `npm publish --access public`
   - After that: create changesets with `bun run changeset`, push to main → CI handles versioning and publishing

## Template Structure

### package.json

Pre-configured with:
- **bin**: `{COMMAND_NAME}: ./dist/cli/cli.js`
- **exports**: ESM + CJS + types
- **scripts**: build, dev, clean, release, format
- **dependencies**: citty, consola, figlet, pathe, execa, globby, nypm, defu, @clack/prompts
- **devDependencies**: typescript, @types/*, rimraf, tsc-alias, @changesets/cli

### CLI Features

- **`--version`**: Shows version from package.json (built into citty)
- **`--help`**: Shows help (built into citty)
- **`ls` command**: Lists available commands (placeholder)
- **ASCII banner**: Figlet-generated on startup
- **Colored output**: Via consola logger wrapper

### Build Output

```
dist/
├── cli/
│   ├── cli.js          # Executable CLI binary
│   └── package.json    # { "type": "module" }
├── cjs/
│   ├── index.cjs       # CommonJS module
│   └── package.json    # { "type": "commonjs" }
├── esm/
│   ├── index.js        # ES module
│   └── package.json    # { "type": "module" }
├── types/
│   └── index.d.ts      # TypeScript declarations
└── fonts/              # Figlet fonts for ASCII art
```

## Adding New Commands

After scaffolding, to add a new command:

1. Create `src/commands/<name>/index.ts`:
```typescript
import { defineCommand } from 'citty';

export const <name>Command = defineCommand({
  meta: {
    name: '<name>',
    description: '<description>'
  },
  run: async () => {
    // command logic
  }
});
```

2. Export from `src/commands/index.ts`
3. Register in `src/cli.ts` under `subCommands`
4. Add to `ls` command output

## Security

This skill:
- Does NOT execute arbitrary user input
- Does NOT modify files outside target directory
- Does NOT commit to git (user decides)

## Notes

- Requires Bun runtime for build
- Node.js >= 18 for execution
- Uses changesets for versioning
