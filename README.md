# Munchkin

A multi-player card game.

# Getting Started

```bash
cd client
yarn
cd ../server
yarn
```

Also create 2 .env files (see below for an example)

# Debug with VS Code

Run the 'All' compound

# Debug without VS Code

With 3 terminals, run the following commands

```bash
cd client && yarn run start
cd client && yarn run electron
cd server && yarn run start
```

To run the optional postgres db, uncomment out the connectDb code inside server/app.ts
Then run `docker-compose up -d` in a terminal.

## ./client/.env

```
# client
PORT=3000

# server
SERVER_URL=http://localhost:4000/

# style
GAME_WIDTH=1280
GAME_HEIGHT=720
```

## ./server/.env

```
# client
CLIENT_URL=http://localhost:3000

# server
SERVER_PORT=4000

# postgres (optional if you want the server)
POSTGRES_HOST=localhost
POSTGRES_PORT=6900
POSTGRES_USER=munchkin
POSTGRES_PASSWORD=munchkin
POSTGRES_DB=munchkin
```
