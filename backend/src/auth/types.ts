import { Socket } from 'socket.io';
import { UserData } from 'src/users/interfaces/userData.interface';

export type Authorized = {
  user: UserData;
};

export type AuthorizedSocket = Socket & Authorized;
