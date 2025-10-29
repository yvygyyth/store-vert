// 强制使用 pnpm
if (!/pnpm/.test(process.env.npm_execpath || '')) {
  console.warn(
    '\n\x1b[33m⚠️  本项目使用 pnpm 作为包管理器\x1b[0m\n' +
    '\x1b[36m请运行以下命令安装：\x1b[0m\n' +
    '  npm install -g pnpm\n' +
    '\x1b[36m然后使用 pnpm 安装依赖：\x1b[0m\n' +
    '  pnpm install\n'
  )
  process.exit(1)
}

