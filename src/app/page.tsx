import { Suspense } from 'react';
import { getPokemonList } from '@/lib/poke-api';
import PokemonCard from '@/components/PokemonCard';
import SearchBar from '@/components/SearchBar';
import Loader from '@/components/Loader';
import type { PokemonListItem } from '@/types/pokemon';
import { getPokemonImage } from '@/lib/poke-api';

async function PokemonListContent() {
  let pokemonList: PokemonListItem[] = [];

  try {
    const data = await getPokemonList(30, 0);
    pokemonList = data.results;
  } catch (err) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-xl font-medium">Error al cargar los Pokémon</p>
        <p className="text-gray-500 mt-2">Intenta recargar la página</p>
      </div>
    );
  }
  const pokemonWithImages = await Promise.all(
    pokemonList.map(async (p) => {
      const id = p.url.split('/').slice(-2, -1)[0];
      let imageUrl = '/images/pokemon-placeholder.png';
      try {
        const detail = await fetch(p.url).then((res) => res.json());
        imageUrl = getPokemonImage(detail);
      } catch (error) {
        return { pokemon: p, id, imageUrl }; //TODO: Si falla, usamos placeholder
      }
      return { pokemon: p, id, imageUrl };
    }),
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {pokemonWithImages.map(({ pokemon, id, imageUrl }) => (
        <PokemonCard key={pokemon.name} pokemon={pokemon} id={id} imageUrl={imageUrl} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-4 tracking-tight">Pokédex</h1>
        <p className="text-center text-gray-600 mb-8 text-lg">Explora los Pokémon de la primera generación</p>

        <SearchBar />

        <Suspense fallback={<Loader />}>
          <PokemonListContent />
        </Suspense>
      </div>
    </main>
  );
}
