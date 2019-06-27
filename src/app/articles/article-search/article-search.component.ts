import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Article } from 'src/app/models/article';
import { ArticleService } from '../article.service';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';

@Component({
  selector: 'app-article-search',
  templateUrl: './article-search.component.html',
  styleUrls: ['./article-search.component.css']
})
export class ArticleSearchComponent implements OnInit {
  response$: Observable<Article[]>;
  private searchTerms = new Subject<string>();

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.response$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((title: string) => this.articleService.searchArticles(title)),
    );
  }

  onSearch(title: string): void {
    this.searchTerms.next(title);
  }

  // onSearch(title: string) {
  //   this.articleService.searchArticles(title)
  //     .subscribe(response => {
  //       this.articles = response.articles;
  //       console.log(response);
  //     });
  // }
}
