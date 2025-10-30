/**
 * 字符串工具函数示例
 * 这个文件展示了如何组织字符串相关的工具函数
 */

/**
 * 首字母大写
 * @param str - 输入字符串
 * @returns 首字母大写的字符串
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * ```
 */
export function capitalize(str: string): string {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
}
