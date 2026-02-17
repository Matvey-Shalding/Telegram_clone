import { currentSession } from '@/store'
import { useAtomValue } from 'jotai'

export function useCurrentSession() {
	return useAtomValue(currentSession)
}
