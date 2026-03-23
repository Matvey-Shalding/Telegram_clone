import { MessageReaction, User } from '@/generated/prisma/client'

export type ReactionWithUser = MessageReaction & { user: User }
