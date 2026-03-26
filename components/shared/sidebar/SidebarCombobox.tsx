'use client'

import { FieldLabel } from '@/components/ui'
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxItem,
	ComboboxList,
	ComboboxValue
} from '@/components/ui/combobox'
import { User } from '@/generated/prisma/client'
import { SetStateAction } from 'jotai'
import { Dispatch } from 'react'
import { Avatar } from '../Avatar'

export function SidebarCombobox({
	data,
	selectedUsersIds,
	setSelectedUsersIds
}: {
	data: User[]
	selectedUsersIds: User[]
	setSelectedUsersIds: Dispatch<SetStateAction<User[]>>
}) {
	return (
		<Combobox
			multiple
			autoHighlight
			items={data}
			defaultValue={[]}
			value={selectedUsersIds}
			onValueChange={setSelectedUsersIds}
		>
			<ComboboxGroup>
				<FieldLabel className="mb-2">Members</FieldLabel>

				<ComboboxChips className="w-full p-1.5!">
					<ComboboxValue>
						{values => (
							<>
								{values.map((value: User) => (
									<ComboboxChip key={value.id}>{value.name}</ComboboxChip>
								))}
								<ComboboxChipsInput />
							</>
						)}
					</ComboboxValue>
				</ComboboxChips>
				<ComboboxContent className="max-h-50! min-w-65! w-65! pointer-events-auto! overscroll-contain">
					<ComboboxEmpty>No items found.</ComboboxEmpty>

					<ComboboxList className="p-0!">
						{(item: User) => (
							<ComboboxItem
								onWheel={e => e.stopPropagation()}
								className="pointer-events-auto! transition-all rounded-none! flex items-center w-full"
								key={item.id}
								value={item}
							>
								<Avatar
									noBadge
									className="size-7"
								/>

								<div className="flex-1 flex flex-col text-left truncate">
									<span className="font-medium text-xs truncate">{item.name}</span>
									<span className="text-[10px] text-muted-foreground truncate">{item.email}</span>
								</div>
							</ComboboxItem>
						)}
					</ComboboxList>
				</ComboboxContent>
			</ComboboxGroup>
		</Combobox>
	)
}
