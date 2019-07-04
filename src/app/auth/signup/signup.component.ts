import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ArticleService } from 'src/app/articles/article.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  signup = false;
  private authStatusSub: Subscription;

  constructor(
    public authService: AuthService,
    private articleService: ArticleService) {}

  ngOnInit() {
    this.articleService.headerUpdate(false);
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSignup(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      this.isLoading = false;
      return;
    }
    this.signup = true;
    this.authService.createUser(form.value.email, form.value.password);
  }
}
