fix-links:
	python scripts/fix_report_links.py

check-kernels:
	python scripts/kernels_bootstrap.py

deploy-reports: fix-links
	rsync -av reports/ user@skrollkeeper.org:/var/www/html/reports/

patch-reports: fix-links
	git diff -- reports/ > reports_patch.diff
	git add reports/ && git commit -m "Auto-webify Tribunal logs" || true

health-check:
	python scripts/kernels_bootstrap.py --dry-run
	python scripts/fix_report_links.py --dry-run

all: check-kernels fix-links patch-reports

cron-health: health-check
	# Add to crontab: @weekly make cron-health | mail -s "VALORCHAIN Health" admin@valorchain.com
