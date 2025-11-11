receivers:
  otlp:
    protocols:
      http:
      grpc:

processors:
  attributes/scrub_dg:
    actions:
      - key: user
        action: update
        pattern: '(?i)($DG_REAL_NAME_REGEX)'
        value: '$DG_PSEUDONYM'
      - key: author
        action: update
        pattern: '(?i)($DG_REAL_NAME_REGEX)'
        value: '$DG_PSEUDONYM'

exporters:
  prometheusremotewrite:
    endpoint: http://prometheus:9090/api/v1/write

service:
  pipelines:
    metrics:
      receivers: [otlp]
      processors: [attributes/scrub_dg]
      exporters: [prometheusremotewrite]
