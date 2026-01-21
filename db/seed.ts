import { db } from "@/db";
import { InferInsertModel } from "drizzle-orm";
import {
  conversationMembers,
  conversations,
  messageReactions,
  messages,
  users,
} from "./schema";

// Utility for random picks
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Types inferred from schema
type NewUser = InferInsertModel<typeof users>;
type NewConversation = InferInsertModel<typeof conversations>;
type NewConversationMember = InferInsertModel<typeof conversationMembers>;
type NewMessage = InferInsertModel<typeof messages>;
type NewReaction = InferInsertModel<typeof messageReactions>;

async function main() {
  // --- Users ---
  const userData: NewUser[] = [
    { email: "alice@example.com", username: "alice", password: "hash1" },
    { email: "bob@example.com", username: "bob", password: "hash2" },
    { email: "charlie@example.com", username: "charlie", password: "hash3" },
    { email: "diana@example.com", username: "diana", password: "hash4" },
    { email: "eve@example.com", username: "eve", password: "hash5" },
    { email: "frank@example.com", username: "frank", password: "hash6" },
    { email: "grace@example.com", username: "grace", password: "hash7" },
    { email: "heidi@example.com", username: "heidi", password: "hash8" },
    { email: "ivan@example.com", username: "ivan", password: "hash9" },
    { email: "judy@example.com", username: "judy", password: "hash10" },
  ];

  const insertedUsers = await db.insert(users).values(userData).returning();

  // --- Conversations ---
  const conversationData: NewConversation[] = [
    { title: "General Chat", isGroup: true },
    { title: "Project Alpha", isGroup: true },
    { title: "Random Banter", isGroup: true },
    { title: "Alice & Bob", isGroup: false },
    { title: "Charlie & Diana", isGroup: false },
  ];

  const insertedConversations = await db
    .insert(conversations)
    .values(conversationData)
    .returning();

  // --- Conversation Members ---
  const memberData: NewConversationMember[] = [];
  for (const conv of insertedConversations) {
    const randomUsers = insertedUsers
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    for (const u of randomUsers) {
      memberData.push({
        conversationId: conv.id,
        userId: u.id,
      });
    }
  }
  await db.insert(conversationMembers).values(memberData);

  // --- Messages ---
  const messageTexts = [
    "Hey everyone!",
    "How’s the project going?",
    "Did you see the latest update?",
    "Let’s meet tomorrow.",
    "I’ll push the code tonight.",
    "Haha that’s funny 😂",
    "Can you review my PR?",
    "Good morning!",
    "What’s the plan for the weekend?",
    "Congrats on the release!",
  ];

  const messageData: NewMessage[] = [];
  for (let i = 0; i < 50; i++) {
    const conv = randomItem(insertedConversations);
    const sender = randomItem(insertedUsers);
    messageData.push({
      conversationId: conv.id,
      senderId: sender.id,
      content: randomItem(messageTexts),
      status: "sent", // ✅ literal type matches enum
    });
  }
  const insertedMessages = await db
    .insert(messages)
    .values(messageData)
    .returning();

  // --- Reactions ---
  const reactions = ["👍", "❤️", "😂", "🔥", "😮"];
  const reactionData: NewReaction[] = [];
  for (let i = 0; i < 30; i++) {
    const msg = randomItem(insertedMessages);
    const user = randomItem(insertedUsers);
    reactionData.push({
      messageId: msg.id,
      userId: user.id,
      reaction: randomItem(reactions),
    });
  }
  await db.insert(messageReactions).values(reactionData);

  console.log(
    "✅ Seed complete: users, conversations, members, messages, reactions",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
