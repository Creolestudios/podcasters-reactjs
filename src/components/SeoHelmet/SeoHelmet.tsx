import React from 'react';
import Helmet from 'react-helmet';

interface IProps {
  displayTitle: string;
  metaDescription: string;
  metaUrl: string;
  metaImageUrl: string;
}

const SeoHelmet: React.FC<IProps> = ({
  displayTitle, metaDescription, metaUrl, metaImageUrl,
}) => (
  <div>
    <Helmet>
      <meta property='og:title' content={displayTitle || ''} />
      <meta property='og:description' content={metaDescription || ''} />
      <meta property='og:url' content={metaUrl || ''} />
      <meta property='og:image' content={metaImageUrl || ''} />
      <meta property='og:image:alt' content={displayTitle || ''} />
      <meta property='twitter:image' content={metaImageUrl || ''} />
      <meta property='twitter:image:alt' content={displayTitle || ''} />
      <meta name='twitter:title' content={displayTitle || ''} />
      <meta name='twitter:description' content={metaDescription || ''} />
      <meta property='og:type' content='website' />
    </Helmet>
  </div>
);

export default SeoHelmet;
