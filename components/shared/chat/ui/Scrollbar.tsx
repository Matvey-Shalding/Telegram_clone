'use client'

import { cn } from '@/lib/utils'
import React from 'react'

type Props = React.HTMLAttributes<HTMLDivElement>

export const Scrollbar = React.forwardRef<HTMLDivElement, Props>(({ className, ...props }, ref) => {
	return (
		<div
			ref={ref}
			{...props}
			className={cn(
				'overflow-y-auto overflow-x-hidden relative',
				'[scrollbar-width:thin] [scrollbar-color:rgb(148,163,184)_transparent]',
				'[&::-webkit-scrollbar]:w-2.5',
				'[&::-webkit-scrollbar-track]:bg-transparent',
				'[&::-webkit-scrollbar-thumb]:rounded-full',
				'[&::-webkit-scrollbar-thumb]:bg-border',
				'[&::-webkit-scrollbar-thumb:hover]:bg-border/80',
				'[&::-webkit-scrollbar:horizontal]:h-2.5',
				'[&::-webkit-scrollbar-thumb:horizontal]:bg-border',
				'[&::-webkit-scrollbar-thumb:horizontal:hover]:bg-border/80',
				'transition-colors',
				className
			)}
		/>
	)
})

Scrollbar.displayName = 'MessagesScrollbar'
