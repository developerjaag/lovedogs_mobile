import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MenuController } from '@ionic/angular';

import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  @ViewChild("login_password") login_password;

  formLogin: FormGroup;
  showPassword: boolean;

  constructor(public formBuilder: FormBuilder, private menu: MenuController, private authService: AuthService) {
    this.menu.enable(false, 'first');
    this.formLogin = this.validartorsFormLogin();
  }

  ngOnInit() {}

  validartorsFormLogin() {
    return this.formBuilder.group({
      input_email: ["", [Validators.required, Validators.email]],
      input_password: ["", Validators.required]
    });
  } // end validartorsFormLogin

  changeShowPassword() {
    this.showPassword = !this.showPassword;

    if (this.showPassword) {
      this.login_password.type = "text";
    } else {
      this.login_password.type = "password";
    }
    this.login_password.setFocus();
  }

  login() {
    const email = this.formLogin.value.input_email;
    const password = this.formLogin.value.input_password;
    this.authService.loginEmailPassword(email, password);
  }

} // end class
