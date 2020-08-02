interface User {
  readonly emailAddress?: string;
  readonly mobile?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly dob?: string;
  readonly gender?: string;
  readonly verified?: boolean;
  readonly discount?: string;
  readonly addressLineOne?: string;
  readonly addressLineTwo?: string;
  readonly addressLineThree?: string;
  readonly city?: string;
  readonly state?: string;
  readonly pincode?: string;
  readonly country?: string;
  readonly addressId?: string;
}

interface UserSettings {
  readonly emailAddress?: string;
  readonly newPassword?: string;
  readonly currentPassword?: string;
}

export { User, UserSettings };