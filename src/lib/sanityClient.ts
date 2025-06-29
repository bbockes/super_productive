import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2023-12-01',
  useCdn: true, // Set to false if you want to ensure fresh content
});

// GROQ queries
export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  category,
  readTime,
  publishedAt,
  content,
  "image": image.asset->url,
  subheader
}`;

export const CATEGORIES_QUERY = `*[_type == "post" && defined(category)] | order(category asc) {
  category
}`;

export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  category,
  readTime,
  publishedAt,
  content,
  "image": image.asset->url,
  subheader
}`;

export const LINK_CARDS_QUERY = `*[_type == "linkCard"] | order(_createdAt desc) {
  _id,
  hook,
  "image": image.asset->url,
  url,
  category
}`;

export const LINK_CARD_CATEGORIES_QUERY = `*[_type == "linkCard" && defined(category)] | order(category asc) {
  category
}`;