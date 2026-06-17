import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RCNV – Rotary Navi Mumbai',
  description: 'Rotary Club management platform for members, projects, news, and dues.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
