---
name: az-cli
description: Scaffold a new TypeScript CLI (commander, @clack/prompts, tsdown single-bundle build, changesets npm release) with the jss-devtools folder structure, or add a command to a CLI scaffolded this way. Use when the user wants a new command-line tool project or a new command in an az-cli project; not for adding a CLI to an existing app or for other project types.
license: MIT
argument-hint: "new <name> [--pm bun|pnpm|yarn|npm] [--scope @org] [--description \"...\"] | command <name>"
metadata:
  author: jjuidev
  version: "2.0.0"
---

# az-cli

Two modes, chosen by the first argument: `new` creates a CLI project, `command` adds a command to one.
Any other first argument: show the `argument-hint` and stop.

## The placeholder rule

Everything in `assets/template/` is copied verbatim, except what carries the prefix `your_`:

- a `your_` file is renamed or deleted;
- a `your_` token or line inside a file is replaced or deleted.

A finished project contains no `your_` anywhere. Nothing outside the `your_` placeholders is optional,
and nothing in the template chooses a package manager: that comes from `references/package-managers.md`.

## Mode `new`

### 1. Inputs

| Input | Rule | When missing |
| --- | --- | --- |
| `<name>` | kebab-case, `^[a-z][a-z0-9-]*$`; becomes the bin name and folder name | ask |
| `--pm` | one of `bun`, `pnpm`, `yarn`, `npm` | ask with AskUserQuestion; never default |
| `--scope` | starts with `@` | no scope |
| `--description` | one line, under 100 characters | ask |

Stop if the target folder exists and is not empty.

### 2. Copy and fill

Copy `assets/template/` (including dotfiles) to `./<name>/`, then replace every placeholder:

| Placeholder | Where | Value |
| --- | --- | --- |
| `your_package_name` | `package.json` | `<scope>/<name>` or `<name>` |
| `your_bin_name` | `package.json` `bin` | `<name>` |
| `your_description` | `package.json` | the description |
| `your_define_constant` | `tsdown.config.ts`, `src/core/constants/package.constant.ts` | `__<NAME>_PACKAGE__`, `<NAME>` = name upper-cased, `-` → `_` |
| `your_debug_env` | `src/cli.ts` | `<NAME>_DEBUG` |
| `your_banner_art` | `src/core/constants/banner.constant.ts` | one string per line of `figlet -f "ANSI Shadow" <NAME>` (run `npx figlet@1.10.0 -f "ANSI Shadow" <NAME>`); keep the art as an array of strings |
| `your_package_manager.config` | root | per `references/package-managers.md` |
| `# your_pm_setup_step` | both workflows | per `references/package-managers.md` |
| `your_install_command`, `your_run_prefix` | both workflows | per `references/package-managers.md` |

Add the `packageManager` field only when the PM row says so. Add a `README.md` with the name,
description, install (`npm i -g <package>`) and development commands for the chosen PM.

### 3. Verify

Run in `./<name>/` with the chosen PM, and fix the project (not the checks) until all pass:

1. First install (creates the lockfile), then `typecheck` and `build`.
2. `node dist/cli.mjs -v` prints `0.0.0` and exits 0; `node dist/cli.mjs -h` exits 0;
   `node dist/cli.mjs unknown-arg` exits 1.
3. `grep -rn your_ . --exclude-dir=node_modules --exclude-dir=dist` prints nothing.

Do not run `git init`, commit or publish unless the user asks.

### 4. Report

Tell the user the release setup from `references/release.md`: first publish by hand, then add the npm
trusted publisher for `release.yml`, then use changesets.

## Mode `command <name>`

Follow `references/command-mode.md`: copy `assets/samples/hello/` into `src/commands/<name>/`, rename,
replace the logic, register in `src/cli.ts`, then typecheck, build and run `<name> -h`.

The sample imports through the `@/` alias. Check `tsconfig.json` `paths` first; when the project has
no `"@/*"` mapping, rewrite those imports to relative paths as the reference shows. Never add an alias
to a project that does not have one.

## References

- `references/conventions.md` — layout, role suffixes, boundaries, imports, code style. Read before
  writing any code in a scaffolded project.
- `references/package-managers.md` — the per-PM values for every PM placeholder.
- `references/command-mode.md` — adding a command.
- `references/release.md` — changesets and npm trusted publishing.

## Refreshing the template

The template is a snapshot of `@jjuidev/jss-devtools` and `@jjuidev/cs` (cs `src/cli.ts`, everything
else from jss-devtools). To refresh it:

1. Compare `assets/template/src/` and `tsconfig.json` with the same files in both repositories.
2. Copy the reference pins for `commander`, `@clack/prompts`, `tsdown`, `typescript`, `@types/node`,
   the Node floor and the action SHAs in the workflows; bump `@changesets/cli` and
   `changesets/action` together (action v2 needs CLI v3).
3. Run mode `new` once per PM into a temporary folder and pass every check in step 3, plus
   mode `command hello`.

## Boundaries

- Writes only inside `./<name>/` (mode `new`) or the current project (mode `command`).
- Never commits, pushes or publishes.
- No linter, formatter, git hooks or tests are scaffolded; add them only if the user asks.
