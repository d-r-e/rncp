import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-footer',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.css',
})
export class FooterComponent {
	public githubLink = 'https://github.com/d-r-e/rncp';

	constructor(
		public authService: AuthService,
		private router: Router
	) {}
}
