'use client'

import React from 'react'

interface HighlightProps {
	text: string
	query: string
	isActive?: boolean
	/** optionally invert colors for dark backgrounds */
	invertColors?: boolean
}

export const Highlight: React.FC<HighlightProps> = ({ text, query, isActive, invertColors = false }) => {
	if (!query) return <>{text}</>

	const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
	const parts = text.split(regex)

	// color mapping based on invert / active state
	const getClass = (active: boolean) => {
		if (active) {
			// active match
			return invertColors
				? 'bg-yellow-500 text-black font-semibold rounded px-[2px] shadow-[0_0_2px_#ffeb3b]'
				: 'bg-yellow-400 text-black font-semibold rounded px-[2px] shadow-[0_0_2px_#ffeb3b]'
		} else {
			// inactive match
			return invertColors ? 'bg-yellow-200 text-black rounded px-[1px]' : 'bg-yellow-100 text-black rounded px-[1px]'
		}
	}

	return (
		<>
			{parts.map((part, i) =>
				regex.test(part) ? (
					<span
						key={i}
						className={getClass(Boolean(isActive))}
					>
						{part}
					</span>
				) : (
					part
				)
			)}
		</>
	)
}
