import { Injectable } from "@angular/core";
import { ApiClient } from "./api-client.service";

@Injectable({ providedIn: "root" })
export class DraftsService {
  constructor(private api: ApiClient) {}

  create(dto: any) {
    return this.api.request<any>("/drafts", { method: "POST", body: JSON.stringify(dto) });
  }

  get(id: string) {
    return this.api.request<any>(`/drafts/${id}`);
  }

  versions(id: string) {
    return this.api.request<any[]>(`/drafts/${id}/versions`);
  }

  generateIdeas(id: string) {
    return this.api.request<any>(`/drafts/${id}/generate-ideas`, { method: "POST" });
  }

  generateDraft(id: string, idea: any) {
    return this.api.request<any>(`/drafts/${id}/generate-draft`, {
      method: "POST",
      body: JSON.stringify({ idea_id: idea.idea_id, idea }),
    });
  }

  refine(id: string, instruction: string, currentDraft: any) {
    return this.api.request<any>(`/drafts/${id}/refine`, {
      method: "POST",
      body: JSON.stringify({ instruction, currentDraft }),
    });
  }
}
