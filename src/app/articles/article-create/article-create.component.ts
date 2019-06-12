import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { ArticleService } from 'src/app/article.service';
import { MatChipInputEvent } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl, NgForm} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { categories } from 'src/app/models/mock-categories';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Article } from 'src/app/models/article';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent implements OnInit {
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
  public model = {
    editorData: '<p>Hello, world!</p>'
  };
  private articleId = null;
  private mode = 'create';
  article: Article;

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private location: Location,
              public articleService: ArticleService,
              public route: ActivatedRoute) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
        startWith(null),
        map((category: string | null) => category ? this._filter(category) : this.allCategories.slice()));
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.articleId = paramMap.get('id');
        this.articleService.getArticleById(this.articleId)
          .subscribe(articleData => {
          this.article = {
            id: articleData.article._id,
            title: articleData.article.title,
            authors: articleData.article.authors,
            content: articleData.article.content,
            categories:  articleData.article.categories
          };
          // console.log(this.article);
          this.model.editorData = this.article.content;
          this.categories = this.article.categories;
        });
      } else {
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
    if (this.mode === 'create') {
      this.articleService.addArticle(form.value.title, form.value.author, this.categories, this.model.editorData);
    } else {
      this.articleService.updateArticle(this.articleId, form.value.title, form.value.author, this.categories, this.model.editorData);
    }
    form.resetForm();
  }
}
