# Assets

Asset pipeline for Nomo applications.

## Usage

```typescript
import { AssetPipeline } from "nomo/assets";

const pipeline = new AssetPipeline({
  manifest: ASSET_MANIFEST,
  isProd: ENVIRONMENT === "production",
  importMap: IMPORT_MAP,
});

// Get asset URL
const jsUrl = pipeline.js("main");
const cssUrl = pipeline.css("main");

// Get asset content
const content = pipeline.asset("bundle.js");
```

## Configuration

| Option      | Type                     | Description               |
| ----------- | ------------------------ | ------------------------- |
| `manifest`  | `Record<string, string>` | Asset manifest from build |
| `isProd`    | `boolean`                | Production mode flag      |
| `importMap` | `ImportMap`              | Import map for modules    |
| `prefix`    | `string`                 | Asset URL prefix          |
