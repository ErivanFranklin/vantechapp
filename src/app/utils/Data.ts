import {Injectable} from '@angular/core';
import {User} from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class Data{
  constructor() {
  }

  createUserFormData(loggedInUserName: string, user: User, profileImage: File): FormData{
    const formData = new FormData();
    formData.append('currentUserName', loggedInUserName);
    formData.append('firstName', user.firstName);
    formData.append('firstName', user.lastName);
    formData.append('userName', user.userName);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.isActive));
    formData.append('isNonLocked', JSON.stringify(user.isNotLocked));
    return formData;
  }
}
