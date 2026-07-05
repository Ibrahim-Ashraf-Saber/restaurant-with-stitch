import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getRestaurantSettingsQuery = groq`
  *[_type == "restaurantSettings"][0] {
    name,
    logo,
    address,
    phone,
    email,
    openingHours,
    socialMediaLinks,
    footerText
  }
`;

export async function getRestaurantSettings() {
  return client.fetch(getRestaurantSettingsQuery, {}, { next: { revalidate: 60 } });
}
