# 网站模块规范

> **唯一规范来源。** spec、tickets、实现全部以本文件为准。
> 状态：结构已批准 · **spec 阶段待指令**
> 约束强度：带 `【L-n】` 的为**锁定项**（不得违反），其余为**默认可改项** —— 规则见 10.1

## 格式约定

- 引用写纯数字章节号：`见 6.6`。不用符号、不写文件名
- 表格优先于段落；表格优于 bullet；bullet 优于段落
- 结构性关系用文字图
- `【L-n】` = 锁定项。未标注 = 默认可改
- `archive/` 下的材料仅作**溯源**，不构成规范。冲突时以本文件为准

## 文件位置

| 路径 | 性质 |
|---|---|
| `docs/spec.md` | **规范来源**（本文件） |
| `archive/research/` | 前期研究材料，已归档，非规范 |
| `archive/网站模块-outline_en.md` | 英文版早期稿，已归档 |
| `archive/placeholder-dataset_en.md` | 英文版早期稿，已归档 |

---

## 1. 背景与前提

**业务定位**：中国 AI 硬件产品与方案公司，面向海外客户销售成品并承接定制化需求。三条产品线：AI Toys / AI Office Assistants / AI Glasses。`archive/research/04-公司业务情况描述.md`

**参考资料性质**：`archive/research/` 下四份材料是 SaaS/AI 方案公司的模板（以 nexstack.sg 为参考风格来源，非本公司资产）。照搬会错三处，已在下文逐条修正。

### 1.1 Case Studies 是核心模块，不是补充模块

- 海外买家面对"中国供应商"这个先验怀疑
- 消除怀疑的唯一有效方式：**已交付并通过客户验证的实证**，不是能力自述
- 验证路径是买家索取样品并自行测试
- 结论：**Case Studies 优先级高于 About**

> `archive/research/03-评估nexstack.sg.md` 恰好也指向这一点（缺少具名客户成功故事）。

**内容策略由此确定：少宣称，多给可验证的事实与实物入口。** 【L-附】

### 1.2 合规是业务模块，不是页脚链接

`archive/research/02-fack-check.md` 只覆盖了 GDPR / CCPA 等隐私法规。但硬件出海真正的门槛是**产品认证**：

| 门槛 | 说明 |
|---|---|
| CE / FCC / UKCA | 欧盟 / 美国 / 英国准入 |
| RoHS / REACH | 有害物质限制 |
| 电池法规（UN38.3） | 电池运输 |
| CPSIA | 美国 AI 玩具面向 12 岁以下 |
| EN 18031 | 欧盟 AI 眼镜（无线电设备） |

认证出现在产品页与信任路径上，详见 7。

### 1.3 声明准确性　【L1】【L2】

> **能力声明可以任意，资产归属必须为真。**

| 类型 | 例子 | 是否为真 |
|---|---|---|
| 能力声明 | "具备设计、生产、制造能力" | 成立 |
| 资产归属声明 | "我们的深圳 1500m² 工厂" | **必须为真** |

**两条工程规则**：

- 照片须标明**自有 / 合作**，且与实际一致
- 认证徽章仅在 `status: obtained` 时渲染，且须显示**证书持有人**（自有 / 制造方 / 产品）

依据：海外买家会对供应商做尽调。声明与实物落差一旦被发现，损失的���是这一单，而是后续所有沟通的可信度。

### 1.4 网站职责边界：建立联系　【L3】

**站内**：讲清公司是谁、卖什么、能定制什么，并提供联系方式。
**站外**：需求、报价、交期、账期、保修、IP 归属等**全部商务细节**，由业务员与客户在 WhatsApp 或邮件直接沟通。

```
站内                              站外
─────────────────────────────    ─────────────────────────────
产品线 / 场景 / 定制能力      →   需求澄清（业务员 ↔ 客户）
认证状态 / 案例                 →   报价、账期
                                →   交期、量产物料
                                →   保修、IP 归属
       │                                │
       └──── 唯一出口：建立联系 ─────────┘
              （表单 / WhatsApp / 邮箱）
```

**推论 —— 全站不发布商务条款：**

| 不发布 | 页面上的替代 |
|---|---|
| 价格 / 报价 | 无需替代，询价后沟通 |
| MOQ 具体数字 | `MOQ and lead time on request` |
| 交期 / 量产周期 | 同上 |
| 账期 / 付款条件 | 无需替代 |
| 保修条款 | `Warranty terms agreed per project` |
| IP 归属条款 | `NDA and IP terms available on request` |

理由：任何写死的数字都是承诺，而商业模式是按项目议定。写死的 MOQ 会在谈判时变成麻烦，写死的保修会变成纠纷依据。

**由此三处简化**（原设计过度了）：

1. 询盘表单从两套合并为一套（字段本就相同，见 4）
2. ODM 页去掉五阶段流程图与周期承诺，改为能力陈述（见 3 模块 5）
3. FAQ 收窄为公司可信度问题（见 5.2）

---

## 2. 两条内容路径　【L18】

```
                            ┌─→ 渠道商 / 采购方 / 品牌客户
A. 产品路径 ────────────────┤
   Products                  └─→ 终端买家

                            ┌─→ 有定制需求的方案需求方
B. 定制路径 ────────────────┤
   Custom / ODM-OEM          └─→ 需要新品类的 Startup
```

