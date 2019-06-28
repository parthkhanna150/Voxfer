import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { ArticleService } from '../articles/article.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // @Input() isHome: boolean;
  isHome = false;
  searchId: string;
  userIsAuthenticated =  false;
  private authListenerSubs: Subscription;
  private isHomeSubs: Subscription;

  constructor(private authService: AuthService, private articleService: ArticleService) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.isHomeSubs = this.articleService.getIsHomeUpdateListener()
      .subscribe((isHome: boolean) => {
        this.isHome = isHome;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.isHomeSubs.unsubscribe();
  }

}
