import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { colorPalette } from '$lib/constants';
import type { MeshGradientColor } from '$lib/types';

let meshGradientColorId = 0;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomPosition() {
  return {
    x: Math.random() * 120 - 10,
    y: Math.random() * 120 - 10
  };
}

export function createMeshGradientColor(
  color: string,
  position = generateRandomPosition()
): MeshGradientColor {
  return {
    id: `mesh-color-${meshGradientColorId++}`,
    color,
    ...position
  };
}

export function generateRandomMeshColors(): MeshGradientColor[] {
  const meshColors: MeshGradientColor[] = [];

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * colorPalette.length);
    meshColors.push(createMeshGradientColor(colorPalette[randomIndex]));
  }

  return meshColors;
}
