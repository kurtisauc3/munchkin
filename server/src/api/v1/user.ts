import { validate } from '../../validate';
import {
  ApiV1UserIsMyUsernameRegisteredRequest,
  ApiV1UserIsMyUsernameRegisteredResponse,
  ApiV1UserIsUsernameAvailableRequest,
  ApiV1UserIsUsernameAvailableResponse,
  ApiV1UserRegisterMyUsernameRequest,
  ApiV1UserRegisterMyUsernameResponse,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN
} from '@shared';
import { Router } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { body } from 'express-validator';
import { Users } from '../../entities';
import { ApiRoutes } from '../../types';

const validateUsernameMiddleware = () =>
  validate([
    body('username', 'required').exists({ checkFalsy: true, checkNull: true }),
    body('username', 'minLength').isLength({ min: USERNAME_MIN_LENGTH }),
    body('username', 'maxLength').isLength({ max: USERNAME_MAX_LENGTH }),
    body('username', 'pattern').matches(USERNAME_PATTERN)
  ]);

const apiV1UserRoutes: ApiRoutes = {
  versionPrefix: 'v1',
  pathPrefix: 'user',
  router: Router()
    .post<ParamsDictionary, ApiV1UserIsMyUsernameRegisteredResponse, ApiV1UserIsMyUsernameRegisteredRequest>(
      '/is-my-username-registered',
      async (req, res) => {
        const { sub } = req.auth;
        const user = await Users.getBySub({ sub });
        const answer = user === null ? 'no' : 'yes';
        return res.status(200).send({ answer });
      }
    )
    .post<ParamsDictionary, ApiV1UserIsUsernameAvailableResponse, ApiV1UserIsUsernameAvailableRequest>(
      '/is-username-available',
      validateUsernameMiddleware(),
      async (req, res) => {
        const { username } = req.body;
        const user = await Users.getByUsername({ username });
        const answer = user === null ? 'yes' : 'no';
        return res.status(200).send({ answer });
      }
    )
    .post<ParamsDictionary, ApiV1UserRegisterMyUsernameResponse, ApiV1UserRegisterMyUsernameRequest>(
      '/register-my-username',
      validateUsernameMiddleware(),
      async (req, res) => {
        const { sub } = req.auth;
        const { username } = req.body;
        try {
          const { id } = await Users.createUser({ username, sub });
          return res.status(200).send({ myself: { username, sub, id } });
        } catch (error) {
          return res.sendStatus(422);
        }
      }
    )
};

export { apiV1UserRoutes };
