import { Category } from '../shared/category.model';

export class Article {
  public title: string;
  public image: string;
  public description: string;
  // public category: Category;
  public date: Date;

  constructor(title: string, image: string, description: string, date: Date) {
    this.title = title;
    this.image = image;
    this.description = description;
    // this.category = category;
    this.date = date;
  }
}
