import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../model/User';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public host = environment.apiUrl;
  private loggedInUsername: string;
  private token: string;
  private jwtHelper = new JwtHelperService();
  public loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/user/login`, user, {observe: 'response'});
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user/register`, user);
  }

  logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  setUserToLocalStorage(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocalStorage(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  loadToken(): void {
    this.token =  localStorage.getItem('token');
  }

  getToken(): string {
    return this.token;
  }

  isUserLoggedIn(): boolean{
    this.loadToken();
    if (this.token != null && this.token !== ''){
      if (this.jwtHelper.decodeToken(this.token).sub != null || ''){
        if (!this.jwtHelper.isTokenExpired(this.token)){
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          this.loggedIn.next(true);
          return true;
        }
      }
    } else {
      this.logOut();
      this.loggedIn.next(false);
      return false;
    }
  }
}
