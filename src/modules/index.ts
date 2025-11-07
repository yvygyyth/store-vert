import { inject } from '@/registry'
import { MemoryStore } from './memory'
import { LocalStore } from './local'
import { SessionStore } from './session'
import { IndexedDBStore } from './indexeddb'
import { STORAGE_KEYS } from '@/constants'

inject(MemoryStore, STORAGE_KEYS.memory)
inject(LocalStore, STORAGE_KEYS.local)
inject(SessionStore, STORAGE_KEYS.session)
inject(IndexedDBStore, STORAGE_KEYS.indexeddb)
