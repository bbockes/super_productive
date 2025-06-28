import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { BlogCard } from './BlogCard';
import { LinkCard } from './LinkCard';
import { BlogModal } from './BlogModal';
import { CategorySidebar } from './CategorySidebar';
import { MobileHeader } from './MobileHeader';
import { DarkModeToggle } from './DarkModeToggle';
import { NewsletterForm } from './NewsletterForm';
import { SearchSubscribeToggle } from './SearchSubscribeToggle';
import { aboutPost, notFoundPost } from '../data/blogData';
import { LinkedinIcon } from 'lucide-react';
import { sanityClient, POSTS_QUERY, CATEGORIES_QUERY, LINK_CARDS_QUERY, LINK_CARD_CATEGORIES_QUERY } from '../lib/sanityClient';
import { slugify, findPostBySlug, filterPostsBySearchQuery } from '../utils/slugify';
import { generateMetaDescription, generatePageTitle, DEFAULT_OG_IMAGE } from '../utils/seoUtils.js';
import { getCategoryColor } from '../utils/categoryColorUtils';
import { 
  generateOrganizationSchema, 
  generateWebSiteSchema, 
  generateBlogSchema,
  insertMultipleStructuredData 
} from '../utils/schemaUtils';

// Add type definitions for posts and categories
interface Post {
  id: string;
  title: string;
  image?: string;
  read_time?: number | string;
  readTime?: number | string;
  created_at?: string;
  publishedAt?: string;
  slug: string;
  category?: string;
  subheader?: string;
  excerpt?: string;
  [key: string]: any;
}

interface LinkCard {
  _id: string;
  title: string;
  image: string;
  url: string;
  category?: string;
}

interface Category {
  name: string;
  color: string;
}

// Helper function to set or update a meta tag
function setMetaTag(property: string, content: string, isName = false) {
  const attributeName = isName ? 'name' : 'property';
  let element = document.querySelector(`meta[${attributeName}="${property}"]`) as HTMLMetaElement;
  
  if (element) {
    element.content = content;
  } else {
    element = document.createElement('meta');
    element.setAttribute(attributeName, property);
    element.content = content;
    document.head.appendChild(element);
  }
}

// Helper function to remove a meta tag
function removeMetaTag(property: string, isName = false) {
  const attributeName = isName ? 'name' : 'property';
  const element = document.querySelector(`meta[${attributeName}="${property}"]`);
  if (element) {
    element.remove();
  }
}

// Helper function to set canonical URL
function setCanonicalUrl(url: string) {
  let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (canonicalElement) {
    canonicalElement.href = url;
  } else {
    canonicalElement = document.createElement('link');
    canonicalElement.rel = 'canonical';
    canonicalElement.href = url;
    document.head.appendChild(canonicalElement);
  }
}

// Helper function to get the current full URL
function getCurrentUrl(): string {
  return window.location.href;
}

// Helper function to get canonical URL without trailing slash
function getCanonicalUrl(): string {
  const baseUrl = window.location.origin;
  const pathname = window.location.pathname;
  
  // Remove trailing slash except for root
  const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
  return `${baseUrl}${cleanPath}`;
}

