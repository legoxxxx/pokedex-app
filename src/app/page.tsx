// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getPokemonList, getPokemonDetail, getPokemonImage } from '@/lib/poke-api';
import PokemonCard from '@/components/PokemonCard';
import SearchBar from '@/components/SearchBar';
import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';
import type { PokemonListItem } from '@/types/pokemon';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonWithImages, setPokemonWithImages] = useState<
    { pokemon: PokemonListItem; id: string; imageUrl: string }[]
  >([]);
  const [totalPokemon, setTotalPokemon] = useState<number | null>(null); // null = cargando
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculamos páginas solo cuando tengamos el total real
  const totalPages = totalPokemon !== null ? Math.ceil(totalPokemon / ITEMS_PER_PAGE) : 1;

  // 1. Obtener el conteo total SOLO UNA VEZ
  useEffect(() => {
    async function fetchTotalCount() {
      try {
        const countResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1');
        if (!countResponse.ok) {
          throw new Error(`Error ${countResponse.status} al obtener conteo total`);
        }
        const countData = await countResponse.json();
        setTotalPokemon(countData.count); // valor real: 1302+ (o lo que sea en ese momento)
      } catch (err) {
        console.error(err);
        setError('No se pudo obtener el total de Pokémon de la API. Intenta recargar la página.');
        setTotalPokemon(null); // No usamos fallback fijo
      }
    }

    fetchTotalCount();
  }, []); // Solo al montar

  // 2. Cargar la página actual cuando cambie currentPage O cuando llegue el total
  useEffect(() => {
    // No intentamos cargar si aún no tenemos el total
    if (totalPokemon === null) return;

    async function fetchCurrentPage() {
      setLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const data = await getPokemonList(ITEMS_PER_PAGE, offset);
        const items = data.results;

        const enriched = await Promise.all(
          items.map(async (p) => {
            const id = p.url.split('/').slice(-2, -1)[0];
            let imageUrl = '/images/pokemon-placeholder.png';

            try {
              const detail = await getPokemonDetail(p.url);
              imageUrl = getPokemonImage(detail);
            } catch (detailErr) {
              console.warn(`No se pudo cargar detalle de ${p.name}:`, detailErr);
            }

            return { pokemon: p, id, imageUrl };
          }),
        );

        setPokemonWithImages(enriched);
      } catch (err) {
        console.error(err);
        setError('Error al cargar la página de Pokémon. Intenta cambiar de página o recargar.');
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentPage();
  }, [currentPage, totalPokemon]); // Dependencias correctas

  const handlePageChange = (page: number) => {
    if (totalPokemon === null) return;
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-4 tracking-tight">
          Pokédex Completa
        </h1>

        <p className="text-center text-gray-600 mb-8 text-lg">
          {totalPokemon !== null
            ? `${totalPokemon} Pokémon disponibles`
            : error
              ? 'Error al cargar el total'
              : 'Cargando total de Pokémon...'}
        </p>

        <SearchBar />

        {error && !totalPokemon ? (
          <div className="text-center py-12 text-red-600 text-xl font-medium">{error}</div>
        ) : loading || totalPokemon === null ? (
          <Loader />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {pokemonWithImages.map(({ pokemon, id, imageUrl }) => (
                <PokemonCard key={pokemon.name} pokemon={pokemon} id={id} imageUrl={imageUrl} />
              ))}
            </div>

            {totalPokemon !== null && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
