import { authClient } from '@/auth-client'
import { atom } from 'jotai'

export type Session = ReturnType<typeof authClient.useSession>['data']

export const sessionAtom = atom<Session>(null)
