import { authClient } from '@/auth-client'
import { atom } from 'jotai'

export type Session = ReturnType<typeof authClient.useSession>['data']

export const currentSession = atom<Session>(null)
