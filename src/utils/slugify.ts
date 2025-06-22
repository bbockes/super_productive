/**
 * Convert a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove all non-word chars except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove hyphens from start and end
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Find a post by its slug
 * @param posts - Array of posts
 * @param slug - The slug to search for
 * @returns The matching post or undefined
 */
export function findPostBySlug(posts: any[], slug: string) {
  return posts.find(post => {
    // Check if post has a slug field, otherwise use title
    const postSlug = post.slug || slugify(post.title);
    return postSlug === slug;
  });
}