#!/bin/bash

# Set the namespace to use
NAMESPACE="queue-up"

# Function to tear down resources in the cluster
gum log -l info "Removing resource"

# Delete the deployment
kubectl delete --all deployments -n $NAMESPACE
kubectl delete --all services -n $NAMESPACE
kubectl delete namespace $NAMESPACE

# Verify that resources are deleted
kubectl get all -n $NAMESPACE

gum log -l info "Deleting cluster!"

# Optionally, delete the entire cluster (if you want)
kind delete cluster --name queue-up
