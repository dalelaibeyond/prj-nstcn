# 官网维护与运维指南

核查日期：2026-10-04。适用对象：内容维护人员、开发人员及部署负责人。

本指南依据当前 `goal-run/` 源码、脚本和实际检查结果编写。[spec.md](spec.md) 是需求参考；历史交付与调整见 [REVIEW.md](../goal-run/REVIEW.md)，启动摘要见 [README.md](../goal-run/README.md)。下述服务器配置是建议方案，尚未部署到真实服务器。

## 1. 当前状态与架构

- 网站代码在 `goal-run/`，技术栈为 Astro 7、原生 CSS、设计令牌和 Node standalone 适配器。
- 当前为英文审阅版，共 25 个内容页面及一个 404 页面。公司、产品、案例、认证与部分文案仍为明确标注的占位内容。
- 首页、详情页、`robots.txt` 和 `sitemap.xml` 在构建时生成；`POST /api/inquiry/` 在 Node 进程中运行。只上传 `dist/client/` 到静态托管平台，询盘接口不会工作。
- 没有 CMS 后台、数据库、询盘落盘或分析脚本；内容修改需要编辑文件并重新构建。
- 正式发布检查当前失败。审阅版可以本地查看，但不能将构建成功理解为已满足上线条件。

## 2. 本地配置与启动

在项目根目录执行：

```bash
cd goal-run
node --version
npm --version
npm ci
# 仅首次创建；已有 .env 时保留原配置
test -f .env || cp .env.example .env
chmod 600 .env
```

`package.json` 要求 Node.js >= 22.12.0，本次验证使用 Node.js 24.14.0、npm 11.20.0。建议团队与部署环境固定相同的受支持 Node 版本，并使用锁文件安装依赖。

审阅环境的 `.env` 保留 `SITE_ENV=review`、`SITE_ORIGIN=http://localhost:4321`。启动已构建的网站：

```bash
export SITE_ENV=review
export SITE_ORIGIN=http://localhost:4321
npm run build
HOST=127.0.0.1 PORT=4321 npm run start
```

浏览器打开 `http://localhost:4321`，前台运行时按 `Ctrl+C` 停止。开发时使用 `npm run dev`；需要仅本机访问可运行 `npm run dev -- --host 127.0.0.1`。脚本默认监听所有网卡，局域网审阅前应确认访问范围。

**构建时显式导出 `SITE_ORIGIN`。** Astro 会读取 `.env`，但构建后执行的 `node scripts/check.mjs` 不会自动读取它。仅在 `.env` 设置本地域名，可能让 sitemap 生成使用本地域名而检查脚本仍使用内容中的域名，从而检查失败。上面的导出方式让两个步骤使用同一值。

