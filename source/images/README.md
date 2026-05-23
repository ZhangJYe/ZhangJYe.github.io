# 图片资源说明

本目录存放网站所需的图片资源。

## 当前资源

| 文件 | 用途 | 说明 |
|------|------|------|
| `avatar.svg` | 侧边栏头像 | 终端符号风格的抽象头像，可直接使用 |
| `favicon.svg` | 浏览器标签图标 | 与头像风格统一的 >_ 符号 |
| `site-logo.svg` | 站点 Logo | Fire's Notes 文字标识 |

## 替换说明

### 更换头像

如果想换成真人头像或自定义图片：

1. 将图片放到 `source/images/`，命名为 `avatar.png` 或 `avatar.svg`
2. 修改 `_config.butterfly.yml` 中的 `avatar.img` 路径
3. 推荐尺寸：200x200px，正方形

### 更换 favicon

1. 将图标放到 `source/images/`，命名为 `favicon.png` 或 `favicon.svg`
2. 修改 `_config.butterfly.yml` 中的 `favicon` 路径
3. 推荐尺寸：32x32px 或 16x16px

## 不再使用的资源

封面图功能已禁用，不需要以下资源：
- `cover/index.jpg` — 首页封面大图
- `cover/default.jpg` — 文章默认封面
- `cover/*.jpg` — 随机封面图

## 命名规范

- 头像：`avatar.*`
- favicon：`favicon.*`
- Logo：`site-logo.*`
- 文章内图片：`posts/<文章名>/<图片名>.png`（需开启 post_asset_folder）

## 注意事项

- 所有图片使用相对路径，以 `/images/` 开头
- 图片文件名使用小写英文和连字符，不要使用中文或空格
