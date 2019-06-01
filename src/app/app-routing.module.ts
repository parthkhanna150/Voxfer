import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleCreateComponent } from './articles/article-create/article-create.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';
import { ArticleDisplayComponent } from './articles/article-display/article-display.component';

const routes: Routes = [
  { path: '',   redirectTo: 'all', pathMatch: 'full' },
  { path: 'all' , component: ArticleListComponent},
  { path: 'create', component: ArticleCreateComponent},
  { path: 'edit/:id', component: ArticleCreateComponent},
  { path: 'display/:id', component: ArticleDisplayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
