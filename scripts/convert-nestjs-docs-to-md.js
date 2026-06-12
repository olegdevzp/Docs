#!/usr/bin/env node
/**
 * Download official NestJS documentation (https://docs.nestjs.com/)
 * from the source repo and combine into a single Markdown file.
 *
 * Source: https://github.com/nestjs/docs.nestjs.com (content/ directory)
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const REPO_ROOT = path.join(__dirname, '..');
const REPO_URL = 'https://github.com/nestjs/docs.nestjs.com.git';
const DEFAULT_OUTPUT = path.join(REPO_ROOT, 'docs', 'node.js', 'nestjs-documentation.md');

/** Page order mirrors https://docs.nestjs.com/ navigation */
const PAGE_ORDER = [
  'content/introduction.md',
  'content/first-steps.md',
  'content/controllers.md',
  'content/components.md',
  'content/modules.md',
  'content/middlewares.md',
  'content/pipes.md',
  'content/guards.md',
  'content/exception-filters.md',
  'content/interceptors.md',
  'content/custom-decorators.md',
  'content/application-context.md',
  'content/discover/who-uses.md',
  'content/migration.md',
  'content/deployment.md',
  'content/support.md',
  // Fundamentals
  'content/fundamentals/dynamic-modules.md',
  'content/fundamentals/dependency-injection.md',
  'content/fundamentals/platform-agnosticism.md',
  'content/fundamentals/async-components.md',
  'content/fundamentals/module-reference.md',
  'content/fundamentals/lazy-loading-modules.md',
  'content/fundamentals/unit-testing.md',
  'content/fundamentals/provider-scopes.md',
  'content/fundamentals/execution-context.md',
  'content/fundamentals/lifecycle-events.md',
  'content/fundamentals/circular-dependency.md',
  'content/fundamentals/discovery-service.md',
  // Techniques
  'content/techniques/mvc.md',
  'content/techniques/serialization.md',
  'content/techniques/caching.md',
  'content/techniques/validation.md',
  'content/techniques/sql.md',
  'content/techniques/mongo.md',
  'content/techniques/file-upload.md',
  'content/techniques/streaming-files.md',
  'content/techniques/logger.md',
  'content/techniques/performance.md',
  'content/techniques/http-module.md',
  'content/techniques/configuration.md',
  'content/techniques/cookies.md',
  'content/techniques/task-scheduling.md',
  'content/techniques/compression.md',
  'content/techniques/queues.md',
  'content/techniques/server-sent-events.md',
  'content/techniques/versioning.md',
  'content/techniques/events.md',
  'content/techniques/sessions.md',
  // Security
  'content/security/authentication.md',
  'content/security/cors.md',
  'content/security/helmet.md',
  'content/security/encryption-hashing.md',
  'content/security/csrf.md',
  'content/security/rate-limiting.md',
  'content/security/authorization.md',
  // GraphQL
  'content/graphql/quick-start.md',
  'content/graphql/resolvers-map.md',
  'content/graphql/mutations.md',
  'content/graphql/scalars.md',
  'content/graphql/subscriptions.md',
  'content/graphql/guards-interceptors.md',
  'content/graphql/federation.md',
  'content/graphql/directives.md',
  'content/graphql/field-middleware.md',
  'content/graphql/complexity.md',
  'content/graphql/extensions.md',
  'content/graphql/unions-and-enums.md',
  'content/graphql/plugins.md',
  'content/graphql/interfaces.md',
  'content/graphql/sharing-models.md',
  'content/graphql/mapped-types.md',
  'content/graphql/cli-plugin.md',
  'content/graphql/schema-generator.md',
  // WebSockets
  'content/websockets/gateways.md',
  'content/websockets/pipes.md',
  'content/websockets/exception-filters.md',
  'content/websockets/guards.md',
  'content/websockets/interceptors.md',
  'content/websockets/adapter.md',
  // Microservices
  'content/microservices/basics.md',
  'content/microservices/redis.md',
  'content/microservices/mqtt.md',
  'content/microservices/nats.md',
  'content/microservices/grpc.md',
  'content/microservices/rabbitmq.md',
  'content/microservices/kafka.md',
  'content/microservices/pipes.md',
  'content/microservices/exception-filters.md',
  'content/microservices/guards.md',
  'content/microservices/interceptors.md',
  'content/microservices/custom-transport.md',
  // OpenAPI
  'content/openapi/introduction.md',
  'content/openapi/types-and-parameters.md',
  'content/openapi/operations.md',
  'content/openapi/security.md',
  'content/openapi/decorators.md',
  'content/openapi/mapped-types.md',
  'content/openapi/cli-plugin.md',
  'content/openapi/other-features.md',
  // CLI
  'content/cli/overview.md',
  'content/cli/workspaces.md',
  'content/cli/libraries.md',
  'content/cli/usages.md',
  'content/cli/scripts.md',
  // Recipes
  'content/recipes/mikroorm.md',
  'content/recipes/sql-typeorm.md',
  'content/recipes/mongodb.md',
  'content/recipes/sql-sequelize.md',
  'content/recipes/cqrs.md',
  'content/recipes/sentry.md',
  'content/recipes/prisma.md',
  'content/recipes/terminus.md',
  'content/recipes/documentation.md',
  'content/recipes/crud-generator.md',
  'content/recipes/hot-reload.md',
  'content/recipes/serve-static.md',
  'content/recipes/router-module.md',
  'content/recipes/nest-commander.md',
  'content/recipes/async-local-storage.md',
  'content/recipes/repl.md',
  'content/recipes/swc.md',
  'content/recipes/suites.md',
  'content/recipes/necord.md',
  'content/recipes/passport.md',
  // FAQ
  'content/faq/global-prefix.md',
  'content/faq/hybrid-application.md',
  'content/faq/multiple-servers.md',
  'content/faq/http-adapter.md',
  'content/faq/keep-alive-connections.md',
  'content/faq/raw-body.md',
  'content/faq/request-lifecycle.md',
  'content/faq/errors.md',
  'content/faq/serverless.md',
  // Devtools
  'content/devtools/overview.md',
  'content/devtools/ci-cd.md',
];

