import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/article.service';
import { Article } from 'src/app/models/article';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html'
})
export class  ArticleListComponent implements OnInit {
  articleList: Article[] = [];

  constructor(public articleService: ArticleService) {}

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.articleList = this.articleService.getArticles();
  }
}
