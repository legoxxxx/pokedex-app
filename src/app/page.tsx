import { getPokemonList } from '@/lib/poke-api';
import PokemonCard from '@/components/PokemonCard';
import type { PokemonListItem } from '@/types/pokemon';
import { getPokemonImage } from '@/lib/poke-api';

export default async function Home() {
  let pokemonList: PokemonListItem[] = [];
  let error: string | null = null;

  try {
    const data = await getPokemonList(30, 0); // primeros 30 para empezar
    pokemonList = data.results;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-gray-900 mb-2 tracking-tight">
          Pokédex
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Descubre todos los Pokémon de la primera generación
        </p>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-xl font-medium">{error}</p>
            <p className="text-gray-500 mt-2">Intenta recargar la página</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {pokemonWithImages.map(({ pokemon, id, imageUrl }) => (
              <PokemonCard key={pokemon.name} pokemon={pokemon} id={id} imageUrl={imageUrl} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
