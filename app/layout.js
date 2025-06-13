import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "AutoTranscribe",
  description: "AI Podcast Transcription Service",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link href="https://fonts.cdnfonts.com/css/geist" rel="stylesheet" />
        </head>
        <body className="font-sans antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}