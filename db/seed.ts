'use server'

import { auth } from '@/auth'
import { prisma } from './prisma'

async function main() {
	console.log('🧹 Clearing database...')

	// Order matters because of FK constraints
	await prisma.messageReaction.deleteMany()
	await prisma.message.deleteMany()
	await prisma.conversationMember.deleteMany()
	await prisma.conversation.deleteMany()

	// BetterAuth tables
	await prisma.verification.deleteMany()
	await prisma.account.deleteMany()
	await prisma.session.deleteMany()
	await prisma.user.deleteMany()

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

		users.push(result.user)
	}

	console.log('✔ Created users')

	// -----------------------------
	// 2. Create 10 conversations
	// -----------------------------
	const createdConversations = await Promise.all(
		Array.from({ length: 10 }).map((_, i) =>
			prisma.conversation.create({
				data: {
					title: `Conversation ${i + 1}`,
					isGroup: i !== 0
				}
			})
		)
	)

	console.log('✔ Created conversations')

	// -----------------------------
	// 3. Add members to conversations
	// -----------------------------
	for (const convo of createdConversations) {
		const memberCount = convo.id === createdConversations[0].id ? 2 : 4
		const selectedUsers = users.slice(0, memberCount)

		await prisma.conversationMember.createMany({
			data: selectedUsers.map(u => ({
				conversationId: convo.id,
				userId: u.id,
				joinedAt: new Date()
			}))
		})
	}

	console.log('✔ Added conversation members')

	// -----------------------------
	// 4. Create messages
	// -----------------------------
	const allMessages = []

	// Utility: random date within last N months
	function randomDateWithinMonths(monthsBack: number) {
		const now = new Date()
		const past = new Date()
		past.setMonth(now.getMonth() - monthsBack)

		const timestamp = past.getTime() + Math.random() * (now.getTime() - past.getTime())

		return new Date(timestamp)
	}

	// 100 messages in conversation 1
	const convo1 = createdConversations[0]

	for (let i = 0; i < 100; i++) {
		const sender = users[Math.floor(Math.random() * users.length)]

		const msg = await prisma.message.create({
			data: {
				conversationId: convo1.id,
				senderId: sender.id,
				content: `Message ${i + 1} in conversation 1`,
				createdAt: randomDateWithinMonths(6) // last 6 months
			}
		})

		allMessages.push(msg)
	}

	// 40 messages across other conversations
	for (let i = 1; i < createdConversations.length; i++) {
		const convo = createdConversations[i]

		for (let j = 0; j < 4; j++) {
			const sender = users[(i + j) % users.length]

			const msg = await prisma.message.create({
				data: {
					conversationId: convo.id,
					senderId: sender.id,
					content: `Message ${j + 1} in conversation ${convo.id}`,
					createdAt: randomDateWithinMonths(3)
				}
			})

			allMessages.push(msg)
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

		await prisma.messageReaction.create({
			data: {
				messageId: msg.id,
				userId: user.id,
				reaction: reactions[i % reactions.length]
			}
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
