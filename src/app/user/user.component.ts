import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../service/authentication.service';
import {Router} from '@angular/router';
import {BehaviorSubject, Subscription} from 'rxjs';
import {User} from '../model/User';
import {UserService} from '../service/user.service';
import {NotificationType} from '../enum/notification-type.enum';
import {NotificationService} from '../service/notification.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';
import {UserDialogComponent} from '../template/user-dialog/user-dialog.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['profileImageUrl', 'userId', 'firstName', 'lastName', 'username', 'email', 'status', 'actions'];
  value = 'Search...';

  private titleSubject = new BehaviorSubject<string>('User');
  public titleAction$ = this.titleSubject.asObservable();
  public users: User[];
  private refreshing: boolean;
  private subscription: Subscription[] = [];

  constructor(private authenticationService: AuthenticationService, private router: Router,
              private userService: UserService, private notificationService: NotificationService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {
      this.router.navigateByUrl('/user/management');
      this.getUsers(true);
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  changeTitle(title: string) {
    this.titleSubject.next(title);
  }

  getUsers(showNotification: boolean) {
    this.refreshing = true;
    this.subscription.push(
      this.userService.getUsers().subscribe(
        (response: User[]) => {
          this.userService.setUsersToLocalStorage(response);
          this.users = response;
          this.refreshing = false;
          if (showNotification) {
            this.sendNotification(NotificationType.SUCCESS, `${response.length} user(s) loaded successfully`);
          }
        }, (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
          this.sendNotification(NotificationType.ERROR, errorResponse.error.message);
          this.refreshing = false;
        })
    );
  }

  private sendNotification(notificationType: NotificationType, message: string) {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred.Please try again');
    }
  }

  openDialog(user: User, edit: boolean) {
    const dialogRefs = this.dialog.open(UserDialogComponent, {
      data: {
        user: user,
        edit: edit
      }
    });
  }

  delete(user: User){
    console.log(user.id);
  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => {
      sub.unsubscribe();
    });
  }

}

