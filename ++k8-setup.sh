#!/bin/bash

function build_admin_organiser() {

    if [[ $build_images == 'Yes' ]]
    then
        gum log -l info "Building admin organiser"

        docker buildx bake admin-organiser
    fi

    gum log -l info "Loading admin organiser images into kind"

    kind image load qu-admin-organiser-backend:latest
    kind image load qu-admin-organiser-frontend:latest
    kind image load qu-admin-organiser-synchronizer-api:latest
}

function build_guest() {

    if [[ $build_images == 'Yes' ]]
    then
        gum log -l info "Building guest"

        docker buildx bake guest
    fi

    gum log -l info "Loading guest images into kind"

    kind image load qu-guest-backend:latest
    kind image load qu-guest-frontend:latest
    kind image load qu-guest-synchronizer-api:latest
}

function build_authenticator() {
    if [[ $build_images == 'Yes' ]]
    then
        gum log -l info "Building authenticator"

        docker buildx bake qu_authenticator_api
    fi

    gum log -l info "Loading authenticator images into kind"

    kind image load qu-authenticator-api:latest
}

options=("All" "Admin/Organiser" "Guest")
build_options=("Yes" "No" )

# Use gum to prompt the user
choice=$(gum choose "${options[@]}" --header "Which part of the system do you wish to run?")
build_images=$(gum choose "${build_options[@]}" --header "Build docker images?")

gum log -l info "Creating k8 Cluster"
kind create cluster --name queue-up --config kind.config.yaml || echo "Cluster already exists"

kubectl apply -f k8/namespace.yaml

# setup secrets manager
gum log -l info 'Setting up secrets manager'
helm upgrade sm-operator bitwarden/sm-operator -i -n queue-up --values ./secrets_manager_values.yaml --devel
kubectl create secret generic bw-auth-token -n queue-up --from-literal=token="$BW_TOKEN"
kubectl apply -f k8/secrets_manager.yaml


if [[ $build_images == 'Yes' ]]
then
    gum log -l info "Building node image"

    docker buildx bake qu_node
fi

case "$choice" in
    All)
        build_admin_organiser
        build_guest
        build_authenticator

        gum log -l info  "Applying k8 deployments and services"
        kubectl apply -f k8 -R
        ;;
    Admin/Organiser)
        build_admin_organiser
        build_authenticator

        cd ./k8
        gum log -l info  "Applying admin/organiser deployments and services"
        ./+admin-organiser-setup.sh
        ;;
    Guest)
        build_guest
        build_authenticator

        cd ./k8
        gum log -l info "Applying guest deployments and services"
        ./+guest-setup.sh
        ;;
    *)
        ;;
esac
