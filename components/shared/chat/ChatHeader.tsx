import React from 'react'
interface Props {
	className?: string
	details: string
	title: string
}
export const ChatHeader: React.FC<Props> = ({ className, details, title }) => {
	return (
		<div className="sticky  border-b border-border top-0 left-0 bg-[#171717] p-2.5 pl-5 w-full flex justify-between">
			<div className="flex flex-col">
				<span className="text-white font-medium">{title}</span>
				<span className="text-xs text-sidebar-ring">{details}</span>
			</div>
		</div>
	)
}
