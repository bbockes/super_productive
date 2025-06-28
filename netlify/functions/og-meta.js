const { createClient } = require('@sanity/client');

// Sanity client configuration (using environment variables)
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: process.env.SANITY_API_VERSION || '2023-12-01',
  useCdn: true,
});

// GROQ query for a single post by slug
const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  category,
  readTime,
  publishedAt,
  "image": image.asset->url,
  subheader
}`;

// Hardcoded data for about and 404 pages (simplified for OG tags)
const aboutPost = {
  id: 'about',
  title: 'About Super Productive',
  excerpt: 'Prompting without a strategy is like building a house without a blueprint. It might feel like progress, but it\'s just motion without direction—fast, but aimless. Super Productive is a weekly newsletter designed to help knowledge workers navigate the full spectrum of modern productivity.',
  image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop',
};

const notFoundPost = {
  id: '404',
  title: 'Uh-oh. Looks like that page doesn\'t exist.',
  excerpt: 'It either wandered off or never existed in the first place. You can head back to the homepage to explore our bite-sized tech tips and productivity insights, or just start clicking buttons to discover new content.',
  image: 'https://images.unsplash.com/photo-1594736797933-d0d92e2d0b3d?w=400&h=250&fit=crop',
};

// Function to detect if the request is from a social media crawler
const isSocialMediaCrawler = (userAgent) => {
  if (!userAgent) return false;
  
  const crawlers = [
    'facebookexternalhit',
    'LinkedInBot',
    'Twitterbot',
    'WhatsApp',
    'SkypeUriPreview',
    'Slackbot',
    'TelegramBot',
    'Googlebot',
    'bingbot',
    'yahoo! slurp',
    'discordbot',
    'embedly',
    'showyoubot',
    'outbrain',
    'pinterest/0.',
    'developers.google.com/+/web/snippet',
    'www.google.com/webmasters/tools/richsnippets',
    'tumblr',
    'bitlybot',
    'SkypeUriPreview',
    'nuzzel',
    'vkShare',
    'W3C_Validator',
    'redditbot',
    'Applebot',
    'flipboard',
    'yandexbot',
    'duckduckbot'
  ];
  
  const lowerCaseUserAgent = userAgent.toLowerCase();
  return crawlers.some(crawler => lowerCaseUserAgent.includes(crawler.toLowerCase()));
};

// Function to ensure description meets minimum length requirements
const ensureMinDescriptionLength = (description, fallbackContext = '') => {
  const minLength = 100;
  let finalDescription = description || '';
  
  // If description is too short, add context
  if (finalDescription.length < minLength) {
    const defaultContext = fallbackContext || 'Discover bite-sized tech tips, AI prompts, and productivity workflows designed to help knowledge workers save time and work smarter.';
    finalDescription = finalDescription ? `${finalDescription} ${defaultContext}` : defaultContext;
  }
  
  // Trim if too long (some platforms have max limits)
  if (finalDescription.length > 300) {
    finalDescription = finalDescription.substring(0, 297) + '...';
  }
  
  return finalDescription;
};

// Proper HTML escaping function
const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

exports.handler = async (event, context) => {
  const path = event.path;
  const host = event.headers.host;
  const userAgent = event.headers['user-agent'] || '';
  
  let post = null;
  let pageTitle = "Super Productive";
  let pageDescription = "Bite-sized tech tips to level up your productivity. Weekly insights on AI prompts, productivity tools, and smart workflows for knowledge workers.";
  let pageImage = "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1";
  let pageUrl = `https://${host}${path}`;

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  // Check if this is a social media crawler
  const isCrawler = isSocialMediaCrawler(userAgent);
  
  console.log('Request details:', {
    path,
    userAgent: userAgent.substring(0, 100), // Log first 100 chars of user agent
    isCrawler,
    host
  });

  // If this is NOT a crawler (i.e., a regular browser), redirect immediately
  if (!isCrawler) {
    console.log('Regular browser detected, redirecting to:', pageUrl);
    return {
      statusCode: 302,
      headers: {
        'Location': pageUrl,
        'Cache-Control': 'no-cache',
      },
      body: '',
    };
  }

  // If we reach here, it's a crawler - serve the meta tags
  console.log('Social media crawler detected, serving meta tags for:', path);

  try {
    if (path === '/about') {
      post = aboutPost;
    } else if (path.startsWith('/posts/')) {
      const slug = path.replace('/posts/', '');
      if (slug === '404') {
        post = notFoundPost;
      } else {
        const sanityData = await sanityClient.fetch(POST_BY_SLUG_QUERY, { slug });
        if (sanityData) {
          post = sanityData;
        } else {
          post = notFoundPost; // Fallback if post not found in Sanity
        }
      }
    }

    if (post) {
      pageTitle = post.title || pageTitle;
      // Ensure description meets minimum length requirements
      const rawDescription = post.excerpt || post.subheader || '';
      pageDescription = ensureMinDescriptionLength(rawDescription, 'From Super Productive: weekly insights on AI prompts, productivity tools, and smart workflows for knowledge workers.');
      pageImage = post.image || pageImage;
      pageUrl = `https://${host}${path}`;
    } else {
      // Ensure default description meets minimum length
      pageDescription = ensureMinDescriptionLength(pageDescription);
    }

    const escapedTitle = escapeHtml(pageTitle);
    const escapedDescription = escapeHtml(pageDescription);
    const escapedImage = escapeHtml(pageImage);
    const escapedUrl = escapeHtml(pageUrl);

    // Facebook App ID (optional, only include if environment variable is set)
    const facebookAppId = process.env.FACEBOOK_APP_ID;
    const facebookAppIdTag = facebookAppId ? `<meta property="fb:app_id" content="${escapeHtml(facebookAppId)}" />` : '';

    // For crawlers, serve static HTML with meta tags (NO redirects)
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${escapedTitle}</title>
          
          <!-- Open Graph Meta Tags -->
          <meta property="og:title" content="${escapedTitle}" />
          <meta property="og:description" content="${escapedDescription}" />
          <meta property="og:image" content="${escapedImage}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:url" content="${escapedUrl}" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Super Productive" />
          ${facebookAppIdTag}
          
          <!-- Twitter Card Meta Tags -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${escapedTitle}" />
          <meta name="twitter:description" content="${escapedDescription}" />
          <meta name="twitter:image" content="${escapedImage}" />
          
          <!-- SEO Meta Tags -->
          <meta name="description" content="${escapedDescription}" />
          <link rel="canonical" href="${escapedUrl}" />
      </head>
      <body>
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1>${escapedTitle}</h1>
              <p>${escapedDescription}</p>
              <p><a href="${escapedUrl}">View full article</a></p>
          </div>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
      body: html,
    };
  } catch (error) {
    console.error('Error generating OG meta tags:', error);
    
    // Return a default page with basic meta tags for crawlers
    const escapedUrl = escapeHtml(pageUrl);
    const escapedImage = escapeHtml(pageImage);
    const escapedTitle = escapeHtml(pageTitle);
    const escapedDescription = escapeHtml(ensureMinDescriptionLength(pageDescription));
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
      body: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${escapedTitle}</title>
            <meta property="og:title" content="${escapedTitle}" />
            <meta property="og:description" content="${escapedDescription}" />
            <meta property="og:image" content="${escapedImage}" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:type" content="image/jpeg" />
            <meta property="og:url" content="${escapedUrl}" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Super Productive" />
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1>Super Productive</h1>
                <p>An error occurred while loading the page content.</p>
                <p><a href="${escapedUrl}">Visit the main site</a></p>
            </div>
        </body>
        </html>
      `,
    };
  }
};