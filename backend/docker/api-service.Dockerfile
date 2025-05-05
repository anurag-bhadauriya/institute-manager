FROM node:20.12.2

ARG API_SERVICE
ARG NEST_CLI_VERSION

WORKDIR /usr/${API_SERVICE}
RUN npm install -g @nestjs/cli@${NEST_CLI_VERSION}
COPY ./package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev"]