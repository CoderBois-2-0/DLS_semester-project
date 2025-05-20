#!/bin/bash

function build_admin_organiser() {

    if [[ $build_images == 'yes' ]]
    then
        gum log -l info "building admin organiser"

        docker buildx bake admin_organiser
    fi

    gum log -l info "loading admin organiser images into kind"

    kind load docker-image qu-admin-organiser-backend:latest --name queue-up
    kind load docker-image qu-admin-organiser-frontend:latest --name queue-up
    kind load docker-image qu-admin-organiser-synchronizer-api:latest --name queue-up
}

function build_guest() {

    if [[ $build_images == 'yes' ]]
    then
        gum log -l info "building guest"

        docker buildx bake guest
    fi

    gum log -l info "loading guest images into kind"

    kind load docker-image qu-guest-backend:latest --name queue-up
    kind load docker-image qu-guest-frontend:latest --name queue-up
    kind load docker-image qu-guest-synchronizer-api:latest --name queue-up
}

function build_authenticator() {
    if [[ $build_images == 'yes' ]]
    then
        gum log -l info "building authenticator"

        docker buildx bake qu_authenticator_api
    fi

    gum log -l info "loading authenticator images into kind"

    kind load docker-image qu-authenticator-api:latest --name queue-up
}

options=("all" "admin/organiser" "guest")
build_options=("yes" "no" )

# use gum to prompt the user
choice=$(gum choose "${options[@]}" --header "which part of the system do you wish to run?")
build_images=$(gum choose "${build_options[@]}" --header "build docker images?")

gum log -l info "creating k8 cluster"
kind create cluster --name queue-up --config kind.config.yaml || echo "cluster already exists"

kubectl apply -f k8/namespace.yaml
namespace="queue-up"

# setup secrets manager
gum log -l info 'setting up secrets manager'
helm upgrade sm-operator bitwarden/sm-operator -i -n $namespace --values ./secrets_manager_values.yaml --devel
kubectl create secret generic bw-auth-token -n $namespace --from-literal=token="$bw_token"
kubectl apply -f k8/secrets_manager.yaml

# grafana alloy
helm install --namespace $namespace alloy grafana/alloy
kubectl create configmap --namespace $namespace alloy-config "--from-file=config.alloy=./config.alloy"
helm upgrade --namespace $namespace alloy grafana/alloy -f ./grafana_alloy_values.yaml


if [[ $build_images == 'yes' ]]
then
    gum log -l info "building node image"

    docker buildx bake qu_node
fi

case "$choice" in
    all)
        build_admin_organiser
        build_guest
        build_authenticator

        gum log -l info  "applying k8 deployments and services"
        kubectl apply -f k8 -r
        ;;
    admin/organiser)
        build_admin_organiser
        build_authenticator

        cd ./k8
        gum log -l info  "applying admin/organiser deployments and services"
        ./+admin-organiser-setup.sh
        ;;
    guest)
        build_guest
        build_authenticator

        cd ./k8
        gum log -l info "applying guest deployments and services"
        ./+guest-setup.sh
        ;;
    *)
        ;;
esac
