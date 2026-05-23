# Butterfly 主题美化提示词模板

## 使用场景

对已搭建的 Hexo + Butterfly 站点进行视觉和功能优化。

## 通用提示词

```
请帮我美化 Butterfly 主题配置。

当前项目：<项目路径>
主题配置文件：_config.butterfly.yml

请根据以下需求进行配置：

1. 首页样式：
   - 设置首页封面图（index_img）
   - 配置顶部公告（announcement）

2. 导航栏：
   - 添加/修改导航菜单项
   - 配置二级菜单（如需要）

3. 侧边栏：
   - 配置个人信息卡片（avatar、description、social links）
   - 配置目录（TOC）显示方式

4. 文章样式：
   - 配置代码高亮主题
   - 配置文章版权信息
   - 配置相关文章推荐

5. 页脚：
   - 配置版权年份
   - 添加自定义页脚内容

6. 暗色模式：
   - 启用暗色模式切换按钮

7. 搜索功能：
   - 启用本地搜索

8. 评论系统（可选）：
   - 集成 Twikoo / Waline / Giscus

要求：
- 不要修改业务代码
- 不要 git push
- 修改后运行 npm run build 验证
```

## 分场景提示词

### 添加头像和社交链接

```
请在 _config.butterfly.yml 中配置：
- 头像图片路径（/images/avatar.png）
- 个人描述文字
- 社交链接（GitHub、Twitter 等）
- 侧边栏显示位置（左/右）
```

### 配置评论系统

```
请帮我集成 <Twikoo/Waline/Giscus> 评论系统到 Butterfly 主题。

要求：
1. 在 _config.butterfly.yml 中启用评论
2. 说明需要在第三方平台完成的配置步骤
3. 不要写入真实密钥，使用环境变量或占位符
```

### 添加自定义页面

```
请帮我创建一个自定义页面：<页面名称>

要求：
1. 创建 source/<页面名>/index.md
2. 配置 Front Matter（title、type、layout）
3. 在导航栏中添加入口
4. 编写页面初始内容
```

## 注意事项

- Butterfly 主题配置优先使用 `_config.butterfly.yml` 覆盖，不要直接修改主题内的 `_config.yml`。
- 图片资源放在 `source/images/` 目录。
- 修改配置后务必运行 `npm run build` 验证。
