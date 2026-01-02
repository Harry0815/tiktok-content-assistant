import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { LoginComponent } from "./features/login/login.component";
import { BrandListComponent } from "./features/brands/brand-list.component";
import { DraftCreateComponent } from "./features/drafts/draft-create.component";
import { DraftDetailComponent } from "./features/drafts/draft-detail.component";

export const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "brands", component: BrandListComponent, canActivate: [authGuard] },
  { path: "drafts/new", component: DraftCreateComponent, canActivate: [authGuard] },
  { path: "drafts/:id", component: DraftDetailComponent, canActivate: [authGuard] },
  { path: "", pathMatch: "full", redirectTo: "brands" },
];
