import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { AppModule } from './app.module';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
	AppModule,
    HttpClientModule,
    CommonModule,
    RouterOutlet,
    LoginComponent,
    HeaderComponent
  ],
  providers: [
  ],
})
export class AppComponent {
	title = 'RNCP';

	constructor(private translate: TranslateService) {
		translate.setDefaultLang('fr');
	}
}
