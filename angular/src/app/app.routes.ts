import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PathComponent } from './path/path.component';
import { AuthGuardService } from './services/auth-guard.service';
import { FaqComponent } from './faq/faq.component';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'rncp',
		pathMatch: 'full',
	},
	{
		path: 'rncp',
		component: PathComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'login',
		component: LoginComponent,
	},
	{
		path: 'faq',
		component: FaqComponent,
		canActivate: [AuthGuardService],
	},
	{
		path: 'auth/callback',
		component: LoginComponent,
	},
];
