import { Injectable } from '@angular/core';
import { Article } from '../models/article';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';

const BACKEND_URL = environment.apiUrl + 'articles';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private isHomeUpdated = new Subject<boolean>();
  isUser = false;
  articles: Article[] = [];
  searchResults: Article[];
  private articlesUpdated = new Subject<Article[]>();

  constructor(public router: Router,
              private http: HttpClient,
              private authService: AuthService) {}

  addArticle(title: string, authors: string, tags: string[], content: string, summary: string) {
    const article: Article = {
      id: null,
      title: title,
      authors: authors,
      content: content,
      summary: summary,
      categories: tags,
      creator: null
    };
    this.http.post<{message: string, article: any}>(BACKEND_URL, article)
      .subscribe((response) => {
        this.articles.push(article);
        this.articlesUpdated.next([...this.articles]);
        this.router.navigate(['display', response.article._id]);
      });
  }

  getIsHomeUpdateListener() {
    return this.isHomeUpdated.asObservable();
  }

  getArticleUpdateListener() {
    return this.articlesUpdated.asObservable();
  }

  getArticleById(id: string) {
    return this.http.get<{article: any}>(BACKEND_URL + '/' + id);
  }

  updateArticle(id: string, title: string, authors: string, tags: string[], content: string, summary: string) {
    const article: Article = {
      id: id,
      title: title,
      authors: authors,
      content: content,
      summary: summary,
      categories: tags,
      creator: null
    };
    this.http.put(BACKEND_URL + '/' + id, article)
      .subscribe((res) => {
        const updatedArticles = [...this.articles];
        const oldIdx  = updatedArticles.findIndex(p => p.id === article.id);
        updatedArticles[oldIdx] = article;
        this.articles = updatedArticles;
        this.articlesUpdated.next([...this.articles]);
        this.router.navigate(['display', article.id]);
      });
  }

  getArticleByTitle(title: string) {
    return this.http.get<{article: any[]}>(BACKEND_URL + '/?title=' + title);
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
    this.http.get<{message: string, articles: any}>(BACKEND_URL)
      .pipe(map((response) => {
        return response.articles.map(article => {
          return {
            id: article._id,
            title: article.title,
            authors: article.authors,
            content: article.content,
            summary: article.summary,
            creator: article.creator,
            categories: article.categories
            };
        });
      }))
      .subscribe((modifiedArticles) => {
        this.articles = modifiedArticles;
        this.articlesUpdated.next([...this.articles]);
      });
  }

  deleteArticle(id: string) {
    this.http.delete(BACKEND_URL + '/' + id)
      .subscribe(() => {
        this.articles = this.articles.filter(article => article.id !== id);
        this.articlesUpdated.next([...this.articles]);
        this.router.navigate(['/']);
      }, () => {
        this.router.navigate(['/']);
      });
  }

  searchArticles(title: string) {
    if (title.length < 3) {
      return of([]);
    }
    return this.http.get<any[]>(BACKEND_URL + '/?title=' + title)
    .pipe(map(response => {
      return response.map(article => {
        return {
          id: article._id,
          title: article.title,
          authors: article.authors,
          content: article.content,
          summary: article.summary,
          creator: article.creator,
          categories: article.categories
          };
      });
    }));
  }

  headerUpdate(isHome: boolean) {
    this.isHomeUpdated.next(isHome);
  }

  allowUser(accessEmail: string, articleID: string) {
    console.log('allowUser in Article Service');
    this.authService.isUser(accessEmail)
      .subscribe(response => {
        this.isUser = response.isUser;
        if (this.isUser) {
          console.log('LETS ADD THIS USER TO THE LIST OF CREATORS FOR THIS ARTICLEID');
          this.http.post<{message: string}>(BACKEND_URL + '/invite/' + articleID, {accessEmail: accessEmail})
            .subscribe(res => {
              console.log(res.message);
            });
        } else {
          console.log('Cannot give access because the user is not signed up. Make sure the invitee is signed up');
        }
      });
  }
}
