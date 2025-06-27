import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { BlogCard } from './BlogCard';
import { BlogModal } from './BlogModal';
import { CategorySidebar } from './CategorySidebar';
import { MobileHeader } from './MobileHeader';
import { DarkModeToggle } from './DarkModeToggle';
import { NewsletterForm } from './NewsletterForm';
import { SearchSubscribeToggle } from './SearchSubscribeToggle';
import { aboutPost, notFoundPost } from '../data/blogData';
import { LinkedinIcon } from 'lucide-react';
import { sanityClient, POSTS_QUERY, CATEGORIES_QUERY } from '../lib/sanityClient';
import { slugify, findPostBySlug, filterPostsBySearchQuery } from '../utils/slugify';
import { getCategoryColor } from '../utils/categoryColorUtils';

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

interface Category {
  name: string;
  color: string;
}

export function BlogLayout() {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const location = useLocation();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Fetch blog posts and categories from Sanity
  useEffect(() => {
    async function fetchData() {
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
    let filtered = selectedCategory === 'All' 
      ? posts 
      : posts.filter((post: Post) => post.category === selectedCategory);
    
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      filtered = filterPostsBySearchQuery(filtered, searchQuery);
    }
    
    return filtered;
  }, [posts, selectedCategory, searchQuery]);

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
          categories={categories} 
          selectedCategory={selectedCategory} 
          onCategorySelect={handleCategorySelect} 
          onAboutClick={handleAboutClick} 
        />
      </div>

      {/* Mobile Menu Overlay - only shows on small screens */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMobileMenu}>
          <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <CategorySidebar 
              categories={categories} 
              selectedCategory={selectedCategory} 
              onCategorySelect={handleCategorySelect} 
              onAboutClick={handleAboutClick}
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
            <div className="hidden lg:flex justify-between items-center mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex items-center overflow-hidden" style={{ width: '600px', maxWidth: '600px' }}>
                <div className="px-4 py-4 w-full">
                  <SearchSubscribeToggle className="w-full" onSearch={handleSearch} />
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

            {/* Tablet Subscribe Section - shows on medium screens only */}
            <div className="hidden md:block lg:hidden mb-8">
              <div className="flex items-start gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden max-w-md flex-1">
                  <div className="px-4 py-4">
                    <NewsletterForm className="w-full" />
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
            </div>

            {/* Mobile Subscribe Section - only shows on small screens */}
            <div className="md:hidden mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-4">
                  <NewsletterForm 
                    className="w-full"
                    placeholder="Get free weekly updates"
                  />
                </div>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-600 dark:text-gray-400">Loading posts...</div>
              </div>
            )}

            {error && (
              <div className="flex justify-center items-center py-12">
                <div className="text-red-500">Error loading posts: {error}</div>
              </div>
            )}

            {/* Blog Cards Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {filteredPosts.map(post => (
                  <BlogCard key={post.id} post={post} onClick={() => handlePostClick(post)} />
                ))}
              </div>
            )}

            {/* No posts message */}
            {!loading && !error && filteredPosts.length === 0 && (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-600 dark:text-gray-400">
                  {searchQuery.trim() ? (
                    `No posts found for "${searchQuery}"${selectedCategory !== 'All' ? ` in "${selectedCategory}" category` : ''}.`
                  ) : (
                    selectedCategory === 'All' ? 'No posts found.' : `No posts found in "${selectedCategory}" category.`
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