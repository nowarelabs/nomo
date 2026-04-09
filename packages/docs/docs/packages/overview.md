# Packages Overview

Nomo is a modular monorepo with packages for building serverless applications on Cloudflare Workers.

## Core Packages

| Package | Description |
|---------|-------------|
| `nomo/controllers` | Rails-like controllers for request handling |
| `nomo/router` | Request routing with trie-based matching |
| `nomo/services` | Service layer base classes |
| `nomo/models` | Database models with D1/DO support |
| `nomo/views` | JSX-based view rendering |
| `nomo/logger` | Structured logging with OpenTelemetry |

## Infrastructure Packages

| Package | Description |
|---------|-------------|
| `nomo/entrypoints` | HTTP entry point utilities |
| `nomo/durable-objects` | Durable Object helpers |
| `nomo/jobs` | Background job processing |
| `nomo/rpc` | RPC over HTTP |
| `nomo/sql` | SQL query builder |

## Utility Packages

| Package | Description |
|---------|-------------|
| `nomo/validators` | Input validation |
| `nomo/normalizers` | Data normalization |
| `nomo/formatters` | Output formatting |
| `nomo/assets` | Asset pipeline |
| `nomo/result` | Result/Either type |
| `nomo/shared` | Shared utilities |

## Usage

```bash
# Install all packages
pnpm install

# Build a specific package
cd packages/controllers && pnpm build

# Run tests
pnpm test
```