**但转化动作只有一个**：联系。两条路径**共用一套 5 字段询盘表单**（4），差别在落地页的信任证据配置，不在表单。

> **这不是两条漏斗。** 全站只有一个转化出口。早期设计中的"双漏斗"表述已作废 —— 它会误导实现出两套转化机制。准确说法：**一条出口，两条内容路径**。
>
> 相应地，原约束"两套独立数据结构与提交端点"作废：字段相同时维护两份是纯重复。

---

## 3. 站点结构

### 3.1 全局壳层

所有页面继承，不单独成页。

| # | 模块 | 内容 | 溯源 |
|---|---|---|---|
| G1 | 顶栏导航 | 按内容路径分组：Products / Solutions / Custom / Case Studies / Insights / About / Contact | 需求 一 |
| G2 | WhatsApp 悬浮 | 右下角一键开启，**真人账号**，`wa.me` 深链 | 需求 二.1 |
| G3 | 隐私与条款 | 页脚独立 Privacy Policy / Terms of Use 链接。**不做 Cookie 同意弹窗**（见 7.3） | 需求 二.2 |
| G4 | SEO + GEO | Schema.org 结构化数据、AI 检索友好的问答式段落、sitemap、`hreflang` 预留、`noindex` 环境开关 | fact-check 2.2 |
| G5 | 合规与认证 | 认证一览页 + 证书持有人标注（见 7.2） | — |

> G2 不做 AI Bot —— WhatsApp Business API 属第三方服务，不在本站范围。

### 3.2 核心页面

| # | 页面 | 目标 | 关键内容 | 溯源 |
|---|---|---|---|---|
| 1 | **Home / Hero** | 3 秒内说清"你是谁、卖什么、能定制什么" | 单一价值主张 + Live Demo（真实设备对话演示）+ 三条产品线入口 + 双重 CTA。**无轮播、无视频背景** | 需求 三 / nexstack 审计 三 |
| 2 | **Products** | 让买家找到目标产品线 | 三条产品线分栏；每线含场景描述、能力要点、认证状态、Datasheet 下载、实拍视频。**MOQ / 交期显示 "on request"** | 需求 一 / 业务描述 |
| 3 | **产品对比** | 替代 PDF 规格表 | 三线横向参数对比表 + 场景筛选。**无价格列、无按价位筛选** | 需求 三 |
| 4 | **Solutions** | 让客户看到"你能解决我的场景" | 三个场景页；含硬件 ↔ 大模型接入方式架构图。**不承诺效果数据** | 需求 / 业务描述 |
| 5 | **Custom / ODM-OEM** | 让采购方相信定制能力 | 五块能力陈述 + 一句"范围与条款按项目议定"。**无流程图、无周期、无条款** | 业务描述 |
| 6 | **Case Studies**（核心） | 提供可验证的交付实证 | 行业案例 + 量化成果 + 客户 Logo Wall + 已提供的认证清单 | nexstack 审计 总结.1 |
| 7 | **About / Company** | 证明公司真实存在 | 团队照片、里程碑、能力构成、**供应链说明**（按 1.3 标注自有/合作） | 需求 一 |
| 8 | **Insights / Resources** | SEO + GEO 阵地 | 行业观点、买家指南、合规解读 | 需求 一 |
| 9 | **Contact** | 全站唯一转化终点 | 5 字段表单 + WhatsApp / 邮箱 / 电话 / 地址 / 地图 | 需求 / 业务描述 |
| 10 | **FAQ** | 打消"你们是谁、靠不靠谱" | 见 5.2 | nexstack 审计 |

> **大模型仅作为 Solutions 页架构图的内容呈现**，不构成代码依赖或技术选型。见 6.3。

---

## 4. 转化出口：询盘表单　【L4】【L5】【L6】【L7】

### 4.1 字段（全必填）

| 字段 key | English label | Placeholder | 类型 |
|---|---|---|---|
| `name` | `Your name` | `Jane Doe` | text |
| `company` | `Company` | `Company name` | text |
| `phoneWhatsapp` | `Phone / WhatsApp` | `+65 8123 4567` | tel |
| `email` | `Email` | `you@company.com` | email |
| `message` | `What do you need?` | `Tell us about the product, your target market, or the customisation you have in mind.` | textarea |

表单标题 `Contact us` ｜ 提交按钮 `Send message`。站点为英文站，展示文案一律英文。

> 字段 **key 名与 placeholder 属默认可改项**；**5 字段与必填不可改**。

### 4.2 行为契约

| 项 | 规则 |
|---|---|
| 校验 | 服务端校验，不依赖前端 |
| 反垃圾 | **honeypot + 限流，不用 reCAPTCHA**【L6】。reCAPTCHA 是 Google 第三方组件，会连带推翻 7.3 的免同意弹窗前提 |
| 命中处理 | 命中 honeypot 或提交过快 → **静默丢弃**（返回 200，不给机器人错误信号） |
| 限流 | 每 IP 每 10 分钟最多 3 次（**阈值属默认可改项**） |
| `Reply-To` | 设为提交人邮箱，客服点回复即可直达 |
| 投递 | 投递到公司邮箱；失败记日志，不向用户暴露细节 |
| 存储 | **不落库**，不建用户体系【L7】 |
| 域名 | 必须配 SPF / DKIM，否则询盘邮件大概率进垃圾箱 |

