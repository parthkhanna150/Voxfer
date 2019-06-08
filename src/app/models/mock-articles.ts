import { Article } from './article';
import { categories } from './mock-categories';
import { users } from './mock-users';

 export const articles: Article[] = [
    {
      authors: users,
      title: 'Test Title 1',
      content: 'Test Content 1',
      categories: categories.slice(3, 6)
    },
    {
      authors: [users[0]],
      title: 'Test Title 2',
      content: 'Test Content 2',
      categories: categories.slice(0, 3)
    }
];
