import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PathComponent } from './path/path.component';
import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
  {
    path: '', redirectTo: 'rncp', pathMatch: 'full'
  },
  {
    path: 'rncp', component: PathComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'auth/callback', component: LoginComponent
  }
];
