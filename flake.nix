{
  description = "Nomo";

  inputs.devshell.url = "github:numtide/devshell";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url =
    "github:NixOS/nixpkgs/nixos-unstable";

  inputs.flake-compat = {
    url = "github:edolstra/flake-compat";
    flake = false;
  };

  outputs = { self, flake-utils, devshell, nixpkgs, ... }:
    flake-utils.lib.eachDefaultSystem (system: {
      devShells.default = let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [ devshell.overlays.default ];
        };

      in pkgs.devshell.mkShell {
        name = "nomo.dev";
        packages = [
          # Build tools
          pkgs.git
          pkgs.curl
          pkgs.wget
          pkgs.httpyac

          # pnpm - Fast, disk space efficient package manager
          pkgs.nodePackages.pnpm

          # Development tools
          pkgs.pkg-config
        ];
        env = [
          # Cloudflare Workers configuration
          {
            name = "WRANGLER_SEND_METRICS";
            value = "false";
          }
        ];
        commands = [
          {
            name = "pnpm-version";
            category = "nomo";
            help = "Check pnpm version";
            command = "pnpm --version";
          }
          {
            name = "wrangler-version";
            category = "nomo";
            help = "Check Wrangler version";
            command = "wrangler --version";
          }
          {
            name = "dev";
            category = "nomo";
            help = "Start development server";
            command = "pnpm run dev";
          }
          {
            name = "build";
            category = "nomo";
            help = "Build the project";
            command = "pnpm run build";
          }
          {
            name = "deploy";
            category = "nomo";
            help = "Build and deploy to Cloudflare Workers";
            command = "pnpm run deploy";
          }
          {
            name = "cf-typegen";
            category = "nomo";
            help = "Generate Cloudflare Workers types";
            command = "pnpm run cf-typegen";
          }
        ];
        bash.extra = ''
          echo "=========================================="
          echo "Nomo Cloudflare Workers Development"
          echo "=========================================="
          echo ""
          if command -v pnpm &>/dev/null; then
            echo "pnpm: $(pnpm --version)"
          else
            echo "pnpm not found in PATH"
          fi
          if command -v wrangler &>/dev/null; then
            echo "Wrangler: $(wrangler --version)"
          else
            echo "Wrangler not found in PATH"
          fi
          echo ""
          echo "Available commands:"
          echo "  dev            - Start development server"
          echo "  build          - Build the project"
          echo "  deploy         - Build and deploy to Cloudflare Workers"
          echo "  cf-typegen     - Generate Cloudflare Workers types"
          echo "  pnpm-version   - Check pnpm version"
          echo "  wrangler-version - Check Wrangler version"
          echo ""
          echo "Quick start:"
          echo "  pnpm install   - Install dependencies"
          echo "  pnpm run dev   - Start development server"
          echo "=========================================="
        '';
      };
    });
}
