import { useState } from 'react';
import type { CategoryId } from '../../types/content';
import { ui } from '../../i18n/ui';

// Story data shared by the desktop stage (CinematicStage) and the phone story (MobileStory)

export const ASSETS = '/aleman_parallax_assets';

export type BagKey = keyof typeof ui.home.heroBags;

// Drop a real model at public/models/<model>.glb and it replaces the built-in 3D bag for that product
export const BAGS: { key: BagKey; src: string; model: string; category: CategoryId; kg: number }[] = [
  { key: 'broilerSuper', src: `${ASSETS}/bag-05-broiler.webp`, model: 'bag-broiler', category: 'poultry', kg: 50 },
  { key: 'cattleFattening', src: `${ASSETS}/bag-02-cattle.webp`, model: 'bag-cattle', category: 'livestock', kg: 50 },
  { key: 'duckLayer', src: `${ASSETS}/bag-03-ducks.webp`, model: 'bag-duck', category: 'duck', kg: 50 },
  { key: 'rabbitLactating', src: `${ASSETS}/bag-04-rabbits.webp`, model: 'bag-rabbit', category: 'rabbit', kg: 50 },
  { key: 'poultryHome', src: `${ASSETS}/bag-01-ducks.webp`, model: 'bag-poultry-home', category: 'poultry', kg: 25 },
];

type CategoryDescKey = 'categoryDescPoultry' | 'categoryDescLivestock' | 'categoryDescRabbit' | 'categoryDescDuck';

// The animal each feed is made for; it stands beside the bag in the product scene
export const COMPANION: Record<CategoryId, string> = {
  poultry: `${ASSETS}/chicken.webp`,
  livestock: `${ASSETS}/cow.webp`,
  duck: `${ASSETS}/duck.webp`,
  rabbit: '/animal_rabbit.webp',
};

export const CATEGORY_DESC: Record<CategoryId, CategoryDescKey> = {
  poultry: 'categoryDescPoultry',
  livestock: 'categoryDescLivestock',
  rabbit: 'categoryDescRabbit',
  duck: 'categoryDescDuck',
};

// Broiler growth: the same bird photographed at four ages, in public/growth/; if one is missing,
// the chicken photo stands in for it
const BIRD_FALLBACK = `${ASSETS}/chicken.webp`;
export const BIRD_STAGES = [
  { file: 'chick-day01.webp', day: 1 },
  { file: 'chick-day10.webp', day: 10 },
  { file: 'broiler-day21.webp', day: 21 },
  { file: 'broiler-day35.webp', day: 35 },
];
export const LAST_DAY = 35;

// Feeding programme shown alongside the growing bird (product slugs from data/products)
export const FEED_STAGES = [
  { slug: 'poultry-starter', from: 1, to: 10 },
  { slug: 'poultry-grower', from: 11, to: 24 },
  { slug: 'poultry-finisher', from: 25, to: 35 },
];

export function BirdImage({ file, className }: { file: string; className?: string }) {
  const [src, setSrc] = useState(`/growth/${file}`);
  return <img src={src} alt="" className={className} onError={() => setSrc(BIRD_FALLBACK)} />;
}
