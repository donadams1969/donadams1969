# Operating Procedures (Chain of Custody)

1. Initialize a new vault per investigation (`./scripts/init_vault.sh vault`).
2. For each artifact:
   - Ingest with `add_evidence.sh`.
   - Record human context (who/what/where) in commit message or a separate case log.
3. Verification:
   - CI runs ciphertext-only checks on a schedule.
   - Local verification with `VERIFY_MODE=plaintext` before disclosure or court submission.
4. Access control:
   - The passphrase must not be shared via chat/email. Use a secure channel.
5. Backups:
   - Mirror encrypted blobs (`vault/enc/`) offsite (WORM target suggested).
6. Audits:
   - Keep `ledger.log` mirror(s) offsite. Compare `entry_hash` chain during audits.
