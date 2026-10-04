# NEXSTACK AI 审阅版回填与验收

日期：2026-10-04。范围：交接文档的 Step 6–7，全站 25 个内容页面、404 和全局界面。网站为英文审阅版，尚未正式发布。

## 内容与实现

| 要求 | 当前实现与证据 |
| --- | --- |
| 品牌、导航、页脚、联系方式、共同 CTA | NEXSTACK AI；公开邮箱 `dalelai0776@gmail.com`；WhatsApp `+66 61 330 6115` / `66613306115`。首页主按钮进入 Contact，辅助入口进入 Products。图标改为栈形标记。 |
| 三产品及三场景 | 保留陪伴玩具、办公助手和眼镜；场景仍用原路径。旧会议、翻译、摄像、语音、适龄控制和硬件形态不再作为已实现能力。规格、演示与资料使用明确审阅提示，没有假下载链接。 |
| Custom 与 About | 回填软件、硬件、AI 及 workflow 开发方向、需求沟通与建议步骤。OEM/ODM 生产安排、样品与商务条件按项目确认。删除旧团队人数、成立年份、里程碑、自有工厂等公开声明。 |
| 案例 | 三个完整 workflow 资料模板，包含背景、任务、贡献、交付、结果和证据章节。未公开客户名称、Logo、引述或成果数字；第三槽位注明不证明额外项目存在。 |
| Insights | 三篇完整英文规划指南，新增 `body` 模型并渲染全部章节及关联链接。不是旧版提纲。 |
| Documentation、Privacy、Terms、404 | 文件状态待核实，认证新增 `unknown`，无取得或办理中声明。法律页保留运营主体、保留期限、提供商与条款等事实缺口；Privacy 明确邮件账户可能保留通信。404 显示恢复链接并返回 HTTP 404。 |
| SEO 与索引 | 每页独立 title 和 description；Open Graph、canonical、hreflang、sitemap 已实际渲染。未用拟注册公司作 Organization 的法定名称，未输出假 LinkedIn。布局和 robots 按全部占位集合阻止索引。 |
| 文案与内部说明隔离 | `src/content/pages.json` 为全部页面正文/SEO 映射，含文案源路径但不输出该路径。Internal notes、备选、媒体需求和中文批注不渲染；事实缺口转为英文 “To confirm” 提示。 |
| 五字段询盘 | 保持姓名、公司、电话/WhatsApp、邮箱和需求留言全部必填；更新提交、发送、成功、失败、校验及隐私提示。邮件配置与后端投递逻辑未改动。 |

## 路径与维护

五个旧路径实际返回 301，正文、关联与 sitemap 使用新路径：

| 原路径 | 新路径 |
| --- | --- |
| `/case-studies/logistics/` | `/case-studies/workflow-project-01/` |
| `/case-studies/education/` | `/case-studies/workflow-project-02/` |
| `/case-studies/retail/` | `/case-studies/workflow-project-03/` |
| `/insights/edge-ai-in-consumer-devices/` | `/insights/briefing-an-ai-companion-toy/` |
| `/insights/child-safety-standards-ai-toys/` | `/insights/defining-an-ai-office-assistant/` |

页面正文和 SEO 的维护入口为 `goal-run/src/content/pages.json`；产品名称、关联、资料与媒体模型仍保留在各集合。资讯全文在 `insights.json` 的 `body`，验收测试要求与对应页面 blocks 一致。联系表单和 FAQ 使用 `site.json`。比较表来自 Compare 页面 blocks，保留原生筛选。

此次没有新增 PDF、外部照片、第三方脚本或图库素材；展示的 SVG 为明确标注的概念图。没有资料下载时不生成下载按钮。本次不将演示、样品、认证或法律信息缺口填成业务事实。

## 验证结果

最终命令在 `goal-run/` 执行：

| 验证 | 结果 |
| --- | --- |
| `npm run build` | 通过：26 个 HTML 页面；14 组颜色对比及链接、标题层级、表单标签、设计 token、noindex 和脚本检查。 |
| `npm run check:types` | 通过：37 个文件，0 errors / warnings / hints。 |
| `npm run test` | 15 项全部通过。新增逐页正文、源文档章节、CTA、SEO、canonical、内部说明隔离、三产品与资讯全文验收；保留虚假声明/发布 gate 负向测试，以及 HTTP → 本地 SMTP 与提交人 Reply-To 测试。 |
| `npm run test:browser` | 52 次桌面/手机路由检查（1440px / 390px，包含 404）全部通过；0 axe WCAG AA 违规、0 页面横向溢出、0 第三方请求、0 运行错误。菜单、键盘、产品筛选、FAQ、表单错误与成功状态通过。 |
| 320px 补充重排检查 | 全部 26 页通过，无页面横向溢出。 |
| 路由运行检查 | 五个 301 的 Location 正确；运行中的全部 26 页状态、H1、SEO title 和 noindex 与当前内容数据一致；新页面 HTTP 200；未知页面 HTTP 404；robots 为 `Disallow: /`。 |
| `npm run gate` | 预期拒绝：10 个文件/规则命中，审阅占位仍阻止正式发布。保护规则没有删除。 |
| `git diff --check` | 通过。 |

本地实验室最大 LCP 136ms、CLS 0.0000、客户端 JS 2,133 bytes；这些不是实际网络 Core Web Vitals 或 INP 结果。

截图已人工查看：首页、产品列表、联系页、办公助手详情、资讯全文及比较页；桌面/手机报告和截图保存在 `goal-run/test-results/`，该目录为忽略的本地验收产物。浏览器表单状态使用模拟响应；本地 SMTP 测试独立验证实际服务端投递链路。此前用户已亲自确认 Hotmail 真收件，本轮没有重复向外部邮箱发送测试邮件。

## 预览、备份与后续

当前审阅服务从 `goal-run/` 启动，端口 4321。当前环境打开 <http://localhost:4321>；如果从其他机器访问，应使用实际可达地址或已有端口转发。修改正文后重建、重启；`.env` 保持现状，不输出或提交邮件凭据。

修改网站之前，只读 `git ls-remote origin refs/heads/main` 核实远端为 `543a4f709bf7e8e38392162ab59225fda1ef5241`，与本地基线一致，并包含 `8d826c6` 和 `312b065`。远端备份约束已满足。本轮未配置 GitHub 认证、未 push；新增网页修改留在工作区，后续 Git 推送仍由用户在 Mac 处理。

待补范围为真实产品版本/规格/交付状态、实拍与演示、授权案例、文件证据、注册主体、制造与商务安排、隐私处理细节及法律条款。它们是正式发布的后续工作；当前审阅版保留明确占位与 noindex，不能把通过审阅验收说成已获正式发布批准。
