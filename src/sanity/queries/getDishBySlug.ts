import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getDishBySlugQuery = groq`
  *[_type == "dish" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    shortDescription,
    price,
    featured,
    available,
    ingredients,
    preparationTime,
    calories,
    rating,
    "categoryName": category->name,
    "imageGallery": imageGallery[].asset->url
  }
`;

export async function getDishBySlug(slug: string) {
  return client.fetch(getDishBySlugQuery, { slug }, { next: { revalidate: 60 } });
}
