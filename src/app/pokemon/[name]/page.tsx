// app/pokemon/[name]/page.tsx
import { getPokemonByNameOrId } from '@/lib/poke-api';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPokemonImage } from '@/lib/poke-api';

export default async function PokemonDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  let pokemon;
  try {
    pokemon = await getPokemonByNameOrId(name);
  } catch (error) {
    notFound(); // Muestra página 404 de Next.js si no existe
  }

  const imageUrl = getPokemonImage(pokemon);

  // Tomamos el tipo principal para el color de fondo/gradiente
  const mainType = pokemon.types[0]?.type.name || 'normal';

  // Mapa de colores por tipo (usando Tailwind classes)
  const typeColorMap: Record<string, { bg: string; text: string; border: string }> = {
    normal: { bg: 'from-gray-400 to-gray-600', text: 'text-gray-800', border: 'border-gray-500' },
    fire: { bg: 'from-red-500 to-orange-600', text: 'text-white', border: 'border-red-600' },
    water: { bg: 'from-blue-500 to-cyan-600', text: 'text-white', border: 'border-blue-600' },
    electric: { bg: 'from-yellow-400 to-amber-500', text: 'text-gray-900', border: 'border-yellow-500' },
    grass: { bg: 'from-green-500 to-emerald-600', text: 'text-white', border: 'border-green-600' },
    ice: { bg: 'from-cyan-300 to-blue-400', text: 'text-gray-900', border: 'border-cyan-400' },
    fighting: { bg: 'from-red-700 to-rose-800', text: 'text-white', border: 'border-red-800' },
    poison: { bg: 'from-purple-500 to-violet-600', text: 'text-white', border: 'border-purple-600' },
    ground: { bg: 'from-amber-700 to-yellow-800', text: 'text-white', border: 'border-amber-800' },
    flying: { bg: 'from-indigo-400 to-blue-500', text: 'text-white', border: 'border-indigo-500' },
    psychic: { bg: 'from-pink-500 to-rose-600', text: 'text-white', border: 'border-pink-600' },
    bug: { bg: 'from-lime-500 to-green-600', text: 'text-white', border: 'border-lime-600' },
    rock: { bg: 'from-stone-600 to-gray-700', text: 'text-white', border: 'border-stone-700' },
    ghost: { bg: 'from-violet-600 to-purple-800', text: 'text-white', border: 'border-violet-700' },
    dragon: { bg: 'from-indigo-700 to-purple-800', text: 'text-white', border: 'border-indigo-800' },
    dark: { bg: 'from-gray-800 to-slate-900', text: 'text-white', border: 'border-gray-900' },
    steel: { bg: 'from-slate-500 to-gray-600', text: 'text-white', border: 'border-slate-600' },
    fairy: { bg: 'from-pink-400 to-purple-400', text: 'text-gray-900', border: 'border-pink-500' },
  };

  const colors = typeColorMap[mainType] || typeColorMap.normal;

  // Formateo de height y weight
  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);

  return (
    <main className={`min-h-screen bg-gradient-to-br ${colors.bg} py-10 px-4 sm:px-6 lg:px-8 text-white`}>
      <div className="max-w-4xl mx-auto">
        <div
          className={`bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border ${colors.border} border-opacity-50`}
        >
          {/* Header con imagen y nombre */}
          <div className="relative pt-12 pb-8 px-6 text-center">
            <div className="absolute top-4 left-6">
              <a
                href="/"
                className="text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium"
              >
                ← Volver al Pokédex
              </a>
            </div>

            <div className="relative mx-auto w-48 h-48 sm:w-64 sm:h-64 mb-6">
              <Image
                src={imageUrl}
                alt={pokemon.name}
                fill
                sizes="(max-width: 768px) 192px, 256px"
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            <h1 className="text-5xl font-extrabold capitalize tracking-tight mb-2">{pokemon.name}</h1>
            <p className="text-2xl font-bold opacity-90">#{pokemon.id.toString().padStart(3, '0')}</p>
          </div>

          {/* Tipos */}
          <div className="flex justify-center gap-4 mb-8">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="px-6 py-2 bg-white/30 rounded-full text-sm font-semibold uppercase tracking-wide backdrop-blur-sm"
              >
                {t.type.name}
              </span>
            ))}
          </div>

          {/* Info básica */}
          <div className="grid grid-cols-2 gap-6 px-8 py-6 bg-black/20">
            <div className="text-center">
              <p className="text-sm opacity-80">Altura</p>
              <p className="text-2xl font-bold">{heightM} m</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-80">Peso</p>
              <p className="text-2xl font-bold">{weightKg} kg</p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="px-8 py-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Estadísticas base</h2>
            <div className="space-y-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="flex items-center gap-4">
                  <span className="w-32 text-right font-medium capitalize opacity-90">
                    {stat.stat.name.replace('-', ' ')}
                  </span>
                  <div className="flex-1 bg-black/30 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all"
                      style={{ width: `${Math.min(stat.base_stat, 255) / 2.55}%` }} // max stat ~255 → 100%
                    />
                  </div>
                  <span className="w-12 font-bold">{stat.base_stat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
