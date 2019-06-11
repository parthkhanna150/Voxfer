import { Injectable } from '@angular/core';
import { Article } from './models/article';
import { articles } from './models/mock-articles';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
          level: 'guest'
        }
      ],
      title: title,
      content: content,
      categories: tags
    };
    this.http.post<{message: string}>('http://localhost:3000/api/articles/create', article)
      .subscribe((response) => {
        console.log(response.message);
        this.articles.push(article);
        this.articlesUpdated.next([...this.articles]);
      });
  }

  getArticleUpdateListener() {
    return this.articlesUpdated.asObservable();
  }

  getArticle(title: String) {
    // this.http.get<{message: String, article: any}>('http://localhost:3000/api/articles/' + title)
    // .subscribe((response) => {
    //   console.log(response.article);
    // });

    const article: Article =  this.articles.find((item) => item.title === title);
    article.content = this.addIdsH4s(article.content);
    return article;
  }

  addIdsH4s(content: string) {
    let idx = 0;
    let prev = 0;
    let newContent = '';
    for (let i = 0; i < content.length - 4; i++) {
      if (content.substring(i, i + 4) === '<h4>') {
        newContent += content.substring(prev, i);
        newContent += '<h4 id="' + idx + '">';
        prev = i + 4;
        idx++;
      }
    }
    newContent += content.substring(prev);
    return newContent;
  }

  getArticles() {
    this.http.get<{message: String, articles: any}>('http://localhost:3000/api/articles')
      .pipe(map((response) => {
        return response.articles.map(article => {
          return {
            id: article._id,
            authors: article.authors,
            title: article.title,
            content: article.content,
            categories: article.categories
            };
        });
      }))
      .subscribe((modifiedArticles) => {
        this.articles = modifiedArticles;
        this.articlesUpdated.next([...this.articles]);
      });

    // return [...this.articles];
  }

}
