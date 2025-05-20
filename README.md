# Queue Up
A site for hosting Lan parties

# Local development
For working on this project locally a few steps are nessesary.

## Ports
Knowing which ports to use for a given site or service is important, see the kind.config file. Look through the k8 files if something is amiss or does not work as it should.

## Dependencies
The project relies on a few external services

- Kind
- Gum
- External Kubernetes resources through Helm
  - Bitwarden secret

### kind
[Kind](https://kind.sigs.k8s.io) is a service that allows for running a local kubernetes cluster in a docker container. Check out the provided link to see how to install for your system.

### Gum
[Gum](https://github.com/charmbracelet/gum) is a application that can provide pretty cli input and output. It is used in combination with out bash scripts. Checkout the github repo on how to install for your system.

### Helm charts
Some of the resources used in this project are provided via Kubernetes package manager [Helm](https://helm.sh). Check out their website on how to install for your system.

Whenever you install a chart through Helm, remeber to update, see the provided cli commands in the next sections.

#### Bitwarden Secrets
[Bitwarden Secrets](https://bitwarden.com/products/secrets-manager/) allows for centralizing sensitive information and environment variables. It has easy setup with Kubernetes but you will need to install the chart through helm.

```bash
helm repo add bitwarden https://charts.bitwarden.com/
helm repo update
```
