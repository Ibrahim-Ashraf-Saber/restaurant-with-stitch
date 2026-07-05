import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getContactQuery = groq`
  *[_type == "contact"][0] {
    address,
    phone,
    email,
    googleMapsUrl,
    socialMediaLinks
  }
`;

export async function getContact() {
  return client.fetch(getContactQuery, {}, { next: { revalidate: 60 } });
}
