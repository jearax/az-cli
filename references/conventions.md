# Conventions

The structure and code rules of a project scaffolded by az-cli. They follow `@jjuidev/jss-devtools` and
`@jjuidev/cs`. Nothing enforces them automatically in a scaffolded project, so review against this file.

## Layout

```
src/
├── cli.ts                        # the entry: builds the root command, owns exit codes and process guards
├── core/                         # shared code; imports no command and no module
│   ├── constants/                # *.constant.ts
│   ├── errors/                   # *.error.ts
│   ├── ui/                       # *.ui.ts — terminal rendering shared by commands
│   ├── utils/                    # *.util.ts — stateless helpers (create when needed)
│   └── adapters/                 # *.adapter.ts — the only knowledge of one external tool (create when needed)
├── commands/<name>/              # one folder per command
│   ├── <name>.command.ts         # commander wiring, option parsing, rendering
│   ├── services/                 # *.service.ts — the command's logic; returns data, prints nothing
│   ├── constants/  types/  templates/   # owned by this command only (create when needed)
└── modules/<name>/               # a feature shared by several commands (create when needed)
    ├── services/  constants/  types/  templates/
scripts/package-info.mjs          # reads package.json at build time for the `define` constant
```

`core/utils`, `core/adapters` and `modules/` do not exist in a fresh scaffold; create them when the first
file of that role appears.

## Role suffixes

Every file under `src/` except `cli.ts` carries the suffix of its role, and lives in the folder that
role allows.

| Suffix | Folder | Role |
| --- | --- | --- |
| `.command.ts` | `commands/<name>/` root | commander wiring, argument parsing, rendering |
| `.service.ts` | `commands/<name>/services/`, `modules/<name>/services/` | logic; returns data, prints nothing |
| `.ui.ts` | `core/ui/` | terminal rendering shared by commands |
| `.util.ts` | `core/utils/` | stateless helpers |
| `.adapter.ts` | `core/adapters/` | the only place that knows one external tool's command line |
| `.check.ts` | `commands/<name>/checks/` | one check of a diagnostic command |
| `.constant.ts` | `constants/` | constant values |
| `.template.ts` | `templates/` | the content of one generated file, as a function of its inputs |
| `.error.ts` | `core/errors/` | error classes |
| `.type.ts` | `types/` | types only |

## Boundaries

- Only `src/cli.ts` sets `process.exitCode`, calls `process.exit` or installs global handlers.
- A service never writes to stdout or stderr; the command renders what the service returns.
- `core/` imports no command and no module. A command imports `core/`, its own folder and `modules/`,
  never another command.
- An expected failure throws `CliError` (message, optional `hint`, optional `commands` to run next).
  Anything else is a crash rendered by `cli.ts` with exit 1; set the debug env var to `1` to see the stack.

## Exit codes and flags

- `0` success, `1` failure (`core/constants/exit-code.constant.ts`).
- `--help, -h` and `--version, -v` are reserved on every command; never reuse `-h` or `-v` for an option.
- Prefer long options; add a short form only for a flag used constantly.

## Imports

- Leaving a folder goes through the `@/` alias (`@/core/errors/cli.error`); staying inside a command
  folder uses `./` (`./services/hello.service`). Never `../`. This holds while `tsconfig.json` maps
  `"@/*"` to `./src/*`, as a fresh scaffold does. In a project without that mapping, relative imports
  (including `../`) are the only working form; follow the project, not this rule.
- No file extension in imports (`moduleResolution: Bundler`).
- Type-only imports use `import type` (`verbatimModuleSyntax`).
- Order: `node:` builtins, external packages, `@/` imports, relative imports, then type imports.

## Code style

- Functions are `const` arrow functions with a block body, never `function` declarations.
- Files are kebab-case. One concern per file; split once a file passes about 200 lines and has
  separable parts.
- The default is no comment. Keep one only for a platform or tool trap, a bug a guard prevents, a
  contract with something outside the code, or an invisible constraint. One line, two at most.
- Colours come from `node:util` `styleText`; interactive prompts from `@clack/prompts`. Gate anything
  animated or prompting behind `isInteractive()` so piped and CI output stays plain.

## TypeScript

`strict` plus `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`,
`exactOptionalPropertyTypes`. `tsc` only type-checks (`noEmit`); tsdown builds the single bundle
`dist/cli.mjs` with every runtime dependency inlined.

## Dependencies

Exact versions only, no ranges. Runtime libraries in `dependencies` (they are bundled), tooling in
`devDependencies`.
