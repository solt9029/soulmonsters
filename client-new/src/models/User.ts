import { Record } from 'immutable';
import { type User as FirebaseUser } from 'firebase/auth';

export interface UserInterface {
  data: FirebaseUser | null;
  error: Error | null | unknown;
  isLoading: boolean;
}

export default class User extends Record<UserInterface>(
  {
    data: null,
    error: null,
    isLoading: false,
  },
  'User'
) {
  startLoading(): User {
    return new User({
      isLoading: true,
    });
  }
  doneLogin(data: FirebaseUser): User {
    return new User({ data });
  }
  doneLogout(): User {
    return new User();
  }
  failedLogin(error: unknown): User {
    return new User({ error });
  }
  failedLogout(error: unknown): User {
    const data = this.data;
    return new User({ error, data });
  }
  initialize(): User {
    if (this.isLoading || this.error !== null) {
      return new User();
    }
    return this;
  }
}
