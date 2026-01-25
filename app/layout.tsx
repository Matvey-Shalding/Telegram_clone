'use client'

import { cn } from '@/lib/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const queryClient = new QueryClient()

	return (
		<html
			lang="en"
			className={cn(inter.variable, 'dark')}
		>
			<QueryClientProvider client={queryClient}>
				<body className="antialiased min-h-full">{children}</body>
			</QueryClientProvider>
		</html>
	)
}
