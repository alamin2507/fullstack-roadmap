import './globals.css';

export const metadata = {
  title: 'Free Full Stack Roadmap — by Sayem Al Amin',
  description: 'A free, complete, self-paced alternative to Programming Hero Batch 14. Track your progress through 11 milestones of full stack web development.',
  keywords: 'full stack, web development, roadmap, free, programming hero, self-study',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  );
}
