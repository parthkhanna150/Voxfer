import { Component } from '@angular/core';
import {Location} from '@angular/common';
import { NgForm } from '@angular/forms';
import { ArticleService } from 'src/app/article.service';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
})
export class ArticleCreateComponent {

  constructor(private location: Location, public articleService: ArticleService) {}

  goBack() {
    this.location.back();
  }

  onSaveArticle(title, author,  tag, content) {
    debugger
    this.articleService.addArticle(title, author, tag, content);
  }
}
