import 'Phaser';
import { ApiV1UserIsMyUsernameRegisteredRequest, ApiV1UserIsMyUsernameRegisteredResponse } from '@shared';
import { ServerPlugin } from 'src/plugins';

class MainScene extends Phaser.Scene {
  serverPlugin: ServerPlugin;
  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    this.serverPlugin = this.plugins.get('server-plugin') as ServerPlugin;
  }

  preload() {}

  async create() {
    const isMyUsernameRegistered = async (request: ApiV1UserIsMyUsernameRegisteredRequest = {}) => {
      const response = await this.serverPlugin.api.post<ApiV1UserIsMyUsernameRegisteredResponse>(
        'v1/user/is-my-username-registered',
        request
      );
      return response.answer === 'yes';
    };
    isMyUsernameRegistered();
  }

  update(): void {}
}

export { MainScene };
