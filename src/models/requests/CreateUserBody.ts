export type CreateUserBody = {
  name: string;
  email: string;
  password: string;
  age?: number;
  language?: string;
  gender?: string;
  avatar?: string;
};

export type ListQuery = {
  page?: number;  // default 1
  limit?: number; // default 20
};

export type FirebaseAuth = {
  idToken: string;
};

