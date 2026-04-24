export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  role: string;
}

export interface User {
  id: number;
  email: string;
  role: {
    id: number;
    name: string;
  };
  profileImageUrl?: string;
}
