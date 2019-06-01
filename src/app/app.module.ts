import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ArticleCreateComponent } from './articles/article-create/article-create.component';
// import {
//   MatInputModule,
//   MatButtonModule,
//   MatFormFieldModule,
//   MatCardModule,
//   MatToolbarModule } from '@angular/material';
import { HeaderComponent } from './header/header.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleCreateComponent,
    HeaderComponent,
    ArticleListComponent,
    // MatInputModule,
    // MatButtonModule,
    // MatFormFieldModule,
    // MatCardModule,
    // MatToolbarModule
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
