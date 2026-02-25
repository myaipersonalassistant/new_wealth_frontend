import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { getBlogPostBySlug, getRelatedPosts, type BlogPostData } from '@/lib/blogPosts';
import { fullUrl, jsonLdBlogPosting, plainTextExcerpt } from '@/lib/seo';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const postData = await getBlogPostBySlug(slug);
        if (postData) {
          setPost(postData);
          const related = await getRelatedPosts(postData.id, postData.category, 3);
          setRelatedPosts(related);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        console.error('Failed to fetch post:', err);
        setError('Failed to load article');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin text-amber-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-bold text-white mb-2">Article Not Found</h1>
          <p className="text-slate-400 mb-6">{error || 'The article you\'re looking for doesn\'t exist or has been removed.'}</p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const postUrl = fullUrl(`/blog/${post.slug}`);
  const description = post.excerpt || plainTextExcerpt(post.content || '', 160);
  const image = post.cover_image || null;
  const published = post.published_at ? new Date(post.published_at).toISOString() : '';
  const modified = post.updated_at ? new Date(post.updated_at).toISOString() : published;

  return (
    <div className="min-h-screen bg-slate-900">
      <SEO
        title={post.title}
        description={description}
        image={image}
        canonicalPath={`/blog/${post.slug}`}
        ogType="article"
        publishedTime={published}
        modifiedTime={modified}
        jsonLd={jsonLdBlogPosting({
          title: post.title,
          description,
          url: postUrl,
          image,
          datePublished: published,
          dateModified: modified,
          authorName: post.author_name,
        })}
      />
      <Header />
      <main id="main-content">
      {/* Article Header */}
      <article className="pt-24" aria-label="Article">
        {/* Cover Image */}
        {post.cover_image && (
          <div className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={post.cover_image ? '-mt-32 relative z-10' : 'pt-8'}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link to="/blog" className="hover:text-amber-400 transition-colors">Blog</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-400">{post.category}</span>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-amber-500/10 text-amber-400 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-500/20">
                {post.category}
              </span>
              <span className="text-slate-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {post.read_time_minutes} min read
              </span>
              <span className="text-slate-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(post.published_at)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Author + Share */}
            <div className="flex items-center justify-between pb-8 mb-8 border-b border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-900 font-bold">
                  {post.author_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-white font-semibold">{post.author_name}</p>
                  <p className="text-slate-500 text-sm">{post.author_bio ? (post.author_bio.length > 60 ? post.author_bio.slice(0, 60) + '...' : post.author_bio) : ''}</p>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>

            {/* Article Body */}
            <div
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-amber-400
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
                prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-em:text-slate-300
                prose-ul:text-slate-300 prose-ol:text-slate-300
                prose-li:mb-2 prose-li:leading-relaxed
                prose-code:text-amber-400 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-blockquote:border-amber-500 prose-blockquote:text-slate-400 prose-blockquote:bg-slate-800/30 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-4
                prose-img:rounded-xl prose-img:my-6 prose-img:shadow-lg
                [&_video]:rounded-xl [&_video]:my-6 [&_video]:w-full [&_video]:max-h-[400px]
                mb-12"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pb-8 mb-8 border-b border-slate-700/50">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 text-sm px-3 py-1 rounded-lg transition-all"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Author Card */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-12">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl flex-shrink-0">
                  {post.author_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm text-amber-400 font-medium mb-1">Written by</p>
                  <h3 className="text-xl font-bold text-white mb-2">{post.author_name}</h3>
                  <p className="text-slate-400 leading-relaxed mb-4">{post.author_bio}</p>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/blog"
                      className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                    >
                      View all articles
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-br from-amber-500/10 to-slate-800/60 border border-amber-500/20 rounded-2xl p-6 sm:p-8 mb-12 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                Ready to Start Your Property Investment Journey?
              </h3>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto">
                Get the free Starter Pack with practical checklists, calculators, and guides to help you take your first step.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/start"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Get the Free Starter Pack
                </Link>
                <Link
                  to="/calculator"
                  className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold px-6 py-3 rounded-xl transition-all border border-slate-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Try the Calculator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Related Articles</h2>
              <p className="text-slate-400">Continue learning about property investment</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/blog/${rp.slug}`}
                  className="group bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-44 overflow-hidden">
                    {rp.cover_image ? (
                      <img
                        src={rp.cover_image}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-slate-800 flex items-center justify-center">
                        <svg className="w-10 h-10 text-amber-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-slate-900/80 backdrop-blur-sm text-amber-400 text-xs font-medium px-2.5 py-1 rounded-lg">
                        {rp.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span>{formatDate(rp.published_at)}</span>
                      <span>·</span>
                      <span>{rp.read_time_minutes} min read</span>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                      {rp.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{rp.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                View All Articles
              </Link>
            </div>
          </div>
        </section>
      )}
      </main>
      <Footer compact />

    </div>
  );
};

export default BlogPost;
