variable "QUEUE_UP_REG_TOKEN" {
    default = null
}

group "admin_organiser" {
    targets = [
        "qu_admin_organiser_backend",
        "qu_admin_organiser_frontend",
        "qu_admin_organiser_synchronizer_api"
    ]
}

group "guest" {
    targets = [
        "qu_guest_backend",
        "qu_guest_frontend",
        "qu_guest_synchronizer_api"
    ]
}

target "qu_node" {
    dockerfile = "./Dockerfile"
    context = "."
    tags = ["qu_node:latest"]
}

target "qu_authenticator_api" {
    dockerfile = "./apps/qu_authenticator_api/Dockerfile"
    context = "."
    tags = ["qu-authenticator-api:latest"]
}

target "qu_admin_organiser_backend" {
    dockerfile = "./apps/admin_organiser/qu_admin_organiser_backend/Dockerfile"
    context = "."
    tags = ["qu-admin-organiser-backend:latest"]
    secret = [
        { type = "env", id = "QUEUE_UP_REG_TOKEN" }
    ]
}

target "qu_admin_organiser_frontend" {
    dockerfile = "./apps/admin_organiser/qu_admin_organiser_frontend/Dockerfile"
    context = "."
    tags = ["qu-admin-organiser-frontend:latest"]
}

target "qu_admin_organiser_synchronizer_api" {
    dockerfile = "./apps/admin_organiser/qu_admin_organiser_synchronizer_api/Dockerfile"
    context = "."
    tags = ["qu-admin-organiser-synchronizer:latest"]
    secret = [
        { type = "env", id = "QUEUE_UP_REG_TOKEN" }
    ]
}

target qu_guest_backend {
    dockerfile = "./apps/guest/qu_guest_backend/Dockerfile"
    context = "."
    tags = ["qu-guest-backend:latest"]
    secret = [
        { type = "env", id = "QUEUE_UP_REG_TOKEN" }
    ]
}

target "qu_guest_frontend" {
    dockerfile = "./apps/guest/qu_guest_frontend/Dockerfile"
    context = "."
    tags = ["qu-guest-frontend:latest"]
}

target "qu_guest_synchronizer_api" {
    dockerfile = "./apps/guest/qu_guest_synchronizer_api/Dockerfile"
    context = "."
    tags = ["qu-guest-synchronizer-api:latest"]
    secret = [
        { type = "env", id = "QUEUE_UP_REG_TOKEN" }
    ]
}
