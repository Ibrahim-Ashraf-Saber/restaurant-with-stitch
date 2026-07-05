import { groq } from 'next-sanity';
import { client } from '../lib/client';

export const getTestimonialsQuery = groq`
  *[_type == "testimonial"] {
    _id,
    customerName,
    customerRole,
    review,
    rating,
    "avatarUrl": customerAvatar.asset->url,
    displayOrder
  } | order(displayOrder asc)
`;

export async function getTestimonials() {
  return client.fetch(getTestimonialsQuery, {}, { next: { revalidate: 60 } });
}
