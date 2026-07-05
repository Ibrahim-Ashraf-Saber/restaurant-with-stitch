import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getAllDishesQuery = groq`
  *[_type == "dish"] {
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
  } | order(name asc)
`;

export async function getAllDishes() {
  return client.fetch(getAllDishesQuery, {}, { next: { revalidate: 60 } });
}
