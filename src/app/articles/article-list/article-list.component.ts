import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ArticleService } from '../../shared/article.service';
import { Article } from '../article.model';
import { ScrollService } from '../../shared/scroll.service';
import { routeFadeStateTrigger } from '../../shared/route-animations';
import { fadeTrigger, listAnimation, listAnimation2 } from '../../shared/animations';
import { CategoryService } from '../../shared/category.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.css'],
  animations: [routeFadeStateTrigger, fadeTrigger, listAnimation, listAnimation2]
})
export class ArticleListComponent implements OnInit, AfterViewInit, OnDestroy {

  articles: Article [];
  articlesToDisplay: Article [];
  selectedArticleId: number;
  pages: number [];
  currentPage: number;
  filterText = '';
  filterBy = 'title';
  searchMode = false;
  articlesChangedSubscription: Subscription;
  articlesLoaded = false;

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private router: Router,
              private scroller: ScrollService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.initArticles();
    this.pages = this.getPages();

    this.route.queryParams.subscribe(params => {
      if (params['key'] && params['searchBy']) {
        this.filterText = params['key'];
        this.filterBy = params['searchBy'];
      }
      if (this.filterText.trim() !== '') {
        this.searchMode = true;
        window.scrollTo(0, 0);
      }
    });

    this.articlesChangedSubscription = this.articleService.articlesChanged.subscribe(
      (articles: Article[]) => {
        this.initArticles();
        this.pages = this.getPages();
      }
    );

  }

  ngAfterViewInit(): void {
    window.scrollTo(this.scroller.X, this.scroller.Y);
  }

  ngOnDestroy(): void {
    this.articlesChangedSubscription.unsubscribe();
  }

  onSelectArticle(id: number) {
    this.selectedArticleId = id;
    this.router.navigate(['article', id]);
    this.scroller.savePosition(window.pageXOffset, window.pageYOffset);
  }

  getPages() {
    let noOfPages: number;
    if (this.articles.length % 10 === 0) {
      noOfPages = this.articles.length / 10;
    } else if (this.articles.length < 10) {
      noOfPages = 1;
    } else {
      noOfPages = Math.floor(this.articles.length / 10) + 1;
    }
    const pages: number [] = [];
    for (let i = 1; i <= noOfPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onSelectPage(page: number) {
    this.scroller.resetPosition();
    this.router.navigate(['articles', +page]);
  }

  private initArticles() {
    this.articles = this.articleService.getArticles();
    this.currentPage = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : 1;
    this.articlesToDisplay = this.articles.slice((this.currentPage - 1) * 10, this.currentPage * 10);
  }

}
