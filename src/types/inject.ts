import { METHODS } from '@/constants'
import type { AnyRecord } from './commom'

export type Key = string | symbol | number

export interface AsyncStorage<Schema extends AnyRecord = AnyRecord> {
    // 获取值
    [METHODS.getItem]<K extends keyof Schema>(key: K): Promise<Schema[K] | null>

    // 设置值
    [METHODS.setItem]<K extends keyof Schema>(key: K, value: Schema[K]): Promise<Schema[K]>

    // 删除值
    [METHODS.removeItem]<K extends keyof Schema>(key: K): Promise<void>

    // 清空存储
    [METHODS.clear](): Promise<void>

    // 获取键数量
    [METHODS.length](): Promise<number>

    // 获取某个键
    [METHODS.key](n: number): Promise<keyof Schema>

    // 获取所有键
    [METHODS.keys](): Promise<keyof Schema[]>

    // 遍历所有数据
    [METHODS.iterate]<R>(
        iteratee: <K extends keyof Schema>(value: Schema[K], key: K, iterationNumber: number) => R
    ): Promise<R>
}

export interface SyncStorage<Schema extends AnyRecord = AnyRecord> {
    // 获取值
    [METHODS.getItem]<K extends keyof Schema>(key: K): Schema[K] | null

    // 设置值
    [METHODS.setItem]<K extends keyof Schema>(key: K, value: Schema[K]): Schema[K]

    // 删除值
    [METHODS.removeItem]<K extends keyof Schema>(key: K): void

    // 清空存储
    [METHODS.clear](): void

    // 获取键数量
    [METHODS.length](): number

    // 获取某个键
    [METHODS.key](n: number): keyof Schema

    // 获取所有键
    [METHODS.keys](): keyof Schema[]

    // 遍历所有数据
    [METHODS.iterate]<R>(iteratee: <K extends keyof Schema>(value: Schema[K], key: K, iterationNumber: number) => R): R
}

export type Storage<Schema extends AnyRecord = AnyRecord> = AsyncStorage<Schema> | SyncStorage<Schema>
