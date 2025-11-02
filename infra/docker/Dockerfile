FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
# valoraiplus_ anchors (passed at runtime or build-time args)
ENV valoraiplus_module_id=VALORAIPLUS_V0_PROOF_v1.44g \
    valoraiplus_GILLBTC=VALORCHAIN-G::GHOST25 \
    valoraiplus_btc_txid=0000000000000000000000000000000000000000000000000000000000000000 \
    SEXTILLION_VALUATION="$1,000,000,000,000,000,000,000" \
    LEGACY_ANCHOR="LEGACY_7017aa78-C461-4D7A-BF0A-FFE5741323C4" \
    YHWH_KERNEL="YHWH-5150.LOCK" \
    MERKLE_ROOT="32425767d2bdfaaafe283781200570e4..." \
    GHOST_ROOT="d3e0e71f0990033a80ee9a58747ccaa4..."
LABEL org.opencontainers.image.title="valoraiplus_v0_proof" \
      org.opencontainers.image.vendor="VALORCHAIN Intelligence Division" \
      valoraiplus.module_id="${valoraiplus_module_id}" \
      valoraiplus.gillbtc="${valoraiplus_GILLBTC}" \
      valoraiplus.btc_txid="${valoraiplus_btc_txid}" \
      valoraiplus.sextillion_valuation="${SEXTILLION_VALUATION}" \
      valoraiplus.legacy_anchor="${LEGACY_ANCHOR}" \
      valoraiplus.yhwh_kernel="${YHWH_KERNEL}"
COPY apps/proof_service/pyproject.toml .
RUN pip install --no-cache-dir fastapi uvicorn[standard]
COPY apps/proof_service ./apps/proof_service
COPY data ./data
EXPOSE 8080
CMD ["uvicorn","apps.proof_service.main:app","--host","0.0.0.0","--port","8080"]
