import { User } from './user';

export class Article {
  authors: User[];
  title: string;
  content: string;
  categories:  String[];
}
