import { inject } from '@/registry'
import { MemoryStorage } from './memory'
import { LocalStorage } from './local'
import { SessionStorage } from './session'
import { STORAGE_KEYS } from '@/constants'

inject(MemoryStorage, STORAGE_KEYS.memory)
inject(LocalStorage, STORAGE_KEYS.local)
inject(SessionStorage, STORAGE_KEYS.session)
