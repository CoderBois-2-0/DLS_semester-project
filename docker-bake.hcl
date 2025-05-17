variable "QUEUE_UP_REG_TOKEN" {
    default = null
}

// Github Container registry
variable "GH_CR" {
    default = "docker-image://ghcr.io/coderbois-2-0/dls_queue-up/qu-node:1"
}

variable "TAG" {
    default = "latest"
}

variable "PUSH" {
    default = false
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
    contexts = {
        qu-node = GH_CR
    }
    tags = PUSH ? ["ghcr.io/coderbois-2-0/dls_queue-up/qu-node:${TAG}", "ghcr.io/coderbois-2-0/dls_queue-up/qu-node:latest"] : ["qu-node:${TAG}"]
    
}

target "qu_authenticator_api" {
    dockerfile = "./apps/qu_authenticator_api/Dockerfile"
    context = "."
    contexts = {
        qu-node = GH_CR
    }
    tags = PUSH ? ["ghcr.io/coderbois-2-0/dls_queue-up/qu-authenticator-api:${TAG}", "ghcr.io/coderbois-2-0/dls_queue-up/authenticator-api:latest"] : ["qu-authenticator-api:latest"]
}

target "qu_admin_organiser_backend" {
    dockerfile = "./apps/admin_organiser/qu_admin_organiser_backend/Dockerfile"
    context = "."
    contexts = {
        qu-node = GH_CR
    }
    tags = PUSH ? ["ghcr.io/coderbois-2-0/dls_queue-up/qu-admin-organiser-backend:${TAG}", "ghcr.io/coderbois-2-0/dls_queue-up/qu-admin-organiser-backend:latest"] : ["qu-admin-organiser-backend:latest"]
    secret = [
        { type = "env", id = "QUEUE_UP_REG_TOKEN" }
    ]
}

target "qu_admin_organiser_frontend" {
    dockerfile = "./apps/admin_organiser/qu_admin_organiser_frontend/Dockerfile"
    context = "."
    contexts = {
        qu-node = GH_CR
    }
    tags = PUSH ? ["ghcr.io/coderbois-2-0/dls_queue-up/qu-admin-organiser-frontend:${TAG}", "ghcr.io/coderbois-2-0/dls_queue-up/qu-admin-organiser-frontend:latest"] : ["qu-admin-organiser-frontend:latest"]
}

target "qu_admin_organiser_synchronizer_api" {
    dockerfile = "./apps/admin_organiser/qu_admin_organiser_synchronizer_api/Dockerfile"
    context = "."
    contexts = {
        qu-node = GH_CR
    }
    tags = PUSH ? ["ghcr.io/coderbois-2-0/dls_queue-up/qu-admin-organiser-synchronizer:${TAG}", "ghcr.io/coderbois-2-0/dls_queue-up/qu-admin-organiser-synchronizer-api:latest"] : ["qu-admin-organiser-synchronizer-api:latest"]
    secret = [
        { type = "env", id = "QUEUE_UP_REG_TOKEN" }
    ]
}

target qu_guest_backend {
    dockerfile = "./apps/guest/qu_guest_backend/Dockerfile"
    context = "."
    contexts = {
        qu-node = GH_CR
    }
    tags = PUSH ? ["ghcr.io/coderbois-2-0/dls_queue-up/qu-guest-backend:${TAG}", "ghcr.io/coderbois-2-0/dls_queue-up/qu-guest-backend:latest"] : ["qu-guest-backend:latest"]
    secret = [
        { type = "env", id = "QUEUE_UP_REG_TOKEN" }
    ]
}

target "qu_guest_frontend" {
    dockerfile = "./apps/guest/qu_guest_frontend/Dockerfile"
    context = "."
    contexts = {
        qu-node = GH_CR
    }
    tags = PUSH ? ["ghcr.io/coderbois-2-0/dls_queue-up/qu-guest-frontend:${TAG}", "ghcr.io/coderbois-2-0/dls_queue-up/qu-guest-frontend:latest"] : ["qu-guest-frontend:latest"]
}

target "qu_guest_synchronizer_api" {
    dockerfile = "./apps/guest/qu_guest_synchronizer_api/Dockerfile"
    context = "."
    contexts = {
        qu-node = GH_CR
    }
    tags = PUSH ? ["ghcr.io/coderbois-2-0/dls_queue-up/qu-guest-synchronizer-api:${TAG}", "ghcr.io/coderbois-2-0/dls_queue-up/qu-guest-synchronizer-api:latest"] : ["qu-guest-synchronizer-api:latest"]
    secret = [
        { type = "env", id = "QUEUE_UP_REG_TOKEN" }
    ]
}
