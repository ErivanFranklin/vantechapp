export class User {
  public id: number;
  public firstName: string;
  public lastName: string;
  public username: string;
  public email: string;
  public profileImage: string;
  public lastLoginDate: Date;
  public lastLoginDateDisplay: Date;
  public joinDate: Date;
  public role: string;
  public authorities: [];
  public active: boolean;
  public isNotLocked: boolean;

  constructor(firstName, lastName, userName) {
    this.firstName = '';
    this.lastName = '';
    this.username = '';
    this.email = '';
    this.role = '';
    this.authorities = [];
    this.active = false;
    this.isNotLocked = false;
  }
}
