# NEXSTACK AI 全站英文文案包

日期：2026-10-04。范围：现有 25 个内容页面、404 及全局文案。依据：[定位背景](../marketing-context.md)、[内容计划](../marketing-content-plan.md)与用户补充。

**完成状态：全站内容初稿已完成。** 产品、案例和法律信息缺口按用户要求保留占位；完成初稿不代表已核实事实、已发布或已回填网站。

## 阅读顺序

先看 Home 和三个产品详情，确认定位与语气；再看 Custom、About、Contact、FAQ。随后审阅场景、资讯与案例模板。每份文件的英文 copy 区供网页使用，Internal notes 不上页面。

## 完整页面索引

| # | 当前页面 | 文案 | 状态 |
| --- | --- | --- | --- |
| 01 | `/` | [Home](home.md) | 初稿完成 |
| 02 | `/products/` | [Products](products.md) | 初稿完成 |
| 03 | `/compare/` | [Compare](compare.md) | 初稿完成；参数占位 |
| 04 | `/solutions/` | [Solutions](solutions.md) | 初稿完成 |
| 05 | `/custom/` | [Custom Development](custom.md) | 初稿完成；商务条件待补 |
| 06 | `/case-studies/` | [Project Experience](case-studies.md) | 概述完成；证据占位 |
| 07 | `/about/` | [About](about.md) | 初稿完成；主体和团队资料待补 |
| 08 | `/insights/` | [Insights](insights.md) | 初稿完成 |
| 09 | `/contact/` | [Contact](contact.md) | 初稿完成；五字段及提示完整 |
| 10 | `/faq/` | [FAQ](faq.md) | 初稿完成 |
| 11 | `/compliance/` | [Product Documentation](compliance.md) | 章节与文案完成；文件状态占位 |
| 12 | `/privacy/` | [Privacy Policy](privacy.md) | 完整章节初稿；事实补齐与法律审阅待办 |
| 13 | `/terms/` | [Terms of Use](terms.md) | 完整章节初稿；主体与法律条款占位 |
| 14 | `/products/ai-toys/` | [AI Companion Toys](product-companion-toys.md) | 初稿完成；产品资料占位 |
| 15 | `/products/ai-office-assistants/` | [AI Office Assistants](product-office-assistants.md) | 初稿完成；产品形态与功能占位 |
| 16 | `/products/ai-glasses/` | [AI Glasses](product-ai-glasses.md) | 初稿完成；用户已确认产品方向 |
| 17 | `/solutions/education-toy-retail/` | [Companion Product Planning](solution-companion-products.md) | 初稿完成；名称调整建议 |
| 18 | `/solutions/smart-office-meetings/` | [Office Assistant Planning](solution-office-work.md) | 初稿完成；不预设会议功能 |
| 19 | `/solutions/wearable-imaging/` | [Wearable Product Planning](solution-wearable-products.md) | 初稿完成；不预设摄像功能 |
| 20 | `/case-studies/logistics/` | [Workflow Case 01](case-workflow-01.md) | 完整案例模板，事实待填写 |
| 21 | `/case-studies/education/` | [Workflow Case 02](case-workflow-02.md) | 完整案例模板，事实待填写 |
| 22 | `/case-studies/retail/` | [Workflow Case 03](case-workflow-03.md) | 可选模板，不暗示第三项目已存在 |
| 23 | `/insights/edge-ai-in-consumer-devices/` | [Companion Toy Brief](insight-companion-brief.md) | 全文完成；建议新路径 |
| 24 | `/insights/child-safety-standards-ai-toys/` | [Office Assistant Brief](insight-office-brief.md) | 全文完成；建议新路径 |
| 25 | `/insights/choosing-a-supplier-checklist/` | [Development Partner Checklist](insight-supplier-checklist.md) | 全文完成 |
| 26 | 404 | [Page Not Found](not-found.md) | 初稿完成 |
| — | 导航、页脚与界面 | [Global Copy](global.md) | 初稿完成 |

## 占位符的含义

- `[NEED: ...]`：具体事实或审批缺口，正式页面使用前补齐或调整。
- `[MEDIA: ...]`：后续媒体需求；实拍后填写真实 alt，不把概念图当产品照片。
- 拟路径：实现阶段选择是否改路由并处理关联。当前站点链接未改。
- 案例和法律页不提供虚构“完整答案”。模板覆盖所需章节，事实内容仍待补。

## 当前实现状态

2026-10-04：全站文案已回填至 NEXSTACK AI 审阅网站，正文与 SEO 映射保存于 `goal-run/src/content/pages.json`；资讯全文同时保存在 `insights.json` 的 `body`。内部批注不进入页面，事实缺口转换为英文审阅提示。

三个 workflow 槽位与前两篇资讯已采用拟定新路径，旧路径返回 301。三个场景保留原路径，正文不再预设旧行业或摄像、会议功能。

修改前只读核实 GitHub main 与本地 `543a4f7` 一致，包含 `8d826c6`、`312b065` 基线。服务器没有配置新 GitHub 认证。新修改尚未推送。

验收结果及预览操作见 [审阅版验收记录](../nexstack-review-acceptance-2026-10-04.md)。产品、案例和法律占位继续保留，正式发布须补齐证据并通过 gate。
