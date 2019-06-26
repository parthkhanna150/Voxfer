import { Injectable } from '@angular/core';
import { Article } from '../models/article';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  articles: Article[] = [];
  private articlesUpdated = new Subject<Article[]>();

  constructor(public router: Router,
              private http: HttpClient) {}

  addArticle(title: string, tags: string[], content: string) {
    const article: Article = {
      id: null,
      title: title,
      content: content,
      categories: tags
    };
    this.http.post<{message: string}>('http://localhost:3000/api/articles', article)
      .subscribe((response) => {
        console.log(response.message);
        this.articles.push(article);
        this.articlesUpdated.next([...this.articles]);
        this.router.navigate(['/']);
      });
  }

  getArticleUpdateListener() {
    return this.articlesUpdated.asObservable();
  }

  getArticleById(id: string) {
    return this.http.get<{article: any}>('http://localhost:3000/api/articles/' + id);
  }

  updateArticle(id: string, title: string, tags: string[], content: string) {
    const article: Article = {
      id: id,
      title: title,
      content: content,
      categories: tags
    };
    // console.log(article);

    this.http.put('http://localhost:3000/api/articles/' + id, article)
      .subscribe((res) => {
        console.log(res);
        const updatedArticles = [...this.articles];
        const oldIdx  = updatedArticles.findIndex(p => p.id === article.id);
        updatedArticles[oldIdx] = article;
        this.articles = updatedArticles;
        this.articlesUpdated.next([...this.articles]);
        this.router.navigate(['/']);
      });
  }

  getArticleByTitle(title: string) {
    const article: Article =  {...this.articles.find((item) => item.title === title)};
    return article;
  }

  addIdsH4s(content: string) {
    let idx = 0;
    let prev = 0;
    let newContent = '';
    for (let i = 0; i < content.length - 4; i++) {
      if (content.substring(i, i + 4) === '<h3>') {
        newContent += content.substring(prev, i);
        newContent += '<h3 id="' + idx + '">';
        prev = i + 4;
        idx++;
      }
    }
    newContent += content.substring(prev);
    return newContent;
  }

  getArticles() {
    this.http.get<{message: string, articles: any}>('http://localhost:3000/api/articles')
      .pipe(map((response) => {
        return response.articles.map(article => {
          return {
            id: article._id,
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
  }
}
