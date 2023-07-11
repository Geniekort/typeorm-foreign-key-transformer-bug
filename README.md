# Minimal reproduction of a bug in TypeORM's foreign key transformer

Reproducing a bug in Typeorm where the foreign key of a table should be transformed from a class instance to a primitive value, but it is not.

## Steps to reproduce

1. Clone this repository
2. Run `yarn install`
4. Start a Postgres database on port 5432 with a database named `typeorm-foreign-key-transformer-bug`. You can use the `docker-compose.yml` file in the root of this repository to start a Postgres database in a Docker container. (`docker-compose up -d`)
3. Run `yarn start`

## Expected behavior

The `User` entity should be saved to the database, with the `id` column set to the **INTEGER!** `id` of the `User` instance, extracted from the object id.
The `Post` entity should be saved to the database, with the `userId` column set to the **INTEGER!** `id` of the `User` instance.

## Actual behavior

The `User` entity is saved.
The `Post` entity cannot be saved, but this error is thrown:

```
QueryFailedError: invalid input syntax for type integer: "{"id":"15"}"
    at PostgresQueryRunner.query (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/driver/postgres/PostgresQueryRunner.ts:299:19)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async InsertQueryBuilder.execute (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/query-builder/InsertQueryBuilder.ts:163:33)
    at async SubjectExecutor.executeInsertOperations (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/persistence/SubjectExecutor.ts:434:42)
    at async SubjectExecutor.execute (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/persistence/SubjectExecutor.ts:137:9)
    at async EntityPersistExecutor.execute (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/persistence/EntityPersistExecutor.ts:182:21) {
  query: 'INSERT INTO "post"("userId") VALUES ($1) RETURNING "id"',
  parameters: [ { id: '15' } ],
  driverError: error: invalid input syntax for type integer: "{"id":"15"}"
      at /Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/node_modules/pg/lib/client.js:526:17
      at processTicksAndRejections (node:internal/process/task_queues:95:5)
      at async PostgresQueryRunner.query (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/driver/postgres/PostgresQueryRunner.ts:249:25)
      at async InsertQueryBuilder.execute (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/query-builder/InsertQueryBuilder.ts:163:33)
      at async SubjectExecutor.executeInsertOperations (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/persistence/SubjectExecutor.ts:434:42)
      at async SubjectExecutor.execute (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/persistence/SubjectExecutor.ts:137:9)
      at async EntityPersistExecutor.execute (/Users/davidkortleven/code/exp/typeorm-foreign-key-transformer-bug/typeorm-foreign-key-transformer-bug/src/persistence/EntityPersistExecutor.ts:182:21) {
    length: 149,
    severity: 'ERROR',
    code: '22P02',
    detail: undefined,
    hint: undefined,
    position: undefined,
    internalPosition: undefined,
    internalQuery: undefined,
    where: "unnamed portal parameter $1 = '...'",
    schema: undefined,
    table: undefined,
    column: undefined,
    dataType: undefined,
    constraint: undefined,
    file: 'numutils.c',
    line: '232',
    routine: 'pg_strtoint32'
  },
  length: 149,
  severity: 'ERROR',
  code: '22P02',
  detail: undefined,
  hint: undefined,
  position: undefined,
  internalPosition: undefined,
  internalQuery: undefined,
  where: "unnamed portal parameter $1 = '...'",
  schema: undefined,
  table: undefined,
  column: undefined,
  dataType: undefined,
  constraint: undefined,
  file: 'numutils.c',
  line: '232',
  routine: 'pg_strtoint32'
}
```

Here we observe that the transformer on the ID property of the User entity is not performed, since the plain object is tried to put into the database, instead of the primitive value of the `id` property.