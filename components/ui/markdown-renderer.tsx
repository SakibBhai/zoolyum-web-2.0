'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-lg max-w-none prose-container', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom image component with Next.js Image optimization
          img: ({ src, alt, ...props }) => {
            if (!src || typeof src !== 'string') return null;
            
            // Handle external URLs and internal paths
            const isExternal = src.startsWith('http');
            
            return (
              <div className="my-6 flex justify-center">
                <Image
                  src={src}
                  alt={alt || ''}
                  width={800}
                  height={400}
                  className="rounded-lg shadow-md max-w-full h-auto"
                  style={{ objectFit: 'contain' }}
                  {...(isExternal && { unoptimized: true })}
                />
              </div>
            );
          },
          
          // Custom link component with Next.js Link
          a: ({ href, children, ...props }) => {
            if (!href) return <span {...props}>{children}</span>;
            
            const isExternal = href.startsWith('http') || href.startsWith('mailto:');
            
            if (isExternal) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#FF5001] hover:text-[#FF5001]/80 underline"
                  {...props}
                >
                  {children}
                </a>
              );
            }
            
            return (
              <Link href={href} className="text-[#FF5001] hover:text-[#FF5001]/80 underline" {...props}>
                {children}
              </Link>
            );
          },
          
          // Custom heading components with proper styling
          h1: ({ children, ...props }) => (
            <h1 className="text-4xl font-bold mb-6 mt-8 text-[#E9E7E2]" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-3xl font-semibold mb-4 mt-6 text-[#E9E7E2]" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-2xl font-semibold mb-3 mt-5 text-[#E9E7E2]" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-xl font-semibold mb-2 mt-4 text-[#E9E7E2]" {...props}>
              {children}
            </h4>
          ),
          
          // Custom paragraph styling
          p: ({ children, ...props }) => (
            <p className="mb-4 leading-relaxed text-[#E9E7E2]" {...props}>
              {children}
            </p>
          ),
          
          // Custom list styling
          ul: ({ children, ...props }) => (
            <ul className="mb-4 pl-6 space-y-2 list-disc" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="mb-4 pl-6 space-y-2 list-decimal" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="text-[#E9E7E2]" {...props}>
              {children}
            </li>
          ),
          
          // Custom blockquote styling
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-[#FF5001] pl-4 py-2 my-4 bg-[#252525] italic text-[#E9E7E2]" {...props}>
              {children}
            </blockquote>
          ),
          
          // Custom code styling
          code: ({ children, className, ...props }) => {
            const isInline = !className;
            
            if (isInline) {
              return (
                <code className="bg-[#252525] px-1 py-0.5 rounded text-sm font-mono text-[#E9E7E2]" {...props}>
                  {children}
                </code>
              );
            }
            
            return (
              <code className="block bg-[#1A1A1A] text-[#E9E7E2] p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props}>
                {children}
              </code>
            );
          },
          
          // Custom pre styling for code blocks
          pre: ({ children, ...props }) => (
            <pre className="bg-[#1A1A1A] text-[#E9E7E2] p-4 rounded-lg overflow-x-auto my-4" {...props}>
              {children}
            </pre>
          ),
          
          // Custom table styling
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border-collapse border border-[#333333]" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="border border-[#333333] bg-[#252525] px-4 py-2 text-left font-semibold text-[#E9E7E2]" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-[#333333] px-4 py-2 text-[#E9E7E2]" {...props}>
              {children}
            </td>
          ),
          
          // Custom horizontal rule
          hr: ({ ...props }) => (
            <hr className="my-8 border-t-2 border-[#333333]" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}