import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from 'src/app/article.service';
import { Article } from 'src/app/models/article';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html'
})
export class  ArticleListComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  private  articlesSub: Subscription;
  constructor(public articleService: ArticleService) {}

  ngOnInit() {
    this.getArticles();
    this.articlesSub = this.articleService.getArticleUpdateListener()
      .subscribe((articles: Article[]) => {
        this.articles = articles;
      });
  }

  ngOnDestroy() {
    this.articlesSub.unsubscribe();
  }

  getArticles() {
    this.articles = this.articleService.getArticles();
  }
}
