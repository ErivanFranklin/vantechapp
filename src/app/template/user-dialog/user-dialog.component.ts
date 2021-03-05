import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../model/User';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  user: User;
  edit: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<UserDialogComponent>) {

    if (data) {
      this.user = data.user;
      this.edit = data.edit;
      console.log(this.user.username);
      console.log(this.user.active);
    }

  }

  ngOnInit(): void {
  }

  closeDialog(){
    this.dialogRef.close(this.user);
  }

}
