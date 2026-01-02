import { Injectable } from "@angular/core";
import { ApiClient } from "./api-client.service";

export type Brand = {
  id: string;
  name: string;
  language: string;
  tonality: string;
};

@Injectable({ providedIn: "root" })
export class BrandsService {
  constructor(private api: ApiClient) {}

  list() {
    return this.api.request<Brand[]>("/brands");
  }

  create(dto: any) {
    return this.api.request<Brand>("/brands", { method: "POST", body: JSON.stringify(dto) });
  }
}
