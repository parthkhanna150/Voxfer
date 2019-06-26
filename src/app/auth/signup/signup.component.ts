import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onSignup(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
  }
}
