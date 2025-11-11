# Privacy Guard Bundle v1 🔐

**Comprehensive real-name redaction system for VALORAIPLUS.**

## Quick Start

```
export DG_REAL_NAME="Your Legal Name"
make -f privacy_guard_bundle_v1/Makefile all
```

This will:
1. Render all templates
2. Install git hooks (pre-commit/pre-push)
3. Deploy observability configs (Prometheus/OTel/Loki)
4. Deploy edge configs (NGINX/WAF)
5. Install CI guards (Gitleaks/GitHub Actions)

## Individual Commands

```
make -f privacy_guard_bundle_v1/Makefile render              # Render templates only
make -f privacy_guard_bundle_v1/Makefile install-hooks       # Install git hooks only
sudo make -f privacy_guard_bundle_v1/Makefile apply-observability # Deploy observability configs (requires sudo)
sudo make -f privacy_guard_bundle_v1/Makefile apply-edge          # Deploy NGINX/WAF configs (requires sudo)
make -f privacy_guard_bundle_v1/Makefile apply-ci            # Install CI leak detection
```

## Architecture

**Layer 1: Ingress (WAF/NGINX)**
Blocks requests containing real name before reaching app.

**Layer 2: Application**
Your existing normalize→encrypt→redact stack.

**Layer 3: Egress (Prometheus/OTel/Loki)**
Scrubs metrics, traces, and logs before export.

**Layer 4: Dev/CI (Git hooks + Gitleaks)**
Prevents commits/pushes containing real name.

## Requirements

- `bash` 4+
- `envsubst` (gnu-gettext)
- `sed`, `git`

## License

Proprietary - VALORAIPLUS Internal Use Only
