import * as t from "drizzle-orm/pg-core"
import { pgEnum, pgTable as table } from "drizzle-orm/pg-core"

// Enums
export const messageStatus = pgEnum("message_status", [
  "sent",
  "delivered",
  "read",
  "failed",
  "draft",
  "deleted",
])

export const userRole = pgEnum("user_role", ["user", "admin"])

// Users
export const users = table("users", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  email: t.varchar({ length: 255 }).unique().notNull(),
  username: t.varchar({ length: 30 }).unique().notNull(),
  password: t.varchar({ length: 255 }).notNull(), 
  role: userRole().default("user").notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow(),
})

export type User = typeof users.$inferSelect

// Conversations
export const conversations = table("conversations", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  title: t.varchar({ length: 255 }),
  isGroup: t.boolean("is_group").default(false).notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
})

export type Conversation = typeof conversations.$inferSelect

// Conversation Members
export const conversationMembers = table("conversation_members", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  conversationId: t.integer("conversation_id")
    .notNull()
    .references(() => conversations.id),
  userId: t.integer("user_id")
    .notNull()
    .references(() => users.id),
  joinedAt: t.timestamp().notNull().defaultNow(),
})

export type ConversationMember = typeof conversationMembers.$inferSelect

// Messages
export const messages = table("messages", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  conversationId: t.integer("conversation_id")
    .notNull()
    .references(() => conversations.id),
  senderId: t.integer("sender_id")
    .notNull()
    .references(() => users.id),
  status: messageStatus().default("sent").notNull(),
  content: t.text("content").notNull(), 
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow(),
})

export type Message = typeof messages.$inferSelect

// Message Reactions
export const messageReactions = table("message_reactions", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  messageId: t.integer("message_id")
    .notNull()
    .references(() => messages.id),
  userId: t.integer("user_id")
    .notNull()
    .references(() => users.id),
  reaction: t.varchar({ length: 30 }).notNull(), 
  createdAt: t.timestamp().notNull().defaultNow(),
})

export type MessageReaction = typeof messageReactions.$inferSelect