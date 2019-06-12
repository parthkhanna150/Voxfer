import { User } from './user';

export class Article {
  id: string;
  authors: User[];
  title: string;
  content: string;
  categories:  string[];
}
