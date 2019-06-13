import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { ArticleDisplayComponent, SafeHtmlPipe } from './articles/article-display/article-display.component';
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
  MatAutocompleteModule,
  MatProgressSpinnerModule} from '@angular/material';
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
    SafeHtmlPipe
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
    CKEditorModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [ArticleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
