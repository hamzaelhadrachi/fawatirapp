import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {CustomHttpResponse, Profile} from '../interface/appstates';
import {User} from "../interface/user";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly server: string = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  login$ = (email: string, password: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .post<
          CustomHttpResponse<Profile>
        >(`${this.server}/user/login`, {email, password})
        .pipe(tap(console.log), catchError(this.handleError))
    );

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      if (error.error.reason) {
        errorMessage = error.error.reason;
        console.log(errorMessage);
      } else {
        errorMessage = `Server-side error: ${error.status} - ${error.message}`;
      }
    }
    return throwError(() => errorMessage);
  }

  verifyCode$ = (email: string, code: string) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<
          CustomHttpResponse<Profile>
        >(`${this.server}/user/verify/code/${email}/${code}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  profile$ = () =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .get<
          CustomHttpResponse<Profile>
        >(`${this.server}/user/profile`,{headers: new HttpHeaders().set('Authorization','Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIiLCJhdWQiOiIiLCJpYXQiOjE3OTE5MjI4MzUsInN1YiI6IjQiLCJBdXRob3JpdGllcyI6WyJSRUFEOlVTRVIiLCJSRUFEOkNVU1RPTUVSIl0sImV4cCI6MTc5MTkyNDYzNX0.VIY3P_lURXLaGhSrdvzLi2Gfe8bpefGyMa2Z0JEvzrWUn5UDkf2h9I6R88D8ebLZtBI28cfsiDwQanmFHekwqA')})
        .pipe(tap(console.log), catchError(this.handleError))
    );
  update$ = (user:User) =>
    <Observable<CustomHttpResponse<Profile>>>(
      this.http
        .patch<
          CustomHttpResponse<Profile>
        >(`${this.server}/user/update`,user,{headers: new HttpHeaders().set('Authorization','Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIiLCJhdWQiOiIiLCJpYXQiOjE3OTE5MjI4MzUsInN1YiI6IjQiLCJBdXRob3JpdGllcyI6WyJSRUFEOlVTRVIiLCJSRUFEOkNVU1RPTUVSIl0sImV4cCI6MTc5MTkyNDYzNX0.VIY3P_lURXLaGhSrdvzLi2Gfe8bpefGyMa2Z0JEvzrWUn5UDkf2h9I6R88D8ebLZtBI28cfsiDwQanmFHekwqA')})
        .pipe(tap(console.log), catchError(this.handleError))
    );
}
