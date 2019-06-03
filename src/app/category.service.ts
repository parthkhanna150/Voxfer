import { categories } from './models/mock-categories';
import { Injectable } from '@angular/core';
import { Category } from './models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories: Category[] = categories;
  getCategories() {
    return this.categories;
  }
}
