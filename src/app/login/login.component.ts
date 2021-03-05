import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import {Subscription} from 'rxjs';
import {User} from '../model/User';
import {NotificationType} from '../enum/notification-type.enum';
import {NotificationService} from '../service/notification.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {HeaderType} from '../enum/header-type-enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {


  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService) {
  }

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  private subscriptions: Subscription[] = [];
  errorMessage = '';
  loading = false;
  error = false;

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  public submit(user: User) {
    if (this.form.valid) {
      this.loading = true;
      this.subscriptions.push(
        this.authenticationService.login(user).subscribe(
          (response: HttpResponse<User>) => {
            const token = response.headers.get(HeaderType.JWT_TOKEN);
            this.authenticationService.saveToken(token);
            this.authenticationService.setUserToLocalStorage(user);
            this.router.navigateByUrl('/user/management');
            this.loading = false;
          }, (errorResponse: HttpErrorResponse) => {
            this.loading = false;
            this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message);
          })
      );
    } else {
      this.error = true;
      this.errorMessage = 'Username or password invalid';
    }
  }

  private sendErrorNotification(notificationType: NotificationType, message: string) {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred.Please try again');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
