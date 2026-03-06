import { createBrowserRouter } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout';
import AppLayout from '../layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/public/HomePage';
import NewsPage from '../pages/public/NewsPage';
import CustomersPage from '../pages/protected/CustomersPage';
import UsersPage from '../pages/protected/UsersPage';
import ArticlesPage from '../pages/protected/ArticlesPage';
import ImagesPage from '../pages/protected/ImagesPage';
import { ROUTES } from './routes';

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.NEWS, element: <NewsPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: ROUTES.CUSTOMERS, element: <CustomersPage /> },
          { path: ROUTES.USERS, element: <UsersPage /> },
          { path: ROUTES.ARTICLES, element: <ArticlesPage /> },
          { path: ROUTES.IMAGES, element: <ImagesPage /> },
        ],
      },
    ],
  },
]);

export default router;
