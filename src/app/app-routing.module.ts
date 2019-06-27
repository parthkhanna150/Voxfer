import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleCreateComponent } from './articles/article-create/article-create.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';
import { ArticleDisplayComponent } from './articles/article-display/article-display.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { ForgetComponent } from './auth/forget/forget.component';

const routes: Routes = [
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'all' , component: ArticleListComponent},
  { path: 'forgot' , component: ForgetComponent},
  { path: 'create', component: ArticleCreateComponent, canActivate: [AuthGuard]},
  { path: 'edit/:id', component: ArticleCreateComponent, canActivate: [AuthGuard]},
  { path: 'display/:id', component: ArticleDisplayComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
