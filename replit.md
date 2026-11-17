# ANCHOR39

The ANCHOR39 marketing website presents its maritime coordination workspace for shipping and terminal agents.

## Run & Operate

- Start the managed workflow `artifacts/anchor39: web` to run the website.
- `pnpm --filter @workspace/anchor39 run typecheck` — check the website.
- `pnpm --filter @workspace/anchor39 test` — browser checks for routes, assets, fonts, demo-request validation, email handoff, and mobile navigation (start the website workflow first).
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The website requires no secrets or database. The API and database packages are unused workspace scaffolding.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/anchor39/` — the migrated React + Vite website, with its original pages, styles, local fonts, and public assets.
- `.migration-backup/` — the unmodified imported source and original documentation.

## Architecture decisions

- Preserve the existing frontend-only behavior; do not introduce a backend merely for the migration.
- The demo-request form prepares a message in the visitor's email client; it does not send or save requests on a server.
- Keep the original anchor39.com canonical and social URLs: migration alone does not change the site's public domain.

## Product

Eight page routes cover the homepage, shipping agents, terminal agents, services, about, how it works, demo requests, and request confirmation. The old `/vision` URL redirects to `/about`.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
