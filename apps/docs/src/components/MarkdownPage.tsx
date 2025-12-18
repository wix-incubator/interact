import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { getMarkdownPath } from '../config/navigation';

export function MarkdownPage() {
  const location = useLocation();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      setLoading(true);
      setError(null);

      const mdPath = getMarkdownPath(location.pathname);
      
      try {
        // Use the /docs endpoint which serves from packages/interact/docs
        const response = await fetch(`/docs/${mdPath}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load: ${mdPath}`);
        }
        
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(`Could not load documentation for: ${location.pathname}`);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
    // Scroll to top on navigation
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Loading documentation...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>Page Not Found</h2>
        <p>{error}</p>
        <a href="/" className="back-link">← Back to Home</a>
      </div>
    );
  }

  return (
    <article className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom link handling for internal navigation
          a: ({ href, children, ...props }) => {
            if (href?.startsWith('./') || href?.startsWith('../')) {
              // Convert relative markdown links to router links
              const cleanHref = href
                .replace(/\.md$/, '')
                .replace(/\/README$/, '');
              return <a href={cleanHref} {...props}>{children}</a>;
            }
            if (href?.startsWith('http')) {
              return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
            }
            return <a href={href} {...props}>{children}</a>;
          },
          // Add copy button to code blocks
          pre: ({ children, ...props }) => (
            <div className="code-block-wrapper">
              <pre {...props}>{children}</pre>
            </div>
          ),
          // Style tables nicely
          table: ({ children, ...props }) => (
            <div className="table-wrapper">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
