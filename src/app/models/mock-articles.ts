import { Article } from './article';
import { categories } from './mock-categories';
import { users } from './mock-users';

 export const articles: Article[] = [
    {
      id: '1',
      authors: users,
      title: 'Test Title 1',
      content: 'Test Content 1',
      categories: categories.copyWithin(0, -1)
    },
    {
      id: '2',
      authors: [users[0]],
      title: 'Test Title 2',
      content: 'Test Content 2',
      categories: categories.copyWithin(0, -4)
    }
];
