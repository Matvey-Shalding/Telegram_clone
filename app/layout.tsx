'use client'

import { Providers } from '@/components/shared/Providers'
import { cn } from '@/lib/utils'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={cn(inter.variable, 'dark')}
		>
			<body className="antialiased min-h-full">
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
