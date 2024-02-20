import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CursusEvent, Me } from '../models/me';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api_url = "api";
  auth_url = `${this.api_url}/auth`;
  public token: string | null = null;
  public me: Me | null = null;

  constructor(private http: HttpClient, private router: Router) {
    this.loadInitialData();
  }

  login(code: string): void {
    const url = `${this.auth_url}/callback?code=${code}`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        if (data['access_token']) {
          this.token = data['access_token'];
          if (this.token)
            localStorage.setItem('access_token', this.token);
          this.getMe().subscribe((data: Me) => {
            this.me = data;
            localStorage.setItem('me', JSON.stringify(this.me));
            this.router.navigate(['/rncp']);
          });
        }
      },
      error: (error) => console.error(error)
    });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getMe() {
    const headers = { 'Authorization': `Bearer ${this.token}` };
    return this.http.get<Me>(`${this.api_url}/me`, { headers });
  }

  getLevel(): number {
    if (this.me) {
      const cursus = this.me.cursus_users.find(cu => cu.cursus_id == 21);
      return cursus ? cursus.level : 0;
    }
    return 0;
  }

  getInternships() {
    // filters for projects_users where cursus_id is 21, in search for any intership
    // {
    //   "projects_users": [
    //     {
    //       "project": {
    //         "name": "Internshipxx"
    //       },
    //       "validated?": true,
    //       "cursus_ids": [21]
    //     }
    //   ]
    // }

    // Assuming 'this.me' is already populated with the user's data
    const projects = this.me?.projects_users;

    if (!projects) {
      return []; // Return an empty array if there are no projects
    }

    const internships = projects.filter(projectUser =>
      projectUser.cursus_ids.includes(21) &&
      (projectUser.project.name.toLowerCase()==("internship i") || projectUser.project.name.toLowerCase() == ("internship ii")) &&
      projectUser["validated?"] // Check if the project is validated
    );

    const internshipDetails = internships.map(projectUser => {
      return {
        name: projectUser.project.name,
        validated: projectUser["validated?"]
      };
    });
    return internshipDetails;
  }


  getProfilePicture(): string | null {
    return this.me ? this.me.image_url : null;
  }

  logout(): void {
    this.token = null;
    this.me = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('me');
  }

  private loadInitialData(): void {
    this.token = localStorage.getItem('access_token');
    const meData = localStorage.getItem('me');
    if (meData) this.me = JSON.parse(meData);
  }

  getEvents() {
    const headers = { 'Authorization': `Bearer ${this.token}` };
    return this.http.get<CursusEvent[]>(`${this.api_url}/events?user_id=${this.me?.id}`, { headers });
  }


}
