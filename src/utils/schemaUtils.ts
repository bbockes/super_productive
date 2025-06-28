/**
 * Schema.org structured data utilities for SEO
 * Generates JSON-LD markup for blog posts, organization, and website
 */

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  subheader?: string;
  content?: any[];
  category?: string;
  readTime?: string | number;
  publishedAt?: string;
  created_at?: string;
  image?: string;
  slug?: string;
}

interface OrganizationSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  logo?: string;
  description: string;
  sameAs?: string[];
}

interface WebSiteSchema {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
  publisher: {
    "@type": string;
    name: string;
  };
  potentialAction?: {
    "@type": string;
    target: string;
    "query-input": string;
  };
}

interface BlogPostingSchema {
  "@context": string;
  "@type": string;
  headline: string;
  description: string;
  image?: string;
  author: {
    "@type": string;
    name: string;
  };
  publisher: {
    "@type": string;
    name: string;
    logo?: {
      "@type": string;
      url: string;
    };
  };
  datePublished: string;
  dateModified: string;
  mainEntityOfPage: {
    "@type": string;
    "@id": string;
  };
  articleSection?: string;
  wordCount?: number;
  timeRequired?: string;
  url: string;
}

interface BlogSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  publisher: {
    "@type": string;
    name: string;
  };
  mainEntityOfPage: {
    "@type": string;
    "@id": string;
  };
}

// Default organization data
const ORGANIZATION_DATA = {
  name: "Super Productive",
  url: "https://superproductive.magic-patterns.com",
  description: "Bite-sized tech tips to level up your productivity. Weekly newsletter with AI prompts, productivity tools, and smart workflows.",
  logo: "https://superproductive.magic-patterns.com/logo.png",
  sameAs: [
    "https://linkedin.com/company/super-productive" // Update with actual social media URLs
  ]
};

// Extract text content from Portable Text for word count and description
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

// Calculate word count from content
function getWordCount(content: any[]): number {
  const text = extractTextFromPortableText(content);
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

// Generate description from post data
function generateDescription(post: BlogPost): string {
  return post.excerpt || 
         post.subheader || 
         (post.content ? extractTextFromPortableText(post.content).substring(0, 160) : '') ||
         'A productivity tip from Super Productive';
}

// Convert read time to ISO 8601 duration format
function formatReadTime(readTime: string | number): string {
  const timeStr = String(readTime || '5 min');
  const minutes = parseInt(timeStr.replace(/\D/g, '')) || 5;
  return `PT${minutes}M`;
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION_DATA.name,
    url: ORGANIZATION_DATA.url,
    logo: ORGANIZATION_DATA.logo,
    description: ORGANIZATION_DATA.description,
    sameAs: ORGANIZATION_DATA.sameAs
  };
}

/**
 * Generate WebSite schema with search functionality
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORGANIZATION_DATA.name,
    url: ORGANIZATION_DATA.url,
    description: ORGANIZATION_DATA.description,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_DATA.name
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${ORGANIZATION_DATA.url}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Generate Blog schema for the main blog page
 */
export function generateBlogSchema(): BlogSchema {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: ORGANIZATION_DATA.name,
    description: ORGANIZATION_DATA.description,
    url: ORGANIZATION_DATA.url,
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_DATA.name
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": ORGANIZATION_DATA.url
    }
  };
}

/**
 * Generate BlogPosting schema for individual blog posts
 */
export function generateBlogPostSchema(post: BlogPost, postUrl: string): BlogPostingSchema {
  const publishedDate = post.publishedAt || post.created_at || new Date().toISOString();
  const description = generateDescription(post);
  const wordCount = post.content ? getWordCount(post.content) : 0;
  
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: description,
    image: post.image,
    author: {
      "@type": "Organization", // Using Organization since this is a company blog
      name: ORGANIZATION_DATA.name
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION_DATA.name,
      logo: ORGANIZATION_DATA.logo ? {
        "@type": "ImageObject",
        url: ORGANIZATION_DATA.logo
      } : undefined
    },
    datePublished: publishedDate,
    dateModified: publishedDate, // Using same date since we don't track modifications
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl
    },
    articleSection: post.category,
    wordCount: wordCount > 0 ? wordCount : undefined,
    timeRequired: post.readTime ? formatReadTime(post.readTime) : undefined,
    url: postUrl
  };
}

/**
 * Generate Article schema for the About page
 */
export function generateAboutPageSchema(): any {
  const aboutUrl = `${ORGANIZATION_DATA.url}/about`;
  
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Super Productive",
    description: "Learn about Super Productive and our mission to help knowledge workers be more productive with AI and modern tools.",
    url: aboutUrl,
    mainEntity: {
      "@type": "Organization",
      name: ORGANIZATION_DATA.name,
      description: ORGANIZATION_DATA.description,
      url: ORGANIZATION_DATA.url
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": aboutUrl
    }
  };
}

/**
 * Insert JSON-LD script tag into document head
 */
export function insertStructuredData(schema: any): void {
  // Remove existing schema script if it exists
  const existingScript = document.querySelector('script[data-schema-type]');
  if (existingScript) {
    existingScript.remove();
  }

  // Create and insert new schema script
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-schema-type', schema['@type']);
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

/**
 * Insert multiple schema objects
 */
export function insertMultipleStructuredData(schemas: any[]): void {
  // Remove existing schema scripts
  const existingScripts = document.querySelectorAll('script[data-schema-type]');
  existingScripts.forEach(script => script.remove());

  // Insert each schema
  schemas.forEach((schema, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-type', schema['@type']);
    script.setAttribute('data-schema-index', index.toString());
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  });
}

/**
 * Get current page URL
 */
export function getCurrentUrl(): string {
  return window.location.href;
}

/**
 * Generate breadcrumb schema for blog posts
 */
export function generateBreadcrumbSchema(post: BlogPost): any {
  const baseUrl = ORGANIZATION_DATA.url;
  const postUrl = `${baseUrl}/posts/${post.slug || post.id}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.category || "Blog",
        item: `${baseUrl}/?category=${encodeURIComponent(post.category || '')}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl
      }
    ]
  };
}