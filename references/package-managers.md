# Package managers

`new` applies exactly one row of this file, the one for `--pm`. Nothing in `assets/template/` names a
package manager; every PM-specific value is a `your_` placeholder filled from here.

## Placeholder values

| Placeholder | bun | pnpm | yarn | npm |
| --- | --- | --- | --- | --- |
| `your_package_manager.config` | delete | rename to `pnpm-workspace.yaml` | rename to `.yarnrc.yml` | rename to `.npmrc` |
| `packageManager` in `package.json` | omit | `pnpm@<pnpm --version>` | set by `corepack use yarn@4` | omit |
| `# your_pm_setup_step` | the bun step below | `- run: corepack enable` | `- run: corepack enable` | delete the line |
| `your_install_command` | `bun install --frozen-lockfile` | `pnpm install --frozen-lockfile` | `yarn install --immutable` | `npm ci` |
| `your_run_prefix` | `bun run` | `pnpm` | `yarn` | `npm run` |
| First local install | `bun install` | `pnpm install` | `yarn install` | `npm install` |

The first local install creates the lockfile that the CI install commands require.

For yarn, a globally installed Yarn Classic (1.x) refuses a project whose `packageManager` is
`yarn@4.x`. Run local yarn commands as `corepack yarn ...` (for example `corepack yarn install`) instead
of enabling Corepack globally, which changes the user's machine. CI runs `corepack enable` on its own
runner.

## Config file content

**pnpm** — `pnpm-workspace.yaml`:

```yaml
# Refuses a Node below engines.node instead of only warning.
engineStrict: true
strictPeerDependencies: true
```

**npm** — `.npmrc`:

```ini
engine-strict=true
```

**yarn** — `.yarnrc.yml`:

```yaml
nodeLinker: node-modules
```

Yarn Berry's default Plug'n'Play install has no `node_modules`, which tsdown and `tsc` resolution here
expect. Yarn must be Berry 4.5.2 or newer: Changesets CLI 3 removed Yarn Classic support and declares
`yarn >=4.5.2` in its `engines`. Run `corepack use yarn@4` before the first install; it writes the
`packageManager` field.

**bun** — no file. The default `bunfig.toml` settings are enough.

## bun CI step

```yaml
      - uses: oven-sh/setup-bun@0c5077e51419868618aeaa5fe8019c62421857d6 # v2.2.0
```

## Node version enforcement

`engines.node` is declared for every PM. Only pnpm (`engineStrict`) and npm (`engine-strict`) refuse an
older Node at install. Yarn Berry and bun have no built-in equivalent: Yarn needs a plugin and bun has
an open feature request. For those two, CI on the floor version is the only check; do not add a plugin
unless the user asks.

## Sources (checked 2026-11-12)

- Changesets CLI 3 release notes: Yarn Classic removed; `engines` npm `>=10.9.0`, pnpm `>=10.0.0`, yarn `>=4.5.2` —
  <https://github.com/changesets/changesets/releases>
- Yarn Berry has no core engines check — <https://github.com/yarnpkg/berry/issues/1177>
- Bun does not enforce `engines` — <https://github.com/oven-sh/bun/issues/14030>
- `oven-sh/setup-bun` v2.2.0 — <https://github.com/oven-sh/setup-bun/releases>
