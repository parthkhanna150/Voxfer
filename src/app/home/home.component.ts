import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ArticleService } from '../articles/article.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.articleService.headerUpdate(true);
  }
}
