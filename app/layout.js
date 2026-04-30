import "./globals.css";

export const metadata = {
  title: "Daily Learning Tracker",
  description: "Track your daily learning journey — 30 or 45 day challenge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
