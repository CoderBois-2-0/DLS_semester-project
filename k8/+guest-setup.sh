kubectl apply -f authenticator.yaml
kubectl apply -f message_broker.yaml
kubectl apply -R -f guest

kubectl apply -f grafana.yaml 