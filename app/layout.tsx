import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SymptomSense — AI Health Checker',
  description: 'Educational AI-powered symptom checker. For informational purposes only.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
