// types.ts
export interface User {
  id: string;
  email: string;
  username: string;
  fullname: string;
}

export interface AuthContextType {
  user: User | null;
}
