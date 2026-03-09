import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BookLanding } from './components/BookLanding';
import { ThemeProvider } from './contexts/ThemeContext';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<BookLanding />} />
            <Route path="/posts/:slug" element={<Navigate to="/" replace />} />
            <Route path="/about" element={<Navigate to="/" replace />} />
            <Route path="/about/" element={<Navigate to="/" replace />} />
            <Route path="/404" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}