隐藏反垃圾字段：`_hp`（honeypot，`display:none` + `aria-hidden`）、`_ts`（渲染时间戳，间隔过短判定机器人）。**字段名属默认可改项。**

### 4.3 页面其他联系方式

- WhatsApp（主）· 对外公布邮箱 · 电话 · 地址 · 地图嵌入
- 承诺文案占位：`We reply within 24 hours.`
- **不设样品申请入口、不设预约演示**【L5】—— 均由业务员在 WhatsApp 承接

---

## 5. 内容与信任规则

### 5.1 声明与素材　【L1】【L9】

| 素材 | 要求 |
|---|---|
| 团队 / 产品照片 | 实拍。**禁止图库图** —— 用户研究已证明图库图会被忽略 |
| 工厂 / 产线照片 | 须标明 `Own facility` 或 `Partner manufacturing`，且取得对方书面许可 |
| 案例 Logo | 须取得客户书面授权。占位期一律灰色占位块 |
| 案例引述 | 占位期不可上线。不得写虚构人名与职位 |
| Datasheet | 占位期标注 `Datasheet pending`；上线前必须换成真实文件或移除槽位 |

**少宣称**：效果数据、量化承诺只在有客户授权时出现；否则改为可验证事实陈述。

### 5.2 FAQ 范围　【L8】

| 收 | 不收 |
|---|---|
| 你是哪家公司、在哪里、做什么 | MOQ 是多少 |
| 卖什么产品、服务哪些市场 | 交期多久 |
| 能否定制、定制什么程度 | 保修多久 |
| 用到什么大模型能力 | 能不能开票、账期 |
| 为什么值得先联系你们 | 价格 |

业务规则答案随项目变，写死会失准。

### 5.3 占位标记与无声明渲染　【L13】

三个字段贯穿 content → UI：

| 字段 | 取值 | 渲染规则 |
|---|---|---|
| `isPlaceholder` | `true` / `false` | `true` 时渲染 dev 环境条，并使上线检查生效 |
| `status`（仅认证类实体） | `obtained` / `in-progress` / `not-applicable` | **只有 `obtained` 渲染认证徽章**，且须同时显示证书持有人；其余渲染为文字状态说明 |
| `isExample`（仅案例类实体） | `true` / `false` | `true` 时渲染为 "Sample case"，不作为客户背书 |

**防护逻辑**：占位数据下 `status` 一律 `in-progress`、`isExample` 一律 `true`，因此页面**不会展示任何虚假认证或虚假客户背书**。这让"先模拟、后替换"成立，把风险从"忘了关掉假声明"降为"忘了改字段" —— 后者由 7.4 的检查兜住。

开发/演示环境整体 `noindex`。

### 5.4 数据模型深度

Schema 支持到**型号级**：

```
productLine  →  model  →  sku
```

当前占位数据只填到**产品线级**，页面也只渲染到产品线级。将来补型号属灌数据，不是写代码；当下不投机性建型号页。

---

## 6. 设计系统与前端基线

### 6.1 内容层　【L12】

- 页面只消费数据，**不内嵌文案字符串**
- 占位数据与真实数据**同构**，替换时只改数据文件，不碰组件
- 实现：Astro content collections，schema 在**构建期校验** —— 字段写错不会静默上线

这是"改 CSS 换风格"和"内容易维护"两项诉求的基础。

### 6.2 CSS 架构契约　【L15】

**目标：换肤只改 CSS；改版式必须动结构。**

| # | 纪律 |
|---|---|
| 1 | **视觉决策收敛进 `tokens.css`** —— 组件内不得出现颜色 / 间距字面量，只用 `var(--color-*)` / `var(--space-*)` |
| 2 | **类名语义化，不编码外观** —— `.product-card__title`，不写 `.blue-bold-16`。类名一旦携带外观，换肤就得连标记一起改 |
| 3 | **零行内样式、零一次性魔法数字** |

**边界说明**（避免误解）：

| 换什么 | 只改 CSS 够吗 |
|---|---|
| 配色 / 字号阶梯 / 间距 / 圆角 / 阴影 / 深色模式 | ✅ 够 |
| 三栏改纵向、居中 Hero 改左图右文 | ❌ **不够**，属布局结构变更，必须改标记 |

**不用 Tailwind**：utility-first 把视觉决策写进 class 列表，风格会分散到每个组件，与本契约直接冲突。

**设计 token 清单见附录 A.1**（具体命名属默认可改项）。

### 6.3 技术基线　【L16】【L17】

| 项 | 选择 | 理由 |
|---|---|---|
| 框架 | **Astro** | 内容集合直接满足 6.1；默认零 JS 输出，交互按需加 island |
| 样式 | **plain CSS + design tokens** | 见 6.2。单一维护者、11 个页面，不引入 utility 框架 |
| 交互 | 原生 JS / 小 island | 对比表筛选、表单校验够用 |
| 后端 | **单个 serverless function** | 只做校验 + 邮件转发，不落库（4.2） |
| 邮件 | Resend 或自有 SMTP（默认可改） | 需配 SPF / DKIM |
| i18n | 不实现，仅预留 `hreflang` | 目标市场未定 |

### 6.4 视觉原则