function cloneContentDir() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nestjs-docs-'));
  console.log(`📥 Cloning NestJS docs source (content only)...`);
  execSync(
    `git clone --depth 1 --filter=blob:none --sparse "${REPO_URL}" "${tmpDir}"`,
    { stdio: 'pipe' }
  );
  execSync('git sparse-checkout set content', { cwd: tmpDir, stdio: 'pipe' });
  return path.join(tmpDir, 'content');
}

function findAllMdFiles(contentDir) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) files.push(full);
    }
  }
  walk(contentDir);
  return files;
}

function relContentPath(contentDir, filePath) {
  return 'content/' + path.relative(contentDir, filePath).split(path.sep).join('/');
}

function cleanMarkdown(text) {
  return text
    .replace(/\{\{\s*'\{'\s*\}\}/g, '{')
    .replace(/\{\{\s*'\}'\s*\}\}/g, '}')
    .replace(/^>\s*(info|warning|hint|notice)\s+/gim, '> ')
    .replace(/<div class="file-tree">[\s\S]*?<\/div>/g, (block) => {
      const items = [...block.matchAll(/<div class="item">([^<]+)<\/div>/g)].map(
        (m) => m[1]
      );
      return items.length ? '```\n' + items.join('\n') + '\n```' : '';
    })
    .trim();
}

function extractTitle(markdown) {
  const match = markdown.match(/^#{1,3}\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function buildCombinedMarkdown(contentDir) {
  const allFiles = findAllMdFiles(contentDir);
  const byRelPath = new Map(allFiles.map((f) => [relContentPath(contentDir, f), f]));

  const ordered = [];
  const seen = new Set();

  for (const rel of PAGE_ORDER) {
    const abs = byRelPath.get(rel);
    if (abs) {
      ordered.push(abs);
      seen.add(rel);
    }
  }

  const remaining = allFiles
    .filter((f) => !seen.has(relContentPath(contentDir, f)))
    .sort((a, b) => a.localeCompare(b));
  ordered.push(...remaining);

  const sections = [];
  const now = new Date().toISOString().slice(0, 10);

  sections.push(`# NestJS Documentation

> Combined from the official source at [docs.nestjs.com](https://docs.nestjs.com/)  
> Repository: [nestjs/docs.nestjs.com](https://github.com/nestjs/docs.nestjs.com)  
> Generated: ${now}

---

`);

  for (const filePath of ordered) {
    const rel = relContentPath(contentDir, filePath);
    const raw = fs.readFileSync(filePath, 'utf8');
    const cleaned = cleanMarkdown(raw);
    const title = extractTitle(cleaned) || path.basename(filePath, '.md');
    const urlPath = rel.replace(/^content\//, '').replace(/\.md$/, '');

    sections.push(`<!-- source: ${rel} -->\n`);
    sections.push(`## [${title}](https://docs.nestjs.com/${urlPath})\n\n`);
    sections.push(cleaned);
    sections.push('\n\n---\n\n');
  }

  return sections.join('');
}

function parseArgs() {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(`
📘 NestJS docs → Markdown

Usage:
  node scripts/convert-nestjs-docs-to-md.js [--output <path>]

Options:
  --output, -o   Output file path (default: docs/node.js/nestjs-documentation.md)

Example:
  node scripts/convert-nestjs-docs-to-md.js
  node scripts/convert-nestjs-docs-to-md.js --output docs/nestjs-docs.md
`);
    process.exit(0);
  }

  const outIdx = argv.findIndex((a) => a === '--output' || a === '-o');
  const output =
    outIdx >= 0 && argv[outIdx + 1]
      ? path.isAbsolute(argv[outIdx + 1])
        ? argv[outIdx + 1]
        : path.resolve(REPO_ROOT, argv[outIdx + 1])
      : DEFAULT_OUTPUT;

  return { output };
}

async function main() {
  const { output } = parseArgs();
  let contentDir;

  try {
    contentDir = cloneContentDir();
    const markdown = buildCombinedMarkdown(contentDir);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, markdown, 'utf8');

    const pageCount = (markdown.match(/<!-- source: content\//g) || []).length;
    const sizeKb = (Buffer.byteLength(markdown, 'utf8') / 1024).toFixed(1);

    console.log(`✅ Combined ${pageCount} pages (${sizeKb} KB)`);
    console.log(`📁 Output: ${output}`);
  } finally {
    if (contentDir) {
      const tmpRoot = path.dirname(contentDir);
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    }
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
