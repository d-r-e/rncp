import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api_url = "api/auth";

  constructor(private http: HttpClient) { }

  login(code: string) {
    const url = this.api_url + "/callback?code=" + code;
    return this.http.get(url);
  }


}
