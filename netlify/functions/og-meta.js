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
  excerpt: 'Prompting without a strategy is like building a house without a blueprint. It might feel like progress, but it\'s just motion without direction—fast, but aimless.',
  image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop',
};

const notFoundPost = {
  id: '404',
  title: 'Uh-oh. Looks like that page doesn\'t exist.',
  excerpt: 'It either wandered off or never existed in the first place.',
  image: 'https://images.unsplash.com/photo-1594736797933-d0d92e2d0b3d?w=400&h=250&fit=crop',
};

exports.handler = async (event, context) => {
  const path = event.path;
  const host = event.headers.host;
  let post = null;
  let pageTitle = "Super Productive";
  let pageDescription = "Bite-sized tech tips to level up your productivity";
  let pageImage = "https://images.pexels.com/photos/3184433/pexels-photo-3184433.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
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
      pageDescription = post.excerpt || post.subheader || pageDescription;
      pageImage = post.image || pageImage;
      pageUrl = `https://${host}${path}`;
    }

    // Escape HTML characters in meta content to prevent XSS
    const escapeHtml = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const escapedTitle = escapeHtml(pageTitle);
    const escapedDescription = escapeHtml(pageDescription);
    const escapedImage = escapeHtml(pageImage);
    const escapedUrl = escapeHtml(pageUrl);

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
          <meta property="og:url" content="${escapedUrl}" />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Super Productive" />
          
          <!-- Twitter Card Meta Tags -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${escapedTitle}" />
          <meta name="twitter:description" content="${escapedDescription}" />
          <meta name="twitter:image" content="${escapedImage}" />
          
          <!-- SEO Meta Tags -->
          <meta name="description" content="${escapedDescription}" />
          <link rel="canonical" href="${escapedUrl}" />
          
          <!-- Redirect to the main application -->
          <meta http-equiv="refresh" content="0; url=${escapedUrl}" />
          <script>
            // Fallback JavaScript redirect for older browsers or if meta refresh fails
            setTimeout(function() {
              window.location.replace("${escapedUrl}");
            }, 100);
          </script>
      </head>
      <body>
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
              <h1>Redirecting...</h1>
              <p>If you are not redirected automatically, follow this <a href="${escapedUrl}">link to the blog post</a>.</p>
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
    
    // Return a default page with basic meta tags
    const escapedUrl = escapeHtml(pageUrl);
    const escapedImage = escapeHtml(pageImage);
    
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
            <title>Super Productive</title>
            <meta property="og:title" content="Super Productive" />
            <meta property="og:description" content="Bite-sized tech tips to level up your productivity" />
            <meta property="og:image" content="${escapedImage}" />
            <meta property="og:url" content="${escapedUrl}" />
            <meta property="og:type" content="website" />
            <meta http-equiv="refresh" content="0; url=${escapedUrl}" />
            <script>
              setTimeout(function() {
                window.location.replace("${escapedUrl}");
              }, 100);
            </script>
        </head>
        <body>
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
                <h1>Loading...</h1>
                <p>An error occurred while loading the page. <a href="${escapedUrl}">Click here to continue</a>.</p>
            </div>
        </body>
        </html>
      `,
    };
  }
};