export function BlogLayout() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [linkCards, setLinkCards] = useState<LinkCard[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [linkCategories, setLinkCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [linkLoading, setLinkLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isLinkMode, setIsLinkMode] = useState<boolean>(false);

  // Update meta tags when selectedPost changes
  useEffect(() => {
    if (selectedPost) {
      // Set the document title
      document.title = generatePageTitle(selectedPost);
      
      // Get description from excerpt, subheader, or content
      const description = generateMetaDescription(selectedPost);
      
      // Set Open Graph meta tags
      setMetaTag('og:title', selectedPost.title);
      setMetaTag('og:description', description);
      setMetaTag('og:type', 'article');
      setMetaTag('og:url', getCurrentUrl());
      setMetaTag('og:site_name', 'Super Productive');
      
      // Always set og:image - use post image or default
      const ogImage = selectedPost.image || DEFAULT_OG_IMAGE;
      setMetaTag('og:image', ogImage);
      setMetaTag('og:image:alt', selectedPost.title);
      setMetaTag('og:image:width', '1200');
      setMetaTag('og:image:height', '630');
      
      // Set Twitter Card meta tags
      setMetaTag('twitter:card', 'summary_large_image', true);
      setMetaTag('twitter:title', selectedPost.title, true);
      setMetaTag('twitter:description', description, true);
      
      // Always set twitter:image - use post image or default
      const twitterImage = selectedPost.image || DEFAULT_OG_IMAGE;
      setMetaTag('twitter:image', twitterImage, true);
      setMetaTag('twitter:image:alt', selectedPost.title, true);
      
      // Set additional meta tags
      setMetaTag('description', description, true);
      
      if (selectedPost.category) {
        setMetaTag('article:section', selectedPost.category);
      }
      
      if (selectedPost.publishedAt || selectedPost.created_at) {
        setMetaTag('article:published_time', selectedPost.publishedAt || selectedPost.created_at);
      }
    } else {
      // Reset to default meta tags when no post is selected
      document.title = generatePageTitle(null);
      
      const defaultDescription = 'Bite-sized tech tips to level up your productivity. Weekly newsletter with AI prompts, productivity tools, and smart workflows.';
      
      // Set default Open Graph meta tags
      setMetaTag('og:title', 'Super Productive');
      setMetaTag('og:description', defaultDescription);
      setMetaTag('og:type', 'website');
      setMetaTag('og:url', getCurrentUrl());
      setMetaTag('og:site_name', 'Super Productive');
      
      // Always set default og:image for homepage
      setMetaTag('og:image', DEFAULT_OG_IMAGE);
      setMetaTag('og:image:alt', 'Super Productive - Bite-sized tech tips to level up your productivity');
      setMetaTag('og:image:width', '1200');
      setMetaTag('og:image:height', '630');
      
      // Set default Twitter Card meta tags
      setMetaTag('twitter:card', 'summary_large_image', true);
      setMetaTag('twitter:title', 'Super Productive', true);
      setMetaTag('twitter:description', defaultDescription, true);
      
      // Always set default twitter:image for homepage
      setMetaTag('twitter:image', DEFAULT_OG_IMAGE, true);
      setMetaTag('twitter:image:alt', 'Super Productive - Bite-sized tech tips to level up your productivity', true);
      
      // Set default meta description
      setMetaTag('description', defaultDescription, true);
      
      // Remove article-specific meta tags (but keep the default image tags)
      removeMetaTag('article:section');
      removeMetaTag('article:published_time');
    }

    // Update structured data based on current page
    updateStructuredData();
    
    // Set canonical URL
    const canonicalUrl = getCanonicalUrl();
    setCanonicalUrl(canonicalUrl);
  }, [selectedPost]);

  // Function to update structured data
  const updateStructuredData = () => {
    const schemas = [
      generateOrganizationSchema(),
      generateWebSiteSchema()
    ];

    // Add page-specific schema
    if (!selectedPost) {
      // Homepage - add Blog schema
      schemas.push(generateBlogSchema());
    }

    insertMultipleStructuredData(schemas);
  };

  // Fetch blog posts and categories from Sanity
  useEffect(() => {
    async function fetchData() {
      console.log('🔧 Sanity Config:', {
        projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
        dataset: import.meta.env.VITE_SANITY_DATASET,
        apiVersion: import.meta.env.VITE_SANITY_API_VERSION
      });
      
      setLoading(true);
      
      try {
        // Fetch posts from Sanity
        const postsData = await sanityClient.fetch(POSTS_QUERY);
        
        // Transform Sanity data to match expected format
        const transformedPosts: Post[] = postsData.map((post: any) => ({
          ...post,
          id: post._id,
          read_time: post.readTime,
          created_at: post.publishedAt,
          slug: post.slug?.current || slugify(post.title)
        }));

        setPosts(transformedPosts);

        // Fetch categories from Sanity
        const categoriesData = await sanityClient.fetch(CATEGORIES_QUERY);
        
        // Extract unique categories and format them with colors
        const uniqueCategories = [...new Set(categoriesData.map((item: any) => item.category).filter(Boolean))] as string[];
        const formattedCategories: Category[] = [
          { name: 'All', color: getCategoryColor('All') },
          ...uniqueCategories.map((categoryName) => ({
            name: categoryName,
            color: getCategoryColor(categoryName)
          }))
        ];

        setCategories(formattedCategories);
      } catch (err: any) {
        console.error('❌ Error fetching blog data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch link cards and categories from Sanity
  useEffect(() => {
    async function fetchLinkData() {
      console.log('🔗 Fetching link cards...');
      setLinkLoading(true);
      
      try {
        // Fetch link cards from Sanity
        const linkCardsData = await sanityClient.fetch(LINK_CARDS_QUERY);
        setLinkCards(linkCardsData);

        // Fetch link categories from Sanity
        const linkCategoriesData = await sanityClient.fetch(LINK_CARD_CATEGORIES_QUERY);
        
        // Extract unique categories and format them with colors
        const uniqueLinkCategories = [...new Set(linkCategoriesData.map((item: any) => item.category).filter(Boolean))] as string[];
        const formattedLinkCategories: Category[] = [
          { name: 'All', color: getCategoryColor('All') },
          ...uniqueLinkCategories.map((categoryName) => ({
            name: categoryName,
            color: getCategoryColor(categoryName)
          }))
        ];

        setLinkCategories(formattedLinkCategories);
      } catch (err: any) {
        console.error('❌ Error fetching link data:', err);
        setLinkError(err.message);
      } finally {
        setLinkLoading(false);
      }
    }

    fetchLinkData();
  }, []);

  // Handle URL-based post selection
  useEffect(() => {
    console.log('🔍 Current pathname:', location.pathname);
    console.log('🔍 URL slug from params:', slug);
    console.log('📝 Posts available:', posts.length);
    
    // Known routes for validation
    const knownRoutes = ['/', '/about', '/super_productive/', '/super_productive'];
    const isKnownRoute = knownRoutes.includes(location.pathname) || 
                         location.pathname.startsWith('/posts/');
    
    // Check if we're on the about page
    if (location.pathname.endsWith('/about')) {
      console.log('✅ On about page, setting selectedPost to aboutPost');
      setSelectedPost(aboutPost);
      console.log('📄 aboutPost content:', aboutPost);
    } else if (slug && posts.length > 0) {
      console.log('🔎 Looking for post with slug:', slug);
      const post = findPostBySlug(posts, slug);
      if (post) {
        console.log('✅ Found post, setting selectedPost:', post.title);
        setSelectedPost(post);
      } else {
        console.log('❌ Post not found, showing 404');
        // Post not found, show 404 page
        setSelectedPost(notFoundPost);
      }
    } else if (knownRoutes.includes(location.pathname)) {
      console.log('🏠 On home page, clearing selectedPost');
      setSelectedPost(null);
    } else if (!isKnownRoute) {
      console.log('❌ Unknown route, showing 404 page');
      // Unknown route, show 404 page
      setSelectedPost(notFoundPost);
    }
  }, [location.pathname, slug, posts]);

  // Debug selectedPost changes
  useEffect(() => {
    console.log('🎯 selectedPost state changed:', selectedPost ? selectedPost.title : 'null');
    console.log('🎯 selectedPost full object:', selectedPost);
  }, [selectedPost]);

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    if (isLinkMode) {
      // Filter link cards
      let filtered = selectedCategory === 'All' 
        ? linkCards 
        : linkCards.filter((card: LinkCard) => card.category === selectedCategory);
      
      // Apply search filter if there's a search query
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((card: LinkCard) => 
          card.title.toLowerCase().includes(searchTerm) ||
          (card.category && card.category.toLowerCase().includes(searchTerm))
        );
      }
      
      return filtered;
    }
    
    // Filter blog posts (existing logic)
    let filtered = selectedCategory === 'All' 
      ? posts 
      : posts.filter((post: Post) => post.category === selectedCategory);
    
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      filtered = filterPostsBySearchQuery(filtered, searchQuery);
    }
    
    return filtered;
  }, [posts, linkCards, selectedCategory, searchQuery, isLinkMode]);

  const handlePostClick = (post: Post) => {
    console.log('🖱️ Post clicked:', post.title);
    const postSlug = post.slug; // Use the actual slug from Sanity
    console.log('🔗 Navigating to slug:', postSlug);
    navigate(`/posts/${postSlug}`);
  };

  const handleAboutClick = () => {
    console.log('ℹ️ About button clicked, navigating to /about');
    navigate('/about');
  };

  const handleCloseModal = () => {
    console.log('❌ Modal close requested, navigating to home');
    navigate('/');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsMobileMenuOpen(false);
    
    // Navigate to home page when "All" is selected
    if (category === 'All') {
      navigate('/');
      // Clear search query to show all posts
      setSearchQuery('');
    }
  };

  const handleToggleMode = () => {
    setIsLinkMode(!isLinkMode);
    setSelectedCategory('All'); // Reset category when switching modes
    setSearchQuery(''); // Clear search when switching modes
  };

  const handleSearch = useCallback((query: string) => {
    console.log('Search called with query:', query);
    setSearchQuery(query);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-x-hidden">
      {/* Desktop/Tablet Sidebar - shows on medium screens and up */}
      <div className="hidden md:block flex-shrink-0">
        <CategorySidebar 
          categories={isLinkMode ? linkCategories : categories} 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect} 
          onAboutClick={handleAboutClick}
          isLinkMode={isLinkMode}
          onToggleLinkMode={handleToggleMode}
        />
      </div>

      {/* Mobile Menu Overlay - only shows on small screens */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <CategorySidebar 
              categories={isLinkMode ? linkCategories : categories} 
              selectedCategory={selectedCategory} 
              onCategorySelect={handleCategorySelect} 
              onAboutClick={handleAboutClick}
              isLinkMode={isLinkMode}
              onToggleLinkMode={handleToggleMode}
              isMobile={true}
              onClose={toggleMobileMenu}
            />
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col min-w-0 w-full">
        {/* Mobile Header - only shows on small screens */}
        <div className="md:hidden flex-shrink-0">
          <MobileHeader onMenuToggle={toggleMobileMenu} />
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto w-full">
            {/* Desktop Header - shows on large screens and up only */}
            {!isLinkMode ? (
              <div className="hidden lg:flex justify-between items-center mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center overflow-hidden" style={{ width: '600px', maxWidth: '600px' }}>
                  <div className="px-4 py-4 w-full">
                    <SearchSubscribeToggle 
                      className="w-full" 
                      onSearch={handleSearch}
                      placeholder="Get 3 new tips in your inbox every Wednesday"
                    />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
                    <DarkModeToggle />
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden lg:flex justify-between items-center mb-8">
                <div className="flex-1 flex justify-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Apps you know. Apps you don't.
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Every app on the blog—and then some.
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
                    <DarkModeToggle />
                  </div>
                </div>
              </div>
            )}

            {/* Tablet Subscribe Section - shows on medium screens only */}
            {!isLinkMode ? (
              <div className="hidden md:block lg:hidden mb-6">
                <div className="flex items-start gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden flex-1 tablet-subscribe-container">
                    <div className="px-4 py-4">
                      <SearchSubscribeToggle 
                        className="w-full"
                        onSearch={handleSearch}
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex-shrink-0 tablet-social-container">
                    <div className="flex items-center gap-3">
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <LinkedinIcon className="w-5 h-5" />
                      </a>
                      <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
                      <DarkModeToggle />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex lg:hidden justify-between items-center mb-6">
                <div className="flex-1 flex justify-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Apps you know. Apps you don't.
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      Every app on the blog—and then some.
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                    <div className="w-px h-5 bg-gray-300 dark:bg-gray-600"></div>
                    <DarkModeToggle />
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Subscribe Section - only shows on small screens */}
            {!isLinkMode ? (
              <div className="md:hidden mb-6 mobile-subscribe-container">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-4">
                    <SearchSubscribeToggle 
                      className="w-full mobile-search-toggle"
                      onSearch={handleSearch}
                      placeholder="Enter your email address"
                    />
                    <NewsletterForm 
                      className="w-full mobile-newsletter-fallback hidden"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:hidden mb-6">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white text-left">
                    Apps you know. Apps you don't.
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-left">
                    Every app on the blog—and then some.
                  </p>
                </div>
              </div>
            )}

            {/* Loading and Error States */}
            {(isLinkMode ? linkLoading : loading) && (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                  Loading {isLinkMode ? 'links' : 'posts'}...
                </div>
              </div>
            )}

            {(isLinkMode ? linkError : error) && (
              <div className="flex justify-center items-center py-12">
                <div className="text-red-500">
                  Error loading {isLinkMode ? 'links' : 'posts'}: {isLinkMode ? linkError : error}
                </div>
              </div>
            )}

            {/* Content Grid */}
            {!(isLinkMode ? linkLoading : loading) && !(isLinkMode ? linkError : error) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {isLinkMode ? (
                  filteredPosts.map((linkCard: any) => (
                    <LinkCard key={linkCard._id} linkCard={linkCard} />
                  ))
                ) : (
                  filteredPosts.map((post: any) => (
                    <BlogCard key={post.id} post={post} onClick={() => handlePostClick(post)} />
                  ))
                )}
              </div>
            )}

            {/* No content message */}
            {!(isLinkMode ? linkLoading : loading) && !(isLinkMode ? linkError : error) && filteredPosts.length === 0 && (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                  {isLinkMode ? (
                    searchQuery.trim() ? (
                      `No links found for "${searchQuery}"${selectedCategory !== 'All' ? ` in "${selectedCategory}" category` : ''}.`
                    ) : (
                      selectedCategory === 'All' ? 'No links found.' : `No links found in "${selectedCategory}" category.`
                    )
                  ) : (
                    searchQuery.trim() ? (
                      `No posts found for "${searchQuery}"${selectedCategory !== 'All' ? ` in "${selectedCategory}" category` : ''}.`
                    ) : (
                      selectedCategory === 'All' ? 'No posts found. Make sure to add some blog posts in your Sanity studio!' : `No posts found in "${selectedCategory}" category.`
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal - This should render when selectedPost is set */}
      {console.log('🎭 Rendering modal check - selectedPost exists:', !!selectedPost)}
      {selectedPost && !isLinkMode && (
        <>
          {console.log('🎭 Actually rendering BlogModal component')}
          <BlogModal post={selectedPost} onClose={handleCloseModal} />
        </>
      )}
    </div>
  );
}