# Robotics English Lab 网站部署说明

这个目录是一个静态网站，可以部署到 Nginx、Apache、Cloudflare Pages、Netlify、Vercel 或 GitHub Pages。

## 网站入口

- `index.html`：资料库首页
- `product_introduction_learning_guide.html`：当前产品学习模块
- `english_pronunciation_audio/`：逐句、单词和商务表达音频
- `product_introduction_sync_full.m4a`：完整跟随音频
- `learning-assets/`：语法内容数据、共享交互脚本和样式，必须一起上传
- `learning-assets/audio-controls.js` / `.css`：统一音频暂停续播、从头播放、单段循环及单词播放器；与整块语法折叠功能一并更新
- `english_pronunciation_audio/grammar_practice/`：8组客户提问与示范回答，共16段合成语音
- `robotics_english_mobile_package.zip`：供首页下载的完整本地学习包

## Nginx 部署

将整个目录上传到服务器，例如：

```text
/var/www/robotics-english/
```

Nginx 的站点根目录指向这个文件夹，并让首页使用 `index.html`。需要保证 `.html`、`.js`、`.css`、`.m4a` 和 `.zip` 可以访问，并使用相应的 MIME 类型。部署在子目录时也保留现有相对目录结构。

## 更新方式

以后新增产品模块时，将新的 HTML 和音频放入网站目录，并在 `index.html` 的学习路径中增加一个模块卡片即可。

语法模块的讲解、题目、反馈与对话放在模块数据文件中。沿用 `robotics_english_learning_template.md` 的教学结构。新模块分配独立且稳定的 moduleId，不复用其他模块的标识；模块数据文件与音频名也应独立。

本次语法复习入口统计当前模块。答题、草稿及自评使用浏览器 localStorage，只保存在当前浏览器及站点；不会自动跨设备同步。部署后 URL 的来源变化，也不会自动带入本地文件模式的记录。存储不可用时仍可以练习，但记录只在当前页面保留。

当前交付为静态网站文件包，未上传到公网服务器。上线后应在目标手机浏览器检查播放、折叠、答题、刷新保存，并抽查完整音频的跟随高亮。

建议正式部署时使用 HTTPS，这样手机浏览器的音频和后续录音功能兼容性更好。
