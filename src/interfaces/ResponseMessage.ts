import {Profile} from './Profile';
import {User} from './User';

interface LoginMessageResponse {
  token?: string;
  message: string;
  user: User;
}

interface ProfileMessageResponse {
  message: string;
  token: string;
  profile: Profile;
}

export {LoginMessageResponse, ProfileMessageResponse}