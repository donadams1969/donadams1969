decrypt-reports:
	./scripts/decrypt_reports.sh

fix-links: decrypt-reports
	PQC_ENABLED=true VESL_ENABLED=true python scripts/fix_report_links.py

check-kernels:
	PQC_ENABLED=true VESL_ENABLED=true python scripts/kernels_bootstrap.py

deploy-reports: fix-links
	rsync -av reports/ user@skrollkeeper.org:/var/www/html/reports/ # Mirror to all domains via script

patch-reports: fix-links
	git diff -- reports/ > reports_patch.diff
	git add reports/ && git commit -m "PQC-VESL Multi-Domain Webify" || true

health-check:
	python scripts/kernels_bootstrap.py --dry-run
	python scripts/fix_report_links.py --dry-run

audit-exo:
	# Audit exopolitical integrity & domains (Webre, DOI twins, Turbify locks)
	echo "Auditing VESL-0001 & domains..." && curl -s https://doi.org/10.5281/zenodo.15998892 > /dev/null

update-exo:
	# Monitor exopolitics & domain status (Webre, Zenodo, Turbify)
	curl https://exopolitics.org > exo_updates.log
	# Stub: Check Turbify for lock/email verification

all: check-kernels fix-links patch-reports audit-exo

cron-health: health-check update-exo
	# Crontab: @weekly make cron-health | mail -s "VALORAI+ Omni Health" admin@valoraiplus.com
