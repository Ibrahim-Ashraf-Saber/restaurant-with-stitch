import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getHeroQuery = groq`
  *[_type == "heroSection"][0] {
    heading,
    subheading,
    ctaText,
    ctaLink,
    "heroImageUrl": heroImage.asset->url
  }
`;

export async function getHero() {
  return client.fetch(getHeroQuery, {}, { next: { revalidate: 60 } });
}
