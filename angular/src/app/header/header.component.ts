import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Me } from '../models/me';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './header.component.html',
	styleUrl: './header.component.css',
})
export class HeaderComponent {
	title = 'RNCP';
	login: string | null = null;
	me?: Me;
	level: number = 0;

	constructor(
		public authService: AuthService,
		private router: Router
	) {}

	isLoggedIn() {
		return this.authService.isLoggedIn();
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}

	get currentLanguage() {
		return this.authService.getLanguage();
	}

	changeLanguage(target: EventTarget | null) {
		if (target !== null) {
			this.authService.changeLanguage((target as HTMLInputElement).value);
		}
	}
}
