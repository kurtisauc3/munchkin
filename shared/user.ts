export interface User {
  id?: number;
  sub: string;
  username: string;
}
export interface ApiV1UserIsMyUsernameRegisteredRequest {}
export interface ApiV1UserIsMyUsernameRegisteredResponse {
  answer: 'yes' | 'no';
}
export interface ApiV1UserIsUsernameAvailableRequest {
  username: string;
}
export interface ApiV1UserIsUsernameAvailableResponse {
  answer: 'yes' | 'no';
}
export interface ApiV1UserRegisterMyUsernameRequest {
  username: string;
}
export interface ApiV1UserRegisterMyUsernameResponse {
  myself: User;
}

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 16;
export const USERNAME_PATTERN = new RegExp(`^[a-zA-Z0-9]{${USERNAME_MIN_LENGTH},${USERNAME_MAX_LENGTH}}$`);
