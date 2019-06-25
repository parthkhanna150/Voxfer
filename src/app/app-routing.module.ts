import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleCreateComponent } from './articles/article-create/article-create.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';
import { ArticleDisplayComponent } from './articles/article-display/article-display.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  { path: '',   redirectTo: 'all', pathMatch: 'full' },
  { path: 'all' , component: ArticleListComponent},
  { path: 'create', component: ArticleCreateComponent},
  { path: 'edit/:id', component: ArticleCreateComponent},
  { path: 'display/:id', component: ArticleDisplayComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
