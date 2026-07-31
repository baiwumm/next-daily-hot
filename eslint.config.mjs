import antfu from '@antfu/eslint-config'

export default antfu({
  nextjs: true,
  react: true,
  stylistic: true,
  tailwindcss: true,
  typescript: true,
  rules: {
  // 允许使用全局 process（Node.js 环境）
    'node/prefer-global/process': ['error', 'always'],

    // 排序 export 导出顺序
    // 例如 export { A }、export { B } 按字母升序排列
    'perfectionist/sort-exports': [
      'warn',
      {
        order: 'asc',
        type: 'alphabetical',
      },
    ],

    // import 分组及排序
    // side-effect → Node 内置 → 第三方依赖 → 项目内部 → 相对路径 → 类型导入
    'perfectionist/sort-imports': [
      'error',
      {
        groups: [
          'side-effect',
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'type',
        ],

        // 不同 import 分组之间保留 1 行空行
        newlinesBetween: 1,

        // 按字母升序排列
        order: 'asc',

        // 使用字母排序规则
        type: 'alphabetical',
      },
    ],

    // 排序具名 export
    // 例如 export { Button, Avatar } 按名称排序
    'perfectionist/sort-named-exports': [
      'error',
      {
        order: 'asc',
        type: 'alphabetical',
      },
    ],

    // 排序 import 中的具名导入
    // 例如 import { useEffect, useState } from 'react'
    'perfectionist/sort-named-imports': [
      'error',
      {
        order: 'asc',
        type: 'alphabetical',
      },
    ],

    // 排序模块
    'perfectionist/sort-modules': [
      'error',
      {
        order: 'asc',
        type: 'alphabetical',
      },
    ],

    'perfectionist/sort-jsx-props': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        customGroups: [
          {
            // React 特殊属性
            groupName: 'react',
            elementNamePattern: '^(key|ref)$',
          },
          {
            // 无障碍属性
            // 例如 aria-label、aria-describedby
            groupName: 'aria',
            elementNamePattern: '^aria-',
          },
          {
            // HTML 原生属性
            // 例如 id、role、name、type
            groupName: 'html',
            elementNamePattern: '^(id|role|name|type|title)$',
          },
          {
            // UI 组件常用属性
            // 例如 variant="outline" size="sm"
            groupName: 'ui',
            elementNamePattern: '^(variant|size|color|radius)$',
          },
          {
            // 状态类属性
            // 例如 isDisabled、isLoading
            groupName: 'state',
            elementNamePattern: '^(is|has)[A-Z]',
          },
          {
            // 事件回调
            // 例如 onClick、onChange
            groupName: 'events',
            elementNamePattern: '^on[A-Z]',
          },
          {
            // 样式相关
            // 放最后方便扫一眼
            groupName: 'style',
            elementNamePattern: '^(className|style)$',
          },
        ],

        groups: [
          'react',
          'aria',
          'html',
          'ui',
          'state',
          'unknown',
          'events',
          'style',
        ],
      },
    ],

    // 禁止无意义 React Fragment
    // 例如避免 <><div /></>，推荐直接使用 <div />
    'react/jsx-no-useless-fragment': [
      'warn',
    ],

    // JSX 表达式大括号空格规则
    // 统一使用 {value}，禁止 { value }
    'style/jsx-curly-spacing': [
      'error',
      {
        children: true,
        when: 'never',
      },
    ],

    // JSX 属性换行规则
    // 每行最多 5 个 props，超过后换行
    'style/jsx-max-props-per-line': [
      'error',
      {
        maximum: 5,
      },
    ],

    // JSX 自闭合标签规则
    // 空组件和 HTML 标签必须使用自闭合形式
    // 例如 <Icon /> 而不是 <Icon></Icon>
    'style/jsx-self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],

    // 超过 6 个属性时强制换行
    'object-curly-newline': ['error', {
      ImportDeclaration: {
        minProperties: 6,
        multiline: true,
        consistent: true,
      },
      ExportDeclaration: {
        minProperties: 6,
        multiline: true,
        consistent: true,
      },
    }],
  },
})
