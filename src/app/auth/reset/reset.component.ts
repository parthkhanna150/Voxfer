import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  isLoading = false;
  token: string;
  route: ActivatedRoute;
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.token = this.route.snapshot.params.token;
  }

  onReset(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      this.isLoading = false;
      return;
    }
    if (form.value.passwordNew !== form.value.passwordConfirm) {
      this.isLoading = false;
      return;
    }
    this.authService.resetPassword(form.value.passwordNew, this.token);
  }
}
