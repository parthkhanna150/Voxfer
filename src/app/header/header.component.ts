import { Component } from '@angular/core';
import { ArticleService } from '../article.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchId: string;

  // constructor(public articleService: ArticleService) {}

  // onSearch(id: String) {
  //   this.articleService.getArticle(id);
  // }
}
