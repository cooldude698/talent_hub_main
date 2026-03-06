import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  children?: React.ReactNode;
}

export const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image = '/og-image.jpg', // Default OG image
  url = 'https://rawgenn.com', 
  children 
}) => {
  const siteTitle = `${title} | RAWGENN`;

  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={description} />
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      {children}
    </>
  );
};

export default SEO;
