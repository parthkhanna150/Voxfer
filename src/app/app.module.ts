import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AngularMaterialModule } from './angular-material.module';

import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';

import { ArticleDisplayComponent, SafeHtmlPipe } from './articles/article-display/article-display.component';
import { ArticleCreateComponent } from './articles/article-create/article-create.component';
import { ArticleSearchComponent } from './articles/article-search/article-search.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';

import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { ForgetComponent } from './auth/forget/forget.component';

import { ErrorComponent } from './error/error.component';

import { ErrorInterceptor } from './error-interceptor';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ResetComponent } from './auth/reset/reset.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleCreateComponent,
    HeaderComponent,
    ArticleListComponent,
    ArticleDisplayComponent,
    SafeHtmlPipe,
    SignupComponent,
    LoginComponent,
    ArticleSearchComponent,
    HomeComponent,
    ForgetComponent,
    ErrorComponent,
    ResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    HttpClientModule,
    AngularMaterialModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents:  [ErrorComponent]
})
export class AppModule { }
