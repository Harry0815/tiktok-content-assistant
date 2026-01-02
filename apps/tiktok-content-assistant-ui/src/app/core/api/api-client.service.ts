import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ApiClient {
  baseUrl = "http://localhost:3000";

  async request<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem("token");
    const headers: any = {
      "Content-Type": "application/json",
      ...(opts.headers ?? {}),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(this.baseUrl + path, { ...opts, headers });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json() as Promise<T>;
  }
}
