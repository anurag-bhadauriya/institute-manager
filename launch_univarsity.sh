#!/bin/bash

# Build & Run Containers
build_and_run() {
    echo -e "${green_color} Running the Docker Compose File for local infra setup: ${check_mark} ${reset_color}"
    cd backend
    if "$clean_resources"; then
        rm -rf node_modules/
        docker-compose down
    else
        npm install
        docker-compose up
    fi
}


# Enable logging every step
handle_logs_enablement() {
    set -x # Enable printing of commands before execution
}

# Function to export all the variables
handle_exports() {
    source ./scripts/set-variables.sh
}

# Function to handle user input
handle_input() {
    # Parse arguments
    while [[ "$#" -gt 0 ]]; do
        case "$1" in
            --development) development=true ;;
            --clean-resources) clean_resources=true ;;
            --enable-logs) enable_logs=true ;;
            *) echo "Unknown option: $1"; exit 1 ;;
        esac
        shift
    done
}

# Handle all the asthetics related variables
handle_asthetics() {
    # Define check mark symbol
    export check_mark="\u2713"
    # Define ANSI escape codes for green color
    export green_color="\e[32m"
    # Reset color to default
    export reset_color="\e[0m"
}

# Main function
main() {
    handle_input
    handle_asthetics
    handle_exports
    handle_logs_enablement
    build_and_run
}

# Initialize Arguments with default values
development=false
clean_resources=false
enable_logs=false

# Start the script
main