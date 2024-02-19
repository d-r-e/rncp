import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    HttpClientModule,
    RouterOutlet,
    LoginComponent,
    CommonModule,
    RouterLink,
    RouterModule,
    RouterLinkActive,
    HeaderComponent
  ],
  providers: [
  ],
})
export class AppComponent {
  title = 'RNCP';
}
