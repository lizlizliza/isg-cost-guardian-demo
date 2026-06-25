# Cost Guardian — 用户手册

> 你不是来欣赏 UI 的，你是来做决策的。这本手册按你要干的活来写，不按页面字段来列。

---

## 一、这玩意能帮你干什么

你是采购经理 / 成本工程师 / 财务 BP。供应商给你报了个价，你想知道：

1. **这个价合不合理？** → Should Cost Calculator 算出一个 clean-sheet 底价
2. **不合理的话，差在哪？** → BOM Analysis 逐行对比 DCE vs 报价
3. **谁在宰我？** → Variance Waterfall 找出哪个组件/哪个成本段被灌水了
4. **我怎么跟供应商谈？** → 导出 DCE Model，参数全透明，逐行对账

成本治理的核心逻辑就一条：**把你的成本直觉变成数字，把数字变成谈判筹码。**

---

## 二、5 分钟走一遍（先别点，看完再动手）

以 **Air Baffle** 为例，模拟一次完整的"供应商报价审查"工作流。

### Step 1：打开 Should Cost Calculator

切换到 SCC 页，你会看到 3 张 Commodity 卡片，点 **Air Baffle**。

右侧显示：**Should Cost $3.24 / unit**。这是引擎根据 28 个参数算出来的 clean-sheet 底价。

### Step 2：理解这个 $3.24 是怎么来的

往下看彩色条（Cost Build-Up Bar）。从左到右是：

| 段 | 金额 | 这句话在业务上是什么意思 |
|----|------|------------------------|
| Raw Material | $1.00 | SECC Steel，钢材多少钱 |
| Conversion / Labor | $0.54 | 深圳工厂，多少道工序，工时多少 |
| Tooling / NRE | $0.37 | 模具费摊销，每件摊多少 |
| Logistics | $0.40 | 深圳到 ISG 匈牙利，海运 |
| Tariff | $0.07 | 关税 |
| E&O Reserve | $0.01 | 超额和报废预留 |
| Warranty | $0.45 | 保修预留 |
| Volume Discount | -$0.09 | **你量大拿到的折扣（这是你的筹码！）** |
| Payment Adder | +$0.02 | 账期成本（Net 60 比 Net 30 贵） |
| Margin / Overhead | $0.47 | 供应商的利润和管理费 |

**加起来 = $3.24。** 任何一个参数变了，这个数就变。

### Step 3：看看供应商报价

vs. Supplier Quote: **$17.20**。Gap: **-$13.96（81.2%）**。

这个差距大到离谱——供应商在上一代平台上给了一个高价，而你的 clean-sheet 模型说这玩意只值 $3.24。

### Step 4：验证你的模型

改几个关键参数，看 Should Cost 敏不敏感：
- 把 Steel Index 从 0.82 调到 1.00 → 成本涨约 $0.08
- 把地点从深圳切到墨西哥 → 劳动力成本翻倍，但物流到墨西哥组装厂便宜了
- 把 Volume 从 25K 调到 75K → 折扣从 3.2% 变 5.1%

右边 Sensitivity Analysis 告诉你：±10% 变化下，**Steel Index** 对最终成本影响最大。

### Step 5：导出 Excel，拿去谈判

点击 **Export to DCE Model** → 下载一个 Excel，里面是所有参数 + 逐行成本明细。

发给供应商："这是我们 DCE 模型算的 $3.24，你们报了 $17.20，逐行对一下，差在哪？"

---

## 三、每个页面帮你做什么决策

### 3.1 Program Dashboard → "这项目整体健康吗？"

**你打开这个页面要回答 3 个问题：**

**Q1：成本在目标内吗？**

看 ACI Index。1.08 = 实际成本比设计成本高 8%。1.00 是目标，超过 1.05 就该看了。

ACI Gap = DCE - ACI = $820 - $886 = -$66。负的 = 实际比设计贵了 $66。