| 原则 | 落地要求 |
|---|---|
| 减法优先 | 拒绝臃肿 3D / Flash 加载动画；Core Web Vitals 达标 |
| 微交互 | 轻量滚动视差与 micro-interactions。**不使用自动播放视频背景**【L19】 —— 拖慢 LCP |
| 真实感 | 团队、产品、供应链一律实拍；量化数字必须可追溯 |
| AI 检索友善 | 问答式段落、Schema.org、结构清晰 |

### 6.5 无障碍　【L10】

目标 **WCAG 2.1 AA**。理由：站点面向欧美买家且需过 CE/FCC，合规与无障碍的期待是实打实的；单人维护，写进去一次就不必回头补。

> `archive/research/02-fack-check.md` 曾把"无障碍"列为已核实，但给出的证据（动画损害 LCP/CLS）说的是**性能**，不是无障碍。该结论缺证据支撑，不能当作已解决。

| 项 | 要求 | 落地方式 |
|---|---|---|
| 语义结构 | 每页一个 `h1`，标题层级不跳级 | 构建期检查 |
| 键盘可达 | 全部交互元素可 Tab 到达、焦点可见、顺序合理 | 保留 `--focus-ring` token，不得移除 |
| 跳过导航 | 每页首个可聚焦元素为「Skip to content」链接 | 壳层统一实现 |
| 文本对比度 | 正文与 UI ≥ 4.5:1，大字 ≥ 3:1 | token 定义处标注对比度，构建期校验 |
| 图片替代文本 | 内容图必须有描述性 `alt`；装饰图 `alt=""` | 每张图带 `alt` 字段，缺失即构建失败 |
| 动效尊重 | 尊重 `prefers-reduced-motion` | 微交互统一包一层 media query |
| 表单可达 | 报错信息与输入框程序化关联，非仅靠颜色 | 见 4.2 |
| 表单控件 | 每个输入有关联 `<label>`，不靠 placeholder 充当标签 | 见 4.1 |

**验收**：语义结构、图片替代文本、文本对比度写成构建期检查（与 7.4 共用同一测试文件）。其余为实现约束，列入 review 检查项。

---

## 7. 隐私与合规

### 7.1 认证清单

占位数据下 `status` 全为 `in-progress`，页面**不渲染任何徽章**，只渲染文字状态。改为 `obtained` 徽章才出现，且必须同时显示 `holder`。

| 标准 | 适用 | status | holder |
|---|---|---|---|
| CE — EN 71, EN 62368 | EU — AI Toys / Office Assistants | `in-progress` | `To be confirmed per model` |
| FCC Part 15 | US | `in-progress` | `To be confirmed per model` |
| UKCA | UK | `in-progress` | `To be confirmed per model` |
| RoHS | EU / US | `in-progress` | `To be confirmed per model` |
| REACH | EU | `in-progress` | `To be confirmed per model` |
| UN38.3（电池运输） | Global | `in-progress` | `To be confirmed per model` |
| CPSIA | US — AI Toys（12 岁以下） | `in-progress` | `To be confirmed per model` |
| EN 18031（无线电） | EU — AI Glasses | `in-progress` | `To be confirmed per model` |

页面文案：
> `Certification status is listed per model. Documentation for your destination market is available on request.`

> **CE / FCC / RoHS 三项待确认是否锁定**（见 9.4 C）。这三项是中国硬件出口的实际硬门槛，缺了整站不可用；具体标准号可增删。

### 7.2 认证出现在哪

- G5 认证一览页
- Products 每条产品线的认证状态
- 产品对比表的认证状态列（`in-progress` 显式显示为 `In progress`，**不留白、不渲染徽章**）

### 7.3 隐私与同意　【L11】

不做分析统计 → 无非必要 cookie → GDPR 下同意弹窗非强制 → **G3 只需页脚链接，不需要弹窗**。

**代价：任何第三方组件都会打破这个前提。** 若日后加入 reCAPTCHA、分析脚本或第三方预约工具，必须同步引入同意机制。这是 4.2 选 honeypot 而非 reCAPTCHA 的原因。

### 7.4 上线前检查（gate）　【L14】

正式环境以下模式必须**零命中**，实现为随 CI 运行的测试：

- `example.com` / `acme-devices.example` / `.example` 顶级域
- `@example` 邮箱
- `TODO` / `Lorem` / `FIXME`
- `isPlaceholder: true` / `isExample: true`
- `Sample case` / `pending` 占位文案

另需三项静态检查（契约要求）：

- 无行内样式
- 组件内无颜色 / 间距字面量
- 每页一个 `h1`，标题层级不跳级

**机器查不出的部分见附录 A.8** —— 那些才是真风险。

### 7.5 壳层占位

| 项 | 占位 |
|---|---|
| Privacy Policy | 骨架占位，主体名用附录 A.1 `legalName`。**上线前须法务审校** |
| Terms of Use | 同上 |
| schema.org `Organization` | 占位 `legalName` + 占位 `sameAs` |
| schema.org `FAQPage` | 从附录 A.7 生成 |
| sitemap | 覆盖全部路径 |
| `noindex` | 开发环境开，正式环境关 |

---

## 8. 二期范围

| 项 | 触发条件 |
|---|---|
| **产能与制造能力页** | 当自有品牌出货量形成、或与制造方合作深度足以作为卖点时。当前无自有产能，**本期不做** |
| News & Press | 有值得发布的里程碑或媒体露出 |
| Careers | 团队规模需要 |
| Downloads Center | 认证文档数量增长到需要索引 |
| 多语言版本 | 目标市场定案后 |
| 样品申请入口 | 若站内样品流程成为主要来源（当前由业务员在 WhatsApp 承接） |

