import React from 'react';
import './App.css';
import { RouterProvider, useNavigation } from './router';
import { Layout } from './components/layout/Layout';
import {
  Home,
  About,
  HowItWorksPage,
  Dashboard,
  Claim,
  Analysis,
  Login,
  Help,
  Track,
  NotFound,
} from './pages';

const AppRoutes: React.FC = () => {
  const { currentPath } = useNavigation();

  // Normalize path by stripping hash and query
  const cleanPath = currentPath.split('#')[0].split('?')[0];

  const renderCurrentPage = () => {
    switch (cleanPath) {
      case '/':
        return <Home />;
      case '/about':
        return <About />;
      case '/how-it-works':
        return <HowItWorksPage />;
      case '/dashboard':
        return <Dashboard />;
      case '/claim':
        return <Claim />;
      case '/analysis':
        return <Analysis />;
      case '/login':
        return <Login />;
      case '/help':
        return <Help />;
      case '/track':
        return <Track />;
      default:
        return <NotFound />;
    }
  };

  return <Layout>{renderCurrentPage()}</Layout>;
};

export function App() {
  return (
    <RouterProvider>
      <AppRoutes />
    </RouterProvider>
  );
}

export default App;
