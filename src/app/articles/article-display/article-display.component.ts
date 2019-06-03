import { Component, OnInit } from '@angular/core';
import { ArticleService } from 'src/app/article.service';
import { Article } from 'src/app/models/article';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
    }

}
