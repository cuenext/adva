import "./globals.css";

export const metadata = {
  title: "ADVA",
  description: "ADVA — creative, digital and event experiences."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
