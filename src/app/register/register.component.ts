import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../service/authentication.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../model/User';
import {Subscription} from 'rxjs';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {NotificationType} from '../enum/notification-type.enum';
import {NotificationService} from '../service/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private authenticationService: AuthenticationService,
              private notificationService: NotificationService) {
  }

  private subscriptions: Subscription[] = [];
  loading = false;
  errorMessage = '';
  error = false;


  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    ])
  });

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
    } else {
      this.router.navigateByUrl('/register');
    }
  }


  submit(user: User) {
    if (this.form.valid) {
      this.loading = true;
      this.subscriptions.push(
        this.authenticationService.register(user).subscribe(
          (response: User) => {
            this.loading = false;
            this.sendNotification(NotificationType.SUCCESS, `A new account was created success ${user.userName}. Please check your email to get the password`);
          }, (errorResponse: HttpErrorResponse) => {
            this.loading = false;
            this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          })
      );
    } else {
      this.error = true;
      this.errorMessage = 'Username or password invalid';
    }
  }

  private sendNotification(notificationType: NotificationType, message: string) {
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
