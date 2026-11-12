# Release

The template publishes to npm with Changesets and npm trusted publishing (OIDC). There is no
`NPM_TOKEN` secret.

## How it flows

1. A change ships with a changeset: `<run> changeset` (for example `pnpm changeset`).
2. A push to `main` runs `.github/workflows/release.yml`. With pending changesets, `changesets/action`
   opens or updates a "chore: version packages" PR.
3. Merging that PR runs the workflow again; with no pending changesets it runs `publish-script`
   (`build` then `changeset publish`), which publishes to npm and pushes the git tag.

## Requirements

- `release.yml` keeps `id-token: write`, `contents: write` and `pull-requests: write`.
- npm 11.5.1 or newer performs the OIDC exchange. The Node 24 floor ships npm 11.
- The job runs on a GitHub-hosted runner; self-hosted runners are not supported for trusted publishing.
- `changesets/action` v2 needs Changesets CLI v3 (`@changesets/cli` 3.x in `devDependencies`).
- In the repository settings, `Actions > General` allows GitHub Actions to create pull requests.
- No `NPM_TOKEN` in the job environment: when one is present, it is used instead of OIDC.

## First publish

Trusted publishing cannot create a package that does not exist yet.

1. Build and publish once from a logged-in machine: `npm publish --access public`.
2. On npmjs.com, open the package settings, add a trusted publisher: GitHub Actions, the repository
   owner and name, and the workflow file name `release.yml`. Every field is case-sensitive.
3. From then on, releases go through the workflow.

## Known gaps

- `changeset publish` delegates to the project's package manager. npm OIDC is documented by npm; OIDC
  through `pnpm publish`, `yarn npm publish` and bun is not confirmed by official docs. If the publish
  step fails with an auth error, change `publish-script` to `<run> build && npx changeset publish` only
  after confirming which publisher it invokes, or publish with `npm publish` directly.
- The `changesets/action` README recommends its separate `version` and `publish` sub-actions to give the
  publish step alone `id-token: write`. The template uses the combined action for simplicity.

## Sources (checked 2026-11-12)

- npm trusted publishing — <https://docs.npmjs.com/trusted-publishers/>
- `changesets/action` v2.1.2 inputs and permissions — <https://github.com/changesets/action>
- Changesets CLI 3 release notes — <https://github.com/changesets/changesets/releases>
