import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { BrandsService, Brand } from "../../core/api/brands.service";
import { DraftsService } from "../../core/api/drafts.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Create Draft</h2>

    <div *ngIf="brands.length===0">No brands yet. Create one first.</div>

    <label>Brand
      <select [(ngModel)]="brandId">
        <option *ngFor="let b of brands" [value]="b.id">{{b.name}}</option>
      </select>
    </label>
    <br/>

    <label>Brief<br/>
      <textarea [(ngModel)]="brief" rows="6" cols="60"></textarea>
    </label>
    <br/>

    <label>Style <input [(ngModel)]="style"></label><br/>
    <label>Length (sec) <input type="number" [(ngModel)]="lengthSec"></label><br/>
    <label>Goal <input [(ngModel)]="goal"></label><br/>

    <button (click)="create()">Create</button>
  `
})
export class DraftCreateComponent {
  brands: Brand[] = [];
  brandId = "";
  brief = "";
  style = "UGC";
  lengthSec = 20;
  goal = "Awareness";

  constructor(
    private brandsApi: BrandsService,
    private draftsApi: DraftsService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.brands = await this.brandsApi.list();
    this.brandId = this.brands[0]?.id ?? "";
  }

  async create() {
    const draft = await this.draftsApi.create({
      brandId: this.brandId,
      brief: this.brief,
      style: this.style,
      lengthSec: this.lengthSec,
      goal: this.goal,
    });
    await this.router.navigateByUrl(`/drafts/${draft.id}`);
  }
}
