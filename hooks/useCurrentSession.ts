import { sessionAtom } from '@/store/sessionAtom'
import { useAtomValue } from 'jotai'

export function useCurrentSession() {
	return useAtomValue(sessionAtom)
}
