import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as jwt from 'express-jwt';
import * as http from 'http';
import * as jwksRsa from 'jwks-rsa';
import * as socketIo from 'socket.io';
import * as url from 'url';
import { apiV1UserRoutes } from './api';
import { connectPostgres } from './connectPostgres';
import { ApiRoutes } from './types';

const { AUTH0_DOMAIN, API_IDENTIFIER, SERVER_PORT, CLIENT_URL } = process.env;

class App {
  public app: express.Application;
  public hub: socketIo.Server;
  public server: http.Server;

  constructor() {
    // network defaults
    this.app = express();
    this.app.use(
      cors({
        origin: CLIENT_URL
      })
    );
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    // routing
    this.app.use(
      jwt.expressjwt({
        secret: jwksRsa.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`
        }) as jwt.GetVerificationKey,
        audience: API_IDENTIFIER,
        issuer: `https://${AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
      })
    );

    // add routes here
    const routes: Array<ApiRoutes> = [apiV1UserRoutes];
    routes.forEach(({ versionPrefix, pathPrefix, router }) => {
      this.app.use(`/api/${versionPrefix}/${pathPrefix}`, router);
    });

    // postgres
    connectPostgres
      .initialize()
      .then(() => {
        console.log('[typeorm] Postgres connected');
      })
      .catch((err) => {
        console.log('[typeorm] Postgres error', err);
      });

    // server
    this.server = http.createServer(this.app);
    this.server.listen(SERVER_PORT, () => {
      console.log(`[http.Server] Server listening on port ${SERVER_PORT}`);
    });

    // socket hub
    this.hub = new socketIo.Server(this.server, {
      cors: {
        origin: CLIENT_URL
      }
    });
    this.hub.on('connect', (socket) => {
      console.log('[socketIo.Server] Client connected');

      // add socket listeners here

      socket.on('disconnect', (reason) => {
        console.log('[socketIo.Server] Client disconnected', reason);
      });
    });
  }
}

export { App };
