import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosAdapter } from 'axios';
import { electron, userData } from './electron';
import { io } from 'socket.io-client';

type SocketInstance = ReturnType<typeof io>;

interface ApiInstance {
  request<T = any>(config: AxiosRequestConfig): Promise<T>;
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

class ServerPlugin extends Phaser.Plugins.BasePlugin {
  socket: SocketInstance;
  api: ApiInstance;

  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    const instance = axios.create();
    const serverURL = electron.ipcRenderer.sendSync('serverURL');
    const baseUrl = `${serverURL}api/`;
    instance.defaults.baseURL = baseUrl;
    instance.defaults.headers.common['Authorization'] = `Bearer ${userData.accessToken}`;
    instance.defaults.headers.common['Content-Type'] = 'application/json';
    instance.interceptors.response.use(
      (response: AxiosResponse) => Promise.resolve(response.data),
      (error: AxiosError) => {
        if (error.response) {
          const { status, statusText } = error.response;
          return Promise.reject({ status, statusText });
        }
        return Promise.reject({
          status: 503,
          statusText: 'Service unavailable'
        });
      }
    );
    this.api = instance;
    this.socket = io(serverURL, {
      autoConnect: true,
      auth: {
        token: `Bearer ${userData.accessToken}`
      },
      transports: ['websocket']
    });
    this.socket.on('connect', () => console.log('[socket.io-client] Client connected'));
    this.socket.on('connect_error', (error) => console.log('[socket.io-client] Client error', error));
  }
}

export { ServerPlugin };
