import unittest
import subprocess
import time
import json
import os
from web3 import Web3

class TestGrokProvenance(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Start Hardhat node as a background process
        print("Starting Hardhat node...")
        cls.hardhat_process = subprocess.Popen(['npx', 'hardhat', 'node'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        time.sleep(5)  # Give it a moment to start

        # Deploy the contract using the Hardhat script
        print("Deploying VALORAIPLUSGrokProvenance contract...")
        deploy_process = subprocess.run(['npx', 'hardhat', 'run', 'scripts/deploy-provenance.js', '--network', 'localhost'], capture_output=True, text=True)
        if deploy_process.returncode != 0:
            print("Deployment failed!")
            print(deploy_process.stdout)
            print(deploy_process.stderr)
            cls.tearDownClass()
            raise Exception("Failed to deploy contract")

        print(deploy_process.stdout)

        # Load deployment info
        with open('deployment-info.json', 'r') as f:
            deployment_info = json.load(f)

        cls.w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))
        cls.contract_address = deployment_info['contractAddress']

        with open('artifacts/contracts/VALORAIPLUSGrokProvenance.sol/VALORAIPLUSGrokProvenance.json') as f:
            abi = json.load(f)['abi']

        cls.contract = cls.w3.eth.contract(address=cls.contract_address, abi=abi)
        cls.provenance_hash = deployment_info['provenanceHash']
        cls.ai_fingerprint = deployment_info['aiFingerprint']
        cls.mnid = deployment_info['mnid']
        cls.caid = deployment_info['caid']
        cls.gyid = deployment_info['gyid']

    @classmethod
    def tearDownClass(cls):
        print("\nStopping Hardhat node...")
        cls.hardhat_process.terminate()
        cls.hardhat_process.wait()

    def test_01_verify_initial_record(self):
        """Test if the initial record was registered correctly during deployment."""
        print("\n--- Testing Initial Record Verification ---")
        record = self.contract.functions.verifyFile(self.provenance_hash).call()
        self.assertEqual(record[0].hex(), self.provenance_hash[2:]) # fileHash
        self.assertEqual(record[1].hex(), self.ai_fingerprint[2:]) # aiFingerprint
        self.assertEqual(record[2], self.mnid) # mnid
        self.assertEqual(record[3], self.caid) # caid
        self.assertEqual(record[4], self.gyid) # gyid
        print("✅ Initial record verified successfully.")

    def test_02_register_new_record(self):
        """Test registering a new record."""
        print("\n--- Testing New Record Registration ---")
        accounts = self.w3.eth.accounts
        new_hash = Web3.keccak(text="new_test_data").hex()
        new_ai_fp = Web3.keccak(text="new_ai_fingerprint").hex()

        tx_hash = self.contract.functions.registerFile(
            new_hash, new_ai_fp, "NEW_MNID", "NEW_CAID", "NEW_GYID"
        ).transact({'from': accounts[1]})

        self.w3.eth.wait_for_transaction_receipt(tx_hash)

        record = self.contract.functions.verifyFile(new_hash).call()
        self.assertEqual(record[0].hex(), new_hash[2:])
        self.assertEqual(record[1].hex(), new_ai_fp[2:])
        self.assertEqual(record[5], accounts[1]) # author
        print("✅ New record registered and verified successfully.")

    def test_03_prevent_duplicate_registration(self):
        """Test that the contract prevents duplicate registrations."""
        print("\n--- Testing Duplicate Registration Prevention ---")
        accounts = self.w3.eth.accounts
        with self.assertRaises(Exception) as context:
            self.contract.functions.registerFile(
                self.provenance_hash, self.ai_fingerprint, self.mnid, self.caid, self.gyid
            ).transact({'from': accounts[0]})

        self.assertTrue('File already registered' in str(context.exception))
        print("✅ Successfully prevented duplicate registration.")

    def test_04_verify_non_existent_record(self):
        """Test that verifying a non-existent record fails."""
        print("\n--- Testing Non-Existent Record Verification ---")
        non_existent_hash = Web3.keccak(text="non_existent").hex()
        with self.assertRaises(Exception) as context:
            self.contract.functions.verifyFile(non_existent_hash).call()

        self.assertTrue('File not registered' in str(context.exception))
        print("✅ Successfully failed to verify non-existent record.")

if __name__ == '__main__':
    unittest.main()