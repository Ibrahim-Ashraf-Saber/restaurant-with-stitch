import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getFeaturedDishesQuery = groq`
  *[_type == "dish" && featured == true] {
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
  } | order(_createdAt desc) [0...6]
`;

export async function getFeaturedDishes() {
  return client.fetch(getFeaturedDishesQuery, {}, { next: { revalidate: 60 } });
}
