import { Injectable } from '@angular/core';
import { Article } from './models/article';
import { articles } from './models/mock-articles';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articles: Article[] = articles;
  private articlesUpdated = new Subject<Article[]>();

  constructor(public router: Router,
              private http: HttpClient) {}

  addArticle(title: string, author: string, tags: String[], content: string) {
    const article: Article = {
      id: null,
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
    debugger
    this.http.post<{message: string}>('http://localhost:3000/api/articles', article)
      .subscribe((response) => {
        console.log(response.message);
        this.articles.push(article);
        this.articlesUpdated.next([...this.articles]);
      });

  }


  getArticleUpdateListener() {
    return this.articlesUpdated.asObservable();
  }

  getArticle(title: string) {
    const article: Article =  this.articles.find((item) => item.title === title);
    return article;
  }

  getArticles() {
    this.http.get<{message: String, articles: Article[]}>('http://localhost:3000/api/articles')
      .subscribe((response) => {
        this.articles = response.articles;
        this.articlesUpdated.next([...this.articles]);
      });

    // return [...this.articles];
  }

}
