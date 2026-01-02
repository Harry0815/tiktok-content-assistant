import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../core/api/auth.service";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:420px; margin:40px auto; border:1px solid #ddd; padding:16px; border-radius:8px;">
      <h2>Login</h2>

      <form (ngSubmit)="onSubmit()" #f="ngForm">
        <label style="display:block; margin:10px 0;">
          Email
          <input
            name="email"
            [(ngModel)]="email"
            type="email"
            required
            style="width:100%; padding:8px; box-sizing:border-box;"
            autocomplete="email"
          />
        </label>

        <label style="display:block; margin:10px 0;">
          Passwort
          <input
            name="password"
            [(ngModel)]="password"
            type="password"
            required
            minlength="6"
            style="width:100%; padding:8px; box-sizing:border-box;"
            autocomplete="current-password"
          />
        </label>

        <button
          type="submit"
          [disabled]="loading || !f.valid"
          style="width:100%; padding:10px; margin-top:8px;"
        >
          {{ loading ? "Logge ein..." : "Login" }}
        </button>

        <div *ngIf="error" style="color:#b00020; margin-top:10px; white-space:pre-wrap;">
          {{ error }}
        </div>
      </form>

      <div style="margin-top:12px; font-size:12px; color:#555;">
        Hinweis: Der Backend-Login erwartet einen existierenden User in der DB.
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  email = "";
  password = "";
  loading = false;
  error = "";

  constructor(private auth: AuthService, private router: Router) {}

  async ngOnInit() {
    if (this.auth.isLoggedIn()) {
      await this.router.navigateByUrl("/brands");
    }
  }

  async onSubmit() {
    this.loading = true;
    this.error = "";
    try {
      await this.auth.login(this.email.trim(), this.password);
      await this.router.navigateByUrl("/brands");
    } catch (e: any) {
      // Backend gibt evtl. JSON oder Text zurück – wir zeigen beides robust an.
      this.error = this.extractErrorMessage(e);
    } finally {
      this.loading = false;
    }
  }

  private extractErrorMessage(e: any): string {
    if (!e) return "Unbekannter Fehler";
    if (typeof e === "string") return e;
    if (e.message) return e.message;
    try {
      return JSON.stringify(e, null, 2);
    } catch {
      return "Login fehlgeschlagen";
    }
  }
}
