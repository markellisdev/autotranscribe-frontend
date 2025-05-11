import "./globals.css";

export const metadata = {
  title: "AutoTranscribe",
  description: "AI Podcast Transcription Service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Link to Geist font from a CDN */}
        <link href="https://fonts.cdnfonts.com/css/geist" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}