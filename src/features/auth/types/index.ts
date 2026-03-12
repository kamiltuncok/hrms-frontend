export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  role: {
    id: number;
    name: string;
  };
  photoUrl?: string;
}
