import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Font preconnects + Google Fonts stylesheet for Montserrat (display=swap) */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
          <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
          <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
          <link rel="preconnect" href="https://www.google-analytics.com" />
          {/* Recommend adding NEXT_PUBLIC_GA_ID to use analytics below */}
          {/* robots and theme-color */}
          <meta name="robots" content="index,follow" />
          <meta name="theme-color" content="#0f172a" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
