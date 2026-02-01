'use server'

import { auth } from '@/auth'
import { db } from '@/db'
import { account, conversationMembers, conversations, messageReactions, messages, session, user, verification } from '@/db/schema'

async function main() {
	console.log('🧹 Clearing database...')

	// Order matters because of FK constraints
	await db.delete(messageReactions)
	await db.delete(messages)
	await db.delete(conversationMembers)
	await db.delete(conversations)

	// BetterAuth tables
	await db.delete(verification)
	await db.delete(account)
	await db.delete(session)
	await db.delete(user)

	console.log('✔ Database cleared')

	console.log('🌱 Seeding database...')

	// -----------------------------
	// 1. Create 10 BetterAuth users
	// -----------------------------
	const users = []

	for (let i = 1; i <= 10; i++) {
		const email = `user${i}@example.com`
		const password = 'password123'

		const result = await auth.api.signUpEmail({
			body: {
				email,
				password,
				name: `User ${i}`
			}
		})

		// const result = await auth.api.signUpEmail({
		// 	email,
		// 	password,
		// 	name: `User ${i}`
		// })

		users.push(result.user)
	}

	console.log('✔ Created users')

	// -----------------------------
	// 2. Create 10 conversations
	// -----------------------------
	const createdConversations = await db
		.insert(conversations)
		.values(
			Array.from({ length: 10 }).map((_, i) => ({
				title: `Conversation ${i + 1}`,
				isGroup: i !== 0 // first one is DM
			}))
		)
		.returning()

	console.log('✔ Created conversations')

	// -----------------------------
	// 3. Add members to conversations
	// -----------------------------
	for (const convo of createdConversations) {
		const memberCount = convo.id === 1 ? 2 : 4 // first chat = DM, others = groups
		const selectedUsers = users.slice(0, memberCount)

		await db.insert(conversationMembers).values(
			selectedUsers.map((user, i) => ({
				conversationId: convo.id,
				userId: +user.id,
				joinedAt: new Date()
			}))
		)
	}

	console.log('✔ Added conversation members')

	// -----------------------------
	// 4. Create messages
	// -----------------------------
	const allMessages = []

	// 60 messages in conversation 1 (spread across days)
	const convo1 = createdConversations[0]

	for (let i = 0; i < 60; i++) {
		const sender = users[i % 2] // alternate between 2 users
		const date = new Date()
		date.setDate(date.getDate() - (60 - i)) // spread across 60 days

		const msg = await db
			.insert(messages)
			.values({
				conversationId: convo1.id,
				senderId: +sender.id,
				content: `Message ${i + 1} in conversation 1`,
				createdAt: date
			})
			.returning()

		allMessages.push(msg[0])
	}

	// 40 messages across other conversations
	for (let i = 1; i < createdConversations.length; i++) {
		const convo = createdConversations[i]

		for (let j = 0; j < 4; j++) {
			const sender = users[(i + j) % users.length]

			const msg = await db
				.insert(messages)
				.values({
					conversationId: convo.id,
					senderId: +sender.id,
					content: `Message ${j + 1} in conversation ${convo.id}`
				})
				.returning()

			allMessages.push(msg[0])
		}
	}

	console.log('✔ Created messages')

	// -----------------------------
	// 5. Add reactions
	// -----------------------------
	const reactions = ['👍', '❤️', '😂', '🔥']

	for (let i = 0; i < 20; i++) {
		const msg = allMessages[i]
		const user = users[i % users.length]

		await db.insert(messageReactions).values({
			messageId: msg.id,
			userId: +user.id,
			reaction: reactions[i % reactions.length]
		})
	}

	console.log('✔ Added reactions')

	console.log('🌱 Seeding complete!')
}

main()
	.then(() => process.exit(0))
	.catch(err => {
		console.error(err)
		process.exit(1)
	})
