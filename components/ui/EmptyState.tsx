'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import * as React from 'react'

interface EmptyStateProps {
	title: string
	description?: string
	icon?: React.ReactNode
	action?: React.ReactNode
	className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, action, className }) => {
	return (
		<div className={cn('grid place-content-center', className)}>
			<Card className="w-full min-w-70 text-center">
				<CardHeader className="flex flex-col items-center gap-2">
					{icon && <div className="text-muted-foreground">{icon}</div>}
					<CardTitle>{title}</CardTitle>
					{description && <CardDescription>{description}</CardDescription>}
				</CardHeader>

				{action && <CardContent className="flex justify-center">{action}</CardContent>}
			</Card>
		</div>
	)
}
