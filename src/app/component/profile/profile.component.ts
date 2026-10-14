import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {UserService} from "../../service/user.service";
import {DataState} from "../../enum/datastate.enum";
import {State} from "../../interface/state";
import {CustomHttpResponse, Profile} from "../../interface/appstates";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileState$: Observable<State<CustomHttpResponse<Profile>>>;
  private dataSubject = new BehaviorSubject<CustomHttpResponse<Profile>>(null);

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  readonly DataState = DataState;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.profileState$ = this.userService.profile$()
      .pipe(
        map(response => {
          console.log(response)
          this.dataSubject.next(response);
          return {
            dataState: DataState.LOADED, appData: response
          };
        }),
        startWith({dataState: DataState.LOADING}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR, appData: this.dataSubject.value, error})
        })
      )
  }
  updateProfile(profileForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.update$(profileForm.value)
      .pipe(
        map(response => {
          console.log(response)
          this.dataSubject.next({...response, data: response.data});
          this.isLoadingSubject.next(false);
          return {
            dataState: DataState.LOADED, appData: this.dataSubject.value
          };
        }),
        startWith({dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({dataState: DataState.LOADED, appData: this.dataSubject.value, error})
        })
      )
  }

  updatePassword(passwordForm: NgForm): void {
    this.isLoadingSubject.next(true);
    if (passwordForm.value.newPassword === passwordForm.value.confirmNewPassword) {
      this.profileState$ = this.userService.updatePassword$(passwordForm.value)
        .pipe(
          map(response => {
            console.log(response);
            passwordForm.reset();
            this.isLoadingSubject.next(false);
            return {
              dataState: DataState.LOADED, appData: this.dataSubject.value,
            };
          }),
          startWith({dataState: DataState.LOADED, appData: this.dataSubject.value }),
          catchError((error: string) => {
            this.isLoadingSubject.next(false);
            passwordForm.reset();
            return of({dataState: DataState.LOADED, appData: this.dataSubject.value, error})
          })
        )
    }else{
      passwordForm.reset();
      this.isLoadingSubject.next(false);
    }
  }

  updateRole(roleForm: NgForm): void {
    this.isLoadingSubject.next(true);
    this.profileState$ = this.userService.updateRoles$(roleForm.value.roleName)
      .pipe(
        map(response => {
          console.log(response)
          this.dataSubject.next({...response, data: response.data});
          this.isLoadingSubject.next(false);
          return {
            dataState: DataState.LOADED, appData: this.dataSubject.value
          };
        }),
        startWith({dataState: DataState.LOADED, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoadingSubject.next(false);
          return of({dataState: DataState.LOADED, appData: this.dataSubject.value, error})
        })
      )
  }

}
