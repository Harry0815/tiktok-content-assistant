import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BrandsService, Brand } from "../../core/api/brands.service";
import { FormsModule } from "@angular/forms";

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <h2>Brands</h2>
    <div style="display:flex; gap:12px; align-items:flex-start;">
      <div style="flex:1;">
        <button routerLink="/drafts/new">+ New Draft</button>
        <ul>
          <li *ngFor="let b of brands">{{b.name}} ({{b.language}})</li>
        </ul>
      </div>

      <div style="width:320px; border:1px solid #ddd; padding:12px;">
        <h3>New Brand</h3>
        <label>Name <input [(ngModel)]="name"/></label><br/>
        <label>Language <input [(ngModel)]="language"/></label><br/>
        <label>Tonality <input [(ngModel)]="tonality"/></label><br/>
        <button (click)="create()">Create</button>
      </div>
    </div>
  `
})
export class BrandListComponent {
  brands: Brand[] = [];
  name = "";
  language = "de";
  tonality = "locker, direkt";

  constructor(private brandsApi: BrandsService) {}

  async ngOnInit() {
    await this.reload();
  }

  async reload() {
    this.brands = await this.brandsApi.list();
  }

  async create() {
    await this.brandsApi.create({ name: this.name, language: this.language, tonality: this.tonality });
    this.name = "";
    await this.reload();
  }
}
