import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { listBlogPosts, getBlogCategories, type BlogPostData } from '@/lib/blogPosts';

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const tagFromUrl = searchParams.get('tag') ?? '';
  const [searchQuery, setSearchQuery] = useState(tagFromUrl);
  const [debouncedSearch, setDebouncedSearch] = useState(tagFromUrl);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Sync tag from URL when user clicks a tag (e.g. /blog?tag=investing)
  useEffect(() => {
    if (tagFromUrl && (searchQuery !== tagFromUrl || debouncedSearch !== tagFromUrl)) {
      setSearchQuery(tagFromUrl);
      setDebouncedSearch(tagFromUrl);
      setPage(1);
    }
  }, [tagFromUrl]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories from Firestore
  useEffect(() => {
    getBlogCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch posts from Firestore
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listBlogPosts({
        category: selectedCategory,
        search: debouncedSearch,
        page,
        perPage: 9,
      });
      setPosts(result.posts);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const featuredPosts = posts.filter(p => p.featured);
  const regularPosts = posts.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main id="main-content">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8" aria-label="Blog introduction">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <span className="text-amber-400 text-sm font-medium">Property Investment Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            The Build Wealth Through Property
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600"> Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Expert articles, guides, and insights to help you build wealth through property investment. Learn from real experience, not theory.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-800/60 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 transition-all text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-slate-900'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'
              }`}
            >
              All Articles
              {total > 0 && selectedCategory === 'all' && (
                <span className="ml-2 text-xs opacity-75">({total})</span>
              )}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-slate-700/50" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-700/50 rounded w-1/4" />
                    <div className="h-6 bg-slate-700/50 rounded w-3/4" />
                    <div className="h-4 bg-slate-700/50 rounded w-full" />
                    <div className="h-4 bg-slate-700/50 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
              <p className="text-slate-400">
                {debouncedSearch
                  ? `No results for "${debouncedSearch}". Try a different search term.`
                  : 'No articles in this category yet. Check back soon!'}
              </p>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {featuredPosts.length > 0 && page === 1 && !debouncedSearch && (
                <div className="mb-12">
                  {featuredPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group block bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-300"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative h-64 lg:h-auto">
                          {post.cover_image ? (
                            <img
                              src={post.cover_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-slate-800 flex items-center justify-center">
                              <svg className="w-16 h-16 text-amber-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="bg-amber-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="p-8 lg:p-10 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="bg-amber-500/10 text-amber-400 text-xs font-medium px-3 py-1 rounded-full border border-amber-500/20">
                              {post.category}
                            </span>
                            <span className="text-slate-500 text-sm flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {post.read_time_minutes} min read
                            </span>
                          </div>
                          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                            {post.title}
                          </h2>
                          <p className="text-slate-400 text-lg leading-relaxed mb-6">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-sm">
                                {post.author_name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">{post.author_name}</p>
                                <p className="text-slate-500 text-xs">{formatDate(post.published_at)}</p>
                              </div>
                            </div>
                            <span className="text-amber-400 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                              Read Article
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Regular Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {post.cover_image ? (
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-slate-800 flex items-center justify-center">
                          <svg className="w-12 h-12 text-amber-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-slate-900/80 backdrop-blur-sm text-amber-400 text-xs font-medium px-3 py-1 rounded-lg border border-amber-500/20">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(post.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {post.read_time_minutes} min
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-xs">
                            {post.author_name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="text-slate-400 text-sm">{post.author_name}</span>
                        </div>
                        <span className="text-amber-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        p === page
                          ? 'bg-amber-500 text-slate-900'
                          : 'bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-500/10 to-slate-800/60 border border-amber-500/20 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Get Property Investment Insights Delivered
            </h2>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              Join thousands of investors receiving our free Starter Pack with practical tools, checklists, and guides.
            </p>
            <Link
              to="/start"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Get the Free Starter Pack
            </Link>
          </div>
        </div>
      </section>
      </main>
      <Footer compact />

    </div>
  );
};

export default Blog;
