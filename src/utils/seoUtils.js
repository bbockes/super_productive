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
  // Special case for about page
  if (post && post.id === 'about') {
    return 'Learn more about Super Productive — a weekly newsletter for digital knowledge workers who want to save time and work smarter.';
  }
  
  return post.excerpt || 
         post.subheader || 
         (post.content ? extractTextFromContent(post.content) : '') ||
         'Discover tools, tips, and AI prompts to boost your productivity, save time, and focus on what matters with the Super Productive newsletter.';
}

// Generate page title
export function generatePageTitle(post) {
  if (!post) {
    return 'Super Productive';
  }
  
  // Special case for about page
  if (post.id === 'about') {
    return 'About Super Productive';
  }
  
  return `Super Productive | ${post.title}`;
}

// Default OG image URL
export const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=630&fit=crop';

// Generate Open Graph meta tags HTML
export function generateOGMetaTags(post, url) {
  const title = post ? post.title : 'Super Productive';
  const description = post ? generateMetaDescription(post) : 'Bite-sized tech tips to level up your productivity. Weekly newsletter with AI prompts, productivity tools, and smart workflows.';
  const image = post?.image || DEFAULT_OG_IMAGE;
  const type = post ? 'article' : 'website';
  
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