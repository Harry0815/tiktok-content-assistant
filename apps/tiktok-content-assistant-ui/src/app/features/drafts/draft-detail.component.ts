import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { DraftsService } from "../../core/api/drafts.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Draft Detail</h2>

    <div *ngIf="error" style="color:red">{{error}}</div>

    <div *ngIf="draft">
      <pre>{{draft | json}}</pre>

      <button (click)="genIdeas()" [disabled]="loading">Generate Ideas</button>

      <div *ngIf="ideas">
        <h3>Ideas</h3>
        <div *ngFor="let i of ideas.ideas" style="border:1px solid #ddd; padding:8px; margin:6px 0;">
          <b>{{i.title}}</b><br/>
          <small>{{i.angle}} · {{i.format}} · {{i.target_length_seconds}}s</small><br/>
          <button (click)="genDraft(i)" [disabled]="loading">Generate Draft</button>
        </div>
      </div>

      <div *ngIf="fullDraft">
        <h3>Current Draft JSON</h3>
        <pre>{{fullDraft | json}}</pre>

        <h4>Refine</h4>
        <input style="width:520px" [(ngModel)]="instruction" placeholder="z.B. kürzer, edgy, mehr CTA"/>
        <button (click)="refine()" [disabled]="loading">Apply</button>
      </div>

      <div>
        <h3>Versions</h3>
        <button (click)="loadVersions()">Reload Versions</button>
        <ul>
          <li *ngFor="let v of versions">v{{v.version}} - {{v.notes}} - {{v.createdAt}}</li>
        </ul>
      </div>
    </div>
  `
})
export class DraftDetailComponent {
  draft: any;
  ideas: any;
  fullDraft: any;
  versions: any[] = [];
  instruction = "";
  loading = false;
  error = "";

  constructor(private route: ActivatedRoute, private draftsApi: DraftsService) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id")!;
    await this.load(id);
  }

  private async load(id: string) {
    this.draft = await this.draftsApi.get(id);
    await this.loadVersions();
  }

  async loadVersions() {
    const id = this.route.snapshot.paramMap.get("id")!;
    this.versions = await this.draftsApi.versions(id);
  }

  async genIdeas() {
    this.loading = true; this.error = "";
    try {
      const id = this.route.snapshot.paramMap.get("id")!;
      this.ideas = await this.draftsApi.generateIdeas(id);
    } catch (e: any) {
      this.error = e.message ?? String(e);
    } finally {
      this.loading = false;
    }
  }

  async genDraft(idea: any) {
    this.loading = true; this.error = "";
    try {
      const id = this.route.snapshot.paramMap.get("id")!;
      this.fullDraft = await this.draftsApi.generateDraft(id, idea);
      await this.loadVersions();
    } catch (e: any) {
      this.error = e.message ?? String(e);
    } finally {
      this.loading = false;
    }
  }

  async refine() {
    this.loading = true; this.error = "";
    try {
      const id = this.route.snapshot.paramMap.get("id")!;
      this.fullDraft = await this.draftsApi.refine(id, this.instruction, this.fullDraft);
      this.instruction = "";
      await this.loadVersions();
    } catch (e: any) {
      this.error = e.message ?? String(e);
    } finally {
      this.loading = false;
    }
  }
}
