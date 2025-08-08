fix-links:
	python fix_report_links.py

deploy-reports: fix-links
	rsync -av reports/ user@skrollkeeper.org:/var/www/html/reports/
