import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  auth_url = environment.auth_url
  constructor(private route: ActivatedRoute,
    private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        console.log(params['code']);
        this.authService.login(params['code']).subscribe({
          next: data => {
            console.log(data);
            this.router.navigate(['/']);
          },
          error: error => {
            console.error(error);
          }
        });

      }
    });
  }

  login() {
    window.location.href = this.auth_url;
  }

}
