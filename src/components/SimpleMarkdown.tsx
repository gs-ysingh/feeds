import React from 'react';

export interface SimpleMarkdownProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable SimpleMarkdown component for rendering rich text
 * Supports **bold**, *italic*, and line breaks
 * Eliminates duplication from FeedItem and can be used elsewhere
 */
export const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ 
  text, 
  className,
  style 
}) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  
  return (
    <div className={className} style={style}>
      {lines.map((line, i) => (
        <span key={i}>
          {line
            .split(/(\*\*[^*]+\*\*)/g)
            .map((part, j) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={j}>{part.slice(2, -2)}</strong>
              ) : (
                part.split(/(\*[^*]+\*)/g).map((sub, k) =>
                  sub.startsWith('*') && sub.endsWith('*') ? (
                    <em key={k}>{sub.slice(1, -1)}</em>
                  ) : (
                    <React.Fragment key={k}>{sub}</React.Fragment>
                  )
                )
              )
            )}
          <br />
        </span>
      ))}
    </div>
  );
};
