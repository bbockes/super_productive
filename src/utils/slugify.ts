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

/**
 * Extract plain text from Portable Text content
 * @param content - Array of Portable Text blocks
 * @returns Extracted plain text as a string
 */
function extractTextFromPortableText(content: any[]): string {
  if (!Array.isArray(content)) return '';
  
  return content
    .filter(block => block._type === 'block')
    .map(block => {
      if (!block.children || !Array.isArray(block.children)) return '';
      return block.children
        .filter((child: any) => child._type === 'span' && child.text)
        .map((child: any) => child.text)
        .join(' ');
    })
    .join(' ');
}

/**
 * Filter posts by search query across title, excerpt, and content
 * @param posts - Array of posts to filter
 * @param query - Search query string
 * @returns Filtered array of posts matching the search query
 */
export function filterPostsBySearchQuery(posts: any[], query: string): any[] {
  if (!query || query.trim() === '') {
    return posts;
  }

  const searchTerm = query.toLowerCase().trim();

  return posts.filter(post => {
    // Search in title
    const title = (post.title || '').toLowerCase();
    if (title.includes(searchTerm)) {
      return true;
    }

    // Search in excerpt/subheader
    const excerpt = (post.excerpt || post.subheader || '').toLowerCase();
    if (excerpt.includes(searchTerm)) {
      return true;
    }

    // Search in content
    if (post.content) {
      const contentText = extractTextFromPortableText(post.content).toLowerCase();
      if (contentText.includes(searchTerm)) {
        return true;
      }
    }

    return false;
  });
}