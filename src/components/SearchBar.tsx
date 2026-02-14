'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/pokemon/${query.trim().toLowerCase()}`);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mb-10">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar Pokémon (ej: pikachu, charizard...)"
          className="
            w-full px-5 py-4 pr-12 rounded-full
            bg-white shadow-md border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            text-gray-800 placeholder-gray-400
            transition-all
          "
        />
        <button
          type="submit"
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            bg-blue-600 text-white p-2 rounded-full
            hover:bg-blue-700 transition-colors
          "
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
