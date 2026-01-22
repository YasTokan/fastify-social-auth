export type CreateUserBody = {
  name: string;
  email: string;
  password: string;
  age?: number;
  language?: string;
  gender?: string;
  avatar?: string;
};