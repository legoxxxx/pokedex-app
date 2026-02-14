import Image from 'next/image';
import Link from 'next/link';
import type { PokemonListItem } from '@/types/pokemon';
import { getPokemonImage } from '@/lib/poke-api';

interface PokemonCardProps {
  pokemon: PokemonListItem;
  id: string;
  imageUrl: string;
}

export default function PokemonCard({ pokemon, id, imageUrl }: PokemonCardProps) {
  const typeColors: Record<string, string> = {
    normal: 'bg-gray-200',
    fire: 'bg-orange-400',
    water: 'bg-blue-400',
    electric: 'bg-yellow-300',
    grass: 'bg-green-400',
    ice: 'bg-cyan-300',
    fighting: 'bg-red-500',
    poison: 'bg-purple-500',
    ground: 'bg-amber-700',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-400',
    bug: 'bg-lime-500',
    rock: 'bg-stone-500',
    ghost: 'bg-violet-600',
    dragon: 'bg-violet-800',
    dark: 'bg-gray-700',
    steel: 'bg-slate-400',
    fairy: 'bg-pink-300',
  };

  const bgColor =
    'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300';

  return (
    <>
      <Link href={`/pokemon/${pokemon.name}`} className="block group">
        <div
          className={`
          ${bgColor}
          rounded-2xl shadow-md overflow-hidden
          transition-all duration-300
          group-hover:shadow-xl group-hover:scale-[1.03]
          border border-gray-200
        `}
        >
          <div className="relative pt-[100%] bg-gradient-to-t from-gray-800/10 to-transparent">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={pokemon.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  className="object-contain drop-shadow-xl transition-transform group-hover:scale-110"
                  priority={Number(id) <= 30} // solo primeras 30 con priority
                />
              ) : (
                <div className="text-gray-400 text-sm font-medium">No image</div>
              )}
            </div>

            <div className="absolute top-2 right-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full">
              #{id.padStart(3, '0')}
            </div>
          </div>

          <div className="p-4 text-center">
            <h3 className="font-bold text-lg capitalize text-gray-800 group-hover:text-blue-600 transition-colors">
              {pokemon.name}
            </h3>
          </div>
        </div>
      </Link>
    </>
  );
}
