import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BlogLayout } from './components/BlogLayout';
import { ThemeProvider } from './contexts/ThemeContext';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<BlogLayout />} />
            <Route path="/posts/:slug" element={<BlogLayout />} />
            <Route path="/about" element={<BlogLayout />} />
            <Route path="/about/" element={<BlogLayout />} />
            <Route path="/404" element={<BlogLayout />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}