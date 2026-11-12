# Command mode

`command <name>` adds one command to a project scaffolded by az-cli, using `assets/samples/hello/` as the
pattern. The sample shows every piece a command has; replace its logic, keep its shape.

## Preconditions

- The project has `src/cli.ts` exporting `createProgram` and `src/core/errors/cli.error.ts`. If not,
  stop: the project was not scaffolded by az-cli.
- `<name>` is kebab-case (`^[a-z][a-z0-9-]*$`) and `src/commands/<name>/` does not exist.

## Import style: detect, never assume

The sample imports shared code through the `@/` alias. Before copying, read the project's
`tsconfig.json` `compilerOptions.paths`:

- **Alias present** (`"@/*": ["./src/*"]` or `["src/*"]`): keep the sample's `@/` imports.
- **Alias absent or mapped elsewhere:** rewrite every `@/<path>` import to a relative path from the file
  that contains it, and register the command in `src/cli.ts` with a relative import:

  | File | `@/core/...` becomes | `src/cli.ts` imports the command as |
  | --- | --- | --- |
  | `src/commands/<name>/<name>.command.ts` | `../../core/...` | `./commands/<name>/<name>.command` |
  | `src/commands/<name>/services/<name>.service.ts` | `../../../core/...` | — |

  Keep the project's existing extension style: if its imports end in `.js`, add `.js` to the new
  relative imports too.

Match what `src/cli.ts` already does when in doubt: its existing imports are the evidence of the
project's style. The typecheck and build in step 5 prove the choice; an unresolved import fails there.

## Steps

1. Copy `assets/samples/hello/` to `src/commands/<name>/`, then apply the import style above.
2. Rename files and identifiers:

   | Sample | Becomes (for `<name>` = `sync-repo`) |
   | --- | --- |
   | `hello.command.ts` | `sync-repo.command.ts` |
   | `services/hello.service.ts` | `services/sync-repo.service.ts` |
   | `registerHelloCommand` | `registerSyncRepoCommand` |
   | `runHello`, `HelloOptions`, `HelloResult` | `runSyncRepo`, `SyncRepoOptions`, `SyncRepoResult` |
   | `.command('hello')` | `.command('sync-repo')` |

3. Replace the description, options, help examples and service logic with what the user asked for.
   Keep the split: the service returns data and throws `CliError`; the command parses and renders.
4. Register it in `src/cli.ts`: import `register<Name>Command` from `@/commands/<name>/<name>.command`
   (or the relative path when the project has no alias) and call it in `createProgram`, right before `return program;`, keeping the calls in the order the
   commands should appear in help.
5. Verify with the project's package manager: `typecheck`, `build`, then
   `node dist/cli.mjs <name> -h` and one real run.

## Rules carried by the sample

- Long options first; never declare `-h` or `-v`.
- Help examples come from `examplesText` and start with `PACKAGE.name`, so they follow a rename.
- Output goes through `process.stdout.write` with `styleText`, not `console.log`.
- No `process.exit` and no `process.exitCode` in the command or service; throw `CliError` instead.

See `references/conventions.md` for the full role-suffix table and import rules.
