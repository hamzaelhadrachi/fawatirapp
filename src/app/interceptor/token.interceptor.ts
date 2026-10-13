import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, switchMap, throwError} from 'rxjs';
import {Key} from "../enum/key.enum";
import {UserService} from "../service/user.service";
import {CustomHttpResponse, Profile} from "../interface/appstates";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isTokenRefreshing:boolean = false;
  private refreshTokenSubject: BehaviorSubject<CustomHttpResponse<Profile>> = new BehaviorSubject<CustomHttpResponse<Profile>>(null);

  constructor(private userService: UserService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> | Observable<HttpResponse<unknown>> {
    if (
      request.url.includes('verify') ||
      request.url.includes('login') ||
      request.url.includes('register') ||
      request.url.includes('refresh') ||
      request.url.includes('resetpassword')
    ) {
      return next.handle(request);
    }
    return next.handle(this.addAuthTokenHeader(request, localStorage.getItem(Key.TOKEN)))
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error instanceof HttpErrorResponse && error.status === 401 && error.error.reason.includes('expired') ){
            return this.handleRefreshToken(request,next);
          }else {
            return throwError(() => error);
          }
        })
      );
  }

  private addAuthTokenHeader(request: HttpRequest<unknown>, token: string) {
    return request.clone({setHeaders: {'Authorization': `Bearer ${token}`}});
  }

  // @ts-ignore
  private handleRefreshToken(request: HttpRequest<unknown>, next: HttpHandler) {
    if(!this.isTokenRefreshing){
      console.log('Refreshing token ...');
      this.isTokenRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.userService.refreshToken().pipe(
        switchMap((response) => {
          console.log('Token refresh Response ...', response);
          this.isTokenRefreshing = false;
          this.refreshTokenSubject.next(response);
          console.log('New Token Received : ', response.data.access_token);
          console.log('Sending original Request : ', request);

          return next.handle(this.addAuthTokenHeader(request,response.data.access_token));
        })
      );
    }else {
      this.refreshTokenSubject.pipe(
        switchMap((response) => {
          return next.handle(this.addAuthTokenHeader(request,response.data.access_token));
        })
      )
    }
  }
}
