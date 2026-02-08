interface Props {
	details: string
	title: string
}

export const ChatHeader: React.FC<Props> = ({ details, title }) => {
	return (
		<div className="border-b border-border bg-[#171717] px-5 h-15 shrink-0 w-full flex items-center justify-between">
			<div className="flex flex-col">
				<span className="text-white font-medium">{title}</span>
				<span className="text-xs text-sidebar-ring">{details}</span>
			</div>
		</div>
	)
}
