import { Router } from 'express';

interface ApiRoutes {
  versionPrefix: 'v1';
  pathPrefix: 'user';
  router: Router;
}

export type { ApiRoutes };
