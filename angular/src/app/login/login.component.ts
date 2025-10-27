import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
        auth_url = environment.auth_url;
        repo_url = 'https://github.com/d-r-e/rncp';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authService: AuthService
	) {}

	ngOnInit(): void {
		// Redirect to home if already logged in
		if (this.authService.isLoggedIn()) {
			this.router.navigate(['/rncp']);
			return;
		}

		this.route.queryParams.subscribe(params => {
			if (params['code']) {
				this.authService.login(params['code']);
				this.router.navigate(['/rncp']);
			}
		});
	}

	isLoggedIn() {
		return this.authService.isLoggedIn();
	}

	login() {
		window.location.href = this.auth_url;
	}
}
