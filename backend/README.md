## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Auto Generating a migration
  ```
  npm run migration:generate --name=your_migration_name
  ```

## Creating an empty migration file
  ```
  npm run migration:create --name=your_migration_name
  ```

## Running a migration
  ```
  npm run migration:run
  ```