ENV_FILE = ./deploy/.env

.PHONY: all backend web

all: backend web

backend:
	@echo "Building backend..."
	@cp ./deploy/docker-compose.yml .
	@cp ./deploy/Dockerfile-backend .
	@podman-compose --env-file ${ENV_FILE} up -d redis backend

web:
	@echo "Building web..."
	@cp ./deploy/docker-compose.yml .
	@cp ./deploy/Dockerfile-web .
	@podman-compose --env-file ${ENV_FILE} up -d web

clean:
	@echo "Cleaning..."
	@rm -f docker-compose.yml Dockerfile-backend Dockerfile-web
	@podman images | grep '<none>' | awk '{print $$3}' | xargs --no-run-if-empty podman rmi -f
	@echo "Done!"