import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Me } from '../models/me';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent  implements OnInit {
	title = 'RNCP';
	login :string | null = null;
	me?: Me;
	level: number = 0;

	constructor(
		public authService: AuthService,
		private router: Router) {}

	ngOnInit(): void {

	}

	isLoggedIn(){
		return this.authService.isLoggedIn();
	}

	logout(){
		this.authService.logout();
		this.router.navigate(['/login']);
	}

	get currentLanguage() {
		return this.authService.getLanguage();
	}

	changeLanguage(event: any) {
		this.authService.changeLanguage(event.target.value);
	}
}
