### Description

这是一个 node 端 toolkit 集合.

### Usage

```js
const { del, diff, file, ips, md5, mkdir, shell, unzip, zip } = require('@tangyansoft/toolkit-node');
```

---

- `del` 删除 `del(target, options)` 返回一个 promise.
  - `target` 目标文件夹或文件
  - `options` 参数 `rimraf` 包的参数
