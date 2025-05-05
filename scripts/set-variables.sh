#!/bin/bash
# # Enable printing of commands before execution
# set -x

export COMMON_NEST_CLI_VERSION=10.3.2
export API_SERVICE=api-service

# Variables related to the docker containers name

echo -e "${green_color} Setting Variables related to the docker containers names, network, volumes etc.: ${check_mark} ${reset_color}"

export DKR_COMMON_PREFIX=unm
export DKR_NETWORK=${DKR_COMMON_PREFIX}_network
export DKR_POSTGRES=${DKR_COMMON_PREFIX}_postgres
# export DKR_RABBITMQ=${DKR_COMMON_PREFIX}_rabbitmq
# export DKR_REDIS=${DKR_COMMON_PREFIX}_redis
# export DKR_REDIS_INSIGHTS=${DKR_COMMON_PREFIX}_redis_insights
# export DKR_VAULT=${DKR_COMMON_PREFIX}_vault

# Volume Names
export DKR_POSTGRES_VOLUME=${DKR_POSTGRES}_data
# export DKR_REDIS_VOLUME=${DKR_REDIS}_data
# export DKR_REDIS_INSIGHTS_VOLUME=${DKR_REDIS_INSIGHTS}_data
# export DKR_RABBITMQ_VOLUME=${DKR_RABBITMQ}_data
# export DKR_RABBITMQ_ADMIN_VOLUME=${DKR_RABBITMQ}_admin_data

# Node.js based custom containers
export DKR_API_SERVICE=${DKR_COMMON_PREFIX}_${API_SERVICE}

# Setting Default credentials
echo -e "${green_color} Setting Default credentials: ${check_mark} ${reset_color}"

export PG_DB_NAME=umanaged
export PG_DB_USER=postgres
export PG_DB_PASSWORD=postgres
# export VAULT_PWD=Vault@123
