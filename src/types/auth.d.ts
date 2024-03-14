export interface ISignup {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IForgotPassword {
  email: string;
  role?: string;
}

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}

export interface IResetPasswordAction extends IResetPassword {
  token: string;
}

export interface IChangePasswordAction {
  oldPassword: string;
  newPassword: string;
}
