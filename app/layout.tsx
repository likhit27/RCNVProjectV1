import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RCNV Rotary Club Management',
  description: 'Rotary Club multi-tenant management with members, projects, news, and dues.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
