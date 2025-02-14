# Project Setup

## Environment Variables Setup

Create a `.env` file in the root directory and add the following environment variables:

```env
# MySQL Database Configuration
DATABASE_URL="mysql://username:password@host:port/database_name"

# Google OAuth Configuration
OAUTH_CLIENT_ID="your-google-oauth-client-id"
OAUTH_CLIENT_SECRET="your-google-oauth-client-secret"
OAUTH_REFRESH_TOKEN="your-google-oauth-refresh-token"
REFRESH_ACCESS_TOKEN="your-refresh-access-token"

# Email Configuration
EMAIL_SENDER="your-email@example.com"
```

## Steps to Setup

1. Copy the above `.env` content and replace the dummy values with your actual credentials.
2. Save the `.env` file in the root directory.
3. Install dependencies:
   ```sh
   npm install
   ```
4. Run database migrations (if using Prisma):
   ```sh
   npx prisma migrate deploy
   ```
5. Start the backend server:
   ```sh
   npm run dev
   ```

Your backend should now be running successfully!

By default, the referee's email ID is set to `EMAIL_SENDER` for testing purposes. You can use `EMAIL_SENDER=itsmerahulgavit@gmail.com`.
