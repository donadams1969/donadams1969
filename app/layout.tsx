import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'VALORAIPLUS® //e — Valor Codex | Sovereign AI Operating System',
    template: '%s | VALORAIPLUS®',
  },
  description:
    'VALORAIPLUS® //e Voyager-Enterprise Edition. Sovereign AI + blockchain operating system. Saint Paul Genesis Node. N.E.W.T. cognitive prosthetic. Zero-drift architecture. DG77.77X.',
  generator: 'VALORAIPLUS®',
  applicationName: 'VALORAIPLUS® //e',
  keywords: [
    'VALORAIPLUS',
    'Valor AI+',
    'N.E.W.T.',
    'sovereign AI',
    'Saint Paul Node',
    'DG77.77X',
    'blockchain',
    'cognitive prosthetic',
    'post-quantum',
    'Valor Codex',
  ],
  authors: [{ name: 'Donny Gillson / DG77.77X', url: 'https://github.com/donadams1969' }],
  creator: 'That\'s Edutainment LLC / VALOR AI+',
  publisher: 'VALORAIPLUS®',
  metadataBase: new URL('https://donadams1969.vercel.app'), // update if different production domain
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'VALORAIPLUS® //e',
    title: 'VALORAIPLUS® //e — Valor Codex',
    description:
      'Sovereign AI Operating System. 14D Core • Saint Paul Genesis Node • N.E.W.T. Prosthetic • Zero-Drift Architecture.',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'VALORAIPLUS® Emblem',
      },
      {
        url: '/apple-icon.png',
        width: 180,
        height: 180,
        alt: 'VALORAIPLUS®',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VALORAIPLUS® //e — Valor Codex',
    description:
      'Sovereign AI Operating System. 14D Core • Saint Paul Genesis Node • N.E.W.T. Prosthetic • Zero-Drift Architecture.',
    images: ['/icon.svg'],
    creator: '@donadams1969',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
