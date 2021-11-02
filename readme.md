# Setting up

## Database

Install postgress and create a user and a database.
Put the information in the env variable

## Env variables

-   create a file ".env" at the root.
-   its content looks like this:

    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/DBname"
    ROOT_URL="https://localhost:3000"
    COOKIE_KEYS=["currentCookieKey", "oldCookieKey"]
    BASE_URL="https://localhost:3000"
    EMAIL_USER=""
    EMAIL_PASSWORD=""
    EMAIL_HOST=""
    EMAIL_SERVICE=""
    ```

    ## Generate prisma type files

-   `npm run prisma-generate`

-   `npx prisma migrate reset --preview-feature`
    to generate tables

# commands

-   `npx prisma generate` after updating schema.prisma
-   `npx prisma migrate dev --preview-feature`
-   `npx prisma migrate reset --preview-feature`

## on prod:

-   `npx prisma migrate deploy`

# Trust self signed certs locally :

You can skip this step and click through the risk-agreement screen every time you refresh the page

    [Tutorial]([https://link](https://betterprogramming.pub/how-to-create-trusted-ssl-certificates-for-your-local-development-13fd5aad29c6))
