import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getCategoriesQuery = groq`
  *[_type == "category"] {
    _id,
    name,
    "slug": slug.current
  } | order(name asc)
`;

export async function getCategories() {
  return client.fetch(getCategoriesQuery, {}, { next: { revalidate: 60 } });
}
