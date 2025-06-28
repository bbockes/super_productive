/**
 * SEO utilities for generating meta tag content
 * These functions are shared between client-side and server-side rendering
 */

// Helper function to extract text content from Portable Text for meta descriptions
export function extractTextFromContent(content) {
  if (!Array.isArray(content)) return '';
  
  const text = content
    .filter(block => block._type === 'block')
    .map(block => {
      if (!block.children || !Array.isArray(block.children)) return '';
      return block.children
        .filter((child) => child._type === 'span' && child.text)
        .map((child) => child.text)
        .join(' ');
    })
    .join(' ');
    
  // Limit to 160 characters for meta description
  return text.length > 160 ? text.substring(0, 157) + '...' : text;
}

// Generate meta description from post data
export function generateMetaDescription(post) {
  if (!post) {
    return 'Bite-sized tech tips to level up your productivity';
  }
  
  // Try excerpt first (this is the main field we want)
  if (post.excerpt && post.excerpt.trim()) {
    console.log(`Using excerpt for ${post.title}: "${post.excerpt}"`);
    return post.excerpt.trim();
  }
  
  // Try subheader next
  if (post.subheader && post.subheader.trim()) {
    console.log(`Using subheader for ${post.title}: "${post.subheader}"`);
    return post.subheader.trim();
  }
  
  // Extract from content as fallback
  if (post.content) {
    const extracted = extractTextFromContent(post.content);
    if (extracted && extracted.trim()) {
      console.log(`Using extracted content for ${post.title}: "${extracted}"`);
      return extracted.trim();
    }
  }
  
  // Final fallback
  console.log(`Using default description for ${post.title}`);
  return 'Bite-sized tech tips to level up your productivity';
}

// Generate page title
export function generatePageTitle(post) {
  return post ? `${post.title} | Super Productive` : 'Super Productive | Bite-sized tech tips to level up your productivity';
}

// Default OG image URL
export const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=630&fit=crop';

// Generate Open Graph meta tags HTML
export function generateOGMetaTags(post, url) {
  const title = post ? post.title : 'Super Productive';
  const description = post ? generateMetaDescription(post) : 'Bite-sized tech tips to level up your productivity. Weekly newsletter with AI prompts, productivity tools, and smart workflows.';
  const image = post?.image || DEFAULT_OG_IMAGE;
  const type = post ? 'article' : 'website';
  
  // Debug logging
  if (post) {
    console.log(`🏷️  Generating meta tags for: ${title}`);
    console.log(`📝 Description: "${description}"`);
    console.log(`🖼️  Image: ${image}`);
  }
  
  let metaTags = `
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="Super Productive" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escapeHtml(title)}" />
    
    <meta name="description" content="${escapeHtml(description)}" />`;
  
  // Add article-specific meta tags
  if (post) {
    if (post.category) {
      metaTags += `\n    <meta property="article:section" content="${escapeHtml(post.category)}" />`;
    }
    if (post.publishedAt || post.created_at) {
      metaTags += `\n    <meta property="article:published_time" content="${post.publishedAt || post.created_at}" />`;
    }
  }
  
  return metaTags;
}

// Escape HTML entities
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}