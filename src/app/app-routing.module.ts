import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArticleCreateComponent } from './articles/article-create/article-create.component';
import { ArticleListComponent } from './articles/article-list/article-list.component';

const routes: Routes = [
  { path: '' , component: ArticleListComponent},
  { path: 'create', component: ArticleCreateComponent},
  { path: 'edit', component: ArticleCreateComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
