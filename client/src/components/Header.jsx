import React from 'react';

function Header() {
  return (
    <header className="flex items-center justify-center md:justify-start p-4 bg-black text-white shadow-md">
      <img src="/logo.png" alt="Me-Manager Logo" className="w-8 h-8 mr-3" />
      <h1 className="text-xl font-bold tracking-wide">Me-Manager</h1>
    </header>
  );
}

export default Header;
