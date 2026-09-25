# Robotics English Lab

机器人行业商务英语学习网站。

## 本地入口

- `index.html`：学习资料库首页
- `daily_practice.html`：独立的今日练习页
- `vocabulary_library.html`：长期积累的独立单词库，支持搜索、词性筛选、例句和发音
- `product_introduction_learning_guide.html`：机器人关节与机械臂产品英语模块
- `learning-assets/`：语法教练、音频控制和页面样式
- `learning-assets/workspace.css` / `workspace.js`：四页共享的排版、导航和首页进度入口
- `learning-assets/course-workspace.js`：课程视图切换、逐句选择和阅读位置
- `english_pronunciation_audio/`：完整、逐句、词汇和客户问答音频

## GitHub Pages

将仓库根目录设置为 GitHub Pages 的发布目录即可。网站是静态文件，不需要构建命令。首次发布后，GitHub 会提供一个 `github.io` 网址，可以在手机浏览器中打开。

练习草稿、答题记录和口语自评只保存在当前浏览器，不会写入 GitHub，也不会自动跨设备同步。

网站和手机包首页均为学习工作台。课程默认一次看一句，可切换整体听读或客户表达；播放器的循环、速度和从头播放收在“设置”中。单词库可查阅或按筛选结果逐词背诵，每组最多5个；“已掌握”是自评，不表示通过自动测评。

## 后续更新

以后新增产品模块时，保持 HTML、`learning-assets` 和音频的相对目录结构，并在首页的产品课程区加入入口。每日复习入口保持独立，不把进度卡片嵌入产品课程页。更新后提交并推送到默认分支，GitHub Pages 会重新发布。
