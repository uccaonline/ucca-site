export const metadata = {
  title: "UCCA — Universal Capability Certification Authority",
  description: "The capability layer for the AI era. Versioned, verifiable, API-first capability objects for high-stakes industries.",
  keywords: "capability assurance, competency verification, enterprise workforce, API-first, defense, aviation, medical",
  openGraph: {
    title: "UCCA — Universal Capability Certification Authority",
    description: "Human capability is unstructured. We make it programmable.",
    url: "https://ucca.online",
    siteName: "UCCA",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#070A12" }}>
        {children}
      </body>
    </html>
  );
}
