
export interface AuthResponse {
  token: string;
  roles: string[];
  userName: string;
}

export interface LoginRequest {
  usuario: string;
  contrasena: string;
}
