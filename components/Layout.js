// components/Layout.js
import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Course Floatation App</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; {new Date().getFullYear()} Course Floatation App. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;