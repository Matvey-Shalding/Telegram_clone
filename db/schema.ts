import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
  varchar,
	pgEnum,
} from "drizzle-orm/pg-core";

// ----------------------
// ENUMS
// ----------------------
export const messageStatus = pgEnum("message_status", [
  "sent",
  "delivered",
  "read",
  "failed",
  "draft",
  "deleted",
]);

export const userRole = pgEnum("user_role", ["user", "admin"]);

// ----------------------
// USER (Better Auth compatible)
// ----------------------
export const user = pgTable("user", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type User = typeof user.$inferSelect;

// ----------------------
// SESSION
// ----------------------
export const session = pgTable(
  "session",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export type Session = typeof session.$inferSelect;

// ----------------------
// ACCOUNT
// ----------------------
export const account = pgTable(
  "account",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export type Account = typeof account.$inferSelect;

// ----------------------
// VERIFICATION
// ----------------------
export const verification = pgTable(
  "verification",
  {
    id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export type Verification = typeof verification.$inferSelect;

// ----------------------
// RELATIONS FOR AUTH TABLES
// ----------------------
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// ----------------------
// CONVERSATIONS
// ----------------------
export const conversations = pgTable("conversations", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  title: text("title"),
  isGroup: boolean("is_group").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;

// ----------------------
// CONVERSATION MEMBERS
// ----------------------
export const conversationMembers = pgTable("conversation_members", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversations.id),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type ConversationMember = typeof conversationMembers.$inferSelect;

// ----------------------
// MESSAGES
// ----------------------
export const messages = pgTable("messages", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  conversationId: integer("conversation_id")
    .notNull()
    .references(() => conversations.id),
  senderId: integer("sender_id")
    .notNull()
    .references(() => user.id),
  status: messageStatus("status").default("sent").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type Message = typeof messages.$inferSelect;

// ----------------------
// MESSAGE REACTIONS
// ----------------------
export const messageReactions = pgTable("message_reactions", {
  id: integer("id").generatedByDefaultAsIdentity().primaryKey(),
  messageId: integer("message_id")
    .notNull()
    .references(() => messages.id),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  reaction: varchar("reaction", { length: 30 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type MessageReaction = typeof messageReactions.$inferSelect;
