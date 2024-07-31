#!/bin/bash -e

echo "Starting database migration..."
pushd ./drizzle/migrate
npm run db:migrate
popd
echo "Database migration completed."

echo "Starting the server..."
node server.js
echo "Server has started."
