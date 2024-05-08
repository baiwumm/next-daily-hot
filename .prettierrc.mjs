module.exports = {
  printWidth: 120, // 设置每行代码的最大字符数为 120
  useTabs: false, // 是否使用空格而不是制表符（tabs）进行缩进
  tabWidth: 2, // 一个制表符应该占据多少个空格的宽度
  trailingComma: "es5", // 在 ES5 语法中支持的地方添加尾随逗号
  semi: false, // 是否在语句末尾自动添加分号
  singleQuote: true, // 是否使用单引号而不是双引号来包裹字符串
  bracketSpacing: true, // 在对象的大括号之间添加空格。例如，在导入语句中，它会在花括号和导入的成员之间添加空格
  arrowParens: "always", // 在箭头函数的参数周围总是添加括号，即使只有一个参数
  jsxSingleQuote: false, // 是否在 JSX 中使用双引号而不是单引号来包裹字符串
  endOfLine: "lf", // 设置文件的换行符。lf 表示 Unix/Linux 风格的换行符（\n），而 crlf 表示 Windows 风格的换行符（\r\n）。对于 Git 和跨平台协作，通常推荐使用 lf
};
