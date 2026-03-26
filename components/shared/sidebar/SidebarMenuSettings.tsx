'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Theme = 'light' | 'dark'

export const SidebarMenuSettings: React.FC = () => {
	const { theme, setTheme } = useTheme()

	const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>((theme as Theme) ?? 'light')

	const [open, setOpen] = useState(false)

	const handleReset = () => {
		setOpen(false)
		setCurrentTheme('light')
		setTheme('light')
	}

	const handleThemeSwitch = () => {
		setOpen(false)
		setTheme(currentTheme)
		toast.success('Theme updated successfully')
	}

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			<DialogTrigger>
				<motion.button
					whileHover={{ scale: 1.03, x: 2 }}
					whileTap={{ scale: 0.97 }}
					className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-accent/10 transition-all duration-150 font-medium text-sm w-full"
				>
					<Settings size={18} />
					Settings
				</motion.button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader className="pb-2.5 border-b border-border">
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Adjust your preferences and appearance.</DialogDescription>
				</DialogHeader>

				<motion.div
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.2 }}
					className="flex flex-col gap-4 mt-4"
				>
					<div className="flex items-center justify-between">
						<span>Dark Mode</span>
						<Switch
							checked={currentTheme === 'dark'}
							onCheckedChange={checked => setCurrentTheme(checked ? 'dark' : 'light')}
						/>
					</div>

					<div className="flex justify-end gap-2 pt-4">
						<Button
							onClick={handleReset}
							variant="outline"
						>
							Reset
						</Button>
						<Button onClick={handleThemeSwitch}>Save</Button>
					</div>
				</motion.div>
			</DialogContent>
		</Dialog>
	)
}