---

## 9. 待定决策

### 9.1 截止前必须定

| 待定项 | 截止点 | 返工成本 | 备注 |
|---|---|---|---|
| 品牌名与域名 | 上线前 | 低 | 替换 content 数据 + schema.org `Organization` + 隐私政策法律主体名 |
| 目标市场定案 → 认证清单 | 合规页开工前 | 中 | 增证书是灌数据；**减证书需改文案**，"不适用"的证书无法直接下线 |
| 产品线最终命名与型号 | 上线前 | 低 | 只改数据 |

### 9.2 已排除

| 项 | 结论 |
|---|---|
| 大模型接入方案 | **不进入网站开发**。仅作为 Solutions 页架构图的内容呈现（6.3） |
| 询盘表单分叉 | 已合并为一套（1.4 / 4） |
| `inquiryType` 下拉字段 | 5 字段已定，不加。代价是客服需自行判断线索类型 |
| CMS | 不引入。全站由单人维护，改文件即改内容（6.1） |
| Cookie 同意弹窗 | 不做（7.3） |

### 9.3 已写入但未最终确认

以下三项已按推荐方案写入并可运行。任一项翻转需连带改动关联章节：

| # | 事项 | 关联章节 | 翻转后果 |
|---|---|---|---|
| 1 | honeypot 而非 reCAPTCHA | 4.2 | 4.2 与 7.3 的"不做同意弹窗"须推翻 |
| 2 | 表单不落库，仅转发邮件 | 4.2 | 须引入存储与 PII 留存流程 |
| 3 | 表单展示文案用英文 | 4.1 | 站点为英文站 |

### 9.4 需确认的三项

| # | 事项 | 建议 | 理由 |
|---|---|---|---|
| A | 对比表维度是否锁定 | **默认可改** | 维度应由实际产品参数决定，现在只有产品线级占位数据。锁死会导致将来加型号时发现不够用 |
| B | 三条产品线的划分是否锁定 | **锁定"三条"结构，不锁名称** | 结构稳定 + 名称可换最省返工。若你想增/减产品线需现在说 |
| C | 认证清单 8 项是否锁定 | **锁定 CE / FCC / RoHS 三项必列**，其余默认可改 | 这三项是出口硬门槛，缺了整站不可用。具体标准号可增删 |

---

## 10. 约束登记表

### 10.1 判定规则

- **带 `【L-n】` 编号 = 锁定项。** 不得违反。要改先确认 —— 它们背后是业务规则、法律风险或明确决策，不是品味偏好。
- **未编号的全部 = 默认可改项。** 可自由替换成更合适的做法。改完说一句即可，不必事先问。

**靠排除法生效**：默认项是巨大集合，不必逐条列出；只有锁定项需精确登记。因此新增内容时**不必问"要不要编号"** —— 不编号即默认可改。

> 为什么要这张表：文档越细，模型越难分辨"这是契约"还是"这是口味"，于是对两者一视同仁地服从。本表把发挥空间还给实现方，同时守住真正不能碰的部分。

### 10.2 锁定清单（19 项）

| ID | 约束 | 出处 | 锁定理由 |
|---|---|---|---|
| **L1** | 照片须标明自有 / 合作，且与实际一致 | 1.3 / 5.1 | 资产归属失实 → 尽调崩塌，后续沟通全部失去可信度 |
| **L2** | 认证徽章仅在 `status: obtained` 时渲染，且必须显示证书持有人 | 1.3 / 5.3 / 7.1 | 展示非己方持有的认证属虚假宣传，出口环节有实际后果 |
| **L3** | 全站不发布价格、MOQ、交期、账期、保修、IP 归属 | 1.4 | 写死的数字即承诺。按项目议定的模式下会变纠纷依据 |
| **L4** | 全站只有一套 5 字段询盘表单，两条路径共用 | 2 / 4 | 业务决定。字段相同时维护两份是纯重复 |
| **L5** | 不设样品申请入口、不设预约演示 | 1.4 / 4.3 | 业务决定。站外 WhatsApp 承接 |
| **L6** | 反垃圾用 honeypot + 限流，**不用 reCAPTCHA** | 4.2 | 用 reCAPTCHA 会连带推翻 L11 |
| **L7** | 表单不落库，仅转发邮件 | 4.2 | 避免 PII 留存义务。改则需引入存储与留存流程 |
| **L8** | FAQ 只收公司可信度问题，不收业务规则 | 5.2 | 业务规则答案随项目变，写死会失准 |
| **L9** | 团队 / 产品 / 产线照片必须实拍，禁止图库素材；客户 Logo 与案例引述须书面授权 | 5.1 | 素材授权风险 + 用户研究已证明图库图被忽略 |
| **L10** | 目标 WCAG 2.1 AA | 6.5 | 已确认纳入本期。面向欧美买家且需过 CE/FCC |
| **L11** | 不引入任何第三方脚本（分析、统计、reCAPTCHA、第三方预约） | 7.3 | 无非必要 cookie 才免同意弹窗。加第三方即打破前提 |
| **L12** | 全部内容走 typed content layer，页面不内嵌文案字符串 | 6.1 | "改 CSS 换风格"与"内容易维护"两项诉求的基础 |
| **L13** | 三个防护字段 `isPlaceholder` / `status` / `isExample` 及其渲染规则 | 5.3 | 占位数据能成立的前提。删掉即失去虚假声明防护 |
| **L14** | 上线前 gate 清单零命中 | 7.4 | "占位内容不漏上线"的唯一机械保障 |
| **L15** | 视觉决策收敛进 `tokens.css`；类名语义化不编码外观；零行内样式；**不用 Tailwind** | 6.2 | 你的明确诉求：以后切换风格改 CSS 即可 |
| **L16** | 框架用 Astro，不用 Next.js | 6.3 | 内容驱动站，避免过度设计 |
| **L17** | 英文单语，i18n 仅预留 `hreflang` | 6.3 | 目标市场未定，锁死语言会返工 |
| **L18** | 全站只有一个转化出口 | 2 | 防实现出两套转化机制 |
| **L19** | 不使用自动播放视频背景 | 6.4 | 拖慢 LCP，违反减法原则 |

