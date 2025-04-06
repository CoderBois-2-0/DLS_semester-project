#!/bin/bash

function build_admin_organiser() {

    if [[ $build_images == 'Yes' ]]
    then
        gum log -l info "Building admin organiser"

        docker buildx build -f ./apps/admin_organiser/Dockerfile --target qu_admin_organiser_backend -t qu-admin-organiser-backend:latest .
        docker buildx build -f ./apps/admin_organiser/Dockerfile --target qu_admin_organiser_frontend -t qu-admin-organiser-frontend:latest .
        docker buildx build -f ./apps/admin_organiser/Dockerfile --target qu_admin_organiser_synchronizer_api -t qu-admin-organiser-synchronizer-api:latest .
    fi

    gum log -l info "Loading admin organiser images into kind"

    kind load docker-image qu-admin-organiser-backend:latest --name queue-up
    kind load docker-image qu-admin-organiser-frontend:latest --name queue-up
    kind load docker-image qu-admin-organiser-synchronizer-api:latest --name queue-up
}

function build_guest() {

    if [[ $build_images == 'Yes' ]]
    then
        gum log -l info "Building guest"

        docker buildx build -f ./apps/guest/Dockerfile --target qu_guest_backend -t qu-guest-backend:latest .
        docker buildx build -f ./apps/guest/Dockerfile --target qu_guest_frontend -t qu-guest-frontend:latest .
        docker buildx build -f ./apps/guest/Dockerfile --target qu_guest_synchronizer_api -t qu-guest-synchronizer-api:latest .
    fi

    gum log -l info "Loading guest images into kind"

    kind load docker-image qu-guest-backend:latest --name queue-up
    kind load docker-image qu-guest-frontend:latest --name queue-up
    kind load docker-image qu-guest-synchronizer-api:latest --name queue-up
}

function build_authenticator() {
    if [[ $build_images == 'Yes' ]]
    then
        gum log -l info "Building authenticator"

        docker buildx build -f ./apps/qu_authenticator_api/Dockerfile --target qu_authenticator_api -t qu-authenticator-api:latest .
    fi

    gum log -l info "Loading authenticator images into kind"

    kind load docker-image qu-authenticator-api:latest --name queue-up
}

options=("All" "Admin/Organiser" "Guest")
build_options=("Yes" "No" )

# Use gum to prompt the user
choice=$(gum choose "${options[@]}" --header "Which part of the system do you wish to run?")
build_images=$(gum choose "${build_options[@]}" --header "Build docker images?")

gum log -l info "Creating k8 Cluster"
kind create cluster --name queue-up --config kind.config.yaml || echo "Cluster already exists"

# setup secrets manager
helm upgrade sm-operator bitwarden/sm-operator -i --debug -n sm-operator-system --create-namespace --values ./k8/sm-values.yaml --devel
kubectl create secret generic bw-auth-token --from-literal=token="$BW_TOKEN"

if [[ $build_images == 'Yes' ]]
then
    gum log -l info "Building node image"

    docker buildx build -t qu-node:latest .
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
