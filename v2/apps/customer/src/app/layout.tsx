import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zepnest — Home Services, On Demand',
  description:
    'Zepnest brings trusted, on-demand home services to your doorstep — electricians, plumbers, AC repair, deep cleaning, salon and grooming, painting, and more.',
  applicationName: 'Zepnest',
  appleWebApp: { capable: true, title: 'Zepnest', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  themeColor: '#1C1C1E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
