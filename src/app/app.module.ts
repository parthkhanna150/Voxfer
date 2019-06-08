import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule } from 'ngx-markdown';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { ArticleDisplayComponent } from './articles/article-display/article-display.component';
import { ArticleCreateComponent } from './articles/article-create/article-create.component';
import {
  MatInputModule,
  MatButtonModule,
  MatFormFieldModule,
  MatCardModule,
  MatToolbarModule,
  MatChipsModule,
  MatDividerModule,
  MatIconModule,
  MatAutocompleteModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';
import { ArticleService } from './article.service';

@NgModule({
  declarations: [
    AppComponent,
    ArticleCreateComponent,
    HeaderComponent,
    ArticleListComponent,
    ArticleDisplayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCardModule,
    MatToolbarModule,
    MatDividerModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MarkdownModule.forRoot(),
    CKEditorModule
  ],
  providers: [ArticleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
