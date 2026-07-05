import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getRelatedDishesQuery = groq`
  *[_type == "dish" && category->name == $categoryName && slug.current != $currentSlug] {
    _id,
    name,
    "slug": slug.current,
    shortDescription,
    price,
    rating,
    "categoryName": category->name,
    "imageUrl": imageGallery[0].asset->url,
    ingredients,
    available
  } | order(_createdAt desc) [0...3]
`;

export async function getRelatedDishes(categoryName: string, currentSlug: string) {
  return client.fetch(
    getRelatedDishesQuery,
    { categoryName, currentSlug },
    { next: { revalidate: 60 } }
  );
}
