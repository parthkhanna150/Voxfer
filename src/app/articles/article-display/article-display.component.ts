import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ArticleService } from 'src/app/article.service';
import { Article } from 'src/app/models/article';
import { Router, ActivatedRoute } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public articleService: ArticleService) {}

    ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      this.article = this.articleService.getArticle(id);

      this.buildSideMenu(this.article.content);
    }

    buildSideMenu(content: string) {
      const doc = new DOMParser().parseFromString(content, 'text/html');
      const h4s = doc.getElementsByTagName('h4');
      const menuUl = document.querySelector('ul');
      const arrH4 = Array.from(h4s);

      arrH4.forEach((h4, position) => {
        const menuLi = document.createElement('li');
        const menuA = document.createElement('a');

        menuA.textContent = h4.textContent;
        menuA.setAttribute('href', 'display/' + this.article.title + '#' + position);

        menuLi.appendChild(menuA);
        menuUl.appendChild(menuLi);
      });
    }
}
