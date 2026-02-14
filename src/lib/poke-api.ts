import type { Pokemon, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function getPokemonList(
  limit: number = 20,
  offset: number = 0,
): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 3600 }, // revalidar cada hora (opcional - ISR)
  });
  if (!response.ok) throw new Error(`Error fetching Pokémon list: ${response.status}`);
  return response.json();
}

export async function getPokemonByNameOrId(nameOrId: string | number): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`, {
    next: { revalidate: 86400 }, // 24 horas para detalles individuales
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Pokémon ${nameOrId} not found`);
    }
    throw new Error(`Error fetching Pokémon: ${response.status}`);
  }
  return response.json();
}

export function getPokemonImage(pokemon: Pokemon): string {
  const sprites = pokemon.sprites;
  if (sprites.other?.['official-artwork']?.front_default)
    return sprites.other?.['official-artwork']?.front_default;
  if (sprites.other?.dream_world?.front_default) return sprites.other?.dream_world?.front_default;
  return sprites.front_default || '/images/pokemon-placeholder.png';
}
