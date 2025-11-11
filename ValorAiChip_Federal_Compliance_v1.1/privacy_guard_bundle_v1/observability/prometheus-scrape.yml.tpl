scrape_configs:
  - job_name: valoraiplus
    static_configs:
      - targets: ['app:8000']
    metric_relabel_configs:
      # Drop any metric with real name in labels
      - action: drop
        regex: .*($DG_REAL_NAME_REGEX).*
        source_labels: [__name__, job, instance, user, author, requester]

      # Replace real name with pseudonym
      - action: replace
        source_labels: [user]
        target_label: user
        regex: (.*)($DG_REAL_NAME_REGEX)(.*)
        replacement: ${1}${DG_PSEUDONYM}${3}
