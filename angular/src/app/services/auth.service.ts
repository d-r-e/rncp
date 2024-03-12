import { EventEmitter, Injectable } from '@angular/core';
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
  private expires_at: string | null = null;

  public onLanguageChange$: EventEmitter<string> = new EventEmitter<string>();

  constructor(
	private http: HttpClient,
	private router: Router) {
    this.loadInitialData();
  }

  login(code: string): void {
    const url = `${this.auth_url}/callback?code=${code}`;
    this.http.get(url).subscribe({
      next: (data: any) => {
        if (data['access_token']) {
          this.token = data['access_token'];
          let expires_in = data['expires_in'];
          const expires_at = new Date();
          expires_at.setSeconds(expires_at.getSeconds() + expires_in);
          this.expires_at = expires_at.toISOString();
          if (this.token && this.expires_at)
          {
            localStorage.setItem('expires_at', this.expires_at);
            localStorage.setItem('access_token', this.token);
          }

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
    const expires_at = localStorage.getItem('expires_at');
    if (expires_at) {
      const expires = new Date(expires_at);
      if (expires < new Date()) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('me');
        return false;
      }
    }
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
    const projects = this.me?.projects_users;

    if (!projects) {
      return [];
    }

    const internships = projects.filter(projectUser =>
      projectUser.cursus_ids.includes(21) &&
      (projectUser.project.name.toLowerCase()==("internship i") || projectUser.project.name.toLowerCase() == ("internship ii")) &&
      projectUser["validated?"]
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

  getLanguage() {
	return localStorage.getItem('lang') || 'en';
  }

  changeLanguage(lang: string) {
	localStorage.setItem('lang', lang);
	this.onLanguageChange$.emit(lang);
  }
}
