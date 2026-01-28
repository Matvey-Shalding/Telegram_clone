// seed.ts
import { db } from '@/db'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { account, conversationMembers, conversations, messageReactions, messages, session, user, verification } from './schema'

async function main() {
	// -----------------------------
	// CLEAR ALL EXISTING DATA
	// -----------------------------
	await db.delete(messageReactions)
	await db.delete(messages)
	await db.delete(conversationMembers)
	await db.delete(conversations)

	await db.delete(session)
	await db.delete(account)
	await db.delete(verification)

	await db.delete(user)

	console.log('🧹 All tables cleared')

	console.log('🌱 Seeding database...')

	// -----------------------------
	// USERS
	// -----------------------------
	const passwordHash = await bcrypt.hash('password123', 10)

	const [alice, bob, charlie] = await db
		.insert(user)
		.values([
			{
				name: 'Alice Johnson',
				email: 'alice@example.com',
				emailVerified: true,
				image: 'https://i.pravatar.cc/150?img=1'
			},
			{
				name: 'Bob Smith',
				email: 'bob@example.com',
				emailVerified: true,
				image: 'https://i.pravatar.cc/150?img=2'
			},
			{
				name: 'Charlie Brown',
				email: 'charlie@example.com',
				emailVerified: false,
				image: 'https://i.pravatar.cc/150?img=3'
			}
		])
		.returning()

	console.log('Users created')

	// -----------------------------
	// ACCOUNTS (BetterAuth)
	// -----------------------------
	await db.insert(account).values([
		{
			providerId: 'email',
			accountId: alice.email,
			userId: alice.id,
			password: passwordHash
		},
		{
			providerId: 'email',
			accountId: bob.email,
			userId: bob.id,
			password: passwordHash
		},
		{
			providerId: 'email',
			accountId: charlie.email,
			userId: charlie.id,
			password: passwordHash
		}
	])

	console.log('Accounts created')

	// -----------------------------
	// SESSIONS (BetterAuth)
	// -----------------------------
	const createSession = (userId: number) => ({
		userId,
		token: crypto.randomUUID(),
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
		ipAddress: '127.0.0.1',
		userAgent: 'seed-script'
	})

	await db.insert(session).values([createSession(alice.id), createSession(bob.id), createSession(charlie.id)])

	console.log('Sessions created')

	// -----------------------------
	// CONVERSATIONS
	// -----------------------------
	const [directConversation] = await db
		.insert(conversations)
		.values({
			title: null,
			isGroup: false
		})
		.returning()

	const [groupConversation] = await db
		.insert(conversations)
		.values({
			title: 'Project Alpha',
			isGroup: true
		})
		.returning()

	console.log('Conversations created')

	// -----------------------------
	// MEMBERS
	// -----------------------------
	await db.insert(conversationMembers).values([
		{ conversationId: directConversation.id, userId: alice.id },
		{ conversationId: directConversation.id, userId: bob.id },

		{ conversationId: groupConversation.id, userId: alice.id },
		{ conversationId: groupConversation.id, userId: bob.id },
		{ conversationId: groupConversation.id, userId: charlie.id }
	])

	console.log('Members added')

	// -----------------------------
	// MESSAGES
	// -----------------------------
	const insertedMessages = await db
		.insert(messages)
		.values([
			{
				conversationId: directConversation.id,
				senderId: alice.id,
				content: 'Hey Bob, how’s everything?',
				status: 'sent'
			},
			{
				conversationId: directConversation.id,
				senderId: bob.id,
				content: 'All good! You?',
				status: 'delivered'
			},
			{
				conversationId: groupConversation.id,
				senderId: charlie.id,
				content: 'Morning team! Ready for the meeting?',
				status: 'read'
			},
			{
				conversationId: groupConversation.id,
				senderId: alice.id,
				content: "Yep, let's do it.",
				status: 'sent'
			}
		])
		.returning()

	console.log('Messages created')

	// -----------------------------
	// REACTIONS
	// -----------------------------
	await db.insert(messageReactions).values([
		{
			messageId: insertedMessages[2].id,
			userId: bob.id,
			reaction: '👍'
		},
		{
			messageId: insertedMessages[2].id,
			userId: alice.id,
			reaction: '🔥'
		}
	])

	console.log('Reactions added')

	console.log('🌱 Seed completed successfully!')
}

main()
	.catch(err => {
		console.error('❌ Seed failed:', err)
		process.exit(1)
	})
	.finally(() => process.exit(0))
