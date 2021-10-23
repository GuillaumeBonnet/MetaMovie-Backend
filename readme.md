# commands

-   `npx prisma generate` after updating schema.prisma
-   `npx prisma migrate dev --preview-feature`
-   `npx prisma migrate reset --preview-feature`

## on prod:

-   `npx prisma migrate deploy`

# Trust self signed certs locally :

    [Tutorial]([https://link](https://betterprogramming.pub/how-to-create-trusted-ssl-certificates-for-your-local-development-13fd5aad29c6))

# format .env variable file

DATABASE_URL="postgresql://user:password@localhost:5432/DBname?schema=public"
COOKIE_KEYS=["currentCookieKey", "oldCookieKey"]
EMAIL_USER=""
EMAIL_PASSWORD=""
EMAIL_HOST=""
EMAIL_SERVICE=""
