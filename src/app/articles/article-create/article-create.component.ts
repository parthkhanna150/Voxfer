import { Component, ElementRef, ViewChild } from '@angular/core';
import {Location} from '@angular/common';
import { ArticleService } from 'src/app/article.service';
import { CategoryService } from 'src/app/category.service';
import { MatChipInputEvent } from '@angular/material';
import { Category } from 'src/app/models/category';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-article-create',
  templateUrl: './article-create.component.html',
  styleUrls: ['./article-create.component.css']
})
export class ArticleCreateComponent {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl();
  filteredCategories: Observable<Category[]>;
  categories: Category[] = [{name: 'Chemistry'}];
  allCategories: Category[] = this.categoryService.getCategories();
  public Editor = ClassicEditor;
  public model = {
    editorData: '<p>Hello, world!</p>'
  };

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private location: Location,
              public articleService: ArticleService,
              public categoryService: CategoryService) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
        startWith(null),
        map((category: string | null) => category ? this._filter(category) : this.allCategories.slice()));
  }

  add(event: MatChipInputEvent): void {
    // Add category only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our category
      if ((value || '').trim()) {
        this.categories.push({name: value.trim()});
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.categoryCtrl.setValue(null);
    }
  }

  remove(category: Category): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push({name: event.option.viewValue});
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  private _filter(value: string): Category[] {
    const filterValue = value;
    return this.allCategories.filter(category => (category.name.toLowerCase()).indexOf(filterValue.toLowerCase()) === 0);
  }

  goBack() {
    this.location.back();
  }

  onSaveArticle(title, author) {
    this.articleService.addArticle(title, author, this.categories, this.model.editorData);
  }
}
