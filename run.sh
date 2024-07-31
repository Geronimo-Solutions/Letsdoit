#!/bin/bash -e

pushd ./drizzle/migrate
pnpm run db:migrate
popd 

node server.js
