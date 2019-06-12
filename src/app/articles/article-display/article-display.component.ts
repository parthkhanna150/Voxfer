import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ArticleService } from 'src/app/article.service';
import { Article } from 'src/app/models/article';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

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
export class ArticleDisplayComponent implements OnInit {
  article: Article;
  id: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public articleService: ArticleService) {}

    ngOnInit() {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
          this.id = paramMap.get('id');
          // console.log(this.id);
          this.articleService.getArticleById(this.id)
            .subscribe((response) => {
          // console.log(response);
          this.article = {
            id: response.article._id,
            title: response.article.title,
            authors: response.article.authors,
            content: response.article.content,
            categories:  response.article.categories
          };
          // console.log(this.article);
          this.article.content = this.articleService.addIdsH4s(this.article.content);
          // console.log(this.article.content);
          this.buildSideMenu(this.article.content);
        });
      });
    }

    buildSideMenu(content: string) {
      const doc = new DOMParser().parseFromString(content, 'text/html');
      const h4s = doc.getElementsByTagName('h4');
      const menuUl = document.querySelector('ul');
      while (menuUl.firstChild) {
        menuUl.removeChild(menuUl.firstChild);
      }

      const arrH4 = Array.from(h4s);

      arrH4.forEach((h4, position) => {
        const menuLi = document.createElement('li');
        const menuA = document.createElement('a');

        menuA.textContent = h4.textContent;
        menuA.setAttribute('href', 'display/' + this.article.id + '#' + position);

        menuLi.appendChild(menuA);
        menuUl.appendChild(menuLi);
      });
    }
}
