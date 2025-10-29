/**
 * 数组工具函数示例
 * 这个文件展示了如何组织数组相关的工具函数
 */

/**
 * 数组去重
 * @param arr - 输入数组
 * @returns 去重后的数组
 * @example
 * ```ts
 * unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 * ```
 */
export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}