**Q2：走到哪个阶段了，每个阶段成本是多少？**

看 PLP Pipeline。当前 Gate 是 Commit（深蓝发光），这个阶段 DCE $820、ACI 1.08。

如果 Development 阶段的 DCE 比 Commit 还高，说明越做越贵——趋势不对。

**Q3：关键人物怎么说？**

看 Functional Commentary。5 个角色（工程/采购/成本/财务/产品）每人 3 条要点 + 状态色。

红色边框 = At Risk = 这个人有个问题在拖成本，需要你找他聊。绿色 = 一切正常。黄色 = 有个事需要处理但不紧急。

### 3.2 L2 BOM Analysis → "哪个组件在宰我？"

**你打开这个页面要回答：哪个组件的报价最离谱？**

**直接看 Variance 列：**
- **Cable / Interconnect：+$24（37.5%）** ← 这个要去谈，报价比 DCE 高了近四成
- **Chassis：+$77（23%）** ← 绝对值最大，$335 vs $412
- **Cooling Fans：$0（0%）** ← 报价和 DCE 完全一致，别在它身上浪费时间

**排序技巧：** 点 Variance 列头按降序排列，红色大数字都在最上面 = 你的谈判清单。

**DC-SCM 显示 "Pending RFI"** = 还没拿到报价 = 尽快找供应商要。Total 行标注了 "excl. pending" 提醒你这个数字是排除了未报价组件的。

**Visual Comparison Chart** 帮你快速定位：红条远远超过蓝条 = 报价水分大。

**双击 Status 可以改**（需要 Admin 页 Web Editing 开关打开）。比如谈判完了，把 Chassis 的 Status 从 Blocked 改成 OK。

### 3.3 Variance Waterfall → "成本差在哪里？"

**你打开这个页面要回答：ACI 和 CCE 之间的差距，是哪些因素造成的？**

**Full Box View：** 看全局。绿色条 = 帮你省钱的，红色条 = 让你多花钱的。

Component Δ 是绿的吗？说明组件层面在降本。Supplier Δ 是红的吗？说明供应商报价在抬价。Freight & Tariff 是红的吗？说明物流成本在涨。

**L2 Component View：** 从 Dashboard 的 BOM 表点击某一行进来，看单个组件的 ACI → DCE → CCE 拆解。

Drivers Table 告诉你每个因素的具体影响金额和优先级。Priority P0 = 马上处理。

### 3.4 Should Cost Calculator → "这个零件应该花多少钱？"

**你打开这个页面要回答：供应商的报价和 clean-sheet 底价差多少，我能给他什么价？**

**核心数字：** Should Cost（左上角大字）。

**你来回答这套逻辑：**
- 我用的是 SECC Steel，厚度 2mm，深圳产的
- 表面做了电镀锌，模具费 $45K 分 5 万件摊
- 海运到匈牙利组装，关税率 7.5%
- 25K 的量拿到 3.2% 折扣，Net 60 账期加了 0.8%
- **综上：这玩意值 $3.24。**

**Sensitivity Analysis** 告诉你在谈判桌上哪些参数是必争之地：Steel Index 波动 ±10% 对成本影响最大，Tariff Rate 影响最小——关税你没得谈，别把精力放这上面。

**Compare Scenarios：** 点 Snap B → 改参数 → 切换 A/B 视图，对比两套方案的成本差异。比如"A 方案深圳产 vs B 方案墨西哥产，差多少？"

### 3.5 Admin → "数据从哪来，到哪去"

**你打开这个页面要做 3 件事：**

1. **下载模板** → 填数据 → 上传（覆盖 Demo 数据）
2. **导出备份** → 下载 IndexedDB 全量数据，浏览器清缓存前记得做
3. **Web Editing 开关** → 控制 BOM Table 的 Status 可否双击编辑

---

## 四、看到什么数字该紧张