### 10.3 默认可改项（已知清单）

以下具体取值**都不是规范**，可替换为更合适的做法。列出是为了避免它们被误当成契约。

| 位置 | 具体取值 | 可改成 |
|---|---|---|
| 附录 A.1 | 约 40 个 CSS token 的名称与分组 | 任何命名方案 |
| 附录 A.1 | `--space-1…16`、4px 基准 | 任意间距阶梯 |
| 6.5 | skip link、`aria-describedby`、`prefers-reduced-motion` 包法、检查的实现方式 | 任何达标手段（**AA 目标不可改，见 L10**） |
| 4.1 | 字段 key 名、placeholder 文案 | 任意命名（**5 字段与必填不可改，见 L4**） |
| 4.2 | honeypot 字段名 `_hp` / `_ts` | 任意（**用 honeypot 不可改，见 L6**） |
| 4.2 | 限流阈值 3 次 / 10 分钟、< 2 秒判机器人 | 任意合理值 |
| 附录 A.3 | 对比表 7 个维度 | 按实际选型需求增删（**见 9.4 A**） |
| 附录 A.2 | Hero 三个指标而非四个 | 任意（**`isExample` 规则不可改，见 L13**） |
| 附录 A.1 | 配置文件路径 `content/site.ts` | 任意 |
| 附录 A.3–A.7 | 三条产品线英文名与定位、三个场景、三个案例行业、三篇 Insights 角度、FAQ 答案 | 任意占位内容 |
| 6.3 | 邮件服务商（Resend 或自有 SMTP） | 任意（**serverless 且不落库不可改，见 L7**） |
| 3.1 / 6.1 | Schema.org 具体类型选用 | 任意合适类型 |

### 10.4 变更纪律

| 动作 | 流程 |
|---|---|
| 改**锁定项** | 先确认 → 改本文件 → 改代码 |
| 改**默认可改项** | 直接改 → 说一句。无需回改本文件 |
| 新增设计陈述 | **默认不编号**，即默认可改。确属业务/法律/明确决策的，才在 10.2 加一行并给新编号 |

---

## 11. 出口：交给 spec 阶段（待指令）

spec 需包含：

- **Astro content collection schemas**：产品线、案例、场景、认证条目、Insight，含 `status` / `isPlaceholder` / `isExample` / 证书持有人字段
- **CSS token 清单**：token 名 → 用途 → 默认值，构成 6.2 的可执行契约
- **询盘表单 schema 与 serverless function 契约**：5 字段、honeypot、限流、`Reply-To` 行为、不落库
- **验收标准**：7.4 的 CI 检查测试 + Core Web Vitals 指标 + 无行内样式 / 无颜色字面量静态检查
- **页面级 wireframe 描述**：10 个页面 + 5 项壳层

拆分顺序由 tickets 阶段决定，并声明 blocking edges。

---
---

# 附录 A · 占位数据

> **上线前整体删除本附录。** 内容替换完成后，附录 A 无保留价值 —— 真实数据在 content 文件里。
>
> 本附录是一次性脚手架，不是 source of truth。全部条目 `isPlaceholder: true`。

## A.1 站点身份

集中在 `content/site.ts` 一处。**改这里，不改组件。**

| 字段 | 占位值 | 备注 |
|---|---|---|
| `legalName` | `Acme Devices Co., Ltd.` | 进 Privacy Policy 法律主体名、页脚 |
| `brandName` | `Acme Devices` | 进 schema.org `Organization`、页脚 |
| `domain` | `acme-devices.example` | **全站禁用 `.example` 的位置必须全部替换** |
| `phone` | `+1 555 0100 100` | |
| `address` | `100 Placeholder Industrial Road, Example District, Shenzhen, China` | |
| `establishedYear` | `2015` | 视真实情况替换 |
| `registrationNumber` | `TODO-REG-NO` | **上线前必填真值**，不接受占位数字 |
| `social.linkedin` | `https://www.linkedin.com/company/placeholder-acme-devices` | 占位，勿指向真实主体 |

### 邮箱分两处，不要混

| 用途 | 开发期值 | 说明 |
|---|---|---|
| **对外公布邮箱**（页面显示） | `sales@acme-devices.example`<br>`privacy@acme-devices.example` | 保持占位。随品牌名一起替换 |
| **表单收件邮箱**（询盘投递到这） | `dalelai0776@gmail.com` | **用真实可用地址**，否则测不了表单闭环。构建期环境变量，不进页面 |

