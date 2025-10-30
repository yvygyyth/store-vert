/**
 * 对象工具函数示例
 * 这个文件展示了如何组织对象相关的工具函数
 */

/**
 * 深度克隆对象
 * @param obj - 输入对象
 * @returns 克隆后的对象
 * @example
 * ```ts
 * const original = { a: 1, b: { c: 2 } }
 * const cloned = deepClone(original)
 * cloned.b.c = 3
 * console.log(original.b.c) // 2
 * ```
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj.getTime()) as T
    if (obj instanceof Array) return obj.map((item) => deepClone(item)) as T
    if (obj instanceof Object) {
        const clonedObj = {} as T
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                clonedObj[key] = deepClone(obj[key])
            }
        }
        return clonedObj
    }
    return obj
}
