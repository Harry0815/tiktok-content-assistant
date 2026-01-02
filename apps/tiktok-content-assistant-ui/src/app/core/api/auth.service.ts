import { Injectable } from "@angular/core";
import { ApiClient } from "./api-client.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private api: ApiClient) {}

  async login(email: string, password: string) {
    const resp = await this.api.request<{ access_token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem("token", resp.access_token);
  }

  logout() {
    localStorage.removeItem("token");
  }

  isLoggedIn() {
    return !!localStorage.getItem("token");
  }
}