### WhatsApp

| 字段 | 占位值 |
|---|---|
| `e164` | `15555550100`（无 `+`、无空格） |
| `prefill` | `Hi Acme Devices, I'd like to know more about your AI hardware products.` |

渲染结果：

```
https://wa.me/15555550100?text=Hi%20Acme%20Devices%2C%20I'd%20like%20to%20know%20more%20about%20your%20AI%20hardware%20products.
```

## A.2 Home / Hero

**Value proposition**

> AI hardware built on proven large-model platforms, customised for your market and delivered under your brand.

**支撑行**

> Toys, office assistants and glasses from a China-based product and solutions company. Custom development, private label and delivery coordination.

**Hero 互动件**：以真实设备对话演示替代轮播与视频背景。占位 `Live device demo — coming soon.`

**三条产品线入口**（卡片，指向 `/products/*`）

**指标条**（3 项，`isExample: true`，渲染时下方标注 `Sample metrics — placeholder data.`）

| 指标 | 占位 |
|---|---|
| Years in business | 10+ |
| Products delivered | 120+ |
| Destination markets | 30+ |

> 三项而非四项：少一个未经验证的数字。真实数据到位后清 `isExample`。

## A.3 Products 与对比

### 三条产品线

| 产品线 | Path | 定位 |
|---|---|---|
| AI Toys | `/products/ai-toys` | Interactive AI companions for children and retail |
| AI Office Assistants | `/products/ai-office-assistants` | Desk-embedded AI for meetings, notes and workflow |
| AI Glasses | `/products/ai-glasses` | Wearable AI with camera, audio and live translation |

### 产品线字段（只填到产品线级 —— 见 5.4）

| 字段 | 占位 | 备注 |
|---|---|---|
| `overview` | 200 字以内定位 | 占位 |
| `capabilities[]` | 能力要点，非参数罗列 | 占位 |
| `useCases[]` | 场景化描述 3–5 条 | 占位 |
| `certifications[]` | 引用 7.1 条目 | `in-progress` |
| `moq` | `"On request"` | **不发布数字**（L3） |
| `leadTime` | `"On request"` | 同上 |
| `customisationOptions[]` | 可定制项 | 占位 |
| `datasheets[]` | 占位链接 | **上线前必须换真实 PDF 或删除槽位** |
| `media` | 占位 | **上线前必须换实拍视频，禁止图库** |

### 对比表维度（默认可改 —— 见 9.4 A）

产品线 · 目标场景 · 大模型能力 · 交互方式 · 电池续航 · 认证状态 · 定制选项

- 无价格列、无按价位筛选器（L3）
- 认证状态列直接引用 7.1 的 `status`，`in-progress` 显式显示为 `In progress`

## A.4 Solutions

> 大模型仅作为**内容**，非技术选型、非代码依赖。

| 场景 | Path | 叙事角度 |
|---|---|---|
| Education & Toy Retail | `/solutions/education-toy-retail` | 年龄分级、内容边界、家长可见性 |
| Smart Office & Meetings | `/solutions/smart-office-meetings` | 会议记录、摘要、行动项、部署形态 |
| Wearable & Imaging | `/solutions/wearable-imaging` | 第一视角拍摄、实时翻译、隐私触发设计 |

**架构图**（只画层级，不指定模型厂商）：

```
Hardware device → On-device wake / ASR → Cloud orchestration → Large-model provider → Response
```

厂商名由真实产品资料填入时，架构图本身不需返工。**不承诺效果数据**（L3）。

## A.5 Custom / ODM-OEM

> **无流程图、无周期、无条款。** 全部商务细节站外沟通（L3）。

### 五块能力

| 能力 | 占位文案 |
|---|---|
| Hardware | Platform selection and hardware adaptation |
| Firmware & Software | Firmware, companion app (iOS / Android), backend |
| Branding | Private label, packaging, brand assets |
| Compliance | Certification coordination for your target markets |
| Delivery | Order coordination, QA and shipping |

### 协作方式

> `Scope, schedule and commercial terms are agreed per project. Get in touch to discuss your requirement.`

### 明确不列出的内容

MOQ 分档 · 打样与认证周期 · 量产交期 · 账期 · 保修条款 · IP 归属条款 · 报价

需表达意愿时只用中性表述：

| 表述 | 占位文案 |
|---|---|
| NDA | `NDA available on request` |
| IP | `IP terms negotiable per project` |
| Warranty | `Warranty terms agreed per project` |

## A.6 Case Studies（核心模块）

> 全部 `isExample: true`，渲染为 `Sample case` 样式，不作为客户背书。

| 行业 | Path | 标题占位 | 量化成果占位 |
|---|---|---|---|
| Logistics | `/case-studies/logistics` | Warehouse voice assistant deployment | `−40% order-picking time` |
| Education | `/case-studies/education` | AI companion for after-school programs | `3× parent-reported engagement` |
| Retail | `/case-studies/retail` | Try-on assistant for eyewear retail | `+18% conversion in pilot stores` |

**每条案例槽位**

`clientProfile`（占位为行业描述，**不写具名客户**）· `challenge` · `solution` · `deploymentScope` · `results[]` · `certificationsProvided[]` · `quote`

> `quote` 占位**不可上线**。上线前必须替换为客户书面授权的真实引述，否则删除该槽位。

