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
import { aboutPost } from '../data/blogData';
import { LinkedinIcon } from 'lucide-react';
import { sanityClient, POSTS_QUERY, CATEGORIES_QUERY, LINK_CARDS_QUERY, LINK_CARD_CATEGORIES_QUERY } from '../lib/sanityClient';
import { slugify, findPostBySlug, filterPostsBySearchQuery } from '../utils/slugify';
import { generateMetaDescription, generatePageTitle, DEFAULT_OG_IMAGE } from '../utils/seoUtils.js';
import { getCategoryColor } from '../utils/categoryColorUtils';
import { getCategoryDisplayName, getSchemaCategory } from '../utils/categoryMappingUtils';
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
  hook: string;
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
  const { slug } = useParams();
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

  // Function to get category color based on name
  const getCategoryColor = (categoryName) => {
    const colorMap = {
      'All': 'bg-gray-800',
      'Writing': 'bg-blue-500',
      'Learning': 'bg-red-500',
      'Planning': 'bg-green-500',
      'Building': 'bg-pink-500',
      'Creativity': 'bg-yellow-500',
      'Growth': 'bg-purple-500',
      'Focus': 'bg-orange-500',
      'Communication': 'bg-indigo-500',
      'Thinking': 'bg-teal-500',
      'Shortcuts': 'bg-emerald-500'
    };
    return colorMap[categoryName] || 'bg-gray-500';
  };

  // Fetch blog posts and categories from Supabase
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
        const transformedPosts = postsData.map(post => ({
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
        const uniqueCategories = [...new Set(categoriesData.map(item => item.category).filter(Boolean))];
        const formattedCategories = [
          { name: 'All', color: getCategoryColor('All') },
          ...uniqueCategories.map(categoryName => ({
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
          ...uniqueLinkCategories.map((schemaCategory) => ({
            name: getCategoryDisplayName(schemaCategory),
            color: getCategoryColor(schemaCategory)
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
        console.log('❌ Post not found, redirecting to home');
        // Post not found, redirect to home
        navigate('/', { replace: true });
        setSelectedPost(null);
      }
    } else if (location.pathname === '/' || location.pathname === '/super_productive/' || location.pathname === '/super_productive') {
      console.log('🏠 On home page, clearing selectedPost');
      setSelectedPost(null);
    }
  }, [slug, posts, navigate, location.pathname]);

  // Debug selectedPost changes
  useEffect(() => {
    console.log('🎯 selectedPost state changed:', selectedPost ? selectedPost.title : 'null');
    console.log('🎯 selectedPost full object:', selectedPost);
  }, [selectedPost]);

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    if (isLinkMode) {
      // Filter link cards
      let filtered;
      if (selectedCategory === 'All') {
        filtered = linkCards;
      } else {
        // Convert display name back to schema category for filtering
        const schemaCategory = getSchemaCategory(selectedCategory);
        filtered = linkCards.filter((card: LinkCard) => card.category === schemaCategory);
      }
      
      // Apply search filter if there's a search query
      if (searchQuery.trim()) {
        const searchTerm = searchQuery.toLowerCase().trim();
        filtered = filtered.filter((card: LinkCard) => 
          card.hook.toLowerCase().includes(searchTerm) ||
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

  const handlePostClick = post => {
    console.log('🖱️ Post clicked:', post.title);
    const postSlug = slugify(post.title);
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

  const handleCategorySelect = (category) => {
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
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center overflow-hidden" style={{ width: '600px', maxWidth: '600px', minWidth: '600px' }}>
                  <div className="px-4 py-4 w-full">
                    <SearchSubscribeToggle 
                      className="w-full" 
                      onSearch={handleSearch}
                      placeholder="Get 3 new tips in your inbox every Wednesday"
                    />
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center flex-shrink-0 ml-auto">
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
              <div className="hidden lg:flex items-center mb-8">
                <div className="flex justify-start" style={{ width: '600px', maxWidth: '600px', minWidth: '600px' }}>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      <span className="text-[#7D1FF1] dark:text-[#AA75F0]">Apps you know.</span> <span className="text-gray-800 dark:text-gray-200">Apps you don't.</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Every app on the blog—and then some.
                    </p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center flex-shrink-0 ml-auto">
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
                      <span className="text-[#7D1FF1] dark:text-[#AA75F0]">Apps you know.</span> <span className="text-gray-800 dark:text-gray-200">Apps you don't.</span>
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
                    <span className="text-[#7D1FF1] dark:text-[#AA75F0]">Apps you know.</span> <span className="text-gray-800 dark:text-gray-200">Apps you don't.</span>
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
      {selectedPost && (
        <>
          {console.log('🎭 Actually rendering BlogModal component')}
          <BlogModal post={selectedPost} onClose={handleCloseModal} />
        </>
      )}
    </div>
  );
}