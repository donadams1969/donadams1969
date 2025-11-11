server:
  log_level: info
positions:
  filename: /tmp/positions.yaml
clients:
  - url: http://loki:3100/loki/api/v1/push
scrape_configs:
  - job_name: app
    static_configs:
      - targets: [localhost]
        labels:
          job: app
          __path__: /var/log/app/*.log
    pipeline_stages:
      - replace:
          expression: '(?i)($DG_REAL_NAME_REGEX)'
          replace: '$DG_PSEUDONYM'
