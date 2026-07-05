import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getWhyChooseUsQuery = groq`
  *[_type == "whyChooseUs"] {
    _id,
    title,
    description,
    icon,
    displayOrder
  } | order(displayOrder asc)
`;

export async function getWhyChooseUs() {
  return client.fetch(getWhyChooseUsQuery, {}, { next: { revalidate: 60 } });
}
