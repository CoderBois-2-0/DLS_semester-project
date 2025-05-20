kubectl apply -f authenticator.yaml 
kubectl apply -f message_broker.yaml
kubectl apply -R -f admin_organiser 

kubectl apply -f grafana.yaml 