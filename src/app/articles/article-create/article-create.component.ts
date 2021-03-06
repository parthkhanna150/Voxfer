import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import {Location} from '@angular/common';
import { ArticleService } from 'src/app/articles/article.service';
import { MatChipInputEvent } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl, NgForm} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { categories } from 'src/app/models/mock-categories';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Article } from 'src/app/models/article';
import { AuthService } from 'src/app/auth/auth.service';
import { sampleContent } from 'src/app/articles/article-create/sample.model';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent implements OnInit, OnDestroy {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl();
  filteredCategories: Observable<string[]>;
  categories: string[] = ['Chemistry'];
  allCategories: string[] = categories;
  public Editor = ClassicEditor;
  sampleContent = sampleContent;
  sampleSummary = '<div><h3>Summary</h3><p>Please enter text for the Summary here.</p>\
  <figure class="image">\
  <img alt="Graphical Abstract" src="https://40370.cdn.cke-cs.com/e4jFyCcE3za2em2hTchK/images/35cd21c61235b80034178b6e3cf72a2dbcae06ee93c2eb76.jpg" srcset="https://40370.cdn.cke-cs.com/e4jFyCcE3za2em2hTchK/images/35cd21c61235b80034178b6e3cf72a2dbcae06ee93c2eb76.jpg/w_96 96w, https://40370.cdn.cke-cs.com/e4jFyCcE3za2em2hTchK/images/35cd21c61235b80034178b6e3cf72a2dbcae06ee93c2eb76.jpg/w_176 176w, https://40370.cdn.cke-cs.com/e4jFyCcE3za2em2hTchK/images/35cd21c61235b80034178b6e3cf72a2dbcae06ee93c2eb76.jpg/w_256 256w" sizes="100vw" width="256">\
  <figcaption>Graphical Abstract</figcaption></figure></div>';
  public summaryModel = {
    editorData: this.sampleSummary
  };
  public contentModel = {
    editorData: this.sampleContent
  };

  private articleId = null;
  private mode = 'create';
  article: Article;
  isLoading = false;
  private authStatusSubs: Subscription;

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private location: Location,
              public articleService: ArticleService,
              public route: ActivatedRoute,
              private authService: AuthService) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
        startWith(null),
        map((category: string | null) => category ? this._filter(category) : this.allCategories.slice()));
  }

  ngOnInit() {
    this.authStatusSubs = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.articleId = paramMap.get('id');
        this.isLoading = true;
        this.articleService.getArticleById(this.articleId)
          .subscribe(articleData => {
            this.isLoading = false;
            this.article = {
              id: articleData.article._id,
              title: articleData.article.title,
              authors: articleData.article.authors,
              content: articleData.article.content,
              summary: articleData.article.summary,
              categories:  articleData.article.categories,
              creator: articleData.article.creator
            };
            this.summaryModel.editorData = this.article.summary;
            this.contentModel.editorData = this.article.content;
            this.categories = this.article.categories;
            this.articleService.headerUpdate(false);
          });
      } else {
        this.articleService.headerUpdate(false);
        this.mode = 'create';
        this.articleId = null;
      }
    });
  }

  add(event: MatChipInputEvent): void {
    // Add category only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our category
      if ((value || '').trim()) {
        this.categories.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.categoryCtrl.setValue(null);
    }
  }

  remove(category: string): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push(event.option.viewValue);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value;
    return this.allCategories.filter(category => (category.toLowerCase()).indexOf(filterValue.toLowerCase()) === 0);
  }

  goBack() {
    this.location.back();
  }

  onSaveArticle(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.articleService.addArticle(
        form.value.title, form.value.authors, this.categories, this.contentModel.editorData, this.summaryModel.editorData
        );
    } else {
      this.articleService.updateArticle(
        this.articleId, form.value.title, form.value.authors, this.categories, this.contentModel.editorData, this.summaryModel.editorData
        );
    }
    form.resetForm();
  }

  ngOnDestroy() {
    this.authStatusSubs.unsubscribe();
  }
}
