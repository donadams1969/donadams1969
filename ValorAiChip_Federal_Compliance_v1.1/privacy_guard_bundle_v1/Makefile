.PHONY: help render install-hooks apply-observability apply-edge apply-ci all clean

SHELL := /bin/bash
export DG_REAL_NAME ?= $(error DG_REAL_NAME not set)
export DG_PSEUDONYM ?= DG77.77X-Ξ

help:
	@echo "Privacy Guard Bundle v1 — Makefile"
	@echo ""
	@echo "Usage:"
	@echo "  make render              Render all templates with DG_REAL_NAME"
	@echo "  make install-hooks       Install pre-commit/pre-push hooks"
	@echo "  make apply-observability Deploy Prometheus/OTel/Loki configs"
	@echo "  make apply-edge          Deploy NGINX/WAF configs"
	@echo "  make apply-ci            Install Gitleaks + GitHub Actions"
	@echo "  make all                 Run all above (render, hooks, observability, edge, ci)"
	@echo "  make clean               Remove rendered templates"
	@echo ""
	@echo "Required ENV:"
	@echo "  DG_REAL_NAME=<<your legal name>>"
	@echo "  DG_PSEUDONYM=DG77.77X-Ξ (optional, defaults to DG77.77X-Ξ)"

render:
	@echo "[1/6] Rendering privacy templates..."
	@bash scripts/render-privacy-templates.sh

install-hooks:
	@echo "[2/6] Installing git hooks..."
	@bash scripts/install-git-hooks.sh

apply-observability: render
	@echo "[3/6] Deploying observability configs..."
	@sudo mkdir -p /etc/prometheus /etc/otel /etc/grafana-agent
	@sudo cp observability/prometheus-scrape.yml /etc/prometheus/prometheus.yml
	@sudo cp observability/otel-collector.yaml /etc/otel/config.yaml
	@sudo cp observability/grafana-agent-logs.yaml /etc/grafana-agent/agent.yaml
	@echo "✅ Observability configs deployed. Restart services."

apply-edge: render
	@echo "[4/6] Deploying edge/WAF configs..."
	@sudo mkdir -p /etc/nginx/conf.d
	@sudo cp edge/nginx.conf /etc/nginx/conf.d/privacy-guard.conf
	@echo "⚠️  For AWS WAF, manually apply edge/aws-waf-rule.json via CLI/Console."
	@echo "✅ NGINX config deployed. Reload nginx."

apply-ci: render
	@echo "[5/6] Installing CI guards..."
	@cp ci/gitleaks.toml ../../.gitleaks.toml
	@mkdir -p ../../.github/workflows
	@cp ci/github-leak-guard.yml ../../.github/workflows/leak-guard.yml
	@echo "✅ CI configs installed. Commit and push."

all: render install-hooks apply-observability apply-edge apply-ci
	@echo "[6/6] Privacy Guard Bundle v1 — FULLY DEPLOYED ✅"

clean:
	@echo "Cleaning rendered templates..."
	@rm -f observability/*.{yml,yaml} edge/*.conf edge/*.json ci/gitleaks.toml
	@echo "✅ Cleaned."
