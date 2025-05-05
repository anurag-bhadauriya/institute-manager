# uni-varsity

## Pre-requisites
1. Install nvm, node, npm via script
2. Install Docker, Docker compose
3. Install nestjs ( npm i -g @nestjs/cli )

## Start all the necessary services
docker-compose up -p unm

## Remove docker volumes that are no longer associated with a container
docker volume rm $(docker volume ls -q --filter dangling=true)


## Created Resources Link by docker container
1. Redis Insights : http://localhost:5540/
2. Redis: http://localhost:6379/
3. Postgres: http://localhost:5432/ postgres:postgres
4. Rabbitmq: http://localhost:5672/
5. RabbitMq Management: http://localhost:15672/  : guest/guest
6. Hashicorp Vault: http://localhost:8200/


## DEFINED Parameters for launch-univarsity.sh
   --development
   --enable-logs
   --clean-resources

===========================================================================================

1. docker build -f Docker/api_service.Dockerfile  -t uni-varsity_api_service .&> build.log
   docker run -it --rm uni-varsity_api_service /bin/bash

docker rm unm_api-service; docker rmi backend-unm_api-service

docker exec -it uni-varsity_api-service bash

docker container prune -f
docker volume prune -f


Stream Docker logs:
   docker logs -f <container_id_or_name>

Launch Scripts with different parameters:
   ./launch-univarsity.sh development

======================================
docker image inspect {imageid or name:tag} --format {{.Config.Volumes}}
docker image inspect 6a27e38d97d0 --format {{.Config.Volumes}}

=========================================================================================
# Step 1: Infra setup ( Docker ignore not working )
- Final Logs saying describing the links of the services that have been started
- Final logs saying how to peek & check the logs of the services
- Run launch-university in detatch mode to start the service with project name
- Run launch-university in detatch mode to stop the service with project name
- Run launch-university in detatch mode to clean up all the resources of the project
- Insert Vault Secrets at Launch (if they don't exist)
# Step 2: Clean up all the resources
# Step 2: DB Initialization
# Step 3: Migration Script for db when we do launch-univarsity.
# Step 4: 

=========================================================================================