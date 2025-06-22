import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlogLayout } from './components/BlogLayout';
import { ThemeProvider } from './contexts/ThemeContext';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/super_productive">
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<BlogLayout />} />
            <Route path="/posts/:slug" element={<BlogLayout />} />
            <Route path="/about" element={<BlogLayout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}