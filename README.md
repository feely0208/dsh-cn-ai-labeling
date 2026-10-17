# @deepwhale-cn/dsh-cn-ai-labeling

[![Listed on DSH Plugin Hub](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/zh/plugins/feely0208/dsh-cn-ai-labeling)

**AI 生成合成内容标识合规自检** —— 给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 用的 skill 插件。

面向中国大陆市场的 AI 产品，在**设计和发版前**逐条核对生成合成内容标识是否落实。规则来自官方原文，不凭记忆。

## 它能扫出什么（5 条规则）

技能负责「怎么做」，规则引擎负责「有没有做」。同一条命令出证据：

```bash
dsh-ai-labeling --root <项目路径>      # 扫一遍
dsh-ai-labeling --demo                # 看内置演示样本
dsh-ai-labeling --list-rules          # 列出规则与依据
```

| 规则 | 查什么 | 级别 |
|---|---|---|
| `AILABEL-NO-DISCLOSURE` | 生成结果直接回给用户的文件里，没有任何「AI 生成」显式标识 | 高 |
| `AILABEL-MISSING-TEXT` | 全项目找不到一句「AI 生成 / 由 AI 生成 / AI-generated」标识文案 | 高 |
| `AILABEL-NO-REVIEW` | 面向用户输出缺「人工核验 / 仅供参考」提示 | 中 |
| `AILABEL-NO-IMPLICIT-META` | 生成产出文件缺 `generated_by` / `ai_generated` 等隐式标识元数据 | 中 |
| `AILABEL-VAGUE-GENERATED` | 文案写「自动生成 / 系统生成」但无 AI 字样 | 低 |

**每条规则都带 `when` 守卫** —— 不用 AI 的项目上，5 条规则记为「不适用」而不是「通过」，
报告会明写「N 条因不适用本项目未运行」。这一条是防假绿：**不适用 ≠ 没问题。**

**边界**：只做静态检查，报出来是提示确认，不是判定违规；图片/音视频里的隐式标识（数字水印）看不见。

## 依据

| 文件 | 性质 | 施行 | 引用条款 |
|---|---|---|---|
| 《互联网信息服务深度合成管理规定》（第 12 号令） | 部门规章 | 2023-01-10 | 第十六条、第十七条、第十八条 |
| 《人工智能生成合成内容标识办法》（国信办通字〔2025〕2 号） | 规范性文件 | 2025-09-01 | 第三～十二条 |
| **GB 45438—2025**《网络安全技术 人工智能生成合成内容标识方法》 | **强制性国标** | 2025-09-01 | 第 5、6 章；**附录 E（规范性）** |

## 安装

```bash
dsh plugin --profile <profile> add @deepwhale-cn/dsh-cn-ai-labeling
```

然后重启 dsh。技能会在 agent 需要时自动可用。

## 它帮你回答的问题

- 我这个产品**是不是**义务主体？纯工具方要不要负责？
- 哪些功能**必须**加显式标识，哪些**不必**？
- 文件元数据里的 AIGC 到底该写成什么格式？
- 导出的 Word / 图片里，标识该怎么带？
- 上架应用市场会被问什么？
- **哪些常见的"合规要求"其实是我多虑了？**

## 三个不显然但很关键的判断

**1. 隐式标识的义务面比显式标识宽。**
隐式标识挂在《深度合成规定》第十六条（对使用其服务生成或编辑的信息内容普遍适用）；
显式标识挂在第十七条第一款（仅限可能导致公众混淆或误认的 5 类服务）。
只做图片生成的产品，显式标识要看场景判定，**隐式标识从第十六条起就适用**。

**2. 义务主体是「服务提供者」，不是产品形态。**
纯客户端 / 纯工具（用户自部署、自配模型）不是义务主体 —— 不能给它扣「未标识」的帽子。
但它的**导出链路**是用户唯一无法自行补齐标识的地方，所以仍应提供标识能力。
另外，「通过提供可编程接口等方式」被 GB 45438 3.7 明确写入定义，**套壳调第三方 API 不豁免**。

**3. 详尽但不误伤。**
GB 45438 附录 A/B/C/D/F **都是资料性**（推荐与示例），**只有附录 E 是规范性**。
数字水印是「准许采用」，附录 A.2 明确写「在本文件中不做要求」。
5% 字高只适用于图片 / 视频 / 虚拟场景，文本、音频、交互界面**没有**字号要求。
插件专设一节列出这些边界 —— 误报多了，人就再也不看报告了。

## 覆盖的检查面

| 组 | 内容 |
|---|---|
| **第 0 步** | 义务主体判定（自建服务 / 工具 / 端上模型） |
| **A. 显式标识** | 文本、图片、音频、视频、虚拟场景、交互场景界面 + 下载/复制/导出链路 |
| **B. 隐式标识** | 五要素齐备、附录 E 格式、Label 取值、字符集、一文件一份 |
| **C. 协议与流程** | 用户服务协议、无标识版本与日志留存、禁止删除篡改 |
| **D. 分发与备案** | 应用市场上架问询、算法备案与安全评估材料 |
| **E. 防误伤** | 明确列出不构成强制要求的项及依据 |

## 取证脚本

插件随包分发 `labeling-check.sh`，技能正文里会给出它的**绝对路径**。

```bash
# 扫代码库，收集标识实现的证据与缺口
bash <labeling-check.sh 路径> --code --dir .

# 校验一个真实产出文件的元数据（导出物 / 图片 / 文档）
bash <labeling-check.sh 路径> --meta ./导出样例.docx
bash <labeling-check.sh 路径> --meta ./生成图.png

# 一起跑
bash <labeling-check.sh 路径> --all --dir .
```

**退出码**：`0` = 未发现问题；`1` = 有发现 —— 可直接用在 CI / 发版前卡口。

脚本只做**取证**：报告"找到了什么、缺什么"，是否违规由人判断。`--meta` 会真实解析文件里的 AIGC JSON，校验 7 个要素、`Label` 取值、字符串类型与字符集。

## 设计取舍

**不内置任何形式的"合规结论库"。** 标识规则会随监管更新，插件里固化的判断迟早过期。所有条款号与数值只来自上表官方来源，并在技能正文里附来源链接。

**不联网。** 只扫本地代码与被指定的文件，不把待审内容发往任何第三方服务。

**只读，不改。** 插件不会修改被扫描的项目。

## 与其它插件的关系

与 [`@deepwhale-cn/dsh-cn-compliance`](https://www.npmjs.com/package/@deepwhale-cn/dsh-cn-compliance) 互补：

- `dsh-cn-compliance` —— 发布前扫**对外文案**（广告法极限词、网络工具红线、备案展示）
- `dsh-cn-ai-labeling` —— 开发时查**产品实现**（标识有没有写进代码与导出物）

按 [DSH 插件生态倡议书](https://github.com/anywhere-labs/dsh-desktop/blob/main/docs/plugin-ecosystem.md) 的三条原则开发：**组合优先、声明清晰、兼容优先**。

## 许可

MIT

---

> 本插件是工程辅助工具，不构成法律意见。条款以官方最新文本为准。

---

## 深鲸网安守护系列（共 31 个）

> 一个插件做一件事。**安全问题是链式的** —— 配套用才完整。

**国内合规** ｜ [等保对照](https://github.com/feely0208/dsh-cn-mlps) · [日志留存](https://github.com/feely0208/dsh-cn-log-retention) · [备案公示](https://github.com/feely0208/dsh-cn-filing) · [用户同意](https://github.com/feely0208/dsh-consent-guard) · [个人信息权利](https://github.com/feely0208/dsh-data-rights) · [未成年人保护](https://github.com/feely0208/dsh-minor-guard) · [影响评估](https://github.com/feely0208/dsh-pipia) · [数据分类分级](https://github.com/feely0208/dsh-data-classify) · [算法备案](https://github.com/feely0208/dsh-algorithm-filing) · [数据出境](https://github.com/feely0208/dsh-cn-data-export) · [国密合规](https://github.com/feely0208/dsh-cn-crypto) · [**AI 内容标识**](https://github.com/feely0208/dsh-cn-ai-labeling)

**AI 与 Agent 治理** ｜ [AI 输出信任](https://github.com/feely0208/dsh-ai-output-trust) · [外部内容信任](https://github.com/feely0208/dsh-content-trust) · [MCP 安全](https://github.com/feely0208/dsh-mcp-audit) · [Agent 权限](https://github.com/feely0208/dsh-agent-scope) · [策略核对](https://github.com/feely0208/dsh-agent-policy) · [可疑指令](https://github.com/feely0208/dsh-phishing-guard)

**数据与凭据** ｜ [敏感数据](https://github.com/feely0208/dsh-data-scan) · [密钥轮换](https://github.com/feely0208/dsh-key-rotate) · [数据留存](https://github.com/feely0208/dsh-data-lifecycle) · [配置审计](https://github.com/feely0208/dsh-env-audit) · [密钥扫描](https://github.com/feely0208/dsh-secret-scan)

**供应链与构建** ｜ [开源许可](https://github.com/feely0208/dsh-license-guard) · [依赖投毒](https://github.com/feely0208/dsh-dep-audit) · [CI 安全](https://github.com/feely0208/dsh-ci-guard) · [工具审查](https://github.com/feely0208/dsh-tool-vet) · [物料清单](https://github.com/feely0208/dsh-sbom)

**权限与应急** ｜ [最小权限](https://github.com/feely0208/dsh-least-privilege) · [告警外发](https://github.com/feely0208/dsh-alert-relay) · [应急证据包](https://github.com/feely0208/dsh-incident-package)

都在 DSH 插件市场（dsh-plugin.org）、npm 和 deepwhale.org.cn/guard.html 上。
