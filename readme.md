# GraphQL and Deno Playground

## To run

1. Install Deno `brew install deno`
2. Install docker and docker-compose
3. `docker-compose up -d` and wait about 2 minutes for the DB to initialize
4. `docker-compose up -d` again to run the flyway migrations to setup the DB tables
5. `make seed` to seed the database information. This takes about 30 minutes on an M1 Mac. Roughly 795MB of data.
6. Visit http://localhost:8080/console to open the hasura development console.
7. Use `myadminsecretkey` to login to the console
8. Add the database with any display name. URL: `postgresql://denoman:denolover@db:5432/playground`
9. Watch all relationships

## Sample Queries

### Users with alerts

```graphql
query ListUsersWithAlerts($limit: Int = 10) {
  users(limit: $limit, order_by: {created_at: asc}) {
    email
    created_at
    first_name
    id
    last_name
    updated_at
    alerts {
      description
      created_at
      read
      updated_at
      organization {
        name
        id
      }
    }
  }
}
```
