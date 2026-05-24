import { apiFetch, logout } from "@/lib/api";

type TokenResponse = {
  accessToken?: string;
  refreshToken?: string;
  AccessToken?: string;
  RefreshToken?: string;
};

type RegisterResponse = {
  fullName: string;
  email: string;
  password: string;
};

export const login = async (email: string, password: string) => {
  return apiFetch<TokenResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
};

export const register = async (fullName: string, email: string, password: string) => {
  const formData = new FormData();
  formData.append("FullName", fullName);
  formData.append("Email", email);
  formData.append("Password", password);

  return apiFetch<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: formData,
  });
};

export const logoutUser = () => {
  logout();
  window.location.href = "/login";
};
