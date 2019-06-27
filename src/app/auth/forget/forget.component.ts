import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onForget(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      return;
    }
    console.log(form.value.email);
    this.authService.forgetPassword(form.value.email);
  }
}