| 你看到的 | 这意味着什么 | 你该做什么 |
|----------|-------------|-----------|
| ACI Index > 1.05 | 实际成本超设计成本 5%+ | 下拉 Waterfall 找哪个 segment 在涨 |
| BOM Variance > +15% | 供应商报价严重偏离 DCE | 进 SCC 算 clean-sheet 底价，约供应商对账 |
| Gate 卡住不动（连续 2 个月） | 程序在某个阶段受阻 | 看 Pipeline 该阶段 why，找相关 Owner |
| Quote Coverage < 70% | 大量组件没拿到报价 | 催采购要报价，没报价的组件成本是盲区 |
| Should Cost 敏感性测试中单参数影响 > $0.10 | 成本对这个参数高度依赖 | 这是你的谈判重点，盯着这个参数砍 |
| 所有状态都是绿色 | 大概率数据有问题 | 14+ 组件的项目不可能全部 OK，检查数据更新周期 |

---

## 五、Excel 上传模板（快速参考）

### 5.1 4 个 Sheet 是什么

| Sheet | 喂给哪个页面 | 一条记录 = 什么 |
|-------|-------------|----------------|
| Dashboard | Program Dashboard | 一个 KPI 值（如 ACI=886, Volume=48K） |
| Pipeline | Dashboard → Pipeline | 一个阶段的状态（Pre-Commit done, Commit active） |
| BOM | L2 BOM Analysis | 一个 L2 组件的成本数据 |
| ShouldCost_Params | Should Cost Calculator | 一个 commodity 的一个参数值 |

### 5.2 上传规则

- **空 Sheet 不覆盖已有数据。** 你改 BOM 就只填 BOM sheet，其他 sheet 留空
- **非空 Sheet 先清空再导入。** 比如 Dashboard sheet 有数据，导入时会删掉旧的，换新的
- **Platform 字段是主键。** 填 "SR650 V4" 而不是 "ThinkSystem SR650 V4"
- **数字不带 $ 和 %。** 写 886 而不是 $886，写 78 而不是 78%

### 5.3 最常见填错的地方

| 错误 | 后果 | 正确写法 |
|------|------|---------|
| 平台名写成 "ThinkSystem SR650 V4" | 数据不匹配，页面空白 | `SR650 V4` |
| Pipeline Stage 写成 "Pre-Commit" | 上传失败 | 写 Stage 序号：`1` |
| Pipeline Status 写成 "Active"（大写 A） | 不识别 | 小写：`done` / `active` / `pending` |
| 数字带了 $ 或千分位逗号 | 解析为文本，计算报错 | `886` 不是 `$886` 或 `886.00` |
| Sheet 名写错大小写 | 上传失败 | 严格 `Dashboard` / `Pipeline` / `BOM` / `ShouldCost_Params` |

---

## 六、常见问题

**Q：改了一个参数，Should Cost 没变？**
A：检查你是不是在 Viewing snapshot B 模式。B 模式所有参数锁定只读。切回 A 就好了。

**Q：上传 Excel 后数据没变？**
A：3 个可能：① Sheet 名为空/拼错 → 检查是不是 4 个标准名；② Platform 列填错了 → 检查是不是 "SR650 V4" 或 "SR630 V3"；③ Sheet 是空的 → 空 Sheet 不会覆盖。

**Q：Code 列 / Gate 列 / Pipeline 日期改了没用？**
A：Gate 不是从 Dashboard 读的，是从 Pipeline 的 `status=active` 自动推导的。改 Pipeline sheet 才对。

**Q：换浏览器数据没了？**
A：数据存在浏览器的 IndexedDB 里，不跟着你的账号走。换浏览器 / 清缓存就会丢。记得经常 Admin → Export 备份。

**Q：供应商说我的 Should Cost 算错了？**
A：点 Export to DCE Model，参数全透明，每一行都有。逐行对账——你的模型有 28 个参数，每个都可以辩论。这就是 DCE 的价值：不是比谁声音大，是比谁逻辑对。
