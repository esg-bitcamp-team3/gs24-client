export interface SignupForm {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
}

export interface UpdateUser {
  name: string;
  phone: string;
}
