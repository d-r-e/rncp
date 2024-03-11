import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./header/header.component";
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { AppModule } from './app.module';
import { AuthService } from './services/auth.service';

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
export class AppComponent implements OnInit {
	title = 'RNCP';

	constructor(
		private authService: AuthService,
		private translate: TranslateService) {
	}

	ngOnInit(): void {
		this.translate.addLangs(['fr', 'en', 'es']);
		this.translate.setDefaultLang('en');

		this.translate.use(this.authService.getLanguage() || 'en');

		this.authService.onLanguageChange$.subscribe((lang: string) => {
			this.translate.use(lang);
		});
	}
}
