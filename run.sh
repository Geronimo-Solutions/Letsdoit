#!/bin/bash -e

echo "Starting database migration..."
pushd ./drizzle/migrate
npm run db:migrate
popd
echo "Database migration completed."

echo "Starting the server..."
node server.js
if [ $? -ne 0 ]; then
  echo "Server failed to start"
  exit 1
fi
echo "Server has started."