**Logo Wall**：占位为灰色占位块。**严禁使用任何真实或图库 Logo。**

## A.7 其余页面占位

### About

| 槽位 | 占位内容 | 上线要求 |
|---|---|---|
| 公司简介 | `We design and supply AI hardware products and solutions, working with manufacturing partners to deliver proven platforms under our own brand.` | — |
| 所在地 | 深圳（占位地址见 A.1） | 真值 |
| 能力构成 | 产品团队 / 供应链协调 / 定制与品牌化 | — |
| 供应链说明 | 按 1.3，区分自有与合作 | **不得暗示自有工厂** |
| 里程碑 | 2015 成立 → 2018 首个海外项目 → 2021 自有品牌立项 → 2024 三条产品线 | 全为占位 |
| 团队规模 | `200+ employees`（`isExample: true`） | — |
| 团队照片 | 占位图位，标注 `Team photo pending` | 禁止图库图 |
| 产线照片 | 占位图位，标注 `Partner manufacturing — 合作产线` | **须获书面许可**（L1） |

### Insights

| Path | 类型 | 意图 |
|---|---|---|
| `/insights/edge-ai-in-consumer-devices` | 行业观点 | 展示专业性，SEO |
| `/insights/child-safety-standards-ai-toys` | 合规解读 | 买家指南，**上线前须认证专员审校** |
| `/insights/choosing-a-supplier-checklist` | 买家指南 | 直接服务决策 |

白皮书下载位：标注 `Whitepaper pending`，上线前必须替换或移除。

### FAQ

| # | 问题 | 占位回答要点 |
|---|---|---|
| 1 | What kind of company is Acme Devices? | 中国 AI 硬件产品与方案公司 |
| 2 | Where are you based and how do you supply? | 所在地 + 供应链模式（1.3 口径） |
| 3 | What products do you offer? | 三条产品线 |
| 4 | Which markets do you serve? | 占位 |
| 5 | Can you customise the products? | 引用 A.5 五块能力 |
| 6 | Do you work with our brand? | Private label 可行 |
| 7 | Which certifications are available? | 引用 7.1，逐市场说明 + on request |
| 8 | How does the process start? | `Send the form or message us on WhatsApp — we discuss your requirement directly.` |

FAQ 页输出 `FAQPage` schema.org 结构化数据。

### CSS Token 清单（契约见 6.2）

`src/styles/tokens.css`。**组件内不得出现下表以外的颜色 / 间距 / 字号字面量。**

颜色：

```
--color-bg   --color-surface   --color-surface-raised
--color-text --color-text-muted --color-text-inverse
--color-brand --color-brand-hover --color-brand-contrast
--color-border --color-border-strong
--color-success --color-warning --color-danger
```

> 无十六进制字面量允许出现在 `tokens.css` 之外。深色模式用 `[data-theme="dark"]` 覆写同一组变量名。

间距（4px 基准）：

```
--space-1 … --space-16    → 0.25rem / 0.5rem / … 递增
--space-section          区块纵向间距
--space-container        容器内边距
```

排版：

```
--font-sans / --font-mono
--text-xs / --text-sm / --text-base / --text-lg / --text-xl
--text-2xl / --text-3xl / --text-4xl
--leading-tight / --leading-normal / --leading-relaxed
--weight-normal / --weight-medium / --weight-bold
--tracking-tight / --tracking-normal
```

形状与动效：

```
--radius-sm / --radius-md / --radius-lg / --radius-full
--shadow-sm / --shadow-md / --shadow-lg
--duration-fast / --duration-normal
--ease-standard
--z-base / --z-sticky / --z-overlay
```

布局常量：

```
--container-max    内容最大宽度
--container-gutter 页面左右留白
--focus-ring       键盘焦点环（无障碍，不可删）
```

## A.8 上线前人工复核清单

> 机器检查见 7.4。以下几类**机器查不出**，必须人工过一遍 —— 这些才是真风险。

- [ ] `registrationNumber` 的 `TODO-REG-NO` 已替换为真值
- [ ] 表单收件环境变量已切到公司正式邮箱
- [ ] 全部 `datasheets[]` 换成真实 PDF，或删除槽位
- [ ] 全部产品 `media` 换成实拍视频，**无图库素材**
- [ ] About 的团队 / 产线照片换成真实照片，产线照已标注 `Partner manufacturing` 且获书面许可
- [ ] 全部 `status` 改为真实值；`obtained` 项已核对 `holder`（证书持有人）文案正确
- [ ] 全部 `isExample: true` 清零，Sample 标注消失
- [ ] Case Studies 的 `quote` 已换成客户授权引述，或该槽位已删除
- [ ] Logo Wall 占位块已替换或整块移除
- [ ] Insights 内容已由认证专员审校（尤其 CPSIA 那篇）
- [ ] Privacy / Terms 已由法务审校
- [ ] 站点无第三方脚本；若有，确认同意机制已同步引入
- [ ] `noindex` 已关闭
- [ ] 域名已配 SPF / DKIM，询盘邮件实测不进垃圾箱
- [ ] **附录 A 已整体删除**

---

## 变更记录

| 日期 | 变更 |
|---|---|
| 2026-10-03 | 合并 `01-outline` + `02-content` 为 `docs/spec.md`；`00-research` 与英文版移入 `archive/`；新增 10 章约束登记表 |