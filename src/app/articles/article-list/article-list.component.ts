import { Component, OnInit, OnDestroy } from '@angular/core';
import { ArticleService } from 'src/app/articles/article.service';
import { Article } from 'src/app/models/article';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css']
})
export class  ArticleListComponent implements OnInit, OnDestroy {
  articles: Article[] = [];
  private  articlesSub: Subscription;
  isLoading = false;

  constructor(public articleService: ArticleService) {}

  ngOnInit() {
    this.isLoading = true;
    this.articleService.getArticles();
    this.articlesSub = this.articleService.getArticleUpdateListener()
      .subscribe((articles: Article[]) => {
        this.isLoading = false;
        this.articles = articles;
      });
  }

  ngOnDestroy() {
    this.articlesSub.unsubscribe();
  }
}
