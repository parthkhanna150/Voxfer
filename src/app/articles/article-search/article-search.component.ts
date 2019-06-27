import { Component, OnInit } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { Article } from 'src/app/models/article';
import { ArticleService } from '../article.service';
import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-article-search',
  templateUrl: './article-search.component.html',
  styleUrls: ['./article-search.component.css']
})
export class ArticleSearchComponent implements OnInit {
  response$: Observable<Article[]>;
  public autoCompleteControl = new FormControl();

  constructor(private articleService: ArticleService) {}

  ngOnInit() {
    this.response$ = this.autoCompleteControl.valueChanges.pipe(
      // delay emits
      debounceTime(300),
      // use switch map so as to cancel previous subscribed events, before creating new once
      switchMap(value => {
        if (value !== '') {
          // lookup from github
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of([]);
        }
      })
      );
    }

    lookup(value: string): Observable<Article[]> {
      return this.articleService.searchArticles(value.toLowerCase());
    }
}
