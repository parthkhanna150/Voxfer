import { Injectable } from '@angular/core';
import { Article } from './models/article';
import { articles } from './models/mock-articles';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articles: Article[] = articles;
  private articlesUpdated = new Subject<Article[]>();

  constructor(public router: Router) {}

  addArticle(title: string, author: string, tags: String[], content: string) {
    const article: Article = {
      authors: [
        {
          name: author,
          type: 'guest'
        }
      ],
      title: title,
      content: content,
      categories: tags
    };
    this.articles.push(article);
    this.articlesUpdated.next([...this.articles]);
  }

  getArticleUpdateListener() {
    return this.articlesUpdated.asObservable();
  }

  getArticle(title: string) {
    const article: Article =  this.articles.find((item) => item.title === title);
    return article;
  }

  getArticles() {
    return [...this.articles];
  }

}
