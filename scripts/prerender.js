#!/usr/bin/env node

/**
 * Pre-rendering script for generating static HTML files with proper meta tags
 * This ensures social media crawlers can access Open Graph meta tags
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server.js';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import utilities and data
const { generateOGMetaTags, generatePageTitle } = await import('../src/utils/seoUtils.ts');
const { aboutPost, notFoundPost } = await import('../src/data/blogData.tsx');
const { slugify } = await import('../src/utils/slugify.ts');

// Sanity client configuration
const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || '2osuh55w',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2023-12-01',
  useCdn: true,
});

// GROQ queries
const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
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

// Base HTML template
const HTML_TEMPLATE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>__TITLE__</title>
    __META_TAGS__
  </head>
  <body>
    <div id="root">__CONTENT__</div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>`;

// Generate static HTML for a route
function generateHTML(title, metaTags, content) {
  return HTML_TEMPLATE
    .replace('__TITLE__', title)
    .replace('__META_TAGS__', metaTags)
    .replace('__CONTENT__', content);
}

// Write file with directory creation
function writeFileWithDirs(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// Main pre-rendering function
async function prerender() {
  console.log('🚀 Starting pre-rendering process...');
  
  try {
    // Fetch posts from Sanity
    console.log('📡 Fetching posts from Sanity...');
    const posts = await sanityClient.fetch(POSTS_QUERY);
    console.log(`✅ Fetched ${posts.length} posts`);
    
    // Transform posts to match expected format
    const transformedPosts = posts.map(post => ({
      ...post,
      id: post._id,
      read_time: post.readTime,
      created_at: post.publishedAt,
      slug: post.slug?.current || slugify(post.title)
    }));
    
    const distDir = path.join(__dirname, '..', 'dist');
    const baseUrl = 'https://superproductive.magic-patterns.com'; // Update this to your actual domain
    
    // Ensure dist directory exists
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    console.log('📝 Generating static HTML files...');
    
    // 1. Generate homepage
    const homeTitle = generatePageTitle(null);
    const homeMetaTags = generateOGMetaTags(null, baseUrl);
    const homeHTML = generateHTML(homeTitle, homeMetaTags, '<div>Loading...</div>');
    writeFileWithDirs(path.join(distDir, 'index.html'), homeHTML);
    console.log('✅ Generated homepage');
    
    // 2. Generate about page
    const aboutTitle = generatePageTitle(aboutPost);
    const aboutMetaTags = generateOGMetaTags(aboutPost, `${baseUrl}/about`);
    const aboutHTML = generateHTML(aboutTitle, aboutMetaTags, '<div>Loading...</div>');
    writeFileWithDirs(path.join(distDir, 'about', 'index.html'), aboutHTML);
    console.log('✅ Generated about page');
    
    // 3. Generate individual post pages
    let postCount = 0;
    for (const post of transformedPosts) {
      const postTitle = generatePageTitle(post);
      const postUrl = `${baseUrl}/posts/${post.slug}`;
      const postMetaTags = generateOGMetaTags(post, postUrl);
      const postHTML = generateHTML(postTitle, postMetaTags, '<div>Loading...</div>');
      writeFileWithDirs(path.join(distDir, 'posts', post.slug, 'index.html'), postHTML);
      postCount++;
    }
    console.log(`✅ Generated ${postCount} post pages`);
    
    // 4. Generate 404 page
    const notFoundTitle = generatePageTitle(notFoundPost);
    const notFoundMetaTags = generateOGMetaTags(notFoundPost, `${baseUrl}/404`);
    const notFoundHTML = generateHTML(notFoundTitle, notFoundMetaTags, '<div>Loading...</div>');
    writeFileWithDirs(path.join(distDir, '404.html'), notFoundHTML);
    console.log('✅ Generated 404 page');
    
    console.log(`🎉 Pre-rendering complete! Generated ${postCount + 3} HTML files.`);
    
  } catch (error) {
    console.error('❌ Pre-rendering failed:', error);
    process.exit(1);
  }
}

// Run the pre-rendering
prerender();