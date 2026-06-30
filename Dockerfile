# Stage 1: Build
FROM public.ecr.aws/docker/library/node:20-alpine AS builder

WORKDIR /app

# Copy only dependency files first
COPY package.json package-lock.json ./

# Install all deps
RUN npm ci

# Copy source code
COPY . .

# Pass build arguments to environment variables for Next.js build
ARG NEXT_PUBLIC_API_URL
ARG BACKEND_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_VAPID_KEY

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV BACKEND_URL=$BACKEND_URL
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_VAPID_KEY=$NEXT_PUBLIC_FIREBASE_VAPID_KEY

# Build the Next.js application
RUN NEXT_STANDALONE=true npm run build

# Stage 2: Production Runtime (Optimized to be <120MB)
FROM public.ecr.aws/docker/library/alpine:3.19 AS runner

WORKDIR /app

# Install Node.js without npm/yarn to keep the image extremely lightweight (~60MB total base)
RUN apk add --no-cache nodejs

# Create non-root node user and group
RUN addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node
USER node

# Copy only what Next.js needs to run as a server
COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static

# Expose app port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js Node.js server
CMD ["node", "server.js"]
