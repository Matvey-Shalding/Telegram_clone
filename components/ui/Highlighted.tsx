'use client'

interface Props {
	text: string
	query?: string
	isActive?: boolean
	invertColors?: boolean
	disabled?: boolean
}

export const Highlight: React.FC<Props> = ({ text, query, isActive, invertColors, disabled }) => {

	console.log(disabled,'disabled')

	if (!query?.trim() || disabled) return <span>{text}</span>

	const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const regex = new RegExp(`(${escaped})`, 'gi')
	const parts = text.split(regex)

	return (
		<span className="whitespace-pre-wrap break-words">
			{parts.map((part, i) =>
				part.toLowerCase() === query.toLowerCase() ? (
					<mark
						key={i}
						className={`rounded px-0.5 font-medium ${
							isActive
								? invertColors
									? 'bg-white text-black'
									: 'bg-orange-400/90 text-black'
								: invertColors
									? 'bg-white/80 text-black'
									: 'bg-yellow-300/80 text-black'
						}`}
					>
						{part}
					</mark>
				) : (
					<span key={i}>{part}</span>
				)
			)}
		</span>
	)
}
