# Nx Monorepo — Junior to Senior Roadmap

A learning roadmap of **Nx** concepts, CLI, and features organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the syntax.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Core concepts](#l1-core-concepts)
  - [Workspace structure](#l1-workspace-structure)
  - [Essential CLI commands](#l1-essential-cli-commands)
  - [Projects and targets](#l1-projects-and-targets)
  - [Running and building](#l1-running-and-building)
  - [Code generation basics](#l1-code-generation-basics)
  - [Basic configuration](#l1-basic-configuration)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Project graph](#l2-project-graph)
  - [Affected commands](#l2-affected-commands)
  - [Local caching](#l2-local-caching)
  - [Library types and structure](#l2-library-types-and-structure)
  - [Tags and module boundary rules](#l2-tags-and-module-boundary-rules)
  - [Workspace-level TypeScript paths](#l2-workspace-level-typescript-paths)
  - [Nx plugins ecosystem](#l2-nx-plugins-ecosystem)
  - [Testing strategies](#l2-testing-strategies)
  - [Storybook integration](#l2-storybook-integration)
  - [Custom generators](#l2-custom-generators)
  - [Custom executors](#l2-custom-executors)
- [Level 3 — Senior](#level-3--senior)
  - [Nx Cloud and remote caching](#l3-nx-cloud-and-remote-caching)
  - [Distributed task execution](#l3-distributed-task-execution)
  - [Module Federation and micro-frontends](#l3-module-federation-and-micro-frontends)
  - [Custom Nx plugins](#l3-custom-nx-plugins)
  - [Advanced generators and migrations](#l3-advanced-generators-and-migrations)
  - [CI/CD optimization](#l3-cicd-optimization)
  - [Enforcing architectural patterns](#l3-enforcing-architectural-patterns)
  - [Multi-framework workspaces](#l3-multi-framework-workspaces)
  - [Performance tuning and production practices](#l3-performance-tuning-and-production-practices)
  - [Workspace migrations](#l3-workspace-migrations)
- [Quick reference table](#quick-reference-table)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each entry shows: **what it does**, a **minimal example**, and a **gotcha** where relevant.
- Items marked with `*` are the most commonly used in day-to-day work.
- Kubernetes/container orchestration is excluded — see the Docker roadmap for those topics.

---

## Level 1 — Junior

### L1 Core concepts

Vocabulary you must know before running a single Nx command.

| Term | What it is |
|---|---|
| **Monorepo** | A single repository that contains multiple projects (apps and libs) managed together. |
| **Workspace** | The root of an Nx repository — contains `nx.json`, `package.json`, and all projects. |
| **Application (app)** | A deployable unit: a web app, API server, CLI tool, etc. Often under `apps/` in an integrated workspace. |
| **Library (lib)** | Reusable code shared between apps or other libs. Often under `libs/` in an integrated workspace. |
| **Project** | Any app or lib Nx knows about (from `project.json`, `package.json`, or plugin inference). |
| **Target** | A named task that can be run on a project (e.g. `build`, `test`, `lint`). |
| **Executor** | The implementation behind a target — either declared in config or provided by an inferred plugin. |
| **Generator** | A schematic that scaffolds code (files, config) in the workspace. |
| **Project graph** | A dependency graph of all projects and how they import each other. |
| **Affected** | The set of projects that are impacted by a given code change. |
| **Cache** | Nx stores task results; if nothing changed, it replays the output instead of re-running. |
| **Tag** | A label applied to a project used to enforce module boundary rules. |

> **Gotcha:** Nx is not a build tool itself — it orchestrates other tools (Webpack, esbuild, Jest, ESLint, etc.). Understanding this distinction prevents a lot of confusion when debugging.

---

### L1 Workspace structure

Typical **integrated** workspace layout (apps + libs). Package-based workspaces instead keep many projects as packages under something like `packages/` with their own `package.json` files — Nx still builds one project graph either way.

```
my-workspace/
├── apps/
│   ├── my-app/              # Angular / React / Node application
│   └── my-app-e2e/          # End-to-end tests for my-app
├── libs/
│   ├── shared/ui-button/    # Presentational UI (type: ui)
│   └── booking/data-access/ # API / state (type: data-access)
├── tools/                   # Workspace plugins, scripts, generators
├── nx.json                  # Nx configuration (plugins, defaults, cache)
├── package.json             # Root dependencies and npm scripts
└── tsconfig.base.json       # Root TypeScript config with path aliases
```

| File / Folder | Purpose |
|---|---|
| `nx.json` | Global Nx settings: plugins, `targetDefaults`, `namedInputs`, Cloud id. * |
| `project.json` | Optional per-project targets and tags (Nx Angular apps use this too, not only non-Angular). * |
| `tsconfig.base.json` | Defines `paths` aliases so projects import each other without relative paths. * |
| `apps/` | Deployable applications (integrated layout). |
| `libs/` | Shared, reusable libraries (integrated layout). |
| `tools/` | Custom generators, executors, and workspace scripts. |

> **Gotcha:** Never import from `apps/` into `libs/`. Apps consume libs; libs never depend on apps. This keeps the dependency graph acyclic and deployable units replaceable.

---

### L1 Essential CLI commands

| Command | What it does |
|---|---|
| `npx nx --version` | Show installed Nx version. |
| `npx create-nx-workspace@latest` | Scaffold a new workspace. * |
| `nx list` | List all installed Nx plugins and available generators. * |
| `nx graph` | Open the interactive project dependency graph in the browser. * |
| `nx run <project>:<target>` | Run a specific target on a project. * |
| `nx run-many -t <target>` | Run a target across all (or selected) projects. * |
| `nx affected -t <target>` | Run a target only on projects impacted by current changes (details in L2). * |
| `nx generate <generator>` | Scaffold code using a generator. * |
| `nx show projects` | List all projects in the workspace. |
| `nx show project <name>` | Show a project's targets and configuration (including inferred ones). |
| `nx reset` | Clear the local Nx cache and daemon state. |

```bash
# run the build target for my-app
nx run my-app:build

# shorthand (when target is unambiguous)
nx build my-app

# run tests for all projects in parallel
nx run-many -t test --parallel=4
```

> **Gotcha:** `nx run <project>:<target>:<configuration>` is the full form. The shorthand `nx build my-app` works when the target name is unambiguous. Prefer the full form in scripts and CI for clarity.

---

### L1 Projects and targets

A target defines **how** a task is executed. Targets can be declared in `project.json` / `package.json`, or **inferred** by plugins registered in `nx.json` (common for lint, test, and Vite/Rspack builds). Use `nx show project <name>` to see the merged result.

```jsonc
// libs/shared/ui-button/project.json — explicit targets (still common)
{
  "name": "shared-ui-button",
  "projectType": "library",
  "tags": ["scope:shared", "type:ui"],
  "targets": {
    "build": {
      "executor": "@nx/js:tsc",
      "options": {
        "outputPath": "dist/libs/shared/ui-button",
        "main": "libs/shared/ui-button/src/index.ts",
        "tsConfig": "libs/shared/ui-button/tsconfig.lib.json"
      }
    },
    "test": {
      "executor": "@nx/jest:jest",
      "options": {
        "jestConfig": "libs/shared/ui-button/jest.config.ts"
      }
    },
    "lint": {
      "executor": "@nx/eslint:lint"
    }
  }
}
```

| Field | What it controls |
|---|---|
| `executor` | Which plugin/tool runs this target (omitted when the target is fully inferred). |
| `options` | Default options passed to the executor. |
| `configurations` | Named overrides (e.g. `production`, `development`). |
| `dependsOn` | Targets that must complete before this one starts (`^build` = dependency builds first). |
| `cache` | Whether Nx should cache the result of this target. |
| `tags` | Labels for module boundary rules (see L2). |

> **Gotcha:** If `nx show project` lists a target you do not see in `project.json`, a plugin inferred it. Change plugin options in `nx.json`, not by inventing a duplicate executor entry.

---

### L1 Running and building

```bash
# build with a named configuration (e.g. production)
nx build my-app --configuration=production

# serve the app for local development
nx serve my-app

# run e2e tests
nx e2e my-app-e2e

# target-specific flags (known to the executor)
nx test my-app --watch
nx test my-app --testFile=src/app/app.component.spec.ts

# force remaining args to the underlying tool when names clash with Nx flags
nx test my-app -- --passWithNoTests
```

> **Gotcha:** Most executor flags can be passed directly (`--watch`). Use `--` only when you need to forward args that Nx would otherwise interpret. When in doubt: `nx run <project>:<target> --help`.

---

### L1 Code generation basics

Generators scaffold boilerplate so the whole team follows the same conventions.

```bash
# generate a new Angular application
nx generate @nx/angular:application my-app

# generate a new React library (directory + name; also updates path aliases)
nx generate @nx/react:library ui-button --directory=libs/shared --tags=scope:shared,type:ui

# generate a component inside an existing project
nx generate @nx/angular:component my-component --project=my-app

# dry-run: preview changes without writing files
nx generate @nx/angular:application demo --dry-run
```

| Flag | What it does |
|---|---|
| `--dry-run` | Preview what files would be created/modified without writing them. * |
| `--project` | Target project for the generated artifact. * |
| `--directory` | Where to place the project or file. |
| `--tags` | Initial tags for boundary rules (set these at creation time). |
| `--name` | Name for the generated artifact. |

> **Gotcha:** Always use `--dry-run` first when running an unfamiliar generator. Generators can modify existing files (e.g. route configs, `tsconfig.base.json`) in ways that are hard to undo.

---

### L1 Basic configuration

```jsonc
// nx.json (simplified)
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "main",
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"]   // build dependency projects first
    },
    "test": {
      "cache": true
    },
    "lint": {
      "cache": true
    }
  },
  "namedInputs": {
    "sharedGlobals": ["{workspaceRoot}/.env"],
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": ["default", "!{projectRoot}/**/*.spec.ts"]
  },
  "plugins": [
    // e.g. { "plugin": "@nx/eslint/plugin" }
  ]
}
```

| Key | What it controls |
|---|---|
| `defaultBase` | The git branch used as the comparison base for `affected`. * |
| `targetDefaults` | Shared target settings applied to all matching targets workspace-wide. * |
| `namedInputs` | Reusable file patterns that determine cache invalidation keys. Named groups must be defined before you reference them (see `sharedGlobals` above). |
| `plugins` | Plugin registrations that infer projects/targets and their options. |

---

## Level 2 — Mid-level

### L2 Project graph

The project graph is Nx's model of the entire workspace — which projects exist and how they depend on each other.

```bash
# open interactive graph in browser
nx graph

# output graph as JSON
nx graph --file=graph.json

# focus on a single project and its neighbors
nx graph --focus=my-app

# show only affected projects
nx graph --affected
```

Nx builds the graph by statically analyzing imports. If `libs/shared/ui` is imported anywhere inside `my-app`, Nx knows `my-app` depends on `shared-ui`.

| Concept | Meaning |
|---|---|
| **Node** | A project (app or lib) in the graph. |
| **Edge** | A dependency relationship between two nodes. |
| **Implicit dependency** | A dependency declared in `nx.json` or `project.json` that Nx cannot infer from imports. |
| **External node** | An npm package tracked as a node in the graph (Nx 16+). |

> **Gotcha:** The project graph is computed at analysis time — it does not execute code. If a project imports another only at runtime (e.g. via dynamic `import()` with a variable path), Nx may not detect the dependency. Use explicit `implicitDependencies` in that case.

---

### L2 Affected commands

`affected` is Nx's killer feature for large monorepos — only build/test what actually changed.

```bash
# test only projects affected since the last commit on main
nx affected -t test --base=main --head=HEAD

# build affected projects in CI
nx affected -t build --base=origin/main

# lint affected using parallel workers
nx affected -t lint --parallel=6

# see which projects are affected (without running anything)
nx show projects --affected --base=main
```

| Option | What it does |
|---|---|
| `--base` | The git ref to compare against (commit, branch, tag). * |
| `--head` | The git ref representing current changes (default: `HEAD`). |
| `--parallel` | Number of tasks to run concurrently. * |
| `--exclude` | Comma-separated list of projects to skip. |

> **Gotcha:** `affected` compares file changes between `--base` and `--head`. If your CI does a shallow clone (`--depth=1`), Nx cannot compute the diff and will treat every project as affected. Fetch enough history or use `--base=HEAD~1` as a fallback.

---

### L2 Local caching

Nx caches task outputs (build artifacts, test results) keyed by inputs. A cache hit replays the previous output instantly.

```bash
# run with cache (default)
nx build my-app

# skip cache for this run
nx build my-app --skip-nx-cache

# clear all cached results
nx reset
```

Cache inputs are controlled by `namedInputs` and `targetDefaults.inputs` in `nx.json`.

```jsonc
// nx.json
{
  "namedInputs": {
    "production": [
      "default",
      "!{projectRoot}/**/*.spec.ts",
      "!{projectRoot}/jest.config.ts"
    ]
  },
  "targetDefaults": {
    "build": {
      "inputs": ["production", "^production"],
      "outputs": ["{options.outputPath}"],
      "cache": true
    }
  }
}
```

| Key | What it means |
|---|---|
| `inputs` | Files and env vars whose changes invalidate the cache entry. |
| `outputs` | Paths restored from cache on a cache hit. |
| `cache: true` | Opt this target into caching. |

> **Gotcha:** If `outputs` is wrong, a cache hit will restore stale files or restore nothing. Always verify the `outputs` field matches what the executor actually writes to disk.

---

### L2 Library types and structure

Nx recommends organizing libs by **type** and **scope** to keep the graph clean.

| Type | What it contains | Example path |
|---|---|---|
| `feature` | Smart components, pages, route-level logic. | `libs/booking/feature-search/` |
| `ui` | Presentational (dumb) components with no business logic. | `libs/shared/ui-button/` |
| `data-access` | Services, API calls, NgRx/Redux state, HTTP clients. | `libs/booking/data-access/` |
| `util` | Pure functions, helpers, constants, types. | `libs/shared/util-date/` |

```
libs/
├── booking/
│   ├── feature-search/     # routed page, depends on data-access + ui
│   ├── data-access/        # BookingService, NgRx state
│   └── ui-seat-picker/     # presentational component
└── shared/
    ├── ui-button/
    └── util-date/
```

> **Gotcha:** Keep dependencies pointing “down” the type stack: `feature` → `data-access` / `ui` / `util`, never the reverse. `feature` → `feature` is usually a smell (extract shared UI or util instead). Enforce this with tags (next section).

---

### L2 Tags and module boundary rules

Tags classify projects; ESLint rules enforce which tags may import which other tags. A project typically has **both** a `scope:*` and a `type:*` tag; every matching `depConstraints` entry must pass.

**Step 1 — assign tags in `project.json` (or via the generator `--tags` flag):**

```jsonc
// libs/booking/feature-search/project.json
{
  "tags": ["scope:booking", "type:feature"]
}
```

**Step 2 — configure constraints in `eslint.config.mjs` (root; flat config is the default in new workspaces):**

```js
import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: ['type:ui', 'type:data-access', 'type:util'],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:util'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
            },
            {
              sourceTag: 'scope:booking',
              onlyDependOnLibsWithTags: ['scope:booking', 'scope:shared'],
            },
          ],
        },
      ],
    },
  },
];
```

```bash
# validate boundaries across the workspace
nx run-many -t lint
```

> **Gotcha:** The `@nx/enforce-module-boundaries` rule only runs during `lint`. It is not enforced at build time. Run linting in CI on every PR to catch violations early. Also tag dependency libs (`scope:shared` on shared UI, etc.) or scope rules will fail even when type rules pass.

---

### L2 Workspace-level TypeScript paths

`tsconfig.base.json` maps library public APIs to import aliases so projects use clean paths instead of relative imports. Generators usually add these entries for you.

```jsonc
// tsconfig.base.json
{
  "compilerOptions": {
    "paths": {
      "@my-org/shared/ui-button": ["libs/shared/ui-button/src/index.ts"],
      "@my-org/shared/util-date": ["libs/shared/util-date/src/index.ts"],
      "@my-org/booking/data-access": ["libs/booking/data-access/src/index.ts"]
    }
  }
}
```

```typescript
// any project can now import cleanly
import { Button } from '@my-org/shared/ui-button';
import { formatDate } from '@my-org/shared/util-date';
```

> **Gotcha:** Only export from `src/index.ts` (the barrel file). Never import from a path deeper than the barrel — that bypasses the public API contract and breaks refactoring safety.

---

### L2 Nx plugins ecosystem

Plugins provide generators, executors, and (often) target inference. Install what your stack needs; you do not need every package below.

| Plugin | Purpose |
|---|---|
| `@nx/angular` | Angular applications and libraries. |
| `@nx/react` | React applications and libraries. |
| `@nx/next` | Next.js applications. |
| `@nx/node` | Node.js applications and libraries. |
| `@nx/nest` | NestJS applications. |
| `@nx/js` | Framework-agnostic TypeScript/JavaScript libs. |
| `@nx/jest` | Jest test runner integration. |
| `@nx/vitest` | Vitest test runner integration (standalone since Nx 23). |
| `@nx/eslint` | ESLint integration and boundary rules. |
| `@nx/storybook` | Storybook setup and targets. |
| `@nx/cypress` | Cypress e2e integration. |
| `@nx/playwright` | Playwright e2e integration. |
| `@nx/webpack` | Webpack-based builds. |
| `@nx/rspack` | Rspack-based builds. |
| `@nx/esbuild` | esbuild-based builds. |
| `@nx/vite` | Vite-based builds and dev server. |
| `@nx/module-federation` | Module Federation host/remote setup and config. |
| `@nx/rollup` | Rollup-based library builds. |
| `@nx/plugin` | Scaffold local/publishable workspace plugins. |

```bash
# install a plugin
npm install --save-dev @nx/react

# list available generators from a plugin
nx list @nx/react
```

---

### L2 Testing strategies

```bash
# run unit tests for one project
nx test my-lib

# run with coverage
nx test my-lib --coverage

# run in watch mode during development
nx test my-lib --watch

# run only affected projects' tests (CI pattern)
nx affected -t test --base=origin/main --parallel=4

# run e2e tests
nx e2e my-app-e2e

# run e2e tests headed (useful for debugging)
nx e2e my-app-e2e --headed
```

| Practice | Why |
|---|---|
| Unit test every `util` and `data-access` lib | Pure functions and services are easiest to test in isolation. |
| Use component testing (Storybook / Playwright CT) for `ui` libs | Visual components benefit from component-level runners. |
| Use e2e for critical user flows only | E2e tests are expensive; scope them to happy paths. |
| Run `nx affected -t test` in CI | Avoid re-running tests for untouched projects. |

---

### L2 Storybook integration

```bash
# add Storybook support to a UI library
nx generate @nx/storybook:configuration --project=shared-ui-button

# run Storybook dev server
nx storybook shared-ui-button

# build static Storybook
nx build-storybook shared-ui-button

# run Storybook interaction / accessibility tests
nx test-storybook shared-ui-button
```

> **Gotcha:** Storybook and your unit-test runner may conflict on module mocking. Separate `tsconfig.storybook.json` and `tsconfig.spec.json` files for each lib are the standard fix.

---

### L2 Custom generators

A generator is a function that creates or modifies files using a virtual file system tree. Prerequisite: a local plugin project (scaffold with `@nx/plugin` — see L3 for a full plugin).

```bash
# one-time: create a workspace plugin to host generators
nx generate @nx/plugin:plugin workspace-plugin --directory=tools/workspace-plugin

nx generate @nx/plugin:generator my-generator --project=workspace-plugin
```

```typescript
// tools/workspace-plugin/src/generators/my-generator/generator.ts
import { Tree, formatFiles, generateFiles, names } from '@nx/devkit';
import * as path from 'path';

export interface MyGeneratorSchema {
  name: string;
  directory: string;
}

export default async function (tree: Tree, options: MyGeneratorSchema) {
  const { fileName, className } = names(options.name);

  generateFiles(
    tree,
    path.join(__dirname, 'files'),   // template directory
    path.join(options.directory, fileName),
    { fileName, className, tmpl: '' }
  );

  await formatFiles(tree);
}
```

```bash
nx generate @my-org/workspace-plugin:my-generator --name=my-feature --directory=libs/shared
```

> **Gotcha:** Generators work on a virtual `Tree` — changes are only written to disk after the generator returns. This makes them safe to test and allows `--dry-run` to work correctly.

---

### L2 Custom executors

An executor is a TypeScript function that implements a target. Create one when no existing plugin covers your needs. Same prerequisite as generators: host it in a `@nx/plugin` project.

```bash
nx generate @nx/plugin:executor my-executor --project=workspace-plugin
```

```typescript
// tools/workspace-plugin/src/executors/my-executor/executor.ts
import { ExecutorContext } from '@nx/devkit';

export interface MyExecutorOptions {
  outputPath: string;
}

export default async function runExecutor(
  options: MyExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  console.log(`Running my-executor for ${context.projectName}`);
  // ... do the work ...
  return { success: true };
}
```

```jsonc
// project.json — using the custom executor
{
  "targets": {
    "my-task": {
      "executor": "@my-org/workspace-plugin:my-executor",
      "options": { "outputPath": "dist/output" }
    }
  }
}
```

> **Gotcha:** Prefer composing existing plugins and inferred targets before writing a custom executor. Custom executors are for genuine gaps (internal deploy steps, codegen, etc.).

---

## Level 3 — Senior

### L3 Nx Cloud and remote caching

Nx Cloud stores task results on a shared server so every developer and CI agent can share the same cache.

```bash
# connect the workspace to Nx Cloud
npx nx connect

# run with remote cache (automatic once connected)
nx build my-app
```

```jsonc
// nx.json — nxCloudId replaced nxCloudAccessToken (Nx 19.7+)
{
  "nxCloudId": "YOUR_WORKSPACE_ID"
}
```

| Feature | What it provides |
|---|---|
| **Remote cache (Nx Replay)** | Push/pull cached task outputs from a shared storage. |
| **Nx Agents** | Distribute CI tasks across agents provisioned by Nx Cloud. |
| **Flaky task detection** | Automatically identifies non-deterministic tests. |
| **Usage analytics** | Shows cache hit rates and time saved per branch/agent. |

> **Gotcha:** Cache results must be **deterministic** — the same inputs must always produce the same outputs. If a test writes timestamps or random tokens to its output files, the cache will be poisoned. Audit `outputs` fields carefully.

---

### L3 Distributed task execution

DTE splits a large task graph across multiple CI agents, dramatically reducing total CI time. Prefer **Nx Agents** (hosted) — Nx Cloud provisions agents for you from a single main job.

```yaml
# .github/workflows/ci.yml — hosted Nx Agents (recommended)
jobs:
  main:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: npm ci
      # stop-agents-after should name the last target you still want distributed
      - run: npx nx-cloud start-ci-run --distribute-on="3 linux-medium-js" --stop-agents-after="e2e"
      - run: nx affected -t lint test build e2e
```

For self-hosted / manual DTE, use `--distribute-on="manual"` and run `npx nx-cloud start-agent` on separate CI jobs that wait for work.

| Concept | What it means |
|---|---|
| **Main job** | The CI job that starts the CI run and issues `nx affected` commands. |
| **Agent** | A worker (hosted by Nx Cloud, or your own CI job) that executes tasks from the queue. |
| **Task distribution** | Nx Cloud decides which agent runs which task based on graph analysis. |

> **Gotcha:** All agents must have the same environment (same Node version, same env vars, same checkout). A mismatch causes cache misses or, worse, incorrect outputs that look like cache hits. Do not mix hosted `--distribute-on="<n> <template>"` with a manual `start-agent` matrix in the same workflow.

---

### L3 Module Federation and micro-frontends

Nx has first-class Module Federation support (Webpack or Rspack via `@nx/module-federation`) — splitting a large app into independently deployable shells and remotes.

```bash
# generate a host (shell) application
nx generate @nx/react:host shell --remotes=cart,product

# generate a remote application
nx generate @nx/react:remote product --host=shell

# serve all remotes together for local development
nx serve shell --devRemotes=cart,product
```

```typescript
// apps/shell/module-federation.config.ts
import { ModuleFederationConfig } from '@nx/module-federation';

const config: ModuleFederationConfig = {
  name: 'shell',
  remotes: ['cart', 'product'],
};

export default config;
```

| Concept | What it means |
|---|---|
| **Host** | The shell application that loads remotes at runtime. |
| **Remote** | An independently built and deployable feature application. |
| **Shared libs** | Dependencies shared between host and remotes to avoid duplicate bundles. |
| **Dynamic federation** | Remotes are loaded from a runtime manifest, not hardcoded URLs. |

> **Gotcha:** Shared library versions must match exactly between host and remotes. Version mismatches cause runtime errors that are hard to debug. Pin shared dependencies strictly in `package.json`.

---

### L3 Custom Nx plugins

L2 covered local workspace generators/executors. At senior level, treat the plugin as a product: publishable package, project inference (`createNodes`), and versioned migrations for consumers.

```bash
# scaffold a publishable plugin (or promote tools/workspace-plugin)
nx generate @nx/plugin:plugin my-plugin --directory=tools/my-plugin

# add a generator / executor
nx generate @nx/plugin:generator my-generator --project=my-plugin
nx generate @nx/plugin:executor my-executor --project=my-plugin

# test the plugin locally
nx build my-plugin
```

**Plugin `package.json` registration:**

```jsonc
{
  "name": "@my-org/my-plugin",
  "generators": "./generators.json",
  "executors": "./executors.json"
}
```

**Project inference** — automatically detect project configs without `project.json` (Nx 23 uses the v2 `createNodes` signature):

```typescript
// my-plugin/src/index.ts
import {
  CreateNodes,
  CreateNodesContext,
  createNodesFromFiles,
} from '@nx/devkit';
import { dirname } from 'path';

export interface MyPluginOptions {}

export const createNodes: CreateNodes<MyPluginOptions> = [
  '**/my-config.json',
  async (configFiles, options, context: CreateNodesContext) => {
    return await createNodesFromFiles(
      (configFilePath, options, context) => ({
        projects: {
          [dirname(configFilePath)]: {
            targets: {
              build: { executor: '@my-org/my-plugin:build' },
            },
          },
        },
      }),
      configFiles,
      options,
      context
    );
  },
];
```

---

### L3 Advanced generators and migrations

Use workspace generators to enforce conventions (tags, folder layout, barrels). Ship **code migrations** with your own plugins so consumers upgrade safely — separate from upgrading Nx itself (see [Workspace migrations](#l3-workspace-migrations)).

**Writing a plugin migration:**

```typescript
// migrations/update-1-0-0/update-1-0-0.ts
import { Tree, getProjects, updateProjectConfiguration } from '@nx/devkit';

export default function update(tree: Tree) {
  const projects = getProjects(tree);

  for (const [name, config] of projects) {
    if (config.targets?.['old-target']) {
      config.targets['new-target'] = config.targets['old-target'];
      delete config.targets['old-target'];
      updateProjectConfiguration(tree, name, config);
    }
  }
}
```

```jsonc
// migrations.json (inside your plugin package)
{
  "migrations": [
    {
      "version": "1.0.0",
      "description": "Rename old-target to new-target",
      "factory": "./src/migrations/update-1-0-0/update-1-0-0"
    }
  ]
}
```

> **Gotcha:** Plugin migrations run when someone executes `nx migrate` against a version that includes them. Test migrations on a disposable workspace copy before publishing the plugin.

---

### L3 CI/CD optimization

| Strategy | How to apply |
|---|---|
| **Affected on PRs** | `nx affected -t build test lint --base=origin/main` on pull requests. |
| **Full graph on main** | On the default branch, `nx run-many -t build test lint` (or affected from the previous successful commit) to keep the remote cache warm. |
| **Remote caching** | Connect to Nx Cloud so agents share cache across runs. |
| **DTE / Nx Agents** | Distribute tasks with `nx-cloud start-ci-run --distribute-on="N <template>"`. |
| **Parallel targets** | Set `--parallel` to match available CPU cores on the agent. |
| **Task pipelines** | Use `dependsOn: ["^build"]` to ensure libraries build before apps. |
| **Skip unnecessary targets** | Use `--exclude` or tags to skip projects irrelevant to a PR. |

```yaml
# optimized PR CI pattern
- name: Build and test affected
  run: |
    nx affected -t build test lint \
      --base=origin/main \
      --parallel=4 \
      --configuration=ci
```

> **Gotcha:** Prefer `affected` on PRs. On `main`, `run-many` (or affected vs last green SHA) is often correct so untouched projects still refresh the shared cache.

---

### L3 Enforcing architectural patterns

Go beyond ESLint rules — use generators and workspace tooling to make the right pattern the easiest path.

**Techniques:**

| Technique | How |
|---|---|
| **Workspace generators** | Enforce naming, tags, and barrel files automatically when teams create libs. |
| **ESLint boundary rules** | Block cross-scope or cross-type imports at lint time. |
| **Custom lint rules** | Write ESLint rules for domain-specific patterns (e.g. no direct HTTP in feature libs). |
| **Pre-commit hooks** | Run `nx affected -t lint` on staged files using `lint-staged` + `husky`. |
| **Project graph assertions** | Write tests that load the Nx project graph and assert no forbidden edges exist. |

```typescript
// tools/scripts/assert-graph.ts
import { createProjectGraphAsync } from '@nx/devkit';

async function assertNoCircularDeps() {
  const graph = await createProjectGraphAsync();
  // ... assert graph invariants ...
}

assertNoCircularDeps();
```

---

### L3 Multi-framework workspaces

Large organizations often have Angular, React, Node, and NestJS all in one workspace.

```bash
# add Angular support to an existing workspace
npm install --save-dev @nx/angular
nx generate @nx/angular:application admin-portal

# add NestJS API
npm install --save-dev @nx/nest
nx generate @nx/nest:application api

# add React micro-frontend
npm install --save-dev @nx/react
nx generate @nx/react:application customer-portal
```

**Shared code across frameworks:**

```typescript
// libs/shared/util-auth/src/index.ts — framework-agnostic
export function parseJwt(token: string): JwtPayload { ... }
export function isTokenExpired(token: string): boolean { ... }
```

| Challenge | Solution |
|---|---|
| Conflicting peer dependencies | Use `--legacy-peer-deps` sparingly; isolate version conflicts at the plugin level. |
| Incompatible build tools | Give each project its own executor; do not force one bundler on all projects. |
| Shared types | Create `util` libs with `@nx/js` — no framework dependency, works everywhere. |
| Different test runners | Configure `targetDefaults` per executor rather than one global Jest config. |

---

### L3 Performance tuning and production practices

| Practice | How to apply |
|---|---|
| **Buildable libraries** | Generate with `--buildable` / a real `bundler` (e.g. `tsc`, `vite`) so the lib has its own `build` target and caches independently. |
| **Publishable libraries** | Generate with `--publishable` + `--importPath`; produces a proper package layout for `nx release`. |
| **`nx release`** | Automated versioning, changelog generation, and npm publishing for libs. |
| **`inputs` tuning** | Exclude test files from `build` inputs so test changes don't bust the build cache. |
| **`outputs` tuning** | Set precise output paths; wrong outputs restore stale or empty artifacts on cache hits. |
| **Daemon** | Nx runs a background daemon for faster project graph computation — leave it running locally. |
| **Module boundary linting** | Always run in CI; it prevents architectural drift that is expensive to fix later. |

```bash
# create a buildable / publishable lib (flags are generator options, not project.json keys)
nx generate @nx/js:library util-date --directory=libs/shared --buildable --publishable --importPath=@my-org/shared/util-date

# release libraries with automatic versioning
nx release --projects=shared-ui-button,shared-util-date

# release with dry-run to preview changes
nx release --dry-run
```

> **Gotcha:** Conventional commits make version bumps automatic, but they are not mandatory — configure a fixed or manual strategy under `release` in `nx.json` if your team does not use them.

---

### L3 Workspace migrations

When upgrading Nx itself, always use the migration tooling — never update `nx` manually in `package.json`.

```bash
# 1. prefer interactive migrate on Nx 23+ (or pin a target version)
nx migrate
# nx migrate latest

# 2. review the generated migrations.json before running
cat migrations.json

# 3. install updated packages, then run the migrations
npm install
nx migrate --run-migrations

# 4. clean up migration file after success
rm migrations.json

# 5. re-run affected to verify nothing broke
nx affected -t build test lint --base=HEAD~1
```

| Command | What it does |
|---|---|
| `nx migrate` | Interactive upgrade flow (Nx 23+); choose target version and packages. |
| `nx migrate latest` | Update `package.json` versions to latest and generate `migrations.json`. |
| `nx migrate --run-migrations` | Execute all pending migration scripts against the workspace. |
| `nx migrate --from=nx@<version>` | Generate migrations from a specific version (useful after skipping updates). |

> **Gotcha:** Prefer one major version at a time. Nx only retains migrations for roughly the last two major versions — jumping from a very old release can skip required migrations. For Angular workspaces, multi-major jumps are especially risky. Use `nx migrate --from=nx@<old-version>` when catching up on skipped package updates.

---

## Quick reference table

| Category | Junior knows | Mid knows | Senior knows |
|---|---|---|---|
| **Concepts** | Workspace, app, lib, target, executor vs inferred target | Project graph, affected, cache inputs/outputs | DTE / Agents, module federation, `createNodes` |
| **CLI** | `run`, `generate`, `graph`, `list`, `show project` | `affected`, `run-many`, `reset` | `migrate`, `release`, `nx-cloud` commands |
| **Config** | `nx.json` basics, reading `project.json` | `namedInputs`, `targetDefaults`, `dependsOn`, plugins | Custom plugins, inference, migration scripts |
| **Libraries** | Create libs, import via path alias | Library types, barrels, tag both scope + type | Buildable/publishable libs, `nx release` |
| **Boundaries** | Knows imports must not go app → lib reverse | Configures `depConstraints` | Custom lint rules, graph assertion tests |
| **Generators** | Uses built-in generators + `--dry-run` | Writes workspace generators | Publishable plugins with migrations |
| **Executors** | Runs built-in / inferred targets | Writes custom executors when needed | Inference plugins that replace boilerplate targets |
| **CI** | Understands why CI uses affected | Tunes cache inputs, sets `--parallel` | Agents / DTE, PR vs main strategies, cache hit rate |
| **Testing** | `nx test`, `nx e2e` | Affected test strategy, coverage thresholds | Flaky detection, distributing e2e across agents |

---

## Practical tasks by level

Use these tasks to validate your real-world readiness at each level. Complete them in a fresh workspace (`npx create-nx-workspace@latest`) so there are no hidden shortcuts.

---

### Junior tasks

1. **Bootstrap a workspace** — Create a new Nx workspace with `create-nx-workspace`, choose an application preset (React or Angular), and explore the generated folder structure. Identify `nx.json`, `project.json`, and `tsconfig.base.json`.
2. **Run basic targets** — Run `nx build`, `nx serve`, `nx test`, and `nx lint` for the generated app. Read the terminal output and explain what each target produced.
3. **Generate a library** — Use `nx g @nx/js:lib shared-utils` to scaffold a utility library. Export a simple helper function from it and import it in the app. Verify the build still passes.
4. **View the project graph** — Run `nx graph` and open the browser view. Identify all projects and draw the dependency edges on paper.
5. **Use `--dry-run`** — Run any generator with `--dry-run` and list the files it would create without touching the disk.
6. **Read project config** — Run `nx show project <app-name> --web` and explain every target listed.
7. **Add a new target** — Add a custom `greet` target to `project.json` that runs `echo Hello from Nx`. Execute it with `nx greet <app-name>`.
8. **Fix a failing lint rule** — Intentionally write an unused variable, run `nx lint`, read the error, fix it, and confirm lint passes.
9. **Run tests** — Write one unit test for your helper function and run `nx test shared-utils`. Make it fail, then fix it.
10. **Explore built-in generators** — Run `nx list` and `nx list @nx/react` (or your preset plugin). List five generators and describe what each one creates.

---

### Middle tasks

1. **Understand affected** — Make a change in `shared-utils`, then run `nx affected -t build test --base=main`. Explain which projects were included and why.
2. **Configure cache inputs** — Add a `namedInput` that excludes `*.md` files from cache keys for the `test` target. Verify that changing a README does not invalidate the test cache.
3. **Set `dependsOn`** — Configure the app's `build` target to `dependsOn` the library's `build` target. Confirm that running `nx build <app>` automatically builds the library first.
4. **Add module boundary tags** — Tag two libraries (`scope:shared` and `scope:feature`). Configure `@nx/enforce-module-boundaries` to prevent `scope:shared` from importing `scope:feature`. Write a cross-boundary import and confirm lint catches it.
5. **Write a workspace generator** — Scaffold a generator with `nx g @nx/plugin:generator my-component --project=tools`. Have it create a boilerplate React component file. Run it against a feature library.
6. **Write a custom executor** — Create an executor that runs `tsc --noEmit` and reports success/failure. Wire it as a `typecheck` target on at least one project.
7. **Configure parallel CI** — Set up a GitHub Actions (or similar) workflow that runs `nx affected -t lint test build --parallel=3`. Cache `node_modules` and `.nx/cache` between runs.
8. **Buildable library** — Generate a buildable library (`--bundler=tsc`). Build it independently and inspect the `dist/` output. Import it in the app using the path alias and verify the final app build works.
9. **Storybook integration** — Add Storybook to a UI library with `nx g @nx/storybook:configuration`. Write one story and run `nx storybook <lib>` successfully.
10. **Tune `run-many`** — Use `nx run-many -t test --projects=tag:scope:shared` to run tests only for shared libraries. Add `--verbose` and inspect cache hit/miss output.

---

### Senior tasks

1. **Self-hosted remote cache** — Configure Nx Cloud (or an S3/GCS remote cache) for the workspace. Prove cache sharing works by running a build on one machine, then running the same build on a second machine (or CI) and confirming a cache hit.
2. **Distributed task execution** — Set up Nx Agents in a CI pipeline (GitHub Actions or similar). Run a full `nx affected -t build test lint` using at least two agent machines. Capture logs showing tasks distributed across agents.
3. **Custom inference plugin** — Write an Nx plugin that uses `createNodes` to infer a `typecheck` target for every project that has a `tsconfig.json`, without adding anything to `project.json`. Publish it as a local package and register it in `nx.json`.
4. **Module federation host + remote** — Scaffold a Module Federation workspace with one host app and two remote apps. Verify `nx serve` launches all three, that one remote can be swapped at runtime, and that `nx build` produces correct output manifests.
5. **Workspace migration script** — Write an Nx migration (generator + `migrations.json`) that renames a config property across all `project.json` files in the workspace. Run it with `nx migrate --run-migrations` and verify idempotency.
6. **`nx release` pipeline** — Configure `nx release` for a publishable library (version bump, changelog generation, npm publish to a local Verdaccio registry). Run the full release flow: `nx release version`, `nx release changelog`, `nx release publish`.
7. **Architectural graph test** — Write a Jest test using `@nx/devkit` that asserts no project with `type:app` imports directly from another `type:app`. Run it in CI as a dedicated `graph-check` target.
8. **Cache hit rate audit** — After 20 CI runs, inspect Nx Cloud analytics (or local cache logs) and identify the three targets with the lowest cache hit rate. Propose and implement input refinements that raise each rate above 80 %.
9. **Multi-framework workspace** — Add a NestJS API and a React frontend to the same workspace. Share a `@scope/types` library (plain TypeScript) between them. Confirm both apps build independently and that affected works correctly when the shared lib changes.
10. **Flaky test quarantine** — Identify a test that fails non-deterministically in CI. Implement a retry strategy (Jest `--retries` or Playwright retry), tag the test as `@flaky`, and configure CI to report flaky results separately without blocking the build.
