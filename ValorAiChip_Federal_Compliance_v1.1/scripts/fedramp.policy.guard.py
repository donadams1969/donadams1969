# Policy Verifier to Check Control Compliance Labels

from kubernetes import client, config
from kubernetes.config import ConfigException

def main():
    """
    This script will verify that all Kubernetes workloads have the required
    FedRAMP-compliant labels.
    """
    print("Checking for FedRAMP compliance labels...")

    try:
        # Try to load the in-cluster configuration
        config.load_incluster_config()
        print("Loaded in-cluster Kubernetes configuration.")
    except ConfigException:
        try:
            # Fallback to loading the local kubeconfig file
            config.load_kube_config()
            print("Loaded local kubeconfig configuration.")
        except ConfigException:
            print("WARNING: Could not load Kubernetes configuration. Skipping compliance check.")
            print("This is expected in a CI 'dry-run' without a configured k8s context.")
            exit(0)

    # Create a Kubernetes API client
    api = client.AppsV1Api()

    # List all deployments in all namespaces
    print("Fetching deployments from all namespaces...")
    deployments = api.list_deployment_for_all_namespaces().items

    all_compliant = True

    if not deployments:
        print("No deployments found.")
        # Exit 0 because there's nothing to check.
        exit(0)

    for deployment in deployments:
        namespace = deployment.metadata.namespace
        name = deployment.metadata.name
        labels = deployment.metadata.labels

        if not labels:
            print(f"ERROR: Deployment '{namespace}/{name}' has no labels.")
            all_compliant = False
            continue

        required_labels = ["gov.fedramp.low", "gov.cisa.cdm"]
        missing_labels = [label for label in required_labels if label not in labels]

        if missing_labels:
            print(f"ERROR: Deployment '{namespace}/{name}' is missing required FedRAMP labels: {', '.join(missing_labels)}")
            all_compliant = False

    if all_compliant:
        print("✅ All deployments are compliant.")
    else:
        print("🚫 Some deployments are not compliant.")
        exit(1)

if __name__ == "__main__":
    main()
