# 贡献指南

感谢你考虑为本项目做出贡献！

## 行为准则

请保持友善和尊重。

## 如何贡献

### 报告 Bug

在提交 Bug 之前，请确保：

1. 检查是否已有相关 Issue
2. 使用最新版本重现问题
3. 提供详细的重现步骤

提交 Bug 时请包含：

- 简短的描述
- 重现步骤
- 预期行为
- 实际行为
- 环境信息（Node 版本、操作系统等）

### 提出新功能

在提交新功能建议之前：

1. 确保该功能符合项目目标
2. 检查是否已有相关讨论
3. 详细说明用例和预期行为

### 提交代码

#### 1. Fork 项目

点击 GitHub 页面右上角的 "Fork" 按钮。

#### 2. 克隆你的 Fork

```bash
git clone https://github.com/your-username/libra-template.git
cd libra-template
```

#### 3. 创建分支

```bash
git checkout -b feature/my-new-feature
# 或
git checkout -b fix/my-bug-fix
```

分支命名规范：
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关

#### 4. 进行更改

- 遵循现有代码风格
- 添加必要的注释
- 更新相关文档
- 添加或更新测试

#### 5. 运行测试

```bash
# 运行所有检查
npm run lint
npm run format:check
npm run typecheck
npm run test
```

确保所有测试通过。

#### 6. 提交更改

```bash
git add .
git commit -m "feat: 添加新功能"
```

提交信息格式：

- `feat:` - 新功能
- `fix:` - Bug 修复
- `docs:` - 文档更新
- `style:` - 代码格式调整
- `refactor:` - 代码重构
- `test:` - 测试相关
- `chore:` - 构建/工具链相关

#### 7. 推送到 GitHub

```bash
git push origin feature/my-new-feature
```

#### 8. 创建 Pull Request

1. 访问你的 Fork 页面
2. 点击 "New Pull Request"
3. 填写 PR 描述，包括：
   - 更改内容
   - 相关 Issue（如果有）
   - 测试情况
   - 截图（如果适用）

## 代码规范

### TypeScript

- 使用 TypeScript 编写所有代码
- 提供完整的类型定义
- 避免使用 `any`
- 使用有意义的变量名

### 函数文档

每个导出的函数都应该包含 JSDoc 注释：

```typescript
/**
 * 函数简短描述
 * @param param1 - 参数1描述
 * @param param2 - 参数2描述
 * @returns 返回值描述
 * @example
 * ```ts
 * myFunction('test', 123) // 示例输出
 * ```
 */
export function myFunction(param1: string, param2: number): string {
  // 实现...
}
```

### 测试

- 为所有功能编写测试
- 测试用例应该清晰易懂
- 包含边界情况测试
- 目标：保持高测试覆盖率（> 80%）

### 代码风格

项目使用 ESLint 和 Prettier 来保持代码风格一致。

运行以下命令格式化代码：

```bash
npm run format
```

## 项目结构

```
src/
├── utils/          # 工具函数（按类别组织）
├── types/          # 类型定义
└── index.ts        # 主入口文件

tests/              # 测试文件（对应 src 结构）
```

## 开发流程

1. **本地开发**
   ```bash
   npm run dev
   ```

2. **运行测试（监听模式）**
   ```bash
   npm run test:watch
   ```

3. **检查代码**
   ```bash
   npm run lint
   npm run typecheck
   ```

4. **构建**
   ```bash
   npm run build
   ```

## 发布流程（维护者）

1. 更新版本号（`package.json`）
2. 更新 `CHANGELOG.md`
3. 运行所有测试和检查
4. 构建项目
5. 提交更改
6. 打标签
   ```bash
   git tag v0.1.0
   git push origin v0.1.0
   ```
7. 发布到 npm
   ```bash
   npm publish
   ```

## 获取帮助

如果你有任何问题：

- 查看现有的 [Issues](https://github.com/your-username/libra-template/issues)
- 创建新的 Issue
- 查看文档

## 许可

通过贡献代码，你同意你的贡献将在 MIT 许可下发布。

