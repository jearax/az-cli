# az-cli

A Claude Code skill that scaffolds TypeScript CLIs with the folder structure and libraries of
`@jjuidev/jss-devtools` and `@jjuidev/cs`: commander, `@clack/prompts`, a single tsdown bundle, and npm
release through Changesets with trusted publishing.

## Usage

```text
/az-cli new my-cli --pm pnpm --scope @jjuidev --description "Does one thing well"
/az-cli command sync-repo
```

`--pm` accepts `bun`, `pnpm`, `yarn` or `npm`; the skill asks when it is missing.

## What a new project gets

- `src/cli.ts` with `--help, -h`, `--version, -v`, a banner on a terminal, exit codes 0 and 1, and
  `CliError` rendering.
- `src/core/` constants, errors and terminal UI; commands go in `src/commands/<name>/`.
- `tsdown` build to `dist/cli.mjs`, `tsc` type-check, Node `>=24.11.0`, exact-pinned dependencies.
- GitHub Actions: `ci.yml` (typecheck, build) and `release.yml` (Changesets, npm trusted publishing).

No linter, formatter, git hooks or tests are generated.

## Layout

- `SKILL.md` — the workflow the agent follows.
- `assets/template/` — the project snapshot; `your_`-prefixed names are placeholders.
- `assets/samples/hello/` — the pattern for `command` mode.
- `references/` — conventions, package-manager values, command mode, release.
