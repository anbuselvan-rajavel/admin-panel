#!/bin/sh

# Run Prisma migrations
npx prisma migrate deploy

# Start Next.js application
node server.js