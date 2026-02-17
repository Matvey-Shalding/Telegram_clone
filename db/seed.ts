'use server'

import { auth } from '@/auth'
import { prisma } from './prisma'

async function main() {
	console.log('🧹 Clearing database...')

	// Order matters
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
	// 1. Create users (BetterAuth)
	// -----------------------------
	const users: { id: string }[] = []

	for (let i = 1; i <= 10; i++) {
		const result = await auth.api.signUpEmail({
			body: {
				email: `user${i}@example.com`,
				password: 'password123',
				name: `User ${i}`
			}
		})

		users.push({ id: result.user.id })
	}

	console.log('✔ Created users')

	// -----------------------------
	// 2. Create conversations
	// -----------------------------
	const conversations = await Promise.all(
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
	// 3. Add members
	// -----------------------------
	for (const convo of conversations) {
		const memberCount = convo.id === conversations[0].id ? 2 : 4

		await prisma.conversationMember.createMany({
			data: users.slice(0, memberCount).map(u => ({
				conversationId: convo.id,
				userId: u.id
			}))
		})
	}

	console.log('✔ Added conversation members')

	// -----------------------------
	// Utility: random date
	// -----------------------------
	function randomDateWithinMonths(monthsBack: number) {
		const now = new Date()
		const past = new Date()
		past.setMonth(now.getMonth() - monthsBack)

		return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()))
	}

	// -----------------------------
	// 4. Create messages + update conversation summary
	// -----------------------------
	for (const convo of conversations) {
		const messageCount = convo === conversations[0] ? 100 : 4

		let lastMessageAt: Date | null = null
		let lastMessagePreview: string | null = null

		for (let i = 0; i < messageCount; i++) {
			const sender = users[(i + Math.floor(Math.random() * users.length)) % users.length]
			const createdAt = randomDateWithinMonths(convo === conversations[0] ? 6 : 3)

			const content = `Message ${i + 1} in ${convo.title ?? convo.id}`

			await prisma.message.create({
				data: {
					conversationId: convo.id,
					senderId: sender.id,
					content,
					createdAt
				}
			})

			// Track last message
			if (!lastMessageAt || createdAt > lastMessageAt) {
				lastMessageAt = createdAt
				lastMessagePreview = content.slice(0, 100)
			}
		}

		// ✅ Update conversation summary ONCE
		await prisma.conversation.update({
			where: { id: convo.id },
			data: {
				lastMessageAt,
				lastMessagePreview
			}
		})
	}

	console.log('✔ Created messages and updated conversation summaries')

	// -----------------------------
	// 5. Add reactions
	// -----------------------------
	const reactions = ['👍', '❤️', '😂', '🔥']
	const messages = await prisma.message.findMany({ take: 20 })

	for (let i = 0; i < messages.length; i++) {
		await prisma.messageReaction.create({
			data: {
				messageId: messages[i].id,
				userId: users[i % users.length].id,
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