`npm run start` 使用 Node 的 `--env-file-if-exists=.env` 加载运行配置，`npm run preview` 是它的别名。已有进程环境变量优先于 `.env`，因此修改文件后还应核对服务管理器中的配置并重启。依据：[Node 环境文件说明](https://nodejs.org/download/release/v22.17.0/docs/api/cli.html#--env-filefile)。

### 配置变量与生效时机

| 变量 | 用途与配置要求 | 修改后的操作 |
| --- | --- | --- |
| `SITE_ENV` | `review` 保持禁止索引；`production` 才可能开启索引。与 `NODE_ENV` 不同 | 重新构建并重启 |
| `SITE_ORIGIN` | 完整源地址，包含协议与必要端口，不带业务路径；正式环境使用实际 HTTPS 域名 | 重新构建并重启 |
| `HOST`、`PORT` | Node 监听地址和端口，本地默认 4321；反向代理后建议绑定 `127.0.0.1` | 重启 |
| `MAIL_TRANSPORT` | 明确填写 `smtp` 或 `resend`；当前代码对非 `resend` 值都会走 SMTP 分支 | 重启 |
| `INQUIRY_TO` | 单个询盘接收邮箱，必须替换示例中的开发收件人 | 重启 |
| `MAIL_FROM` | 单个已验证的发件邮箱；当前校验不接受 `名称 <邮箱>` 写法 | 重启 |
| `SMTP_HOST`、`SMTP_PORT` | SMTP 主机与端口，由邮件供应商提供 | 重启 |
| `SMTP_SECURE` | `true` 使用隐式 TLS，通常配合 465；`false` 通常配合 587，远程 SMTP 会要求 STARTTLS | 重启 |
| `SMTP_USER`、`SMTP_PASS` | 供应商账号与密码或应用专用密码 | 重启 |
| `RESEND_API_KEY` | 使用 Resend 时填写 API 密钥；SMTP 模式不需要 | 重启 |

不要给密钥添加 `PUBLIC_` 前缀或写进内容 JSON。`.env` 已在 `goal-run/.gitignore` 中排除；正式环境宜由密钥管理或受限环境文件注入。`astro.config.mjs` 中的 `site` 读取 `process.env.SITE_ORIGIN`，页面元数据读取构建时的 `import.meta.env.SITE_ORIGIN`，内容中的 `site.domain` 则是回退值；三处应保持一致。

## 3. 邮件配置与投递验收

选择一种传输方式，在 `.env` 或部署环境中配置：

```dotenv
# SMTP 模式：用邮件供应商和公司实际值替换尖括号部分
MAIL_TRANSPORT=smtp
INQUIRY_TO=<公司收件邮箱>
MAIL_FROM=<已验证发件邮箱>
SMTP_HOST=<供应商SMTP主机>
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<账号>
SMTP_PASS=<密码或应用专用密码>
```

Resend 模式设置 `MAIL_TRANSPORT=resend`、`INQUIRY_TO`、`MAIL_FROM` 和 `RESEND_API_KEY`。Resend 的 HTTP 调用在服务端执行，不是浏览器第三方脚本。

配置后重启，打开联系页面，等待至少两秒，填写五个必填字段并提交一条明确标识的测试询盘。确认供应商接受邮件、公司收件箱实际收到、点击回复时目标是提交人的邮箱，同时检查垃圾邮件和退信。发信域名的 SPF、DKIM、DMARC 应按供应商说明配置并验证。

`npm run test` 的邮件集成测试会启动独立 HTTP 服务和临时本地 SMTP 服务，验证真实 SMTP 接受及 `Reply-To`，不会向示例中的外部邮箱实际投递。因此它不能代替真实收件箱验收。没有可用凭据时，正常询盘会报告失败；网站不会保存一份询盘供后续重发。

当前反垃圾规则会对蜜罐非空、提交过快和超过限流的请求返回成功但不投递。单 IP 默认十分钟最多三次尝试，计数在字段验证之前。排查“显示成功但未收信”时，不能只看 HTTP 200。

## 4. 内容与功能在哪里修改

下表路径均相对 `goal-run/`。内容 JSON 顶层是记录数组，主站记录 `id` 为 `main`；不要将其改成普通对象。

| 要修改的内容 | 文件与字段 |
| --- | --- |
| 公司名、品牌名、域名、地址、公开邮箱、电话、注册信息、LinkedIn | `src/content/site.json`：`legalName`、`brandName`、`domain`、`address`、`email`、`privacyEmail`、`phone`、`registrationNumber` 等 |
| 导航、首页标题、按钮、页脚及表单提示 | `src/content/site.json`：`navigation`、`ui`；标题中的 `\n` 表示换行 |
| WhatsApp | `src/content/site.json`：`whatsapp.e164` 为纯数字国际号码，不含 `+`；`whatsapp.prefill` 为预填文本 |
| FAQ、定制能力、里程碑、统计数字 | `src/content/site.json`：`faq`、`capabilities`、`milestones`、`metrics`、`architecture`、`teamCapabilities` |
| 隐私政策与使用条款 | `src/content/site.json`：`legal.privacy`、`legal.terms`；标题与说明在 `ui` |
| 产品和对比参数 | `src/content/products.json`：产品名称、`overview`、能力、场景、定制选项、`certifications`、`modelCapabilities`、`interaction`、`battery` 等 |
| 解决方案 | `src/content/solutions.json`：`title`、`description`、`considerations`、关联产品 `product` |
| 客户案例 | `src/content/cases.json`：客户背景、挑战、方案、部署范围、结果、引述与案例标记 |
| 认证状态及持有人 | `src/content/certifications.json`：`name`、`market`、`status`、`holder` |
| 资讯 | `src/content/insights.json`：标题、分类、简介、`outline`；目前只渲染提纲，全文需扩展模型与模板 |
| 内容字段和约束 | `src/content.config.ts`；集合读取与关联校验在 `src/lib/content.ts` |
| 首页、各类详情页布局 | `src/components/Home.astro`、`src/components/PageBody.astro`；卡片及其他公共块在同目录 |
| 壳层、SEO、索引控制 | `src/layouts/Layout.astro`；robots 与 sitemap 分别在 `src/pages/robots.txt.ts`、`src/pages/sitemap.xml.ts` |
| Logo、概念插图与素材展示 | `src/components/Brand.astro`、`Concept.astro`、`Asset.astro` |
| 颜色、间距、字号与布局 | `src/styles/tokens.css` 定义视觉值；`src/styles/global.css` 引用令牌并设置布局 |
| 表单字段、前端交互和发送逻辑 | 标签在 `site.json` 的 `formFields`；组件在 `src/components/ContactForm.astro`；校验、限流、发信在 `src/lib/inquiry.mjs`；入口在 `src/pages/api/inquiry.ts` |
| 路由和 404 | `src/lib/routes.ts`、`src/pages/[...path].astro`、`src/pages/index.astro`、`src/pages/404.astro` |
| 构建、静态检查与发布 gate | `package.json`、`scripts/check.mjs`、`scripts/gate.mjs`；浏览器检查在 `scripts/browser-check.mjs` |

公开联系邮箱与后台 `INQUIRY_TO` 是两套独立配置，修改一处不会自动修改另一处。

### 常见内容变更流程

1. 编辑对应 JSON，保留已有字段名、唯一 `id`、排序字段 `order`；有序集合的 `order` 必须是正整数。
2. 新增详情记录时填写唯一 `path`，采用 `/products/某路径/` 等带首尾斜杠的格式。路由与 sitemap 会从集合生成；新增固定栏目则还需修改 `routes.ts`、页面标题映射、`PageBody.astro` 和导航。
3. 产品的认证引用和解决方案的产品引用必须指向现有 `id`。案例认证引用也应人工核对，当前读取层没有同等关联校验。
4. 执行构建、类型与测试检查，启动产物查看结果；运行中的生产服务需要重建后重启。

不得直接修改 `dist/` 或 `.astro/`，它们会被重新生成。增加、删除产品线或案例时，需同步调整依赖固定页面数和产品数量的测试，见第 7 节。

### 图片、视频、资料下载与授权

当前没有 `public/` 素材目录，可按需创建 `goal-run/public/media/`、`goal-run/public/downloads/`。文件 `public/media/team.webp` 的访问路径是 `/media/team.webp`，不要把 `public` 写进 URL。

首页设备演示、团队、制造场景与客户 Logo 对应 `site.json` 的 `demo`、`teamPhoto`、`manufacturingPhoto`、`clientLogos`；产品素材对应 `products.json` 的 `media`，资料下载对应 `datasheets`。素材记录需要 `src`、`alt`、`kind`、`width`、`height`、`ownership`、`permissionConfirmed`。示例结构：

```json
{
  "src": "/media/team.webp",
  "alt": "团队合影的准确描述",
  "kind": "image",
  "width": 1600,
  "height": 900,
  "ownership": "own",
  "permissionConfirmed": true
}
```

`kind` 支持 `image` 或 `video`；`ownership` 支持 `own`、`partner`、`client`。只在获得授权后填写 `permissionConfirmed: true`，并另存授权依据。当前网站是英文，正式录入时 `alt` 与页面文案应使用相应语言。

当前静态检查把站内所有 `<a>` 链接都当作页面路径，直接添加本地 PDF 下载会产生“broken internal link”。需先扩展检查器以验证静态文件实际存在，再添加下载链接；不要简单跳过下载检查。图片和视频也应核对实际文件可访问、尺寸、压缩与视频字幕，字段合法不能证明文件存在或授权有效。

产品 `models`、`skus` 已有数据结构但当前详情页未展示；仅录入这些字段不会自动出现型号表。`moq`、`leadTime` 当前只接受 `On request`，展示也依赖公共文案。要展示具体型号、报价条件或周期，须同步修改 schema 与模板。

## 5. 部署、发布与回滚

### 5.1 发布前检查

审阅环境与正式环境应隔离。外部审阅环境增加访问认证；`noindex` 和 robots 不能提供访问控制。

正式发布前，确认真实身份和联系方式、产品规格、素材授权、认证与案例证据、法务文本及真实邮件投递均已就绪。仅在真实性核实后设置 `isPlaceholder=false`、`isExample=false`，并替换 `ui`、FAQ、法律正文中的审阅和占位文案。

在独立构建目录中执行以下步骤，任一步失败都先处理再发布：

```bash
npm ci
export SITE_ORIGIN='https://<实际域名>'
export SITE_ENV=production
npm run build:production
npm run check:types
npm run test
```

把尖括号连同里面的说明替换为实际值。这段正式发布流程须先完成第 7 节中的测试调整，目前审阅数据执行 `build:production` 会被 gate 阻止。gate 位于 Astro 构建之后，因此失败时也可能已经生成 `dist/`；部署系统必须以整个命令退出码作为条件，不能只检查产物存在。

`Layout.astro` 在 `SITE_ENV` 非 `production` 或任一集合仍有占位项时设置 `noindex`；`robots.txt.ts` 只检查主站的占位标记，两者目前存在范围差异。发布前同时核对实际页面的 robots meta、`robots.txt`、canonical 与 sitemap，不能只依赖 gate 的零命中。

### 5.2 推荐部署方式：长期运行的 Node 服务

优先使用支持长期 Node 进程的服务器或托管服务，保留 `dist/client/` 和 `dist/server/` 的相对目录结构、`package.json`、锁文件及运行依赖。目标机部署依赖可使用 `npm ci --omit=dev`；构建与检查在安装完整依赖的构建环境执行。构建机与运行机的系统、架构及 Node 版本应兼容，避免直接复制不兼容的原生依赖。

托管平台设置：工作目录为 `goal-run/`；构建命令为通过验收的 `npm run build:production`；启动命令为 `npm run start`；把构建域名与运行时邮件密钥按生效阶段分别注入。若平台分配监听端口，应使用其 `PORT`，不要固定覆盖为 4321。serverless 或边缘平台需要重新选择适配器，并复验 SMTP/邮件 API、限流和同源检查。

自行部署时可使用 systemd。下面是**待创建的示例**，假定已创建专用非 root 用户 `nstcn`，发布目录为 `/srv/nstcn/releases/<版本>/`，`/srv/nstcn/current` 指向当前版本，Node 路径已用 `command -v node` 核实。文件 `/etc/systemd/system/nstcn.service`：

```ini
[Unit]
Description=NSTCN website
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=nstcn
Group=nstcn
WorkingDirectory=/srv/nstcn/current
Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=4321
ExecStart=/usr/bin/node --env-file=/etc/nstcn/runtime.env dist/server/entry.mjs
Restart=on-failure
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true
UMask=0077

[Install]
WantedBy=multi-user.target
```

`/etc/nstcn/runtime.env` 保存实际邮件配置，限制为服务用户可读（例如 root 所有、`nstcn` 组、权限 640），目录权限相应限制；不要放到静态目录。使用严格 `--env-file` 可让环境文件缺失时启动失败，而不是静默缺少配置。首次安装及后续查看：

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now nstcn
sudo systemctl status nstcn
sudo journalctl -u nstcn -n 100 --no-pager
# 更换版本或运行配置后
sudo systemctl restart nstcn
```

### 5.3 HTTPS、反向代理与验收

入口配置实际域名、HTTPS 证书和自动续期，只允许可信入口访问应用端口。代理必须固定或校验外部 `Host`，覆盖来自客户端的转发头，并在入口实施限流；避免把不可信的 IP 当作限流依据。

**当前适配器需要特别验证 HTTPS 同源行为。** 已安装的 `@astrojs/node` 11.1.6 使用 `createRequestFromNodeRequest`：请求协议根据 Node socket 是否加密确定。只在代理上终止 HTTPS、再通过 HTTP 回源，即使传递 `X-Forwarded-Proto`，也可能使接口看到 HTTP 源地址，导致浏览器 HTTPS 提交被拒绝。此判断来自当前依赖源码，尚未在真实代理链验证。

可先采用 HTTPS 回源，使用适配器支持的运行变量 `SERVER_CERT_PATH`、`SERVER_KEY_PATH` 指定 Node 可读的证书与私钥，代理验证回源证书并保留正确 Host；或评估适配器更新/受信代理下的请求源重建方案。证书轮换后重启服务。不要通过移除询盘同源校验来解决 403。standalone 和 TLS 变量见 [Astro Node 适配器文档](https://docs.astro.build/en/guides/integrations-guide/node/)。

需要采用转发 IP 时，在 `astro.config.mjs` 的 `security.allowedDomains` 配置实际域名的精确允许规则，重新构建；当前未配置该项，IP 可能只得到代理地址。允许域名不等于信任任何代理，仍须限制回源入口并覆盖 `X-Forwarded-For`。规则语义见 [Astro 安全配置](https://docs.astro.build/en/reference/configuration-reference/#securityalloweddomains)。

正式切换前在同样的代理链上完成：

1. 首页、产品、全部详情页、联系页可访问；不存在的路径返回真实 404；CSS、媒体和资料文件正常。
2. HTTPS 跳转、证书、canonical、sitemap 使用实际域名；索引状态符合环境用途。
3. 通过浏览器提交测试询盘，验证同源检查、实际收件与 `Reply-To`；另外核验代理限流，正常访客不会共用一个 IP 配额。
4. 查看服务日志、入口错误率和邮件供应商投递记录；应用日志只保留失败概述，避免记录询盘正文。

不要缓存 `/api/inquiry/` 的响应。可对带内容哈希的静态资源长缓存，对 HTML、robots 与 sitemap 使用可更新的策略，并在发布后核对 CDN 是否仍提供旧版本。

### 5.4 发布与回滚

每次发布记录源码版本、锁文件、构建变量、检查报告和变更说明。先将新版本装入独立目录，完成预发布验收，再切换 `current` 链接并重启；不要在正在服务的目录里原地运行构建。保留上一版可运行产物与依赖。

若页面错误、询盘失败或索引配置异常，把 `current` 切回上一个通过验收的目录，重启并复查首页、联系表单及元数据。此方案重启时有短暂中断；需要不中断服务时再采用两套实例切换。邮件配置单独受控备份，回滚应用时核对配置是否兼容，不要恢复已撤销的密钥。当前没有数据库迁移步骤。

## 6. 日常检查与故障排查

常规变更验证：

```bash
npm run build
npm run check:types
npm run test
# 首次准备浏览器；Linux 缺系统依赖时按 Playwright 提示安装
npx playwright install chromium
```

另开终端运行 `HOST=127.0.0.1 PORT=4321 npm run start`，再执行：

```bash
REVIEW_URL=http://127.0.0.1:4321 npm run test:browser
npm run gate
```

`test:browser` 不负责启动服务，默认也是 `http://127.0.0.1:4321`，报告和截图写入 `test-results/`。审阅数据下 gate 失败符合当前状态；正式数据下必须零命中。本地浏览器测试中的表单响应被模拟，不能代替真实邮件测试。

| 症状 | 检查与处理 |
| --- | --- |
| 启动报入口文件不存在 | 确认在 `goal-run/`，先构建；检查 `dist/server/entry.mjs` 是否已部署 |
| `EADDRINUSE` | 用 `ss -ltnp` 查看实际监听者，确认后停止对应服务，或修改端口；不要盲目终止全部 Node 进程 |
| 改文案后页面未变化 | 重建、重启，核对服务指向版本与 CDN 缓存；开发服务器和构建产物不要混淆 |
| sitemap 检查失败 | 显式导出 `SITE_ORIGIN`，核对内容域名、构建地址及检查进程环境，再重建 |
| 表单 503 或显示发送失败 | 核对传输方式、发件与收件地址、SMTP TLS/账号、API 密钥及出站网络；查看供应商错误记录 |
| 表单 403 | 核对浏览器 Origin、Node 实际请求协议/Host、代理链和证书；不要关闭校验来掩盖问题 |
| 表单 200 但无邮件 | 检查蜜罐、等待时间、IP 配额、供应商投递/退信与垃圾邮件；成功响应不是收件证明 |
| 请求 400、413 或 415 | 检查五个字段的格式/长度、重复字段、16 KiB 请求上限以及 JSON/URL 编码内容类型 |
| gate 出现占位命中 | 按 `file` 和 `pattern` 回到内容源修改，不要编辑生成页面或删除检查规则；一次文件/规则命中不等于一个占位记录 |
| 浏览器测试无法运行 | 检查 Chromium、系统依赖、服务与 `REVIEW_URL`；端口不一致时同步设置 |

每次发布检查真实询盘；定期核对依赖审计、证书续期、邮件退信、可用性和授权资料。至少备份源文件、锁文件、素材、授权凭据与受控配置，并定期演练恢复；`node_modules/` 和 `dist/` 不应成为源码的唯一备份。

## 7. 已确认的遗留问题与建议优先级

| 优先级 | 当前问题及证据 | 建议措施 |
| --- | --- | --- |
| P0：正式发布前 | 本次 gate 仍有 87 个文件/规则命中；真实内容、媒体授权、认证、案例及法律正文尚未完成 | 按第 4 节逐项替换并留存依据；不能只翻转标记。证书只有核实取得后才能设 `obtained`，占位认证 schema 禁止该状态 |
| P0：正式发布前 | 真实邮件凭据、公司邮箱收件与域名认证尚未验收；失败询盘不落盘 | 完成真实投递验收，明确失败处理与人工联络渠道；如需可靠重试，再设计受控队列、保留期限和隐私条款 |
| P0：正式发布前 | `tests/site.test.mjs` 固定 26 页，并断言案例全为占位、认证全为 `in-progress`、gate 必须拒绝；浏览器脚本固定三产品线 | 分离审阅夹具与正式数据验收，按集合生成合理数量断言，保留每个禁止模式的负向测试；不能简单删除保护规则 |
| P0：正式发布前 | 当前 `http-cache-semantics@4.2.0` 仍有高危审计报告；本次 `npm audit --json` 显示 `fixAvailable: true`，与旧 REVIEW 的“无兼容修复”记录不同 | 在独立变更中检查升级方案、更新锁文件并完整回归；不要直接执行强制降级。风险详情见 [安全公告](https://github.com/advisories/GHSA-ch52-4w7c-c8xp)，未修复前不能声称依赖安全检查通过 |
| P0：部署验收前 | 没有实际域名、HTTPS 代理链和部署自动化；Node 适配器的协议识别及转发 IP 需要现场验证 | 按第 5 节验证受信入口、HTTPS 回源或其他经过测试的源重建方案、同源提交与 IP 配额 |
| P1：扩大使用前 | 内存限流单实例有效，重启会清空；代理后可能共享 IP；超过限流仍返回成功 | 优先入口统一限流；评估对正常访客返回明确限流提示并同步测试，避免丢失有效询盘 |
| P1：内容扩展前 | 本地资料下载会被当前链接检查误报；模型/SKU 未展示；资讯只有提纲；MOQ/周期受 schema 限制 | 扩展模板与校验器，在增加真实内容时同步完成，不把“数据已写入”当作“功能已展示” |
| P1：正式发布前 | robots 仅查主站标记，布局检查全部集合；gate 只扫描部分内容与客户端文件，没有验证正式索引状态或内容真实性 | 统一占位判定，并加入生产环境、域名、robots meta、sitemap 与素材存在性验收；人工核实真实性 |
| P1：稳定运行前 | 没有独立健康接口、投递监控、故障告警或备份恢复自动化 | 先做首页存活、API 错误率及供应商投递监控，设置负责人；需要健康接口时避免暴露密钥或个人信息 |
| P2：持续优化 | 历史本地性能与 axe 检查不能证明真实网络 CWV、INP 或完整无障碍 | 使用真实素材后复测移动网络、人工键盘/屏幕阅读器、视频字幕与生产性能，再决定是否引入符合隐私要求的测量方案 |

本次工作目录未检测到 Git 仓库，也未发现 Dockerfile、CI 流水线或部署配置。建议纳入版本管理，使用小范围变更、代码评审、自动验证和发布审批记录；优先落实 P0，避免同时引入 CMS、数据库或多实例而增加维护成本。需要多人频繁更新内容时，再评估 CMS 与授权发布流程。

## 8. 本次核查结果与边界

2026-10-04 实际重新运行：

| 检查 | 结果 |
| --- | --- |
| `npm run build` | 通过，26 个 HTML 页面，14 组颜色对比及静态检查通过 |
| `npm run check:types` | 通过，33 个文件，零错误、警告或提示 |
| `npm run test` | 13 项通过，包括本地 HTTP → SMTP 接受与提交人 `Reply-To` |
| `npm run gate` | 失败，87 个文件/规则命中，当前不能正式发布 |
| `npm audit --json` | 1 项 high，`http-cache-semantics`；当前报告提示修复可用，尚未实施 |

本次没有重新执行浏览器全量检查，历史 50 项桌面/移动检查结果见 `REVIEW.md`，不能作为后续变更的验收结果。也没有部署 systemd、配置代理、启用正式索引或验证外部邮箱收件。维护指南中的部署步骤须在目标环境完成验收后才能记录为已上线。
