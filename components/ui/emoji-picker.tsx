'use client'

import {
	type EmojiPickerListCategoryHeaderProps,
	type EmojiPickerListEmojiProps,
	type EmojiPickerListRowProps,
	EmojiPicker as EmojiPickerPrimitive
} from 'frimousse'
import { LoaderIcon, SearchIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '@/lib/utils'

function EmojiPicker({ className, ...props }: React.ComponentProps<typeof EmojiPickerPrimitive.Root>) {
	return (
		<EmojiPickerPrimitive.Root
			className={cn('bg-popover text-popover-foreground isolate flex flex-col overflow-hidden rounded-md', className)}
			data-slot="emoji-picker"
			{...props}
		/>
	)
}

function EmojiPickerSearch({ className, ...props }: React.ComponentProps<typeof EmojiPickerPrimitive.Search>) {
	return (
		<div
			className={cn('flex h-9 items-center gap-2 border-b px-3', className)}
			data-slot="emoji-picker-search-wrapper"
		>
			<SearchIcon className="size-4 shrink-0 opacity-50" />
			<EmojiPickerPrimitive.Search
				className="outline-hidden placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
				data-slot="emoji-picker-search"
				{...props}
			/>
		</div>
	)
}

function EmojiPickerRow({ children, ...props }: EmojiPickerListRowProps) {
	return (
		<div
			{...props}
			className="scroll-my-1 px-1"
			data-slot="emoji-picker-row"
		>
			{children}
		</div>
	)
}

function EmojiPickerEmoji({ emoji, className, ...props }: EmojiPickerListEmojiProps) {
	return (
		<button
			{...props}
			className={cn('data-[active]:bg-accent flex size-7 items-center justify-center rounded-sm text-base', className)}
			data-slot="emoji-picker-emoji"
		>
			{emoji.emoji}
		</button>
	)
}

function EmojiPickerCategoryHeader({ category, ...props }: EmojiPickerListCategoryHeaderProps) {
	return (
		<div
			{...props}
			className="bg-popover text-muted-foreground px-2 pb-2 border-b border-border pt-3.5 text-xs leading-none"
			data-slot="emoji-picker-category-header"
		>
			{category.label}
		</div>
	)
}

function EmojiPickerContent({ className, ...props }: React.ComponentProps<typeof EmojiPickerPrimitive.Viewport>) {
	return (
		<EmojiPickerPrimitive.Viewport
			className={cn(
				'outline-hidden relative flex-1 overflow-y-auto overflow-x-hidden',
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
			data-slot="emoji-picker-viewport"
			{...props}
		>
			<EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-muted-foreground">
				<LoaderIcon className="size-4 animate-spin" />
			</EmojiPickerPrimitive.Loading>

			<EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
				No emoji found.
			</EmojiPickerPrimitive.Empty>

			<EmojiPickerPrimitive.List
				className="select-none pb-1"
				components={{
					Emoji: EmojiPickerEmoji,
					Row: EmojiPickerRow,
					CategoryHeader: EmojiPickerCategoryHeader
				}}
			/>
		</EmojiPickerPrimitive.Viewport>
	)
}

function EmojiPickerFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			className={cn('max-w-(--frimousse-viewport-width) flex w-full min-w-0 items-center gap-1 border-t p-2', className)}
			data-slot="emoji-picker-footer"
			{...props}
		>
			<EmojiPickerPrimitive.ActiveEmoji>
				{({ emoji }) =>
					emoji ? (
						<>
							<div className="flex size-7 flex-none items-center justify-center text-lg">{emoji.emoji}</div>
							<span className="text-secondary-foreground truncate text-xs">{emoji.label}</span>
						</>
					) : (
						<span className="text-muted-foreground ml-1.5 flex h-7 items-center truncate text-xs">Select an emoji…</span>
					)
				}
			</EmojiPickerPrimitive.ActiveEmoji>
		</div>
	)
}

export { EmojiPicker, EmojiPickerContent, EmojiPickerFooter, EmojiPickerSearch }
