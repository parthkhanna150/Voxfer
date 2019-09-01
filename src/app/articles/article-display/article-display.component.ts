import { Component, OnInit, Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { ArticleService } from 'src/app/articles/article.service';
import { Article } from 'src/app/models/article';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/auth.service';

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-article-diplay',
  templateUrl: './article-display.component.html',
  styleUrls: ['./article-display.component.css']
})
export class ArticleDisplayComponent implements OnInit, OnDestroy {
  accessEmail: string;
  userId: string;
  article: Article;
  id: string;
  isLoading = false;
  private authStatusSubs: Subscription;
  userIsAuthenticated = false;
  constructor(
    private route: ActivatedRoute,
    public articleService: ArticleService,
    private authService: AuthService) {}

    ngOnInit() {
      this.isLoading = true;
      this.userId = this.authService.getUserId();
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.id = paramMap.get('id');
          this.articleService.getArticleById(this.id)
            .subscribe((response) => {
              this.article = {
                id: response.article._id,
                title: response.article.title,
                authors: response.article.authors,
                content: response.article.content,
                summary: response.article.summary,
                categories:  response.article.categories,
                creator: response.article.creator
              };

              const menuUl = document.getElementById('navigationUL');
              while (menuUl.firstChild) {
                menuUl.removeChild(menuUl.firstChild);
              }
              this.article.content = this.articleService.addIdsH4s(this.article.content);
              this.buildSideMenu(this.article.content);

              this.userIsAuthenticated = this.authService.getIsAuth();
              this.authStatusSubs = this.authService.getAuthStatusListener()
                .subscribe(isAuthenticated => {
                  this.userIsAuthenticated = isAuthenticated;
                  this.userId  = this.authService.getUserId();
                });
              this.articleService.headerUpdate(false);
              this.isLoading = false;
        });
      });
    }

    ngOnDestroy() {
      this.authStatusSubs.unsubscribe();
    }

    buildSideMenu(content: string) {
      const doc = new DOMParser().parseFromString(content, 'text/html');
      const h3s = doc.getElementsByTagName('h3');
      const menuUl = document.getElementById('navigationUL');
      const menuLi = document.createElement('li');
      menuLi.textContent = 'Table of Contents';
      menuLi.setAttribute('style', 'text-decoration: none; color: black; padding-bottom: 1rem; font-weight: bold;');
      menuUl.appendChild(menuLi);

      const arrH3s = Array.from(h3s);

      arrH3s.forEach((h3, position) => {
// tslint:disable-next-line: no-shadowed-variable
        const menuLi = document.createElement('li');
        const menuA = document.createElement('a');
        menuA.textContent = h3.textContent;
        menuA.setAttribute('href', 'display/' + this.article.id + '#' + position);
        menuA.setAttribute('style', 'text-decoration: none; color: black;');
        menuLi.appendChild(menuA);
        menuUl.appendChild(menuLi);
      });
    }

    allowUser(accessEmail: string, articleId: string) {
      this.articleService.allowUser(accessEmail, articleId);
    }

    onDelete(id: string) {
      this.articleService.deleteArticle(id);
    }
}
