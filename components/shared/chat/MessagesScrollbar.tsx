'use client'

import { cn } from '@/lib/utils'
import React from 'react'

type Props = React.HTMLAttributes<HTMLDivElement>

const Scrollbar = React.forwardRef<HTMLDivElement, Props>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			{...props}
			className={cn(
				// Make it the scroll container
				'overflow-y-auto overflow-x-hidden relative',

				// Firefox
				'[scrollbar-width:thin] [scrollbar-color:rgb(148,163,184)_transparent]',

				// WebKit base
				'[&::-webkit-scrollbar]:w-2.5',
				'[&::-webkit-scrollbar-track]:bg-transparent',
				'[&::-webkit-scrollbar-thumb]:rounded-full',

				// Radix ScrollArea thumb color
				'[&::-webkit-scrollbar-thumb]:bg-border',

				// Hover effect like Radix
				'[&::-webkit-scrollbar-thumb:hover]:bg-border/80',

				// Horizontal scrollbar support (Radix style)
				'[&::-webkit-scrollbar:horizontal]:h-2.5',
				'[&::-webkit-scrollbar-thumb:horizontal]:bg-border',
				'[&::-webkit-scrollbar-thumb:horizontal:hover]:bg-border/80',

				// Smooth transitions like Radix
				'transition-colors',

				className
			)}
		/>
	)
})


export const MessagesScrollbar = Scrollbar
