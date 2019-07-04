import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ArticleService } from 'src/app/articles/article.service';

@Component({
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
  isLoading = false;

  constructor(public authService: AuthService, private articleService: ArticleService) {}

  ngOnInit() {
    this.articleService.headerUpdate(false);
  }

  onForget(form: NgForm) {
    this.isLoading = true;
    if (form.invalid) {
      this.isLoading = false;
      return;
    }
    this.authService.forgetPassword(form.value.email);
  }
}
