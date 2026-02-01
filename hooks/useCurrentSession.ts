import { sessionAtom } from '@/atoms/sessionAtom'
import { useAtomValue } from "jotai"

export function useCurrentSession() {
  return useAtomValue(sessionAtom)
}