# Soul Monsters

A soul monsters card game built with React frontend and NestJS backend.

## Project Structure

This project uses Yarn Workspaces to manage multiple packages:

- **client/** - React frontend application (soulmonsters-client)
- **server/** - NestJS backend API (soulmonsters-server)
- **schema/** - Shared GraphQL schema definitions

## Getting Started

### Prerequisites

- Node.js 22.14.0
- Yarn 1.22.22

### Installation

Install all dependencies for both client and server:

```bash
yarn install
```

This will install dependencies for the root workspace and all sub-workspaces.

## Available Scripts

### Root Level Commands

```bash
# Install all dependencies
yarn install:all

# Start development servers
yarn start:client    # Start React development server
yarn start:server    # Start NestJS development server

# Build applications
yarn build:client    # Build React app for production
yarn build:server    # Build NestJS app

# Run tests
yarn test:client     # Run client tests
yarn test:server     # Run server tests

# Lint code
yarn lint:client     # Lint client code
yarn lint:server     # Lint server code
```

### Working with Individual Workspaces

You can also run commands directly on specific workspaces:

```bash
# Run any script in the client workspace
yarn client <script-name>
# Example: yarn client start

# Run any script in the server workspace  
yarn server <script-name>
# Example: yarn server start:dev
```

### Adding Dependencies

To add dependencies to a specific workspace:

```bash
# Add to client
yarn workspace soulmonsters-client add <package-name>

# Add to server
yarn workspace soulmonsters-server add <package-name>

# Add dev dependency to client
yarn workspace soulmonsters-client add -D <package-name>
```

## Development Workflow

1. **Install dependencies**: `yarn install`
2. **Start both servers**: 
   - Terminal 1: `yarn start:server`
   - Terminal 2: `yarn start:client`
3. **Development**: The client will typically run on http://localhost:3000 and the server on http://localhost:4000

## Architecture

- **Client**: React application with Apollo GraphQL client, Redux for state management
- **Server**: NestJS application with GraphQL API, TypeORM for database access
- **Schema**: Shared GraphQL schema definitions used by both client and server

## Contributing

When making changes:
1. Run linting: `yarn lint:client` and `yarn lint:server`
2. Run tests: `yarn test:client` and `yarn test:server`
3. Ensure both client and server build successfully