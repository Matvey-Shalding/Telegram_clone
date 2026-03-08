import { MessageReaction } from '@/generated/prisma/client'

export type ReactionGroup = {
	emoji: string
	reactions: MessageReaction[]
}

export function groupReactions(reactions: MessageReaction[]): ReactionGroup[] {
	const map = new Map<string, MessageReaction[]>()

	for (const reaction of reactions) {
		if (!map.has(reaction.reaction)) {
			map.set(reaction.reaction, [])
		}

		map.get(reaction.reaction)!.push(reaction)
	}

	return Array.from(map.entries()).map(([emoji, reactions]) => ({
		emoji,
		reactions
	}))
}
