/* ============================================================
   COLD PRINT · 冷案印痕 前端逻辑
   ============================================================ */

// ------------------ 静态数据 ------------------
const WORLDS = [
  { id: "fantasy",   name: "古老宅邸", desc: "豪门命案，密室里的秘密", setting: "一座与世隔绝的百年宅邸，暴雨夜，继承人死在反锁的书房。每个家人都有完美的不在场证明，也都没有。" },
  { id: "cyber",     name: "霓虹街区", desc: "电子城里的离奇失踪", setting: "永不熄灯的电子城，一名网红在直播中凭空消失，弹幕还停在最后一帧诡异的笑脸。" },
  { id: "wuxia",     name: "旧城巷弄", desc: "拆迁前夜的江湖旧账", setting: "拆迁在即的百年老巷，一声枪响后，三个门派压了十年的恩怨被重新翻出。" },
  { id: "space",     name: "远洋邮轮", desc: "公海密室，消失的贵宾", setting: "航程第七夜，豪华邮轮上的贵宾离奇坠海，而救生艇少了一艘，监控却空无一人。" },
  { id: "apocalypse",name: "废土边境", desc: "末日营地的无名尸", setting: "文明崩塌后的边境营地，一具不属于任何据点的尸体，牵出被刻意掩埋的真相。" },
  // —— 悬疑向世界 ——
  { id: "timephoto", name: "冷案档案室", desc: "被人遗忘的旧案", setting:
    "你是一间小侦探事务所的探员，专长从被人遗忘的旧案里捞出真凶。" +
    "调查守则：不凭臆测定罪；不向嫌疑人泄露证据；每一次深究，都会扰动局中人的记忆。" +
    "委托人递来一桩陈年旧案，而你要在卷宗里找出被洗过的真相——同时盯住自己越界的尺度。" },
  { id: "mystery", name: "迷雾港", desc: "证词缝隙里的推理", setting:
    "终年被灰雾笼罩的工业城市，接连发生无法用常理解释的事件。" +
    "每个看似无关的证人，都被一根看不见的线牵着；真相藏在两份证词互相矛盾的地方。" +
    "这里最危险的从不是怪物，而是你愿意相信的那个人。" },
  { id: "infinite", name: "记忆回廊", desc: "一层层嵌套的未结之案", setting:
    "被拉入层层嵌套的副本空间。每个副本都有必须自己摸索出的规则，以及一处不肯示人的出口。" +
    "死亡是真的，但更可怕的是——你开始记不清自己原本是谁。" },
];
// —— 试玩版：仅开放以下世界，其余在创建界面锁定 ——
const PLAYTEST_OPEN = ["fantasy", "cyber", "wuxia", "space", "apocalypse", "timephoto", "mystery", "infinite"];  // 桌面完整版：全世界开放
const CLASSES = [
  { id: "warrior",  name: "刑侦", icon: "⚔️", desc: "高体能近身，正面制服的王者", stats: { hp: 150, attack: 15, defense: 12, gold: 40, skills: ["近身制服", "威慑"] } },
  { id: "mage",     name: "侧写师", icon: "🔮", desc: "心理画像，脆弱而致命", stats: { hp: 90, attack: 20, defense: 6, gold: 60, skills: ["心理侧写", "线索串联"] } },
  { id: "ranger",   name: "跟踪者", icon: "🏹", desc: "敏捷监视，陷阱与跟拍", stats: { hp: 110, attack: 16, defense: 8, gold: 50, skills: ["精准跟拍", "脱身"] } },
  { id: "rogue",    name: "潜入者", icon: "🗡️", desc: "阴影中的利刃，撬锁与潜行", stats: { hp: 100, attack: 18, defense: 7, gold: 80, skills: ["撬锁", "潜行"] } },
  { id: "priest",   name: "谈判专家", icon: "✨", desc: "攻心为上，安抚与说服", stats: { hp: 120, attack: 12, defense: 10, gold: 70, skills: ["攻心", "安抚"] } },
];
const DIFFS = [
  { id: "easy",   name: "简单", desc: "悠闲冒险" },
  { id: "normal", name: "普通", desc: "标准挑战" },
  { id: "hard",   name: "困难", desc: "残酷考验" },
];
const MOODS = {
  scene: "✦ 序章", battle: "⚔ 战斗", tense: "❗ 紧张", mysterious: "🌙 神秘",
  peaceful: "🍃 宁静", sad: "🕯 哀伤", triumph: "🏆 凯旋",
};
const MOOD_BG = {
  battle: "rgba(255,79,109,.2)", tense: "rgba(255,209,102,.18)",
  mysterious: "rgba(167,139,250,.2)", peaceful: "rgba(103,232,249,.16)",
  sad: "rgba(120,120,160,.2)", triumph: "rgba(255,209,102,.25)", scene: "rgba(255,126,182,.15)",
};

// ------------------ 环境低语：各世界专属的氛围短句 ------------------
// 借鉴 80 Days / 生命线 的做法：正文之前先落一行环境描写，
// 让玩家在读到剧情前，先"闻到"这个世界的气味。
const AMBIENT_LINES = {
  fantasy: [
    "雨水顺着彩窗淌下，把墙上的族徽洗得发暗。",
    "壁炉里的火快灭了，映得每个人的脸都像在隐瞒什么。",
    "走廊尽头有扇门，风从底下钻出来，带着地窖的潮味。",
    "老座钟敲了十二下，比平时慢了半拍。",
    "地毯上有一道拖痕，通往书房，又在中途消失了。",
    "你听见二楼有脚步，可管家说那里没人住。",
  ],
  cyber: [
    "霓虹在积水里碎成一片，红得发烫，蓝得发冷。",
    "头顶的飞行器划过，广告声被雨声吞掉一半。",
    "通风口吐出温热的风，混着机油和廉价合成面的味道。",
    "义体改造店的灯牌坏了一个字，闪得像在抽搐。",
    "数据流在视网膜边缘滚动，你不看它也在。",
    "有人在巷口呕吐，声音被电子鼓点盖了过去。",
  ],
  wuxia: [
    "拆迁的碎砖堆在巷口，露出底下褪色的对联。",
    "远处的收音机放着老戏，断在第三句上。",
    "墙角有摊暗渍，被雨水泡得发胀。",
    "一只野猫从篱笆上跳过，尾巴扫落了半片瓦。",
    "谁家的门虚掩着，门缝里漏出一线暖黄。",
    "风穿过空了的鸟笼，发出很轻的啸声。",
  ],
  space: [
    "海风咸得发苦，甲板上的躺椅还留着上一位客人的体温。",
    "宴会厅的水晶灯晃了一下，像有人悄悄走过。",
    "泳池的水面平得不自然，映不出任何人的脸。",
    "广播说一切正常，可广播员的声音在发抖。",
    "救生艇的锁扣上结着新鲜的锈，像是刚被人动过。",
    "你听见船舱深处有水流声，可这层早就封闭了。",
  ],
  apocalypse: [
    "风卷起灰，打在面罩上，像有人一直在敲门。",
    "废弃的加油站还立着，价格牌停在很久以前。",
    "远处有狗叫，叫了半声就停了——它学会了。",
    "铁皮在日晒下吱呀作响，像骨头在动。",
    "水要比子弹金贵，这是活下来的人都懂的事。",
    "天是黄色的，从来没有人说过它为什么会这样。",
  ],
  timephoto: [
    "档案室的灯管嗡嗡响，照得满墙卷宗发灰。",
    "一杯凉透的茶，茶叶沉在杯底，像没说完的话。",
    "有份卷宗的边角被翻得起毛，像是被人反复读过。",
    "窗外的雨把霓虹打散，投在墙上像血迹。",
    "证物袋里还残留着海水的咸味，或别的什么。",
    "你翻开第一页，发现这桩案子，当年被草草结了。",
  ],
  mystery: [
    "雾很厚，三步之外就没有了人。",
    "煤气灯把影子拉到墙上，影子比人先到。",
    "石板缝里积着水，映出来的月亮是碎的。",
    "有人在你身后停下，又在你回头前走开了。",
    "证词都太整齐了，整齐得像被人背过。",
    "钟停在两点十四分，没有人愿意去修它。",
  ],
  infinite: [
    "这条走廊和刚才那条一模一样，包括那道裂缝。",
    "门后有门，门后还有门，你数不清已经推开几扇。",
    "脚下的光在退，你留下的痕迹也在退。",
    "空气里有静电味，和每一次进入副本时一样。",
    "你听见自己的脚步声——只有一份，没有回声。",
    "墙上的编号跳了一下，从 07 变成了 06。",
  ],
};
const AMBIENT_GENERIC = [
  "你停下脚步，听了一会。",
  "有什么东西和刚才不一样了，你说不上来。",
  "风换了方向。",
  "这一刻很安静，安静得让人不太放心。",
];
function ambientLine(wid) {
  const pool = AMBIENT_LINES[wid] || [];
  const src = pool.length ? pool : AMBIENT_GENERIC;
  return src[Math.floor(Math.random() * src.length)];
}
function showAmbient(text) {
  const el = $("ambient-line");
  if (!el) return;
  el.classList.remove("show");
  el.textContent = text || "";
  // 强制重排，让 transition 每次都能重新播放
  void el.offsetWidth;
  if (text) el.classList.add("show");
}

const PORTRAITS = [
  { id: "protagonist", name: "调查员",   given: "沈夜", full: "character/protagonist.jpg", avatar: "character/protagonist.jpg" },
  { id: "aqua",        name: "痕迹分析师", given: "江临", full: "character/aqua.jpg",        avatar: "character/aqua.jpg" },
  { id: "neon",        name: "网络侦探", given: "苏夜", full: "character/neon.jpg",        avatar: "character/neon.jpg" },
  { id: "frost",       name: "法医",      given: "白桦", full: "character/frost.jpg",       avatar: "character/frost.jpg" },
  { id: "stellar",     name: "资深探员", given: "陆沉", full: "character/stellar.jpg",     avatar: "character/stellar.jpg" },
  // 男角色（横版卡片式立绘）
  { id: "storm",   name: "外勤探员", given: "周野", full: "character/storm.jpg",   avatar: "character/storm.jpg",   card: true },
  { id: "silver",  name: "退休刑警", given: "老白", full: "character/silver.jpg",  avatar: "character/silver.jpg",  card: true },
  { id: "crimson", name: "线人",      given: "阿炎", full: "character/crimson.jpg", avatar: "character/crimson.jpg", card: true },
  { id: "violet",  name: "辩护律师", given: "顾宸", full: "character/violet.jpg",  avatar: "character/violet.jpg",  card: true },
  // 女角色（v0.1 新增，创建页可选形象 + 图鉴展示）
  { id: "f1", name: "档案管理员",   given: "阮秋", full: "character/f1.jpg", avatar: "character/f1.jpg" },
  { id: "f2", name: "自由调查记者", given: "纪云", full: "character/f2.jpg", avatar: "character/f2.jpg" },
];

// 角色图鉴数据（screen-codex 动态渲染，覆盖全部登场角色）
const CODEX = [
  { id: "protagonist", given: "沈夜", role: "调查员（玩家）", avatar: "character/protagonist.jpg",
    bio: "受雇查案的独立调查员。习惯在旧卷宗的褶皱里抽线头——表面写满疲惫，眼神却始终锐利；越是被人抹干净的案子，他越觉得底下有东西在发烫。",
    fields: [["身份","受雇查案的独立调查员"],["微表情","疲惫但锐利"],["服装","深色衬衫 + 旧风衣"],["特质","能在旧案里嗅出被洗过的真相"]] },
  { id: "aqua", given: "江临", role: "痕迹分析师", avatar: "character/aqua.jpg",
    bio: "事务所的痕迹分析师。白衬衫永远笔挺，一枚放大镜挂坠随他俯身查看现场；他相信任何接触都会留下痕迹，也相信沉默的物证比证词更诚实。",
    fields: [["身份","事务所痕迹分析师"],["微表情","冷静、专注"],["服装","白衬衫 + 马甲 + 放大镜挂坠"],["特质","从纤毫痕迹里还原现场"]] },
  { id: "neon", given: "苏夜", role: "网络侦探", avatar: "character/neon.jpg",
    bio: "网络侦探，偶尔兼职黑客。耳机几乎不离耳，习惯在屏幕微光里缩着身子；他认一个死理——所有被删掉、被抹掉的，都还躺在某个扇区的角落里，等着被人捞起来。",
    fields: [["身份","网络侦探 / 兼职黑客"],["微表情","警觉、闪躲"],["服装","旧夹克 + 耳机"],["特质","相信所有被抹掉的都还在某个扇区"]] },
  { id: "frost", given: "白桦", role: "法医", avatar: "character/frost.jpg",
    bio: "事务所的法医。镜片后是一双冷淡而审视的眼睛，话不多，结论却从不绕弯；她见过的尸体比活人多，因而对“活着”这件事格外认真。",
    fields: [["身份","事务所法医"],["微表情","冷淡、审视"],["服装","衬衫 + 医用围裙 + 眼镜"],["特质","见过的尸体比活人多"]] },
  { id: "stellar", given: "陆沉", role: "资深探员（同伴）", avatar: "character/stellar.jpg",
    bio: "所里的资深探员。灰围巾裹着旧西装，话少而沉；见过太多塌掉的事，却依然愿意在废墟里替人撑住那根底线——这是他和这座城市之间，仅剩的默契。",
    fields: [["身份","资深探员"],["微表情","沉郁、担当"],["服装","旧西装 + 灰围巾"],["特质","在废墟里仍替人撑着底线"]] },
  { id: "storm", given: "周野", role: "外勤探员", avatar: "character/storm.jpg",
    bio: "外勤探员。风衣下别着警徽，性子紧绷又热血，永远是第一个冲进去的人，也常常第一个挨刀；他认死理：现场不能没人守。",
    fields: [["身份","外勤探员"],["微表情","紧绷、热血"],["服装","风衣 + 警徽"],["特质","冲在最前，也最先挨刀"]] },
  { id: "silver", given: "老白", role: "退休刑警", avatar: "character/silver.jpg",
    bio: "退休多年的老刑警。旧毛衣配搪瓷茶缸，浑身写着疲惫与怀疑；他不爱说教，只把几十年的经验泡进茶里——那是最钝、却最可靠的刀。",
    fields: [["身份","退休刑警"],["微表情","疲惫、怀疑"],["服装","旧毛衣 + 茶缸"],["特质","经验是最钝也最可靠的刀"]] },
  { id: "crimson", given: "阿炎", role: "线人", avatar: "character/crimson.jpg",
    bio: "街头的线人。高领和围巾遮住大半张脸，眼神闪躲又戒备；嘴上从来不饶人，真到收尾时刻，却总默默递来那个最关键的人。",
    fields: [["身份","街头线人"],["微表情","闪躲、戒备"],["服装","高领 + 围巾遮口"],["特质","嘴硬心软，总在收尾递来关键证人"]] },
  { id: "violet", given: "顾宸", role: "辩护律师", avatar: "character/violet.jpg",
    bio: "辩护律师。三件套西装一丝不苟，领带夹闪着冷光，出庭时锐利得像已经胜券在握；他专精一件事：在法理最窄的缝隙里，替委托人撬出一线生机。",
    fields: [["身份","辩护律师"],["微表情","锐利、胜券在握"],["服装","三件套西装 + 领带夹"],["特质","在法理的缝隙里替人争一线生机"]] },
  // —— 可选形象 + 图鉴展示（阮秋 / 纪云，v0.1）——
  { id: "f1", given: "阮秋", role: "档案科管理员", avatar: "character/f1.jpg",
    bio: "市局档案科的活索引，经手三千多件旧卷宗。闭着眼能说出某份证词压在哪一格，也记得那些写「结案」却从没被回答过的问题。",
    fields: [["身份","市局档案科管理员"],["微表情","从容、不动声色"],["服装","深棕开衫 + 袖套 + 挂绳老花镜"],["特质","认得出每一任档案员的笔迹"]] },
  { id: "f2", given: "纪云", role: "自由调查记者", avatar: "character/f2.jpg",
    bio: "为追一桩十年前的失踪案辞了职，相机和笔就是她的取证工具。相信没被刊登的真相并没有消失，只是暂时无人认领。",
    fields: [["身份","自由调查记者"],["微表情","好奇、警觉"],["服装","军绿工装外套 + 胶片相机 + 单边发夹"],["特质","采访申请三次被驳回，仍不换选题"]] },
];

function renderCodex() {
  const grid = $("codex-grid");
  const detail = $("codex-detail");
  if (!grid || !detail) return;
  grid.innerHTML = "";
  CODEX.forEach((c, i) => {
    const d = document.createElement("div");
    d.className = "codex-card" + (i === 0 ? " selected" : "");
    d.innerHTML = `<img src="${c.avatar}" alt=""><div class="cc-name">${esc(c.given)}</div><div class="cc-role">${esc(c.role)}</div>`;
    d.onclick = () => {
      grid.querySelectorAll(".codex-card").forEach(x => x.classList.remove("selected"));
      d.classList.add("selected");
      showCodexDetail(c);
    };
    grid.appendChild(d);
  });
  showCodexDetail(CODEX[0]);
}

function showCodexDetail(c) {
  const detail = $("codex-detail");
  if (!detail) return;
  const lis = c.fields.map(f => `<li><b>${esc(f[0])}</b> · ${esc(f[1])}</li>`).join("");
  const bio = c.bio ? `<p class="codex-bio">${esc(c.bio)}</p>` : "";
  detail.innerHTML =
    `<div class="codex-art"><img src="${c.avatar}" alt="${esc(c.given)}" /><div class="codex-platform"></div></div>` +
    `<div class="codex-info"><div class="codex-name">${esc(c.given)} <span class="codex-tag">${esc(c.role)}</span></div>` +
    bio +
    `<ul class="codex-list">${lis}</ul></div>`;
}

// 各世界可选背景图（每个世界 3 张变体，进入游戏及每次新场景时轮换）
const WORLD_BGS = {
  fantasy:    ["backgrounds/bg_fantasy_1.svg", "backgrounds/bg_fantasy_2.svg", "backgrounds/bg_fantasy_3.svg"],
  cyber:      ["backgrounds/bg_cyber.png", "backgrounds/bg_cyber2.png", "backgrounds/bg_cyber_3.svg"],
  wuxia:      ["backgrounds/bg_wuxia_1.svg", "backgrounds/bg_wuxia_2.svg", "backgrounds/bg_wuxia_3.svg"],
  space:      ["backgrounds/bg_space_1.svg", "backgrounds/bg_space_2.svg", "backgrounds/bg_space_3.svg"],
  apocalypse: ["backgrounds/bg_apocalypse_1.svg", "backgrounds/bg_apocalypse_2.svg", "backgrounds/bg_apocalypse_3.svg"],
  timephoto:  ["backgrounds/bg_timephoto_1.svg", "backgrounds/bg_timephoto_2.svg", "backgrounds/bg_timephoto_3.svg"],
  mystery:    ["backgrounds/bg_mystery_1.svg", "backgrounds/bg_mystery_2.svg", "backgrounds/bg_mystery_3.svg"],
  infinite:   ["backgrounds/bg_infinite_1.svg", "backgrounds/bg_infinite_2.svg", "backgrounds/bg_infinite_3.svg"],
};
let curBgUrl = null;
function rotateWorldBg() {
  const wid = (S.state && S.state.world_id) || "fantasy";
  const bgs = WORLD_BGS[wid] || [];
  if (!bgs.length) { $("world-bg").style.backgroundImage = ""; return; }
  let idx = 0;
  if (bgs.length > 1) { do { idx = Math.floor(Math.random() * bgs.length); } while (bgs[idx] === curBgUrl); }
  curBgUrl = bgs[idx];
  $("world-bg").style.backgroundImage = "url('" + curBgUrl + "')";
}

// ------------------ 全局状态 ------------------
const S = {
  screenApi: { api_available: false, voice_available: true, voice_default: "zh-CN-XiaoxiaoNeural", voices: [{"id": "zh-CN-XiaoxiaoNeural", "name": "晓晓", "gender": "female", "desc": "温柔甜美 · 默认"}, {"id": "zh-CN-XiaoyiNeural", "name": "晓伊", "gender": "female", "desc": "活泼俏皮"}, {"id": "zh-CN-XiaoxuanNeural", "name": "晓萱", "gender": "female", "desc": "沉稳知性"}, {"id": "zh-CN-YunxiNeural", "name": "云希", "gender": "male", "desc": "阳光少年"}, {"id": "zh-CN-YunyangNeural", "name": "云扬", "gender": "male", "desc": "沉稳播报"}, {"id": "zh-CN-YunjianNeural", "name": "云健", "gender": "male", "desc": "激昂热血"}] },
  create: { world: "fantasy", classId: "warrior", diff: "normal", name: "", portrait: "protagonist" },
  state: null,        // 游戏运行时状态
  history: [],        // AI 对话历史
  typing: { timer: null, i: 0, text: "", done: null, paused: false }, // 打字机句柄
  currentAudio: null,
  voiceOn: true,
  voiceId: "zh-CN-XiaoxiaoNeural",  // 当前旁白声线
  voiceCache: {},                  // 声线试听音频缓存（秒切）
  textSpeed: 1,       // 剧情倍速（文字打字机）
  voiceSpeed: 1,      // 剧情倍速（语音）
  paused: false,      // 暂停中
  cast: {},           // 角色声线登记表：说话者名 → 声线 id（同一角色固定声线）
  lastSegments: [],   // 当前场景的配音分段（🔊 重播用）
  sceneCache: new Map(),  // 场景配音缓存：key → blob（FIFO，上限 30 条）
  voiceToken: 0,      // 分段播放取消令牌
  voiceDone: null,    // 当前段落播放的唤醒函数（外部停止时调用）
  voiceBusy: false,   // 分段播放进行中（含段落间合成间隙）
  curSpeaker: "",     // 正在发声的角色名（空 = 旁白）
};

// ------------------ 工具 ------------------
const $ = (id) => document.getElementById(id);
const show = (id) => {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  // BGM 音量随场景调节：菜单正常、游戏中压低、离开菜单时淡出
  if (id === "screen-menu") { if (BGM.playing) BGM.setLevel("menu"); }
  else if (BGM.playing) BGM.setLevel("game");
};
const esc = (t) => { const d = document.createElement("div"); d.textContent = t ?? ""; return d.innerHTML; };

function makePetals(n = 16) {
  const box = $("petals");
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    const size = 6 + Math.random() * 9;
    p.style.width = size + "px"; p.style.height = size * 0.8 + "px";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 7 + Math.random() * 9 + "s";
    p.style.animationDelay = -Math.random() * 12 + "s";
    p.style.opacity = 0.25 + Math.random() * 0.4;
    box.appendChild(p);
  }
}

// ------------------ 打字机（支持倍速 / 暂停） ------------------
function typeWriter(text, done) {
  stopTyping();
  const el = $("dialog-text");
  el.textContent = "";
  S.typing = { timer: null, i: 0, text: text, done: done || null, paused: false };
  setPaused(false); // 新场景默认恢复播放
  S.typing.timer = setInterval(typeTick, Math.max(8, 26 / S.textSpeed));
}
function typeTick() {
  const t = S.typing;
  if (!t || t.paused) return;
  // 每次吐 1~2 字符，中文更自然
  t.i += Math.random() < 0.35 ? 2 : 1;
  $("dialog-text").textContent = t.text.slice(0, t.i);
  if (t.i >= t.text.length) {
    clearInterval(t.timer); t.timer = null;
    t.done && t.done();
  }
}
function stopTyping() {
  if (S.typing && S.typing.timer) clearInterval(S.typing.timer);
  S.typing = { timer: null, i: 0, text: "", done: null, paused: false };
}
function skipTyping() {
  const t = S.typing;
  if (!t || !t.timer) return false;
  clearInterval(t.timer); t.timer = null;
  $("dialog-text").textContent = S.pendingSceneText || t.text;
  return true;
}
// 变速时重排计时器（保留当前进度）
function restartTyping() {
  const t = S.typing;
  if (!t || !t.timer || t.paused) return;
  clearInterval(t.timer);
  t.timer = setInterval(typeTick, Math.max(8, 26 / S.textSpeed));
}

// ------------------ 倍速 / 暂停 ------------------
function setSpeed(v) {
  v = parseFloat(v) || 1;
  S.textSpeed = v; S.voiceSpeed = v;
  if (S.currentAudio) S.currentAudio.playbackRate = v;
  restartTyping();
  document.querySelectorAll(".speed-btn").forEach(b => {
    b.classList.toggle("selected", parseFloat(b.dataset.speed) === v);
  });
}
function setPaused(on) {
  S.paused = on;
  if (S.typing) S.typing.paused = on;
  if (S.currentAudio) {
    if (on) S.currentAudio.pause();
    else S.currentAudio.play().catch(() => {});
  }
  const b = $("btn-pause");
  if (b) { b.innerHTML = on ? "▶ 继续" : "⏸ 暂停"; b.classList.toggle("paused", on); }
}
function togglePause() {
  if (!S.state) return;
  const playing = (S.typing && S.typing.timer) || S.currentAudio || S.voiceBusy;
  if (!playing) { toast("当前没有正在播放的剧情"); return; }
  setPaused(!S.paused);
}

// ------------------ API ------------------
async function apiChat(payload) {
  const r = await fetch("api/chat", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("chat " + r.status);
  return r.json();
}

// ------------------ 离线案件库（上架 / 无 API 时使用，运行时零成本） ------------------
// 设计案里的「AI 成本模型」落地：开发期用 gen_cases.py 一次性把案件预生成进 cases.json，
// 上架后前端直接遍历本地 JSON，不再调用任何云端 API —— 卖一份的边际成本 ≈ $0。
let _casesPromise = null;
function loadCases() {
  if (_casesPromise) return _casesPromise;
  _casesPromise = fetch("cases.json")
    .then(r => (r.ok ? r.json() : null))
    .catch(() => null)
    .then(d => d || (typeof window !== "undefined" && window.CASES_DATA) || null); // file:// 直开时 fetch 被禁，回退内联案件库
  return _casesPromise;
}
async function bakedChat(payload) {
  const data = await loadCases();
  const st = S.state;
  const wid = (st && st.world_id) || "fantasy";
  const pool = (data && data.cases && data.cases[wid]) || [];
  if (!pool.length) {
    return {
      scene: "档案室里一片寂静，似乎没有更多线索了。你合上卷宗，今天先到这里。",
      segments: [{ speaker: "", voice_hint: "narrator", emotion: "calm", text: "档案室里一片寂静，似乎没有更多线索了。" }],
      choices: [{ id: 1, text: "继续" }, { id: 4, text: "自由行动" }],
      mood: "scene", status_change: {}, combat: null, affinity: [], clue: "", twist: false, victory: false, case_end: false, chain: false,
    };
  }
  if (st.case_pool == null) st.case_pool = Math.floor(Math.random() * pool.length);
  const caseObj = pool[st.case_pool] || pool[0];
  const nodes = caseObj.nodes || [];
  const ni = st.node_idx || 0;
  const node = nodes[Math.min(ni, nodes.length - 1)];
  // 推进游标：到案件末尾则串下一个案件（多案时），否则逐节点前进
  let nextNi = ni + 1;
  let caseEnd = false;
  if (nextNi >= nodes.length) {
    nextNi = 0;
    st.case_pool = (st.case_pool + 1) % pool.length;
    caseEnd = true;
    st.case_cleared = (st.case_cleared || 0) + 1;
  }
  st.node_idx = nextNi;
  const chain = pool.length > 1; // 还有别的案件可串，才算 Roguelike 连环
  const out = Object.assign({}, node);
  out.status_change = out.status_change || {};
  out.mood = out.mood || "scene";
  out.choices = (out.choices && out.choices.length) ? out.choices : [{ id: 1, text: "继续" }, { id: 4, text: "自由行动" }];
  out.segments = out.segments && out.segments.length ? out.segments
    : [{ speaker: "", voice_hint: "narrator", emotion: "calm", text: out.scene || "" }];
  out.combat = out.combat || null;
  out.affinity = out.affinity || [];
  out.clue = out.clue || "";
  out.twist = !!out.twist;
  out.victory = false;
  out.case_end = caseEnd;
  out.chain = chain;
  // 案件级审讯数据（前端据此并入嫌疑人档案 / 发放物证 / 记录真凶）
  out.case_id = caseObj.id || "";
  out.case_suspects = caseObj.suspects || [];
  out.case_evidence = caseObj.evidence || [];
  out.case_culprit = caseObj.culprit || "";
  return out;
}
async function apiVoice(text, voice, pro) {
  // 预烘焙模式：查本地清单（file:// 与 http 均可，零服务端、零网络）
  const key = sceneCacheKey(text, voice, pro);
  const local = window.VOICE_MANIFEST && window.VOICE_MANIFEST[key];
  if (local) return { __local: local };
  throw new Error("语音未预烘焙");
}
// 场景配音缓存（同文本 + 同声线 + 同语气不重复合成）
function sceneCacheKey(text, voice, pro) {
  return voice + "|" + (pro ? pro.rate + pro.pitch + pro.volume : "") + "|" + text;
}
async function fetchSceneAudio(text, voice, pro) {
  const key = sceneCacheKey(text, voice, pro);
  if (S.sceneCache.has(key)) return S.sceneCache.get(key);
  const blob = await apiVoice(text, voice, pro);
  S.sceneCache.set(key, blob);
  if (S.sceneCache.size > 30) {
    const oldest = S.sceneCache.keys().next().value;   // FIFO 淘汰
    S.sceneCache.delete(oldest);
  }
  return blob;
}
function stopVoice() {
  S.voiceToken++;                       // 取消进行中的分段播放循环
  S.voiceBusy = false;
  stopCompanionSpeech();                // 陆沉的语音同步停止，避免残留/重合
  const a = S.currentAudio;             // 先抓取当前在播音频引用，避免被 finish 提前置空
  if (S.voiceDone) { const wake = S.voiceDone; S.voiceDone = null; wake(); }
  if (a) { try { a.pause(); } catch (e) {} }   // 真正暂停音频元素，杜绝新段叠在旧段上
  S.currentAudio = null;
  BGM.duck(false);   // 旁白结束，恢复 BGM 音量
  if (S.paused) setPaused(false);
  $("btn-voice").classList.remove("playing");
  S.curSpeaker = "";
  updateSpeakerLabel();
}
// 播放单个音频片段，返回 Promise（ended / 出错 / 被外部停止时 resolve/reject）
function playBlob(blob) {
  return new Promise((resolve, reject) => {
    const local = blob && blob.__local;
    const url = local || URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.playbackRate = S.voiceSpeed;   // 跟随剧情倍速
    S.currentAudio = audio;
    let settled = false;
    const finish = (err) => {
      if (settled) return;
      settled = true;
      S.voiceDone = null;
      try { audio.pause(); } catch (e) {}   // 自然结束或被中断都确保停掉音频元素
      if (!local) URL.revokeObjectURL(url);
      if (S.currentAudio === audio) S.currentAudio = null;
      if (err) reject(err); else resolve();
    };
    S.voiceDone = () => finish(null);    // 外部停止时唤醒挂起的段落
    audio.onended = () => finish(null);
    audio.onerror = () => finish(new Error("音频解码失败"));
    audio.play().then(() => { if (S.paused) audio.pause(); }).catch(finish);
  });
}
// 场景配音：按分段依次播放——不同角色不同声线，不同情绪不同语气
async function playSceneVoice(segments) {
  S.voiceBusy = true;                   // 先置忙，后可能触发的同伴语音会自动排队
  stopVoice();
  const segs = (segments || []).filter(s => s && s.text);
  if (!segs.length) { S.voiceBusy = false; return; }
  const token = S.voiceToken;
  S.voiceBusy = true;
  $("btn-voice").classList.add("playing");
  try {
    for (let i = 0; i < segs.length; i++) {
      if (token !== S.voiceToken) return;          // 已被取消（新场景 / 手动停止）
      const seg = segs[i];
      const voice = voiceFor(seg);
      const pro = EMOTION_PROSODY[seg.emotion] || EMOTION_PROSODY.calm;
      const blob = await fetchSceneAudio(seg.text, voice, pro);
      if (token !== S.voiceToken) return;
      S.curSpeaker = seg.speaker || "";
      updateSpeakerLabel();
      if (i === 0) {
        BGM.duck(true);                            // 旁白期间自动压低 BGM，保证人声清晰
        if (S.typing.timer) skipTyping();          // 边听边读：语音响起即展开全文
      }
      await playBlob(blob);
      if (token !== S.voiceToken) return;
    }
  } catch (e) {
    if (token === S.voiceToken) toast("语音播放失败：" + e.message);
  } finally {
    if (token === S.voiceToken) stopVoice();
  }
}
function toast(msg) {
  const t = document.createElement("div");
  t.className = "thinking"; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2400);
}

// ------------------ 游戏状态 ------------------
function newState() {
  const w = WORLDS.find(x => x.id === S.create.world);
  const c = CLASSES.find(x => x.id === S.create.classId);
  const diffHp = { easy: 1.3, normal: 1.0, hard: 0.75 }[S.create.diff];
  const st = {
    world: w.name, world_id: w.id, world_setting: w.setting,
    class_name: c.name, class_id: c.id, difficulty: S.create.diff,
    player_name: S.create.name || "无名旅者",
    portrait: S.create.portrait,
    level: 1, exp: 0, exp_to_next: 100,
    hp: Math.round(c.stats.hp * diffHp), max_hp: Math.round(c.stats.hp * diffHp),
    attack: c.stats.attack, defense: c.stats.defense, gold: c.stats.gold,
    mp: 30, max_mp: 30,
    luck: { warrior: 8, mage: 9, ranger: 12, rogue: 14, priest: 10 }[c.id] || 10,
    inventory: ["面包", "水瓶"], skills: [...c.stats.skills],
    turn_count: 0, monsters_killed: 0,
    // 羁绊表：三位侦探搭档（线人/法医/黑客），初始 0 = 初识
    affinity: { informant: 0, coroner: 0, hacker: 0 },
    alignment: 0, achievements: [],
    quests: [],
    // —— 悬疑系统 ——
    dives: 3,          // 剩余勘查次数（调取现场回放的能力）
    divergence: 0,     // 现实偏移度 0~100，越高时间线越不稳定
    clues: [],         // 已收集的关键线索
    twists: 0,         // 遭遇的剧情反转次数
    endings: [],       // 已解锁的结局 id
    relics: [],        // 蒙尘遗物（未鉴定）
    _relicsFound: 0, _relicsCursed: 0,
    // —— 离线案件库进度（上架 / 无 API 时遍历 cases.json） ——
    case_pool: null,   // 当前承办的案件序号（null = 待随机）
    node_idx: 0,       // 当前案件内的场景节点游标
    case_cleared: 0,   // 已告破案件数
    baked_cursor: null, // 服务端 baked 模式游标 {case_id, node_idx}（契约 v1，随响应回显）
    // —— 审讯 / 物证 / 指控（侦探核心玩法） ——
    suspects: {},          // 嫌疑人档案 {id: {name,role,alibi,hostile,pacified,verified}}
    evidence: [],          // 物证 [{id,name,hint,identified,solid,authored,note}]
    case_culprit: "",      // 当前案件真凶 id（authored 真相，指控判定用）
    _case_id: "",          // 已并入审讯数据的案件 id（防止重复发放）
    pending_accusation: null, // 当前可用的指控提案 {ready,min_evidence,candidates,culprit}
    accused: "",           // 玩家已指控的嫌疑人 id（空 = 未指控）
    accuse_result: null,   // 指控判定 {correct, sufficient, identified, min}
  };
  // 新开局：重置角色声线表，玩家角色按形象预配固定声线
  S.cast = {};
  S.cast[st.player_name] = PLAYER_VOICE[st.portrait] || "zh-CN-XiaoxiaoNeural";
  saveCast();
  return st;
}
function expNeeded(level) { return 100 + (level - 1) * 60; }

function applyStatusChange(sc) {
  if (!sc) return;
  const st = S.state;
  let msgs = [];
  if (sc.hp_change) {
    st.hp = Math.max(0, Math.min(st.max_hp, st.hp + sc.hp_change));
    msgs.push(`${sc.hp_change > 0 ? "💗 恢复" : "💔 损失"} ${Math.abs(sc.hp_change)} HP`);
    if (sc.hp_change < 0) { const cw = $("char-wrap"); cw.classList.remove("damaged"); void cw.offsetWidth; cw.classList.add("damaged"); }
  }
  if (sc.attack_change) { st.attack += sc.attack_change; msgs.push(`⚔ 攻击 ${sc.attack_change > 0 ? "+" : ""}${sc.attack_change}`); }
  if (sc.defense_change) { st.defense += sc.defense_change; msgs.push(`🛡 防御 ${sc.defense_change > 0 ? "+" : ""}${sc.defense_change}`); }
  if (sc.gold_change) { st.gold = Math.max(0, st.gold + sc.gold_change); msgs.push(`💰 金币 ${sc.gold_change > 0 ? "+" : ""}${sc.gold_change}`); }
  if (sc.exp_gain) {
    st.exp += sc.exp_gain; msgs.push(`✦ 经验 +${sc.exp_gain}`);
    while (st.exp >= st.exp_to_next) {
      st.exp -= st.exp_to_next; st.level++; st.exp_to_next = expNeeded(st.level);
      st.max_hp += 20; st.hp = st.max_hp; st.attack += 3; st.defense += 2;
      const cw = $("char-wrap"); cw.classList.remove("levelup"); void cw.offsetWidth; cw.classList.add("levelup");
      msgs.push(`🎉 等级提升 → Lv.${st.level}！`);
    }
  }
  if (sc.add_item) { st.inventory.push(sc.add_item); msgs.push(`📦 获得「${sc.add_item}」`); }
  if (sc.remove_item) {
    const idx = st.inventory.indexOf(sc.remove_item);
    if (idx >= 0) { st.inventory.splice(idx, 1); msgs.push(`📤 失去「${sc.remove_item}」`); }
  }
  if (sc.add_skill) { st.skills.push(sc.add_skill); msgs.push(`🌟 习得技能「${sc.add_skill}」`); }
  if (sc.monsters_killed) { st.monsters_killed += sc.monsters_killed; msgs.push(`💀 击败 ${sc.monsters_killed} 个敌人`); }
  if (msgs.length) toast(msgs.join("　"));
}
function applyQuest(q) {
  if (!q || !q.action || q.action === "none") return;
  const st = S.state;
  if (q.action === "add" && q.name) {
    st.quests.push({ id: q.id || ("q" + Date.now()), name: q.name, description: q.description || "", done: false });
    toast(`📜 新任务：${q.name}`);
  } else if (q.action === "complete" && q.id) {
    const t = st.quests.find(x => x.id === q.id || x.name === q.name);
    if (t) { t.done = true; toast(`✅ 任务完成：${t.name}`); }
  }
  renderQuest();
}

// ------------------ 渲染 ------------------
function renderHUD() {
  const st = S.state; if (!st) return;
  updateAccuseBtn();   // 指认按钮随指控提案显隐
  $("hud-name").textContent = st.player_name;
  $("hud-class").textContent = `${st.class_name} · ${st.difficulty === "easy" ? "简单" : st.difficulty === "hard" ? "困难" : "普通"}`;
  $("hud-world").textContent = st.world;
  $("bar-hp").style.width = (st.hp / st.max_hp * 100) + "%";
  $("text-hp").textContent = `${st.hp}/${st.max_hp}`;
  $("bar-exp").style.width = (st.exp / st.exp_to_next * 100) + "%";
  $("text-exp").textContent = `${st.exp}/${st.exp_to_next}`;
  if ($("bar-mp")) { $("bar-mp").style.width = (st.mp / st.max_mp * 100) + "%"; $("text-mp").textContent = `${st.mp}/${st.max_mp}`; }
  $("stat-atk").textContent = st.attack;
  $("stat-def").textContent = st.defense;
  $("stat-gold").textContent = st.gold;
  $("stat-level").textContent = st.level;
  if ($("stat-luck")) $("stat-luck").textContent = st.luck;
  if ($("stat-dive")) $("stat-dive").textContent = st.dives ?? 0;
  if ($("stat-diverge")) $("stat-diverge").textContent = st.divergence ?? 0;
}

// ============================================================
//  趣味层：战斗 · 运气 · 羁绊 · 商店 · 成就 · 结局
// ============================================================
// 契约 2.2：侦探搭档好感三件套（与后端 affinity.char 对齐）。
// 固定 id：informant(线人) / coroner(法医) / hacker(黑客)。
// 资深探员陆沉保留为「固定搭档旁白」（案件叙事与建议气泡），不占好感槽。
const COMPANIONS = {
  informant: { name: "线人", given: "阿炎", avatar: "character/crimson.jpg",
               sigil: "🖤", tint: "#ff7eb6", hint: "young_m",
               desc: "街头线人，消息灵通、嘴硬心软。他替你撬开不肯开口的嫌疑人的嘴，也总在收尾时递来关键证人。" },
  coroner:   { name: "法医", given: "白桦", avatar: "character/frost.jpg",
               sigil: "🔬", tint: "#67e8f9", hint: "mature_f",
               desc: "事务所的法医，见过的尸体比活人多。她出具的物证鉴定，往往比口供更不容狡辩。" },
  hacker:    { name: "黑客", given: "苏夜", avatar: "character/neon.jpg",
               sigil: "💻", tint: "#a78bfa", hint: "young_m",
               desc: "网络侦探，调监控、挖数据黑市、复原被删改的记录。她相信——所有被抹掉的，都还在某个扇区里。" },
};
const ACHIEVEMENTS = [
  { id: "first_blood", icon: "⚔",  name: "首战告捷", desc: "赢得你的第一场战斗" },
  { id: "slayer",      icon: "💀", name: "百战余生", desc: "累计击败 10 个敌人" },
  { id: "bond_max",    icon: "💞", name: "羁绊之证", desc: "与某位搭档的默契达到 100" },
  { id: "tycoon",      icon: "💰", name: "腰缠万贯", desc: "金币达到 500" },
  { id: "ascendant",   icon: "🌟", name: "登峰造极", desc: "角色达到 10 级" },
  { id: "wanderer",    icon: "🧭", name: "天涯旅者", desc: "存活满 50 回合" },
  { id: "pacifist",    icon: "🕊", name: "不战而胜", desc: "20 回合内从未战斗" },
  { id: "collector",   icon: "🎒", name: "收藏家",   desc: "同时持有 8 件以上物品" },
  { id: "victory",     icon: "👑", name: "传说圆满", desc: "达成通关结局" },
  // —— 悬疑成就 ——
  { id: "clue_first", icon: "🔍", name: "初得蛛丝", desc: "发现第一条线索" },
  { id: "clue_five",  icon: "🧩", name: "抽丝剥茧", desc: "累计收集 5 条线索" },
  { id: "truth",      icon: "🕯", name: "真相大白", desc: "拼齐线索，揭开事件真相" },
  { id: "perfect_accuse", icon: "⚖", name: "完美收官", desc: "证据充分并指认真凶" },
  { id: "framed_once",    icon: "⛓", name: "冤字当头", desc: "经历一次错误的指控" },
  { id: "evidence_five",  icon: "🔬", name: "物证满架", desc: "累计鉴定 5 件物证" },
  { id: "paradox",    icon: "🌀", name: "偏移失控", desc: "让调查偏移度达到 60%" },
  { id: "diver",      icon: "⏳", name: "勘查初成", desc: "完成一次现场勘查" },
  { id: "ending_hunter", icon: "🚪", name: "结局收藏家", desc: "解锁 3 种不同结局" },
  { id: "bond_all",   icon: "🤝", name: "众志同心", desc: "与全部同伴的默契都达到 20" },
  { id: "relic_find", icon: "❔", name: "拾遗者",   desc: "拾到第一件蒙尘遗物" },
  { id: "relic_five", icon: "🔮", name: "开箱者",   desc: "鉴定 5 件蒙尘遗物" },
  { id: "cursed",     icon: "💀", name: "以身试咒", desc: "鉴定出一件凶物，却活了下来" },
];

// ---------------- 未鉴定遗物 ----------------
// 取自 roguelike 的经典设计：捡到时你不知道它是什么。
// 鉴定是一次赌博——可能是守护，也可能是代价。
// 文字游戏里最缺的就是"手心出汗"的那一秒，这个系统补的就是它。
const RELIC_TABLE = [
  // 吉（共 8 档）
  { id: "guard",   name: "守护之契",   icon: "🛡", good: true,  w: 12,
    desc: "纹路沉稳，握在手里像握住一块不会熄灭的炭。",
    text: "你感到胸口一沉，随即又轻了——某种东西替你挡在了身前。",
    apply: st => { st.max_hp += 20; st.hp += 20; } },
  { id: "edge",    name: "锋锐之缺",   icon: "🗡", good: true,  w: 11,
    desc: "断了一截，断口却比刃还利。",
    text: "断刃在你掌中震了一下，像是认了新的主人。",
    apply: st => { st.attack += 4; } },
  { id: "ward",    name: "静默壁垒",   icon: "🧱", good: true,  w: 10,
    desc: "表面布满细密的裂纹，敲上去却闷响如石。",
    text: "裂纹在你触碰时合上了——它替你受过一次伤。",
    apply: st => { st.defense += 4; } },
  { id: "charm",   name: "四叶之运",   icon: "🍀", good: true,  w: 9,
    desc: "一枚被摩挲得发亮的小铜片，边缘已经圆了。",
    text: "你把它放进口袋，从此走路都轻快了几分。",
    apply: st => { st.luck += 5; } },
  { id: "hourglass",name:"重勘之砂",   icon: "⏳", good: true,  w: 9,
    desc: "细沙倒着往上流，怎么看都不合常理。",
    text: "沙子回流了一瞬。你又多了一次重来的机会。",
    apply: st => { st.dives = (st.dives || 0) + 1; } },
  { id: "coin",    name: "旧朝金币",   icon: "💰", good: true,  w: 12,
    desc: "上面铸着早已无人使用的年号。",
    text: "虽然年号作废了，金子还是金子。",
    apply: st => { st.gold += 120; } },
  { id: "elixir",  name: "澄澈之泉",   icon: "💧", good: true,  w: 10,
    desc: "瓶身冰凉，里面的液体在缓慢发光。",
    text: "一股清流自喉间淌下，疲惫被冲散了大半。",
    apply: st => { st.mp = st.max_mp; st.hp = Math.min(st.max_hp, st.hp + 40); } },
  { id: "insight", name: "洞察之眼",   icon: "👁", good: true,  w: 8,
    desc: "透过它看东西，边缘会微微扭曲。",
    text: "你看见了一条本不该看见的缝隙——真相又近了一寸。",
    apply: st => { addClue("遗物指向：被刻意抹去的那一段记录"); } },
  // 平（1 档）
  { id: "trinket", name: "无用之美",   icon: "🪶", good: true,  w: 9,
    desc: "很漂亮，仅此而已。",
    text: "它什么也没做。但你想了想，还是留着吧。",
    apply: st => { st.gold += 15; } },
  // 凶（4 档）
  { id: "curse_hp",name: "蚀骨之环",   icon: "💀", good: false, w: 8,
    desc: "环内侧有一圈细齿，像是咬合过什么。",
    text: "它收紧了。你听见自己的骨头在响——有些东西，一旦戴上就摘不下来。",
    apply: st => { st.max_hp = Math.max(20, st.max_hp - 15); st.hp = Math.min(st.hp, st.max_hp); } },
  { id: "curse_atk",name:"钝锈之刃",   icon: "🔪", good: false, w: 7,
    desc: "锈得很厉害，握柄却很新，像是常被人握着。",
    text: "锈迹顺着掌心爬上来。你的手，没有从前稳了。",
    apply: st => { st.attack = Math.max(3, st.attack - 3); } },
  { id: "curse_fog",name:"错位之砂",   icon: "🌫", good: false, w: 7,
    desc: "沙子在漏，可壶身完好无损。",
    text: "你想起了一些事，又很快忘了——世界在你身后悄悄改了几笔。",
    apply: st => { bumpDivergence(10); } },
  { id: "curse_gold",name:"贪婪之囊",  icon: "🕳", good: false, w: 6,
    desc: "袋口缝着，里面有东西在动。",
    text: "金币从缝里漏了个干净，那东西还在动。你决定不再打开它。",
    apply: st => { st.gold = Math.max(0, st.gold - 60); } },
];
const RELIC_TOTAL_W = RELIC_TABLE.reduce((s, r) => s + r.w, 0);
// 悬念提示：未鉴定时只给一句若有若无的暗示，不给答案
const RELIC_HINTS = [
  "摸上去，凉得不太正常。",
  "它比你以为的要重。",
  "表面无尘，像是刚被人放下。",
  "偶尔会发出很轻的、像呼吸的声音。",
  "你的影子在它旁边，短了一点点。",
  "看久了，会忘了自己为什么在看它。",
];
function rollRelic() {
  let r = Math.random() * RELIC_TOTAL_W;
  for (const x of RELIC_TABLE) { r -= x.w; if (r <= 0) return x; }
  return RELIC_TABLE[0];
}
function gainRelic(st, silent) {
  st.relics = st.relics || [];
  const r = {
    uid: "r" + Date.now() + Math.floor(Math.random() * 1000),
    hint: RELIC_HINTS[Math.floor(Math.random() * RELIC_HINTS.length)],
    identified: false,
    relic: null,
  };
  st.relics.push(r);
  if (!silent) {
    pushLog("system", "❔ 你拾起一件「蒙尘遗物」——它还不知道自己是什么。");
    toast("❔ 拾得蒙尘遗物（打开物品栏可鉴定）");
  }
  return r;
}
function identifyRelic(uid) {
  const st = S.state; if (!st) return;
  const r = (st.relics || []).find(x => x.uid === uid);
  if (!r || r.identified) return;
  const roll = rollRelic();
  r.identified = true; r.relic = roll.id;
  roll.apply(st);
  st._relicsFound = (st._relicsFound || 0) + 1;
  if (!roll.good) st._relicsCursed = (st._relicsCursed || 0) + 1;
  renderHUD(); checkAchievements();
  pushLog("system", `${roll.icon} 鉴定结果：「${roll.name}」——${roll.text}`);
  toast(`${roll.icon} ${roll.name}`);
  // 立刻刷新面板，让玩家看到结果
  openInventory();
}
function relicLine(uid) {
  const st = S.state; const r = (st.relics || []).find(x => x.uid === uid);
  if (!r) return "";
  if (!r.identified) return `❔ 蒙尘遗物｜${r.hint}`;
  const d = RELIC_TABLE.find(x => x.id === r.relic);
  if (!d) return "❔ 蒙尘遗物";
  return `${d.icon} ${d.name}｜${d.desc}`;
}
// 结局结算里的「遗物账本」：把你一路上的赌局摊开来看
function relicEpilogue() {
  const st = S.state; if (!st) return "";
  const found = (st.relics || []).filter(r => r.identified && r.relic);
  if (!found.length) return "";
  let good = 0, bad = 0;
  const rows = found.map(r => {
    const d = RELIC_TABLE.find(x => x.id === r.relic);
    if (!d) return "";
    d.good ? good++ : bad++;
    return `<div class='over-relic ${d.good ? "good" : "bad"}'>${d.icon} ${esc(d.name)}<span>${esc(d.desc)}</span></div>`;
  }).join("");
  const verdict = bad === 0
    ? "你捡起的每一件，都恰好是幸运的那一件。"
    : (good === 0 ? "你碰过的东西，没有一件放过你。"
      : `你赌了 ${found.length} 次，赢了 ${good} 次，也认了 ${bad} 次。`);
  return `<div class='over-relics'><div class='over-relics-h'>❔ 遗物账本 · ${found.length} 件</div>${rows}
    <div class='over-relics-v'>${esc(verdict)}</div></div>`;
}
function openInventory() {
  const st = S.state; if (!st) return;
  const relics = st.relics || [];
  let html = "<div class='inv-sec'><div class='inv-h'>🎒 行囊</div>";
  html += `<div class='inv-items'>${st.inventory.length ? st.inventory.map(n => esc(n)).join("、") : "<span class='dim'>空空如也</span>"}</div></div>`;
  html += "<div class='inv-sec'><div class='inv-h'>❔ 蒙尘遗物<span class='inv-sub'>鉴定是不可逆的赌博</span></div>";
  if (!relics.length) {
    html += "<div class='dim inv-empty'>还没有拾到任何遗物。它们通常藏在诡异的角落里。</div>";
  } else {
    relics.forEach(r => {
      if (r.identified) {
        const d = RELIC_TABLE.find(x => x.id === r.relic);
        html += `<div class='relic-row identified ${d && d.good ? "good" : "bad"}'>`;
        html += `<div class='relic-txt'>${d ? d.icon + " " + esc(d.name) + "<span class='relic-desc'>" + esc(d.desc) + "</span>" : "❔"}</div>`;
        html += `<div class='relic-done'>已鉴定</div></div>`;
      } else {
        html += `<div class='relic-row'><div class='relic-txt'>❔ 蒙尘遗物<span class='relic-desc'>${esc(r.hint)}</span></div>`;
        html += `<button class='relic-btn' data-uid='${r.uid}'>鉴 定</button></div>`;
      }
    });
  }
  html += "</div>";
  html += `<div class='inv-sec'><div class='inv-h'>🌟 技能</div><div class='inv-items'>${st.skills.length ? st.skills.map(n => esc(n)).join("、") : "<span class='dim'>尚未习得</span>"}（耗 8 MP）</div></div>`;
  showModal("物品 & 遗物", html);
  $("modal-body").querySelectorAll(".relic-btn").forEach(b => {
    b.onclick = () => identifyRelic(b.dataset.uid);
  });
}

// ---------------- 陆沉常驻同伴 ----------------
// 在关键剧情/战斗节点主动搭话，使用专属声线（独立于场景旁白，不被新场景打断）
const COMPANION_LINES = {
  greet:       ["你来了。……这桩案子，比卷宗上写的要脏。", "又接活了？这一次，记得留好证据链。"],
  combat_start:["小心点，对方不是第一次动手了。", "退后，这交给我先顶一下。"],
  combat_win:  ["干净利落。走吧，现场留给技术队。", "看到了吗？你比档案里写的更能扛。"],
  hurt:        ["别硬撑……先处理伤口。", "你流血了，我没办法当没看见。"],
  lowhp:       ["撑住！我没打算今天替你收尾。", "别怕，卷宗没合上，人就不能倒。"],
  levelup:     ["你进步了，这行饭越吃越稳。", "沉住气，下一步才是关键。"],
  bond1:       ["跟你查案的日子，是我最踏实的时候。", "不知从哪天起，已经习惯你在身边了。"],
  bond2:       ["哪怕线索全断了，我也只认你这一个搭档。", "你是我翻过的所有案子里，唯一不想放手的那个。"],
  victory:     ["我们做到了……没让真凶溜走。", "案子结了，而我们，还能一起喝杯咖啡。"],
};
const COMPANION_VOICE = "zh-CN-YunyangNeural";
let _compThrottle = 0;
// 等待剧情旁白播完（避免陆沉的声音和旁白重合）
function waitVoiceIdle(maxMs) {
  return new Promise(resolve => {
    const t0 = Date.now(), limit = maxMs || 15000;
    (function check() {
      if (!S.voiceBusy || Date.now() - t0 > limit) return resolve();
      setTimeout(check, 120);
    })();
  });
}
// 停止陆沉当前语音并隐藏气泡（新场景开始/手动停止时调用）
function stopCompanionSpeech() {
  S._compToken = (S._compToken || 0) + 1;   // 作废尚未开始播放的排队语音
  if (S._compAudio) { try { S._compAudio.pause(); } catch (e) {} S._compAudio = null; }
  clearTimeout(S._compTimer);
  const bubble = $("companion-bubble"), ava = $("companion-ava");
  if (bubble) { bubble.classList.remove("show"); bubble.classList.add("hidden"); }
  if (ava) ava.classList.remove("talking");
}
// 显示陆沉气泡 + 用她的专属声线朗读（等旁白结束再开口，声音不重合）
async function showCompanionBubble(text, emotion) {
  const wrap = $("companion"), bubble = $("companion-bubble"), ava = $("companion-ava");
  if (wrap) wrap.classList.remove("hidden");
  if (bubble) { bubble.textContent = text; bubble.classList.remove("hidden"); bubble.classList.add("show"); }
  if (ava) ava.classList.add("talking");
  // 气泡淡出：开播后才开始计时，保证文字和语音同步
  const fade = () => {
    clearTimeout(S._compTimer);
    S._compTimer = setTimeout(() => {
      if (bubble) { bubble.classList.remove("show"); bubble.classList.add("hidden"); }
      if (ava) ava.classList.remove("talking");
    }, 4600);
  };
  if (!S.voiceOn) { fade(); return; }
  const myToken = (S._compToken = (S._compToken || 0) + 1);
  try {
    const pro = EMOTION_PROSODY[emotion || "calm"] || EMOTION_PROSODY.calm;
    const blob = await fetchSceneAudio(text, COMPANION_VOICE, pro);
    if (myToken !== S._compToken) return;               // 已被更新的气泡取代
    await waitVoiceIdle(15000);                          // 等剧情旁白播完
    if (myToken !== S._compToken) return;               // 期间又来了新气泡
    const local = blob && blob.__local;
    const url = local || URL.createObjectURL(blob);
    const a = new Audio(url); a.playbackRate = S.voiceSpeed;
    S._compAudio = a;
    a.onended = () => {
      if (!local) URL.revokeObjectURL(url);
      if (S._compAudio === a) S._compAudio = null;
      fade();
    };
    a.play().catch(() => fade());
  } catch (e) { fade(); }
}
// 关键节点主动搭话（带节流，避免刷屏）
async function companionSay(event, emotion) {
  const st = S.state; if (!st) return;
  const lines = COMPANION_LINES[event]; if (!lines || !lines.length) return;
  const now = Date.now();
  if (now - _compThrottle < 6000) return;   // 同一事件 6 秒内不重复
  _compThrottle = now;
  const text = lines[Math.floor(Math.random() * lines.length)];
  showCompanionBubble(text, emotion);
}
function showCompanion() { const w = $("companion"); if (w) w.classList.remove("hidden"); }

// ---------------- 悬疑 / 线索系统 ----------------
// 记录玩家挖到的线索、现实偏移度与反转次数，驱动悬疑感与隐藏结局
function addClue(text) {
  const st = S.state; if (!st || !text) return;
  const t = String(text).trim();
  if (!t || st.clues.includes(t)) return;      // 去重
  st.clues.push(t);
  toast("🔍 发现线索：" + t);
  checkAchievements();
}
function bumpDivergence(n) {
  const st = S.state; if (!st) return;
  st.divergence = clamp((st.divergence || 0) + (n || 0), 0, 100);
  if (st.divergence >= 60) toast("⚠ 调查的裂痕正在扩大……");
  checkAchievements();
}
function mysterySummary() {
  const st = S.state; if (!st) return "";
  const d = st.divergence || 0;
  const state = d >= 80 ? "濒临崩坏" : d >= 50 ? "严重扭曲" : d >= 25 ? "轻微偏移" : "稳定";
  const dives = st.dives ?? 0, cl = (st.clues || []).length, tw = st.twists ?? 0;
  return `🕳 调查偏移度：${d}%（${state}）　⏳ 剩余复盘：${dives} 次　🔍 线索：${cl} 条　🌀 反转：${tw} 次`;
}
// ---------------- 角色卡片 ----------------
// 把「玩家角色 + 已知同伴」渲染成一张张卡片：立绘 / 称号 / 声线 / 羁绊
function cardVoiceName(id) {
  const m = {
    "zh-CN-XiaoxiaoNeural": "晓晓 · 温柔", "zh-CN-XiaoyiNeural": "晓伊 · 俏皮",
    "zh-CN-XiaoxuanNeural": "晓萱 · 沉稳", "zh-CN-YunxiNeural": "云希 · 阳光",
    "zh-CN-YunyangNeural": "云扬 · 浑厚", "zh-CN-YunjianNeural": "云健 · 激昂",
  };
  return m[id] || id || "未知";
}
function bondLabel(v) {
  const n = v || 0;
  return n >= 80 ? "知交" : n >= 40 ? "挚友" : n >= 10 ? "同伴" : n >= 0 ? "初识" : "疏远";
}
// 无实拍立绘的同伴：生成一枚主题纹章卡面（渐变底 + 徽记 + 名讳）
function crestSVG(c) {
  const g = c.sigil || "✦", t = c.tint || "#a78bfa";
  return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id="cg" cx="50%" cy="38%" r="72%">
        <stop offset="0%" stop-color="${t}" stop-opacity=".85"/>
        <stop offset="100%" stop-color="#0d0b1c" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect width="120" height="150" fill="url(#cg)"/>
    <circle cx="60" cy="58" r="34" fill="none" stroke="${t}" stroke-width="1.6" opacity=".65"/>
    <circle cx="60" cy="58" r="41" fill="none" stroke="${t}" stroke-width="0.8" opacity=".35"/>
    <text x="60" y="72" font-size="34" text-anchor="middle">${g}</text>
    <text x="60" y="128" font-size="15" text-anchor="middle" fill="#f3eefb" opacity=".9">${esc(c.given)}</text>
  </svg>`;
}
function renderCards() {
  const st = S.state; if (!st) return "";
  const p = PORTRAITS.find(x => x.id === (st.portrait || "protagonist")) || PORTRAITS[0];
  // 玩家卡片
  let html = `<div class='cards-grid'>`;
  html += `<div class='char-card player'>
      <div class='cc-art'><img src='${p.full}' alt='' /></div>
      <div class='cc-body'>
        <div class='cc-name'>${esc(st.player_name)} <span class='cc-tag'>玩家</span></div>
        <div class='cc-line'>${esc(p.name)} · ${esc(st.class_name)}</div>
        <div class='cc-line dim'>声线 · ${esc(cardVoiceName(S.cast && S.cast[st.player_name]))}</div>
        <div class='cc-stats'>
          <span>❤ ${st.hp}/${st.max_hp}</span><span>🔷 ${st.mp}/${st.max_mp}</span>
          <span>⚔ ${st.attack}</span><span>🛡 ${st.defense}</span><span>🎲 ${st.luck}</span>
        </div>
      </div></div>`;
  // 同伴卡片
  const ids = Object.keys(st.affinity || {});
  ids.forEach(id => {
    const c = COMPANIONS[id] || { name: id, given: id, avatar: "", sigil: "❔", tint: "#a78bfa", hint: "narrator", desc: "旅途中的邂逅。" };
    const v = (st.affinity || {})[id] || 0, pct = clamp((v + 100) / 2, 0, 100);
    const art = c.avatar ? `<img src='${c.avatar}' alt='' />` : crestSVG(c);
    html += `<div class='char-card companion'>
      <div class='cc-art'>${art}</div>
      <div class='cc-body'>
        <div class='cc-name'>${esc(c.given)} <span class='cc-tag bond'>${bondLabel(v)}</span></div>
        <div class='cc-line'>${esc(c.name)}</div>
        <div class='cc-line dim'>声线 · ${esc(cardVoiceName(VOICE_HINT_MAP[c.hint]))}</div>
        <div class='cc-bar'><div class='cc-fill' style='width:${pct}%'></div>
        <div class='cc-desc'>${esc(c.desc)}</div>
      </div></div>`;
  });
  html += "</div>";
  if (!ids.length) html += "<p class='dim'>尚未结识同伴。</p>";
  return html;
}
function openCards() {
  const st = S.state; if (!st) return;
  showModal("🎴 角色卡片", renderCards());
}
function openClues() {
  const st = S.state; if (!st) return;
  const cl = st.clues || [];
  const list = cl.length
    ? `<div class='clue-list'>${cl.map((c, i) => `<div class='clue-row'>${i + 1}. ${esc(c)}</div>`).join("")}</div>`
    : "<p class='clue-empty'>还没有发现任何线索。试着和每个人多说几句，或回到关键地点再看一眼。</p>";
  showModal("🔍 线索档案", `${mysterySummary()}\n\n${list}`);
}
// 执行一次现场勘查：消耗次数、增加偏移，并向 AI 请求一段"过去的真相"
async function doTimeDive() {
  const st = S.state; if (!st) return;
  if (S.voiceBusy) { toast("剧情朗读中，稍候再勘查"); return; }
  if ((st.dives || 0) <= 0) { toast("勘查胶片已用尽"); return; }
  st.dives -= 1;
  st._divesUsed = (st._divesUsed || 0) + 1;
  bumpDivergence(randInt(3, 8));
  renderHUD();
  await submitPlayerAction("[现场勘查] 你调取一段现场回放，回到案发前的十二小时。请揭示一个此前无人知晓、且与本案直接相关的关键细节，并让它对当下的调查产生可见的偏移。");
}

function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function grantExp(n) {
  const st = S.state; st.exp += n;
  while (st.exp >= st.exp_to_next) {
    st.exp -= st.exp_to_next; st.level++; st.exp_to_next = expNeeded(st.level);
    st.max_hp += 20; st.hp = st.max_hp; st.attack += 3; st.defense += 2;
    st.max_mp += 5; st.mp = st.max_mp;
    toast("🎉 等级提升 → Lv." + st.level + "！");
    if (!combat) companionSay("levelup", "happy");
  }
  renderHUD();
}

// ---------------- 战斗 + 运气 ----------------
let combat = null; // {enemy, ehp, defending, usedDice, eTurn, pAtkBuff, pDefBuff, pAtkDown, eAtkDown, ePoison}

// 12 种敌人原型：hpMul/atkMul/defMul 为等级缩放系数，ability 为特殊行为
const ENEMY_TYPES = [
  { name: "持械劫匪", epithet: "亡命之徒", hpMul: 1.0, atkMul: 1.0, defMul: 1.0, ability: "none" },
  { name: "街头混混", epithet: "帮派马仔", hpMul: 0.8, atkMul: 1.2, defMul: 0.7, ability: "charge" },
  { name: "彪形打手", epithet: "雇主保镖", hpMul: 1.6, atkMul: 0.9, defMul: 1.8, ability: "guard" },
  { name: "阴狠线人", epithet: "下毒老手", hpMul: 1.1, atkMul: 0.9, defMul: 1.0, ability: "venom" },
  { name: "冷面杀手", epithet: "沉默雇凶", hpMul: 0.9, atkMul: 1.0, defMul: 0.9, ability: "frost" },
  { name: "飞车暴徒", epithet: "飙车党徒", hpMul: 0.85, atkMul: 1.35, defMul: 0.6, ability: "charge" },
  { name: "负隅者",   epithet: "困兽犹斗", hpMul: 1.2, atkMul: 1.1, defMul: 1.2, ability: "none" },
  { name: "犯罪头目", epithet: "幕后黑手", hpMul: 0.95, atkMul: 1.05, defMul: 0.8, ability: "drain" },
  { name: "纵火狂徒", epithet: "疯狂纵火", hpMul: 1.0, atkMul: 1.25, defMul: 0.9, ability: "none" },
  { name: "设局老千", epithet: "陷阱布置", hpMul: 1.1, atkMul: 0.95, defMul: 0.9, ability: "venom" },
  { name: "义体打手", epithet: "改装保镖", hpMul: 1.3, atkMul: 1.0, defMul: 1.4, ability: "guard" },
  { name: "复仇狂徒", epithet: "偏执复仇", hpMul: 0.9, atkMul: 1.1, defMul: 0.8, ability: "drain" },
];
const ENEMY_ABILITY_DESC = {
  none: "", charge: "冲撞：每 3 回合发动凶猛扑击", drain: "反扑：攻击时借势稳住自身",
  guard: "死守：防御极高", venom: "暗算：可能令你中毒", frost: "压制：可能削弱你的力量",
};
// 敌人立绘：按能力生成主题化的 SVG 怪兽头像（无需外部素材，永远可用）
const ENEMY_ART = {
  none:   { c1: "#4a2a8c", c2: "#170a30", eye: "#d9b6ff", accent: "#8a5cf0", glyph: "✦" },
  charge: { c1: "#9c3a14", c2: "#2a0f06", eye: "#ffd27a", accent: "#ff7a3c", glyph: "⚡" },
  drain:  { c1: "#7a1850", c2: "#1f0414", eye: "#ff8fb4", accent: "#e01d72", glyph: "🩸" },
  guard:  { c1: "#454b54", c2: "#13161b", eye: "#c4d8e8", accent: "#90a6ba", glyph: "🛡" },
  venom:  { c1: "#1f6e36", c2: "#061a0c", eye: "#c2ff8a", accent: "#56d36a", glyph: "☠" },
  frost:  { c1: "#155a8c", c2: "#04161f", eye: "#c8f3ff", accent: "#5cc8ff", glyph: "❄" },
};
function enemyArtSVG(ability) {
  const t = ENEMY_ART[ability] || ENEMY_ART.none;
  // 侦探向：去掉兽角 / 冰晶 / 毒滴等怪兽特征，仅保留一个阴影中的对峙者剪影
  const horns = "";
  const drips = "";
  const crystal = "";
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="g" cx="50%" cy="42%" r="60%">
      <stop offset="0%" stop-color="${t.c1}"/><stop offset="100%" stop-color="${t.c2}"/>
    </radialGradient></defs>
    <circle cx="60" cy="60" r="58" fill="url(#g)" stroke="${t.accent}" stroke-width="2"/>
    ${horns}${crystal}
    <path d="M34 58 Q60 40 86 58 Q80 92 60 96 Q40 92 34 58 Z" fill="#0c0c14" opacity=".55"/>
    <ellipse cx="48" cy="60" rx="7" ry="9" fill="${t.eye}"/>
    <ellipse cx="72" cy="60" rx="7" ry="9" fill="${t.eye}"/>
    <circle cx="48" cy="60" r="3" fill="#0a0a12"/><circle cx="72" cy="60" r="3" fill="#0a0a12"/>
    <path d="M48 76 Q60 86 72 76 Q66 82 60 82 Q54 82 48 76 Z" fill="#0a0a12"/>
    ${drips}
    <text x="98" y="26" font-size="20" text-anchor="middle">${t.glyph}</text>
  </svg>`;
}
function makeEnemy(st) {
  const lvl = st.level || 1;
  const t = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
  const hp = Math.round((38 + lvl * 16) * t.hpMul);
  return { name: t.name, epithet: t.epithet, ability: t.ability,
           hp, atk: Math.round((7 + lvl * 1.8) * t.atkMul),
           def: Math.round((2 + lvl * 0.6) * t.defMul), flee: true };
}

// 技能数据库：kind 决定结算逻辑，power 为基础数值（随等级放大）
// 侦探向重皮：所有技能改为查案 / 制伏手段，kind 机制保持原样不变
const SKILL_DB = {
  // —— 职业初始技能（对局起手即可用）——
  "近身制服": { mp: 6,  kind: "attack",        power: 20, desc: "擒拿压制，造成稳定伤害" },
  "威慑":     { mp: 5,  kind: "buff_atk",      power: 5,  desc: "厉声喝止，攻击力提升（整场）" },
  "心理侧写": { mp: 7,  kind: "attack_debuff", power: 16, debuff: 3, desc: "看穿破绽，伤害并扰乱对方心防" },
  "线索串联": { mp: 5,  kind: "buff_def",      power: 5,  desc: "理清头绪，处变更从容（防御提升）" },
  "精准跟拍": { mp: 7,  kind: "attack_sure",   power: 22, desc: "咬死目标，必定命中的跟拍突袭" },
  "脱身":     { mp: 5,  kind: "buff_def",      power: 7,  desc: "金蝉脱壳，大幅提升闪避" },
  "撬锁":     { mp: 4,  kind: "buff_def",      power: 6,  desc: "无声潜入，悄然拉开距离" },
  "潜行":     { mp: 5,  kind: "buff_def",      power: 8,  desc: "隐入暗处，大幅提升闪避" },
  "攻心":     { mp: 6,  kind: "buff_atk",      power: 6,  desc: "言语施压，攻破对方心防" },
  "安抚":     { mp: 6,  kind: "heal",          power: 22, desc: "稳住局面，平复伤势" },
  // —— 可通过商店习得的进阶技能 ——
  "擒拿重击": { mp: 8,  kind: "attack",        power: 26, desc: "沉重擒抱，造成大量伤害" },
  "催泪闪击": { mp: 10, kind: "attack",        power: 28, desc: "催泪喷雾直射，轰击对手" },
  "冷冻喷雾": { mp: 10, kind: "attack_debuff", power: 20, debuff: 4, desc: "冷冻气体炸开，伤害并削弱对方" },
  "电击枪":   { mp: 12, kind: "attack",        power: 34, desc: "高压电击，造成巨额伤害" },
  "掩体掩护": { mp: 7,  kind: "buff_def",      power: 10, desc: "依托掩体，防御大幅提升" },
  "擒锁回气": { mp: 10, kind: "lifesteal",     power: 24, desc: "锁喉压制，伤害并稳住自身" },
  "拼死一搏": { mp: 8,  kind: "buff_atk",      power: 10, desc: "退无可退，攻击暴涨" },
  "麻醉针":   { mp: 9,  kind: "attack_poison", power: 18, desc: "麻醉注射，持续放倒对手" },
  "急救包":   { mp: 12, kind: "heal",          power: 45, desc: "现场急救，大幅治愈" },
  // 通用远程技（部分职业起手即带，商店亦可得）
  "精准射击": { mp: 7,  kind: "attack_sure",   power: 24, desc: "远程精准一击，必定命中" },
};
// 玩家有效攻防（含战斗内增益/减益）
function effAtk(st) {
  let a = st.attack + (combat ? (combat.pAtkBuff || 0) : 0);
  if (combat && (combat.pAtkDown || 0) > 0) a = Math.round(a * 0.7);
  return Math.max(1, a);
}
function effDef(st) { return st.defense + (combat ? (combat.pDefBuff || 0) : 0); }
// 伤害结算：比率减伤（防御再高也不会免疫）+ ±8% 波动，保证战斗节奏稳定
const MITIGATION_K = 78;
function dmgToEnemy(raw) {
  const ed = combat ? (combat.enemy.def || 0) : 0;
  return Math.max(1, Math.round(raw * (1 - ed / (ed + MITIGATION_K)) * (0.92 + Math.random() * 0.16)));
}
function dmgToPlayer(raw) {
  const pd = effDef(S.state);
  return Math.max(1, Math.round(raw * (1 - pd / (pd + MITIGATION_K)) * (0.92 + Math.random() * 0.16)));
}
function startCombat(c) {
  const e = c.enemy || c;
  combat = { enemy: e, ehp: e.hp, defending: false, usedDice: false, flee: c.flee !== false, eTurn: 0 };
  $("combat-name").textContent = e.name + (e.epithet ? " · " + e.epithet : "");
  $("combat-enemy-hp").style.width = "100%";
  $("combat-enemy-hp-text").textContent = e.hp + "/" + e.hp;
  $("combat-log").innerHTML = "";
  const ab = ENEMY_ABILITY_DESC[e.ability] || "";
  combatLog("⚔ 遭遇 " + e.name + (e.epithet ? "（" + e.epithet + "）" : "") + "！" + (ab ? " 〔" + ab + "〕" : ""));
  $("combat-panel").classList.remove("hidden");
  const menu = $("combat-skillmenu"); if (menu) { menu.classList.add("hidden"); menu.innerHTML = ""; }
  const art = $("combat-enemy-art"); if (art) art.innerHTML = enemyArtSVG(e.ability);
  renderCombatHUD();
  setCombatButtons(true);
  companionSay("combat_start", "tense");
}
function combatLog(t) {
  const b = $("combat-log"); const d = document.createElement("div");
  d.textContent = t; b.appendChild(d); b.scrollTop = b.scrollHeight;
}
function renderCombatHUD() {
  const st = S.state;
  $("combat-php").style.width = (st.hp / st.max_hp * 100) + "%";
  $("combat-php-text").textContent = st.hp + "/" + st.max_hp;
  $("combat-pmp").style.width = (st.mp / st.max_mp * 100) + "%";
  $("combat-pmp-text").textContent = st.mp + "/" + st.max_mp;
  const dice = $("combat-dice"); if (dice) dice.disabled = combat.usedDice;
}
function setCombatButtons(on) {
  ["combat-atk", "combat-def", "combat-skill", "combat-item", "combat-flee", "combat-dice"]
    .forEach(id => { const el = $(id); if (el) el.disabled = !on; });
}
function flashDamage() {
  const cw = $("char-wrap"); cw.classList.remove("damaged"); void cw.offsetWidth; cw.classList.add("damaged");
}
function tickEnemyStatus() {
  if (!combat) return;
  if ((combat.ePoison || 0) > 0) {
    const d = 5 + (S.state.level || 1) * 2; combat.ehp = Math.max(0, combat.ehp - d);
    combat.ePoison--; combatLog("☠ " + combat.enemy.name + " 中毒，受到 " + d + " 伤害（剩 " + combat.ePoison + " 回合）");
    updateEnemyHp();
  }
  if ((combat.eAtkDown || 0) > 0) combat.eAtkDown--;
}
function combatEnemyTurn() {
  const st = S.state;
  tickEnemyStatus();
  if (combat.ehp <= 0) { combatWin(); return; }
  combat.eTurn = (combat.eTurn || 0) + 1;
  let eatk = combat.enemy.atk;
  if ((combat.eAtkDown || 0) > 0) eatk = Math.round(eatk * 0.6);
  let mul = 1;
  if (combat.enemy.ability === "charge" && combat.eTurn % 3 === 0) {
    mul = 2; combatLog("⚡ " + combat.enemy.name + " 蓄力，发动猛击！");
  }
  let dmg = dmgToPlayer(eatk);
  dmg = Math.max(1, Math.round(dmg * mul));
  if (combat.defending) dmg = Math.max(1, Math.floor(dmg / 2));
  st.hp = Math.max(0, st.hp - dmg);
  if (combat.enemy.ability === "drain") {
    const h = Math.max(1, Math.round(dmg * 0.35));
    combat.ehp = Math.min(combat.enemy.hp, combat.ehp + h);
    combatLog(combat.enemy.name + " 吸噬生命，回复 " + h + " HP");
    updateEnemyHp();
  }
  if (combat.enemy.ability === "venom" && Math.random() < 0.5) {
    st._poison = Math.max(st._poison || 0, 3);
    combatLog("☠ " + combat.enemy.name + " 的撕咬使你中毒！");
  }
  if (combat.enemy.ability === "frost" && Math.random() < 0.35) {
    combat.pAtkDown = Math.max(combat.pAtkDown || 0, 2);
    combatLog("❄ " + combat.enemy.name + " 的寒气削弱了你的力量！");
  }
  let tag = (combat.defending ? "🛡 你格挡，" : "") + combat.enemy.name + " 攻击，受到 " + dmg + " 伤害";
  if (mul > 1) tag += "（猛击！）";
  combatLog(tag);
  flashDamage(); renderCombatHUD(); renderHUD();
  combat.defending = false;
  if (st.hp <= 0) { combat = null; $("combat-panel").classList.add("hidden"); gameOver(); }
  else if (st.hp / st.max_hp < 0.35 && Math.random() < 0.4) companionSay("lowhp", "sad");
  else if (st.hp / st.max_hp < 0.6 && Math.random() < 0.25) companionSay("hurt", "sad");
}
function combatWin() {
  const st = S.state;
  st.monsters_killed += 1;
  const g = 10 + st.level * 3, e = 15 + st.level * 5;
  st.gold += g; grantExp(e);
  combatLog("🏆 击败 " + combat.enemy.name + "！获得 " + g + " 金币、" + e + " 经验");
  toast("🏆 战斗胜利！+" + g + "金币 +" + e + "经验");
  combat = null; $("combat-panel").classList.add("hidden");
  // 若这是制服暴力抗法的嫌疑人：登记到嫌疑人档案
  if (S.combatSuspectId) {
    const s = (st.suspects || {})[S.combatSuspectId];
    if (s) { s.hostile = false; s.pacified = true; toast("✅ " + s.name + " 已被制服，记入档案"); }
    S.combatSuspectId = null;
  }
  checkAchievements(); renderHUD();
  companionSay("combat_win", "happy");
}
function tickPlayerPoison() {
  const st = S.state;
  if (combat && (st._poison || 0) > 0) {
    const d = 4 + (st.level || 1) * 2; st.hp = Math.max(0, st.hp - d);
    st._poison--; combatLog("☠ 毒性发作，受到 " + d + " 伤害（剩 " + st._poison + " 回合）");
    renderCombatHUD(); renderHUD();
    if (st.hp <= 0) { combat = null; $("combat-panel").classList.add("hidden"); gameOver(); return true; }
  }
  if (combat && (combat.pAtkDown || 0) > 0) combat.pAtkDown--;
  return false;
}
function combatAct(type) {
  if (!combat) return;
  const st = S.state;
  if (tickPlayerPoison()) return;
  setCombatButtons(false);
  if (type === "def") { combat.defending = true; combatLog("🛡 你举盾防御"); combatEnemyTurn(); if (combat) setCombatButtons(true); return; }
  if (type === "flee") {
    if (!combat.flee) combatLog("无处可逃！");
    else {
      const chance = Math.min(0.8, Math.max(0.35, 0.42 + st.luck / 160));
      if (Math.random() < chance) { combatLog("💨 你成功脱离了战斗"); combat = null; $("combat-panel").classList.add("hidden"); return; }
      combatLog("逃跑失败！");
    }
    combatEnemyTurn(); if (combat) setCombatButtons(true); return;
  }
  if (type === "item") { useCombatItem(); return; }
  // 普通攻击（含运气骰判定）
  const roll = randInt(1, 20), eff = roll + Math.floor(st.luck / 4);
  let raw = effAtk(st) + randInt(0, 4), crit = eff >= 20, miss = roll <= 2;
  if (crit) raw += Math.round(effAtk(st) * 0.55);
  const dmg = miss ? 0 : dmgToEnemy(raw);
  if (!miss) combat.ehp -= dmg;
  combatLog(miss ? "✘ 攻击落空！" : "🗡 命中，造成 " + dmg + " 伤害" + (crit ? "（暴击！）" : ""));
  updateEnemyHp();
  if (combat.ehp <= 0) { combatWin(); return; }
  combatEnemyTurn(); if (combat) setCombatButtons(true);
}
// 战斗内使用道具：自动挑「当前最有用」的一件（中毒优先解毒，其次补血/补蓝）
function useCombatItem() {
  const st = S.state;
  if (!combat) return;
  if (tickPlayerPoison()) return;      // 与攻击一致：行动前先结算中毒
  const idx = n => st.inventory.indexOf(n);
  const take = n => { const i = idx(n); if (i >= 0) st.inventory.splice(i, 1); return i >= 0; };
  let msg = null;
  const poisoned = (st._poison || 0) > 0;
  const lowHp = st.hp / st.max_hp < 0.55, lowMp = st.mp / st.max_mp < 0.5;
  if (poisoned && idx("解毒草") >= 0) {
    take("解毒草"); st._poison = 0; msg = "🌿 你嚼下解毒草，体内毒性尽数消散";
  } else if (lowHp && idx("药水") >= 0) {
    take("药水"); const heal = 45 + st.level * 3;
    st.hp = Math.min(st.max_hp, st.hp + heal); msg = "🧪 你饮下药水，恢复 " + heal + " HP";
  } else if (lowMp && idx("镇定剂") >= 0) {
    take("镇定剂"); const r = 30 + st.level * 4;
    st.mp = Math.min(st.max_mp, st.mp + r); msg = "💊 你注入镇定剂，回复 " + r + " 专注";
  } else if (idx("药水") >= 0) {
    take("药水"); const heal = 45 + st.level * 3;
    st.hp = Math.min(st.max_hp, st.hp + heal); msg = "🧪 你饮下药水，恢复 " + heal + " HP";
  }
  if (!msg) { toast("没有可用的道具"); setCombatButtons(true); return; }
  combatLog(msg); renderCombatHUD(); renderHUD();
  combatEnemyTurn(); if (combat) setCombatButtons(true);
}
function updateEnemyHp() {
  const e = combat.enemy, pct = clamp(combat.ehp / e.hp * 100, 0, 100);
  $("combat-enemy-hp").style.width = pct + "%";
  $("combat-enemy-hp-text").textContent = Math.max(0, combat.ehp) + "/" + e.hp;
}
function combatDice() {
  if (!combat || combat.usedDice) return;
  combat.usedDice = true; const st = S.state;
  const roll = randInt(1, 20) + Math.floor(st.luck / 3);
  combatLog("🎲 命运骰子：" + roll + (roll >= 15 ? " 大吉！" : roll <= 5 ? " 凶险…" : " 平"));
  if (roll >= 15) {
    const b = 10 + st.level * 4; combat.ehp -= b; combatLog("⚡ 运气爆发，敌人受到 " + b + " 额外伤害");
    updateEnemyHp(); if (combat.ehp <= 0) { combatWin(); return; }
  } else if (roll <= 5) {
    const b = 8 + st.level * 2; st.hp = Math.max(0, st.hp - b); combatLog("💥 厄运降临，你受到 " + b + " 伤害");
    flashDamage(); renderCombatHUD(); renderHUD(); if (st.hp <= 0) { combat = null; $("combat-panel").classList.add("hidden"); gameOver(); return; }
  }
  $("combat-dice").disabled = true;
}

// 战斗内选技面板：列出玩家全部技能，点击施放
function openSkillMenu() {
  if (!combat) return;
  const st = S.state;
  const menu = $("combat-skillmenu");
  menu.innerHTML = "";
  (st.skills || []).forEach(name => {
    const sk = SKILL_DB[name]; if (!sk) return;
    const b = document.createElement("button");
    b.className = "skill-opt";
    const can = st.mp >= sk.mp;
    b.disabled = !can;
    b.innerHTML = `<span class='sk-name'>${esc(name)}</span><span class='sk-mp'>${sk.mp}MP</span>`
      + `<small class='sk-desc'>${esc(sk.desc)}</small>`;
    b.onclick = () => { menu.classList.add("hidden"); menu.innerHTML = ""; castSkill(name); };
    menu.appendChild(b);
  });
  if (!menu.children.length) { toast("尚未习得任何技能"); return; }
  menu.classList.toggle("hidden");
}
function castSkill(name) {
  if (!combat) return;
  const sk = SKILL_DB[name]; if (!sk) return;
  const st = S.state;
  if (st.mp < sk.mp) { toast("法力不足（需 " + sk.mp + "）"); return; }
  if (tickPlayerPoison()) return;
  st.mp -= sk.mp;
  setCombatButtons(false);
  const lvl = st.level || 1;
  combatLog("🌟 施放【" + name + "】");
  const k = sk.kind;
  if (k.indexOf("attack") === 0 || k === "lifesteal") {
    let raw = sk.power + lvl * 3 + randInt(0, 4);
    if (k === "attack_crit" && Math.random() < 0.5) { raw = Math.round(raw * 1.8); combatLog("💥 暴击！"); }
    const dmg = dmgToEnemy(raw);
    if (k === "attack_sure") combatLog("🎯 精准命中，无可闪避");
    combat.ehp -= dmg;
    combatLog("对 " + combat.enemy.name + " 造成 " + dmg + " 伤害");
    if (k === "attack_debuff") { combat.eAtkDown = Math.max(combat.eAtkDown || 0, sk.debuff || 3); combatLog("❄ 敌人力被削弱"); }
    if (k === "attack_poison") { combat.ePoison = Math.max(combat.ePoison || 0, 3); combatLog("☠ 敌人中毒"); }
    if (k === "attack_heal") { st.hp = Math.min(st.max_hp, st.hp + (sk.heal || 10)); combatLog("✨ 回复 " + (sk.heal || 10) + " 生命"); }
    if (k === "lifesteal") { const h = Math.round(dmg * 0.5); st.hp = Math.min(st.max_hp, st.hp + h); combatLog("🩸 吸取 " + h + " 生命"); }
    updateEnemyHp(); tickEnemyStatus();
  } else if (k === "heal") {
    const h = sk.power + lvl * 4; st.hp = Math.min(st.max_hp, st.hp + h); combatLog("✨ 回复 " + h + " 生命");
  } else if (k === "buff_atk") {
    combat.pAtkBuff = (combat.pAtkBuff || 0) + sk.power; combatLog("💪 攻击提升 " + sk.power);
  } else if (k === "buff_def") {
    combat.pDefBuff = (combat.pDefBuff || 0) + sk.power; combatLog("🛡 防御提升 " + sk.power);
  }
  renderCombatHUD(); renderHUD();
  if (combat.ehp <= 0) { combatWin(); return; }
  combatEnemyTurn(); if (combat) setCombatButtons(true);
}

// ---------------- 羁绊好感 ----------------
function companionVals(st) { const a = st.affinity || {}; return [a.informant || 0, a.coroner || 0, a.hacker || 0]; }
function companionMax(st) { const v = companionVals(st); return v.length ? Math.max.apply(null, v) : 0; }
function companionMin(st) { const v = companionVals(st); return v.length ? Math.min.apply(null, v) : 0; }

function applyAffinity(list) {
  if (!list || !list.length) return;
  const st = S.state;
  list.forEach(a => {
    let id = a.char || "informant";
    if (id === "stellar" || id === "陆沉") id = "informant";   // 兼容期：旧搭档落到线人
    if (!COMPANIONS[id]) return;                               // 未知 char：忽略，不报错、不建槽
    const prev = st.affinity[id] || 0;
    st.affinity[id] = clamp(prev + (a.delta || 0), -100, 100);
    const now = st.affinity[id];
    if ((a.delta || 0) > 0) toast("💞 与" + COMPANIONS[id].given + "的默契加深了");
    if (now !== prev) companionBondCheck(prev, now);
  });
  checkAchievements();
}
function companionBondCheck(prev, now) {
  if (!t1(prev) && now >= 10) companionSay("bond1", "happy");
  else if (!t2(prev) && now >= 40) companionSay("bond2", "serious");
  else if (!t3(prev) && now >= 80) companionSay("bond2", "serious");
}
function t1(v) { return v >= 10; } function t2(v) { return v >= 40; } function t3(v) { return v >= 80; }
function openBonds() {
  const st = S.state; let html = "<div class='bonds-list'>";
  const ids = Object.keys(st.affinity || {});
  if (!ids.length) html += "<p class='dim'>尚未结识同伴。</p>";
  ids.forEach(id => {
    const c = COMPANIONS[id] || { name: id, given: id, avatar: "", sigil: "❔", tint: "#a78bfa", hint: "narrator", desc: "旅途中的邂逅。" };
    const v = st.affinity[id] || 0, pct = clamp((v + 100) / 2, 0, 100);
    const lvl = bondLabel(v);
    const art = c.avatar ? `<img src='${c.avatar}' alt='' />` : crestSVG(c);
    html += `<div class='bond-row'><div class='bond-ava'>${art}</div>
      <div class='bond-main'><div class='bond-name'>${esc(c.given)} <span class='bond-lvl'>${lvl}</span></div>
      <div class='bond-bar'><div class='bond-fill' style='width:${pct}%'></div></div>
      <div class='bond-desc'>${esc(c.desc)}</div></div></div>`;
  });
  html += "</div>";
  showModal("羁绊 · 同伴", html);
}

// ---------------- 商店养成 ----------------
// 可习得的进阶技能书（分档定价）
const SHOP_SKILLS = [
  { name: "电击枪",   cost: 60 },
  { name: "掩体掩护", cost: 55 },
  { name: "擒锁回气", cost: 65 },
  { name: "麻醉针",   cost: 58 },
  { name: "急救包",   cost: 70 },
];
// 常备货物：消耗品与永久强化
const SHOP_ITEMS = [
  { id: "heal",   label: "🛏 休整治疗",   cost: 20, note: "回满 HP 与 MP" },
  { id: "atk",    label: "⚔ 锻体·攻击",  cost: 40, note: "攻击 +2（永久）" },
  { id: "def",    label: "🛡 锻体·防御",  cost: 40, note: "防御 +2（永久）" },
  { id: "hp",     label: "❤ 强身·生命",   cost: 50, note: "生命上限 +15 并回满" },
  { id: "luck",   label: "🍀 祈愿·运气",  cost: 45, note: "运气 +2（提升暴击与闪避）" },
  { id: "potion", label: "🧪 购买药水",   cost: 15, note: "战斗中使用，回复生命" },
  { id: "antidote", label: "🌿 购买解毒草", cost: 10, note: "战斗中解除中毒状态" },
  { id: "dust",   label: "💊 购买镇定剂", cost: 18, note: "战斗中回复专注" },
  { id: "film",   label: "🎞 勘查胶片",   cost: 80, note: "现场勘查次数 +1" },
];
function openShop() {
  const st = S.state;
  const row = (id, label, cost, note) =>
    `<div class='shop-row'><div class='shop-info'><b>${label}</b><small>${note}</small></div>
      <button class='btn btn-primary shop-buy' data-id='${id}' ${st.gold < cost ? "disabled" : ""}>💰${cost}</button></div>`;
  let html = `<p class='dim'>行商就站在村口，花费金币即可强化自身、补充补给。</p>
    <div class='shop-list'>
      ${SHOP_ITEMS.map(x => row(x.id, x.label, x.cost, x.note)).join("")}
    </div>`;
  html += `<div class='shop-sep'>📖 技能书（习得后战斗中可用）</div><div class='shop-list'>`;
  SHOP_SKILLS.forEach(s => {
    const known = (st.skills || []).includes(s.name);
    const sk = SKILL_DB[s.name];
    html += `<div class='shop-row'><div class='shop-info'><b>${esc(s.name)}</b><small>${known ? "已掌握" : (sk ? esc(sk.desc) : "")}　${sk ? sk.mp + "MP" : ""}</small></div>
      <button class='btn ${known ? "btn-ghost" : "btn-primary"} shop-buy' data-id='sk_${s.name}' ${known || st.gold < s.cost ? "disabled" : ""}>${known ? "✓" : "💰" + s.cost}</button></div>`;
  });
  html += `</div><p class='dim'>当前金币：💰 ${st.gold}</p>`;
  showModal("🏪 旅店商店", html);
  $("modal-body").querySelectorAll(".shop-buy").forEach(b => b.onclick = () => buyShop(b.dataset.id));
}
function buyShop(id) {
  const st = S.state;
  const item = SHOP_ITEMS.find(x => x.id === id);
  const sk = SHOP_SKILLS.find(x => "sk_" + x.name === id);
  const cost = item ? item.cost : (sk ? sk.cost : null);
  if (cost == null) { toast("未知商品"); return; }
  if (st.gold < cost) { toast("金币不足"); return; }
  if (sk) {
    if ((st.skills || []).includes(sk.name)) { toast("已掌握【" + sk.name + "】"); return; }
    st.gold -= cost; st.skills = st.skills || []; st.skills.push(sk.name);
    toast("✅ 习得新技能【" + sk.name + "】"); renderHUD(); openShop(); return;
  }
  st.gold -= cost;
  if (id === "heal") { st.hp = st.max_hp; st.mp = st.max_mp; }
  else if (id === "atk") st.attack += 2;
  else if (id === "def") st.defense += 2;
  else if (id === "hp") { st.max_hp += 15; st.hp = st.max_hp; }
  else if (id === "luck") st.luck = (st.luck || 10) + 2;
  else if (id === "potion") st.inventory.push("药水");
  else if (id === "antidote") st.inventory.push("解毒草");
  else if (id === "dust") st.inventory.push("镇定剂");
  else if (id === "film") st.dives = (st.dives || 0) + 1;
  toast("✅ 已购买"); renderHUD(); openShop();
}

// ---------------- 成就 ----------------
function checkAchievements() {
  const st = S.state; if (!st) return;
  const a = st.affinity || {}, inv = st.inventory.length;
  const cond = {
    first_blood: st.monsters_killed >= 1, slayer: st.monsters_killed >= 10,
    bond_max: companionMax(st) >= 100, tycoon: st.gold >= 500, ascendant: st.level >= 10,
    wanderer: st.turn_count >= 50, pacifist: st.turn_count >= 20 && st.monsters_killed === 0,
    collector: inv >= 8, victory: !!st._victory,
    // 悬疑线
    clue_first: (st.clues || []).length >= 1,
    clue_five:  (st.clues || []).length >= 5,
    truth:      (st.clues || []).length >= 8 || !!st._truthFound,
    paradox:    (st.divergence || 0) >= 60,
    diver:      (st._divesUsed || 0) >= 1,
    // 审讯 / 指控线
    perfect_accuse: !!(st.accuse_result && st.accuse_result.correct && st.accuse_result.sufficient),
    framed_once:    !!st.accused && !(st.accuse_result || {}).correct,
    evidence_five:  ((st.evidence || []).filter(e => e.identified).length) >= 5,
    ending_hunter: (st.endings || []).length >= 3,
    bond_all:   Object.keys(COMPANIONS).every(id => ((st.affinity || {})[id] || 0) >= 20),
    relic_find: (st.relics || []).length >= 1,
    relic_five: (st._relicsFound || 0) >= 5,
    cursed:     (st._relicsCursed || 0) >= 1,
  };
  ACHIEVEMENTS.forEach(x => {
    if (!st.achievements.includes(x.id) && cond[x.id]) { st.achievements.push(x.id); toast("🏆 成就解锁：" + x.name); }
  });
}
function openAch() {
  const st = S.state; let html = "<div class='ach-list'>";
  ACHIEVEMENTS.forEach(a => {
    const got = (st.achievements || []).includes(a.id);
    html += `<div class='ach-row ${got ? "got" : "locked"}'><span class='ach-icon'>${a.icon}</span>
      <div class='ach-main'><div class='ach-name'>${a.name}</div><div class='ach-desc'>${esc(a.desc)}</div></div>
      <span class='ach-state'>${got ? "✓" : "🔒"}</span></div>`;
  });
  html += "</div>";
  // 已解锁结局一览
  const got = st.endings || [];
  if (got.length) {
    html += `<div class='shop-sep'>🚪 已解锁结局 ${got.length}/${ENDINGS.length - 1}</div><div class='clue-list'>`;
    got.forEach(id => {
      const e = ENDINGS.find(x => x.id === id); if (!e) return;
      html += `<div class='clue-row'>${e.icon} <b>${esc(e.name)}</b> · ${esc(e.sub)}</div>`;
    });
    html += "</div>";
  }
  showModal("🏆 成就 · " + (st.achievements || []).length + "/" + ACHIEVEMENTS.length, html);
}

// ---------------- 多结局分支 ----------------
// 结局由「线索完成度 × 现实偏移度 × 立场 × 羁绊」共同决定，按优先级取第一个命中
const ENDINGS = [
  // —— 指控线结局（玩家主动指认真凶时触发，优先级最高） ——
  { id: "perfect", icon: "👑", name: "完美收官", win: true,
    title: "✧ 指控结局 · 完美收官 ✧",
    sub:   "铁证如山，真凶无从抵赖。",
    desc:  "你把证据链一环一环摊开，每一环都咬合得纹丝合缝。真凶在审讯室里终于垂下肩膀：" +
           "『算你厉害。』陆沉难得地笑了——这一案，办得干净，也办得漂亮。",
    test: st => st.accused && st.accused === st.case_culprit
                 && (st.accuse_result || {}).sufficient === true },

  { id: "framed", icon: "⛓", name: "冤假错案", win: false,
    title: "✧ 指控结局 · 冤假错案 ✧",
    sub:   "你指着的那个人，在证据面前喊冤。",
    desc:  "法庭外下着雨。你指错的那个人隔着铁窗看你，真正的凶手消失在人群里，" +
           "此后再没有人愿意相信你的卷宗。有些指控，一步错，就是满盘皆输。",
    test: st => st.accused && st.accused !== st.case_culprit },

  { id: "thin", icon: "🔍", name: "真相过半", win: true,
    title: "✧ 指控结局 · 真相过半 ✧",
    sub:   "你指对了人，却拿不出足够的铁证。",
    desc:  "真凶被带走时盯着你：『下次，带齐证据再来。』你知道他说得对——" +
           "方向没错，脚步却慢了半拍。卷宗里还空着几页，等着下一桩案把它们填满。",
    test: st => st.accused && st.accused === st.case_culprit },

  // 真结局优先级最高：线索齐、偏移可控、羁绊深厚
  { id: "true", icon: "👑", name: "真相大白", win: true,
    title: "✧ 真结局 · 真相大白 ✧",
    sub:   "你拼齐了最后一块拼图，也守住了该守住的人。",
    desc:  "所有线索在那一刻归位。你没有篡改现场，却让沉默的证据终于开口。" +
           "陆沉站在你身侧——" +
           "原来最难的不是揪出凶手，而是查清之后，还能不能平静地走出这扇门。",
    test: st => (st.clues || []).length >= 8 && (st.divergence || 0) < 50
                 && companionMax(st) >= 40 },

  { id: "collapse", icon: "🌀", name: "证据崩坏", win: false,
    title: "✧ 崩坏结局 · 证据尽碎 ✧",
    sub:   "你查得太深，证据链自己碎了。",
    desc:  "每一次复盘都在真相上划一刀，而你划得太深。卷宗的页码开始错位，" +
           "证人的脸模糊成一片，连你亲手记的笔记都出现了别人的笔迹。" +
           "你站在崩解的档案室里，终于明白——有些案子，本就不该挖到最底。",
    test: st => (st.divergence || 0) >= 80 },

  { id: "dark", icon: "🌑", name: "坠入暗面", win: false,
    title: "✧ 黑化结局 · 心囚 ✧",
    sub:   "为了得到一个答案，你把自己交给了更深的黑暗。",
    desc:  "你并非败给了敌人，而是败给了那个『无论如何都要知道真相』的执念。" +
           "当最后一层伪装被撕下时，镜子里的人已经不再是你出发时的样子。",
    test: st => (st.alignment || 0) <= -15 },

  { id: "echo", icon: "🔮", name: "真相回响", win: true,
    title: "✧ 特殊结局 · 真相回响 ✧",
    sub:   "所有的声音都留在了证物里，包括你自己的。",
    desc:  "你终于听懂了那些细碎的回响——它们不是别人的低语，而是每一个被你忽略的"
         + "「现场」留下的提醒。你合上档案，录音笔的红灯同时熄灭。",
    test: st => (st.clues || []).length >= 7 && ((st.affinity || {}).hacker || 0) >= 40 },

  { id: "forgotten", icon: "🥀", name: "被遗忘者", win: false,
    title: "✧ 遗忘结局 · 无人记得 ✧",
    sub:   "你查清了案子，代价是没人再肯为你作证。",
    desc:  "证词里你的位置空了出来，像从未有人办过这案。事务所的墙上，" +
           "那个名字被咖啡晕开，成了空白。",
    test: st => companionMin(st) <= -10 },

  { id: "loop", icon: "♾️", name: "无尽回廊", win: true,
    title: "✧ 追查结局 · 无尽回廊 ✧",
    sub:   "你走得足够久，久到开始怀疑出口是否真的存在。",
    desc:  "第无数次穿过同一道门时，你忽然想起——上一次，你也是在这里想起这件事的。",
    test: st => (st.turn_count || 0) >= 80 },

  { id: "tycoon_end", icon: "💰", name: "富甲天下", win: true,
    title: "✧ 财富结局 · 富甲天下 ✧",
    sub:   "谜题未必解开，但你确实再也不用为金币发愁了。",
    desc:  "行商笑着收下最后一枚金币，说你其实比那些追寻真相的人聪明。"
           + "你没反驳——毕竟，活着走出迷城，本身就是一种答案。",
    test: st => (st.gold || 0) >= 500 },

  { id: "lonely", icon: "🕯", name: "孑然一身", win: false,
    title: "✧ 孤独结局 · 无人共证 ✧",
    sub:   "你解开了谜题，却弄丢了愿意陪你一起看答案的人。",
    desc:  "真相握在手里，沉甸甸的。你想转身说点什么，身后却空无一人。" +
           "有些路，走得太专注，就会忘记回头看看谁还在。",
    test: st => companionMax(st) <= 0 && (st.clues || []).length >= 3 },

  // 兜底：条件未达成时的未竟结局
  { id: "unfinished", icon: "📖", name: "未竟之途", win: false,
    title: "✧ 未竟结局 · 故事尚未写完 ✧",
    sub:   "谜题还在那里，而你的脚步停在了半途。",
    desc:  "有些门需要更多的线索才能推开。再走一遍，多问一句，也许答案就在下一条证词里。",
    test: () => true },
];
function resolveEnding(win) {
  const st = S.state; if (!st) return ENDINGS[ENDINGS.length - 1];
  return ENDINGS.find(e => e.win === !!win && e.test(st)) || ENDINGS[ENDINGS.length - 1];
}

// ---------------- 结局评级 ----------------
function endingGrade() {
  const st = S.state;
  const score = st.level * 8 + st.monsters_killed * 4 + Math.floor(st.gold / 10)
    + (st.achievements.length * 12) + Math.floor(companionMax(st) / 5)
    + Math.floor(st.turn_count / 2) + (st._victory ? 40 : 0);
  return score >= 260 ? "S" : score >= 190 ? "A" : score >= 120 ? "B" : "C";
}
function endingStatsHtml(grade, win) {
  const st = S.state;
  const icons = (st.achievements || []).map(id => { const a = ACHIEVEMENTS.find(x => x.id === id); return a ? a.icon : ""; }).join("");
  return `<div class="over-grade ${win ? "win" : ""}">结局评级 <b>${grade}</b></div>
    <div><b>最终等级</b> Lv.${st.level}</div>
    <div><b>存活回合</b> ${st.turn_count}</div>
    <div><b>击败敌人</b> ${st.monsters_killed}</div>
    <div><b>累计金币</b> ${st.gold}</div>
    <div><b>搭档默契</b> 阿炎 ${(st.affinity||{}).informant||0} · 白桦 ${(st.affinity||{}).coroner||0} · 苏夜 ${(st.affinity||{}).hacker||0}</div>
    ${st.accuse_result ? `<div><b>指控结果</b> ${st.accuse_result.correct ? "✅ 指认真凶" : "⛓ 指错了人"} · 铁证 ${st.accuse_result.identified}/${st.accuse_result.min}</div>` : ""}
    <div><b>成就</b> ${(st.achievements || []).length}/${ACHIEVEMENTS.length}　${icons}</div>
    <div><b>技能</b> ${st.skills.join("、") || "无"}</div>
    ${relicEpilogue()}`;
}
function victoryEnding() {
  const st = S.state; st._victory = true; checkAchievements();
  companionSay("victory", "happy");
  const e = resolveEnding(true);
  st.endings = st.endings || [];
  if (!st.endings.includes(e.id)) st.endings.push(e.id);
  $("over-title").textContent = e.title;
  $("over-sub").textContent = e.sub;
  $("over-note").textContent = e.desc;
  $("over-stats").innerHTML = endingStatsHtml(endingGrade(), true);
  localStorage.removeItem("illusion_save"); show("screen-over");
}
function renderQuest() {
  const st = S.state;
  const active = (st?.quests || []).filter(q => !q.done);
  if (active.length) {
    $("quest-card").classList.remove("hidden");
    $("quest-name").textContent = active[active.length - 1].name;
    $("quest-desc").textContent = active[active.length - 1].description;
  } else $("quest-card").classList.add("hidden");
}
function showScene(data) {
  const st = S.state;
  // 新场景到来：轮换一张不同背景
  rotateWorldBg();
  $("mood-tag").textContent = MOODS[data.mood] || MOODS.scene;
  $("mood-tag").style.background = MOOD_BG[data.mood] || MOOD_BG.scene;
  // 环境低语：正文之前先落一行氛围短句（悬疑世界尤其吃这一口）
  showAmbient(ambientLine((st && st.world_id) || "fantasy"));
  S.curSpeaker = "";
  updateSpeakerLabel();
  S.pendingSceneText = data.scene;
  S.lastSegments = sceneSegments(data);
  typeWriter(data.scene);
  pushLog("scene", data.scene);   // 全文同步进对话记录，随时可读
  renderChoices(data.choices || [], data.risk_hint);
  renderHUD();
  // 趣味层：羁绊变化、遭遇战、成就检测
  applyAffinity(data.affinity);
  if (!data.affinity || !data.affinity.length) {
    // 后端/案件未显式给好感时，宁静或凯旋场景缓慢累积与三位搭档的默契
    if ((data.mood === "peaceful" || data.mood === "triumph") && Math.random() < 0.5) {
      const a = S.state.affinity;
      Object.keys(COMPANIONS).forEach(id => {
        const prev = a[id] || 0;
        a[id] = Math.min(100, prev + 1);
        companionBondCheck(prev, a[id]);
      });
    }
  }
  if (data.combat && data.combat.enemy) startCombat(data.combat);
  else if (data.mood === "battle") startCombat({ enemy: makeEnemy(S.state), flee: true });
  // 悬疑层：线索入档、现实偏移累计、反转计数
  if (data.clue) addClue(data.clue);
  if (data.divergence_change) bumpDivergence(data.divergence_change);
  if (data.twist) { st.twists = (st.twists || 0) + 1; checkAchievements(); }
  // 审讯层：新案件并入嫌疑人档案 / 发放物证 / 记录真凶（仅一次）
  if (data.case_id && data.case_id !== st._case_id) {
    st._case_id = data.case_id;
    st.pending_accusation = null;   // 新案的指控提案以本案为准，清掉旧案残留
    updateAccuseBtn();
    (data.case_suspects || []).forEach(s => mergeSuspect(s));
    (data.case_evidence || []).forEach(e => grantEvidence(e, true));
    if (data.case_culprit) st.case_culprit = data.case_culprit;
  }
  mergeSuspects(data.suspects);                    // 节点级嫌疑人（线上模式）
  if (data.evidence && data.evidence.id) grantEvidence(data.evidence, false);
  if (data.accusation && data.accusation.ready) {  // 解锁指认真凶
    st.pending_accusation = data.accusation;
    if (data.accusation.culprit) st.case_culprit = data.accusation.culprit;
    updateAccuseBtn();
    toast("⚖ 证据已足以指认真凶——想自己结案，就按下『指认』");
  }
  // 遗物掉落：AI 显式给 relic，或神秘/紧张氛围下自行掉落（不可预测，才有赌的意味）
  const stR = S.state;
  if (stR) {
    stR.relics = stR.relics || [];
    if (data.relic) gainRelic(stR, false);
    else if ((data.mood === "mysterious" || data.mood === "tense") && Math.random() < 0.16) gainRelic(stR, false);
    else if (Math.random() < 0.05) gainRelic(stR, false);
  }
  checkAchievements();
}
// 陆沉的性格词典：她温柔谨慎，偏好稳妥、善意、先观察
const COMPANION_ADVICE = {
  cautious: { kw: ["谨慎", "观察", "小心", "潜行", "躲", "退", "等待", "探查"],
               say: "若是我，会先看清周遭再动。", w: 1.35 },
  kind:     { kw: ["帮助", "救助", "安慰", "温柔", "原谅", "救", "护", "馈赠"],
               say: "能帮一把的话，就帮一把吧。", w: 1.3 },
  social:   { kw: ["交谈", "搭话", "询问", "对话", "说服", "倾听", "问"],
               say: "先听听对方怎么说，好吗？", w: 1.15 },
  curious:  { kw: ["探索", "搜寻", "调查", "寻找", "打开", "研究"],
               say: "我想知道那后面藏着什么。", w: 1.05 },
  brave:    { kw: ["战斗", "攻击", "冲", "迎战", "挑战", "杀", "闯"],
               say: "有时候，只能先迈出那一步。", w: 1.0 },
};
function companionAdvice(choices) {
  let best = null, bestScore = 0;
  (choices || []).forEach(c => {
    const t = c.text || "";
    Object.keys(COMPANION_ADVICE).forEach(k => {
      const cfg = COMPANION_ADVICE[k];
      let s = 0;
      cfg.kw.forEach(w => { if (t.indexOf(w) >= 0) s += 1; });
      s *= cfg.w;
      if (s > bestScore) { bestScore = s; best = { choice: c, cfg }; }
    });
  });
  return best;
}
// ---------------- 抉择风险标记 ----------------
// 只说"这一步属于哪一种代价"，不说它会带来什么。
// 知道有风险，却不知道是什么风险——这才是让人手心出汗的设计。
const RISK_TAGS = [
  { cls: "danger", label: "凶险", kw: ["战斗", "攻击", "迎战", "冲上去", "杀", "闯", "硬碰", "正面"] },
  { cls: "cost",   label: "代价", kw: ["牺牲", "代价", "失去", "放弃", "交换", "赌", "献出", "舍弃"] },
  { cls: "stealth",label: "隐秘", kw: ["潜行", "躲", "藏", "暗中", "观察", "窥", "跟踪", "屏息"] },
  { cls: "unknown",label: "未知", kw: ["打开", "探索", "未知", "奇怪", "触碰", "掀开", "走进", "翻看"] },
  { cls: "time",   label: "查访", kw: ["复盘", "勘查", "盘问", "搜查", "跟踪", "潜入", "重查", "取证"] },
  { cls: "bond",   label: "结缘", kw: ["帮助", "救助", "安慰", "原谅", "救", "护", "交谈", "倾听", "挽留"] },
  { cls: "law",    label: "涉法", kw: ["报警", "警察", "拘捕", "起诉", "法庭", "律师", "投案", "合法", "证", "官"] },
  // 注：stealth(隐秘)/time(查访) 仅用于前端关键词推断；契约后端 risk_hint.tag 用 danger/cost/unknown/law/bond
];
// 后端 risk_hint.tag → 渲染标签（与契约 2.4 枚举对齐；time/stealth 保留以便回退）
const RISK_LABEL = { danger: "凶险", cost: "代价", unknown: "未知", law: "涉法", bond: "结缘", time: "查访", stealth: "隐秘" };
function riskTag(text) {
  if (S.showRiskTags === false) return null;
  let best = null, bestN = 0;
  for (const g of RISK_TAGS) {
    let n = 0;
    for (const w of g.kw) if (text.indexOf(w) >= 0) n++;
    if (n > bestN) { bestN = n; best = g; }
  }
  return best;
}
function toggleRiskTags() {
  S.showRiskTags = !(S.showRiskTags !== false);
  const b = $("btn-risk-tags");
  if (b) {
    b.classList.toggle("off", S.showRiskTags === false);
    b.textContent = S.showRiskTags === false ? "🏷 标记 关" : "🏷 标记 开";
  }
  if (S.lastChoices && S.lastChoices.length) renderChoices(S.lastChoices);
  toast(S.showRiskTags === false ? "已隐藏风险标记（全凭直觉）" : "已开启风险标记");
}

function renderChoices(choices, riskHint) {
  const box = $("choices"); box.innerHTML = "";
  S.lastChoices = choices || [];
  S.lastRiskHint = riskHint || null;   // 记住本幕的风险提示，切换开关时重渲
  choices.forEach((c, i) => {
    const b = document.createElement("button");
    b.className = "choice-btn";
    b.dataset.num = c.id ?? (i + 1);
    // 风险标记：优先用后端 risk_hint 给出的语义标签；未提供则按关键词推断。
    // 只提示「后果的类型」（danger/cost/unknown/law/bond…），绝不剧透具体内容（Reigns 式克制）。
    let tag = null;
    if (riskHint) {
      const rh = (riskHint || []).find(x => x && x.id === (c.id ?? (i + 1)));
      if (rh && rh.tag) tag = { cls: rh.tag, label: RISK_LABEL[rh.tag] || rh.tag };
    }
    if (!tag) tag = riskTag(c.text || "");
    if (tag) {
      const s = document.createElement("span");
      s.className = "risk-tag " + tag.cls;
      s.textContent = tag.label;
      b.appendChild(s);
    }
    const t = document.createElement("span");
    t.className = "choice-text";
    t.textContent = c.text;
    b.appendChild(t);
    b.onclick = () => onChoose(c);
    box.appendChild(b);
  });
  // 陆沉的建议：在她偏好的那个选项上打标记，并让她开口说一句
  const adv = companionAdvice(choices);
  if (adv) {
    const idx = (choices || []).indexOf(adv.choice);
    if (idx >= 0 && box.children[idx]) box.children[idx].classList.add("advised");
    const txt = adv.choice.text || "";
    const short = txt.length > 12 ? txt.slice(0, 12) + "…" : txt;
    showCompanionBubble("若是我，会选「" + short + "」——" + adv.cfg.say, "calm");
  }
}
function showModal(title, html) {
  $("modal-title").textContent = title;
  $("modal-body").innerHTML = html;
  $("modal").classList.remove("hidden");
}
function thinking(showIt) {
  let t = document.querySelector(".thinking");
  if (showIt) {
    if (!t) {
      t = document.createElement("div"); t.className = "thinking loading-dots";
      t.textContent = "命运之轮转动中";
      document.body.appendChild(t);
    }
  } else if (t) t.remove();
}

// ------------------ 核心流程 ------------------
async function onChoose(choice) {
  const st = S.state;
  const text = choice.text || "";
  let userInput = `[玩家选择了选项${choice.id ?? ""}] ${text}`;
  const isFree = /自由行动/.test(text);
  if (isFree) { openFreeInput(); return; }
  pushLog("player", text);
  await advance(userInput, false);
}
function openFreeInput() {
  $("free-input").value = "";
  $("free-input-modal").classList.remove("hidden");
  setTimeout(() => $("free-input").focus(), 50);
}
async function submitFree() {
  const v = $("free-input").value.trim();
  if (!v) return;
  $("free-input-modal").classList.add("hidden");
  await submitPlayerAction(v);
}
// 对话记录：把玩家输入与剧情旁白都显示出来
function pushLog(role, text) {
  const body = $("chat-log-body");
  if (!body || !text) return;
  const d = document.createElement("div");
  d.className = "msg " + (role === "player" ? "msg-player" : "msg-scene");
  d.textContent = role === "player" ? `▶ ${S.state ? S.state.player_name : "你"}：${text}` : text;
  body.appendChild(d);
  body.scrollTop = body.scrollHeight;
}
function resetLog() { const b = $("chat-log-body"); if (b) b.innerHTML = ""; }
// 读档时把已发生的剧情文字重新填充进记录区
function restoreLog() {
  resetLog();
  (S.history || []).forEach(h => {
    if (h.role === "user") {
      const t = (h.content || "")
        .replace(/^\[玩家选择了选项\s*\d*\]\s*/, "")
        .replace(/^\[自由行动\]\s*玩家行动:\s*/, "");
      if (t) pushLog("player", t);
    } else {
      try { const d = JSON.parse(h.content); if (d && d.scene) pushLog("scene", d.scene); } catch (e) { /* 忽略非 JSON 记录 */ }
    }
  });
}
// 常驻对话框：玩家随时可输入行动 / 台词，驱动剧情
async function submitPlayerAction(text) {
  text = (text || "").trim();
  if (!text || !S.state) return;
  $("action-input").value = "";
  pushLog("player", text);
  setActionEnabled(false);
  try {
    await advance(`[自由行动] 玩家行动: ${text}`, true, text);
  } finally {
    setActionEnabled(true);
  }
}
function setActionEnabled(on) {
  const inp = $("action-input"), btn = $("btn-action");
  if (inp) inp.disabled = !on;
  if (btn) btn.disabled = !on;
}
async function advance(userInput, isFree, rawText) {
  const st = S.state;
  setActionEnabled(false);
  thinking(true);
  try {
    const payload = {
      world_setting: st.world,
      world_id: st.world_id,
      world_setting_full: st.world_setting,
      player_name: st.player_name,
      portrait: st.portrait || "protagonist",
      difficulty: st.difficulty,
      baked_cursor: st.baked_cursor || null,   // 服务端 baked 游标（契约 v1，缺省 null = 从头开始）
      state: {
        level: st.level, exp: st.exp, exp_to_next: st.exp_to_next,
        hp: st.hp, max_hp: st.max_hp, attack: st.attack, defense: st.defense,
        gold: st.gold, inventory: st.inventory, skills: st.skills,
        turn_count: st.turn_count, monsters_killed: st.monsters_killed,
      },
      history: S.history.slice(-20),
      user_input: rawText || userInput,
      is_free_action: !!isFree,
    };
    let data;
    if (S.offline) {
      data = await bakedChat(payload);
    } else {
      try { data = await apiChat(payload); }
      catch (e) { data = await bakedChat(payload); }   // 在线失败 → 无缝兜底离线案件库
    }
    // 服务端 baked 模式：回存下一节点游标，下次请求据此推进（契约 v1）
    if (data && data.baked_cursor) st.baked_cursor = data.baked_cursor;
    thinking(false);
    st.turn_count++;
    applyStatusChange(data.status_change);
    applyQuest(data.quest);
    st.alignment = clamp((st.alignment || 0) + (data.alignment_change || 0), -100, 100);
    S.history.push({ role: "user", content: payload.user_input });
    S.history.push({ role: "assistant", content: JSON.stringify(data) });
    showScene(data);
    // 死亡 / 通关 / 胜利判定
    if (st.hp <= 0 || /游戏结束/.test(JSON.stringify(data.choices))) {
      gameOver();
      return;
    }
    if (data.victory) { victoryEnding(); return; }
    if (data.case_end) {
      if (data.chain) { caseCleared(); }     // 多案世界：串下一案，流程继续
      else { victoryEnding(); return; }      // 单案世界：本案即终局，正常结算
    }
    checkAchievements();
    if (S.voiceOn && data.scene) playSceneVoice(S.lastSegments).catch(() => {});
  } catch (e) {
    thinking(false);
    toast("剧情生成失败：" + e.message);
  } finally {
    setActionEnabled(true);
  }
}
function caseCleared() {
  toast("🗂 案件告破 · 新案已接");
  companionSay("victory", "happy");
  checkAchievements();
}

// ---------------- 审讯 / 物证 / 指控（侦探核心玩法） ----------------
function mergeSuspect(s) {
  if (!s || !s.id) return;
  const st = S.state;
  st.suspects = st.suspects || {};
  const old = st.suspects[s.id] || {};
  st.suspects[s.id] = Object.assign({}, old, s, {
    pacified: old.pacified || false,
    verified: s.alibi_verified !== undefined ? s.alibi_verified : old.verified,
  });
}
function mergeSuspects(list) { (list || []).forEach(mergeSuspect); }
function grantEvidence(ev, authored) {
  if (!ev || !ev.id) return;
  const st = S.state;
  st.evidence = st.evidence || [];
  if (st.evidence.some(e => e.id === ev.id)) return;
  st.evidence.push({ id: ev.id, name: ev.name || "不明物证", hint: ev.hint || "",
                     identified: !!ev.identified, solid: false,
                     authored: authored !== false, note: "" });
  toast("🔍 获得未鉴定物证：" + (ev.name || "不明物证"));
}
function identifiedSolidCount() {
  return (S.state.evidence || []).filter(e => e.identified && e.solid).length;
}
// 鉴定不可逆：案件内 authored 物证 → 铁证；线上随机物证 → 七成铁证 / 三成误导
function identifyEvidence(evId) {
  const st = S.state;
  const ev = (st.evidence || []).find(e => e.id === evId);
  if (!ev || ev.identified) return;
  ev.identified = true;
  ev.solid = ev.authored !== false ? true : Math.random() < 0.7;
  if (ev.solid) {
    ev.note = ev.hint || "细节彼此咬合，这条线索站得住。";
    toast("🔬 鉴定完成：「" + ev.name + "」是铁证");
  } else {
    ev.note = "鉴定显示这条线索被故意留在那里——它指向了错误的方向。";
    toast("🔬 鉴定完成：「" + ev.name + "」竟是误导……");
  }
  openEvidence();   // 刷新面板
  checkAchievements();
}
function openSuspects() {
  const st = S.state;
  const list = Object.values(st.suspects || {});
  if (!list.length) {
    showModal("🗂 嫌疑人档案", "<p class='dim'>尚未锁定任何嫌疑人。继续调查，让名字浮出水面。</p>");
    return;
  }
  let html = "<div class='bonds-list'>";
  list.forEach(s => {
    const status = s.pacified ? "已制服" : s.hostile ? "⚠ 暴力抗法" : "在查";
    const tint = s.pacified ? "#a0e7d0" : s.hostile ? "#ff6b81" : "#9fc0ff";
    const verTxt = s.verified === false ? "不在场证明：<b style='color:#ff6b81'>出现矛盾</b>"
                 : s.verified === true ? "不在场证明：已核实" : "不在场证明：待核实";
    html += `<div class='bond-row'><div class='bond-ava'>${crestSVG({ sigil: s.hostile && !s.pacified ? "⚠" : "👤", tint: tint, given: "" })}</div>
      <div class='bond-main'><div class='bond-name'>${esc(s.name)} <span class='bond-lvl'>${status}</span></div>
      <div class='bond-desc'>${esc(s.role || "身份不明")} · ${verTxt}<br>口供：${esc(s.alibi || "拒答")}</div>
      ${s.hostile && !s.pacified ? `<button class='mini-btn' data-pacify='${s.id}' style='margin-top:8px'>⚔ 正面制服</button>` : ""}
      ${!s.pacified ? `<button class='mini-btn' data-press='${s.id}' style='margin-top:8px'>🗣 施压问话</button>` : ""}
      </div></div>`;
  });
  html += "</div>";
  showModal("🗂 嫌疑人档案 · " + list.length + " 人", html);
  document.querySelectorAll("[data-pacify]").forEach(b => { b.onclick = () => pacifySuspect(b.dataset.pacify); });
  document.querySelectorAll("[data-press]").forEach(b => { b.onclick = () => pressSuspect(b.dataset.press); });
}
function pacifySuspect(sid) {
  const st = S.state;
  const s = (st.suspects || {})[sid];
  if (!s) return;
  $("modal").classList.add("hidden");
  S.combatSuspectId = sid;
  startCombat({ enemy: { name: s.name + "（暴力抗法）", hp: 55 + st.level * 15,
                          atk: 9 + st.level * 2, def: 4 + st.level, ability: "none" },
                flee: false });
}
function pressSuspect(sid) {
  const st = S.state;
  const s = (st.suspects || {})[sid];
  if (!s) return;
  applyAffinity([{ char: "informant", delta: 2 }]);   // 线人帮你撬嘴
  if (s.verified === undefined || s.verified === null) {
    s.verified = false;
    if (s.alibi) addClue(s.name + " 的不在场证明出现矛盾：" + s.alibi);
    toast("🗣 你顶回一句，" + s.name + " 的眼神躲了一下");
  } else {
    toast("🗣 " + s.name + " 咬死原话，不再多说");
  }
  openSuspects();   // 刷新面板
}
function openEvidence() {
  const st = S.state;
  const list = st.evidence || [];
  if (!list.length) {
    showModal("🔍 物证鉴定", "<p class='dim'>尚未取得任何物证。</p>");
    return;
  }
  const solid = identifiedSolidCount();
  let html = `<p class='dim' style='margin-bottom:10px'>已确认铁证 <b>${solid}</b> 件 · 指控通常需要 3 件以上才稳</p><div class='bonds-list'>`;
  list.forEach(e => {
    const state = e.identified ? (e.solid ? "✅ 铁证" : "🌀 误导") : "❔ 未鉴定";
    const body = e.identified ? (e.note || e.hint) : "（未鉴定）" + (e.hint ? " " + e.hint : "");
    html += `<div class='bond-row'><div class='bond-ava'>🔍</div>
      <div class='bond-main'><div class='bond-name'>${esc(e.name)} <span class='bond-lvl'>${state}</span></div>
      <div class='bond-desc'>${esc(body)}</div>
      ${!e.identified ? `<button class='mini-btn' data-idn='${e.id}' style='margin-top:8px'>🔬 鉴定（不可逆）</button>` : ""}
      </div></div>`;
  });
  html += "</div>";
  showModal("🔍 物证鉴定 · " + list.length + " 件", html);
  document.querySelectorAll("[data-idn]").forEach(b => { b.onclick = () => identifyEvidence(b.dataset.idn); });
}
function updateAccuseBtn() {
  const b = $("btn-accuse");
  if (!b) return;
  const st = S.state;
  const ready = !!(st && st.pending_accusation && st.pending_accusation.ready) && !st.accused;
  b.classList.toggle("hidden", !ready);
}
function openAccusation() {
  const st = S.state;
  const acc = st.pending_accusation;
  if (!acc || !acc.ready || st.accused) return;
  const cands = (acc.candidates || []).map(id => st.suspects[id]).filter(Boolean);
  if (!cands.length) { toast("尚未锁定可指控的嫌疑人"); return; }
  const solid = identifiedSolidCount();
  const min = acc.min_evidence || 3;
  let html = `<p class='dim' style='margin-bottom:10px'>铁证 <b>${solid}</b> / ${min} 件` +
             (solid < min ? " · 证据不足，指控有被驳回的风险" : " · 证据链完整，可以收网") + "</p><div class='bonds-list'>";
  cands.forEach(s => {
    html += `<div class='bond-row'><div class='bond-ava'>👤</div>
      <div class='bond-main'><div class='bond-name'>${esc(s.name)}</div>
      <div class='bond-desc'>${esc(s.role || "")} · ${esc(s.alibi || "拒答")}</div>
      <button class='mini-btn' data-accuse='${s.id}' style='margin-top:8px'>⚖ 指控 ${esc(s.name)}</button>
      </div></div>`;
  });
  html += "</div><p class='dim' style='margin-top:10px'>指认真凶将直接终结本案：指对人且证据充分，才是完美收官。</p>";
  showModal("⚖ 指认真凶", html);
  document.querySelectorAll("[data-accuse]").forEach(b => { b.onclick = () => resolveAccusation(b.dataset.accuse); });
}
function resolveAccusation(pickedId) {
  const st = S.state;
  const acc = st.pending_accusation || {};
  st.accused = pickedId;
  const solid = identifiedSolidCount();
  const min = acc.min_evidence || 3;
  st.accuse_result = { correct: pickedId === st.case_culprit, sufficient: solid >= min, identified: solid, min: min };
  $("modal").classList.add("hidden");
  st._victory = st.accuse_result.correct;
  checkAchievements();
  const e = resolveEnding(st.accuse_result.correct);
  st.endings = st.endings || [];
  if (!st.endings.includes(e.id)) st.endings.push(e.id);
  companionSay(st.accuse_result.correct ? "victory" : "hurt", st.accuse_result.correct ? "happy" : "sad");
  $("over-title").textContent = e.title;
  $("over-sub").textContent = e.sub;
  $("over-note").textContent = e.desc;
  $("over-stats").innerHTML = endingStatsHtml(endingGrade(), st.accuse_result.correct);
  localStorage.removeItem("illusion_save");
  show("screen-over");
}
function gameOver() {
  const st = S.state;
  const e = resolveEnding(false);
  st.endings = st.endings || [];
  if (!st.endings.includes(e.id)) st.endings.push(e.id);
  $("over-title").textContent = e.title;
  $("over-sub").textContent = e.sub;
  $("over-note").textContent = e.desc;
  $("over-stats").innerHTML = endingStatsHtml(endingGrade(), false);
  localStorage.removeItem("illusion_save");
  show("screen-over");
}

// ------------------ 存档 ------------------
function saveGame() {
  if (!S.state) return;
  localStorage.setItem("illusion_save", JSON.stringify({ state: S.state, history: S.history.slice(-40) }));
  toast("💾 已保存");
}
function loadGame() {
  const raw = localStorage.getItem("illusion_save");
  if (!raw) { toast("没有找到存档"); return false; }
  try {
    const d = JSON.parse(raw);
    S.state = d.state; S.history = d.history || [];
    migrateState(S.state);   // 旧存档补齐审讯系统字段
    loadCast();
    enterGame();
    restoreLog();
    return true;
  } catch { toast("存档损坏"); return false; }
}
// 旧存档兼容：补齐审讯 / 物证 / 指控字段（缺省安全值）
function migrateState(st) {
  if (!st) return st;
  st.suspects = st.suspects || {};
  st.evidence = st.evidence || [];
  st.case_culprit = st.case_culprit || "";
  st._case_id = st._case_id || "";
  st.pending_accusation = st.pending_accusation || null;
  st.accused = st.accused || "";
  st.accuse_result = st.accuse_result || null;
  st.baked_cursor = st.baked_cursor || null;   // 服务端 baked 游标
  st.relics = st.relics || [];
  st.endings = st.endings || [];
  st.achievements = st.achievements || [];
  return st;
}
function enterGame() {
  const bg = $("world-bg");
  bg.className = "";
  bg.id = "world-bg";
  const wid = S.state.world_id || "fantasy";
  bg.classList.add("bg-" + wid);
  // 进入游戏：随机选一张背景（重置当前，确保首张随机）
  curBgUrl = null;
  rotateWorldBg();
  const p = PORTRAITS.find(x => x.id === (S.state.portrait || "protagonist")) || PORTRAITS[0];
  $("char-img").src = p.full;
  document.getElementById("char-wrap").classList.toggle("as-card", !!p.card);
  document.querySelector(".hud-avatar").src = p.avatar;
  renderHUD(); renderQuest();
  showCompanion();
  show("screen-game");
}

// ------------------ 初始化 UI ------------------
function initCreate() {
  // 默认角色名跟随所选形象
  if (!S.create.name) {
    const def = PORTRAITS.find(p => p.id === S.create.portrait) || PORTRAITS[0];
    S.create.name = def.given;
  }
  // 世界
  const wg = $("world-grid"); wg.innerHTML = "";
  if (PLAYTEST_OPEN.indexOf(S.create.world) < 0) S.create.world = "fantasy";  // 旧存档防御
  WORLDS.forEach(w => {
    const open = PLAYTEST_OPEN.indexOf(w.id) >= 0;
    const d = document.createElement("div");
    d.className = "world-card bg-" + w.id + (S.create.world === w.id ? " selected" : "") + (open ? "" : " locked");
    d.innerHTML = `<div class="wc-desc">${open ? esc(w.desc) : "🔒 试玩版未开放 · 即将登陆 Steam"}</div><div class="wc-name">${esc(w.name)}</div>`;
    d.onclick = () => {
      if (!open) { toast("🔒 该世界将在正式版开放，试玩请从「古老宅邸」或「迷雾港」开始"); return; }
      S.create.world = w.id; initCreate();
    };
    wg.appendChild(d);
  });
  // 难度
  const dr = $("diff-row"); dr.innerHTML = "";
  DIFFS.forEach(x => {
    const b = document.createElement("div");
    b.className = "diff-btn" + (S.create.diff === x.id ? " selected" : "");
    b.innerHTML = `${x.name}<small>${x.desc}</small>`;
    b.onclick = () => { S.create.diff = x.id; initCreate(); };
    dr.appendChild(b);
  });
  // 职业
  const cg = $("class-grid"); cg.innerHTML = "";
  CLASSES.forEach(c => {
    const d = document.createElement("div");
    d.className = "class-card" + (S.create.classId === c.id ? " selected" : "");
    d.innerHTML = `<div class="cc-icon">${c.icon}</div><div class="cc-name">${esc(c.name)}</div><div class="cc-desc">${esc(c.desc)}</div>`;
    d.onclick = () => { S.create.classId = c.id; initCreate(); };
    cg.appendChild(d);
  });
  // 形象
  const pr = $("portrait-row"); pr.innerHTML = "";
  PORTRAITS.forEach(p => {
    const d = document.createElement("div");
    d.className = "portrait-card" + (S.create.portrait === p.id ? " selected" : "");
    d.innerHTML = `<img src="${p.full}" alt=""><div class="pc-name">${esc(p.name)}</div><div class="pc-given">${esc(p.given)}</div>`;
    d.onclick = () => { S.create.portrait = p.id; if (!S.create.name) { S.create.name = p.given; } initCreate(); };
    pr.appendChild(d);
  });
  $("input-name").value = S.create.name;
}

// ------------------ 主题模式：档案卷宗（默认）/ 霓虹夜色 ------------------
const Theme = {
  KEY: "coldprint.theme",
  get() {
    try { return localStorage.getItem(this.KEY) === "neon" ? "neon" : "paper"; } catch (e) { return "paper"; }
  },
  set(name) {
    try { localStorage.setItem(this.KEY, name); } catch (e) {}
    const link = document.getElementById("theme-link");
    if (link) link.setAttribute("href", name === "neon" ? "style-neon.css" : "style.css");
    this.refresh();
  },
  toggle() { this.set(this.get() === "neon" ? "paper" : "neon"); },
  refresh() {
    const label = this.get() === "neon" ? "霓虹夜色" : "档案卷宗";
    const b1 = $("btn-theme"); if (b1) b1.textContent = "\u{1F3A8} 主题 · " + label;
    const b2 = $("btn-theme-game"); if (b2) b2.textContent = "\u{1F3A8} " + label;
    if (typeof toast === "function") toast("界面主题：「" + label + "」");
  },
};

function bindEvents() {
  // 菜单
  $("btn-new").onclick = () => { initCreate(); show("screen-create"); };
  $("btn-continue").onclick = () => loadGame();
  $("btn-codex").onclick = () => { renderCodex(); show("screen-codex"); };
  $("btn-help").onclick = () => show("screen-help");
  $("btn-theme").onclick = () => Theme.toggle();
  const _btg = $("btn-theme-game"); if (_btg) _btg.onclick = () => Theme.toggle();
  $("btn-codex-back").onclick = () => show("screen-menu");
  $("btn-help-back").onclick = () => show("screen-menu");
  // 创建
  $("input-name").oninput = (e) => { S.create.name = e.target.value.trim(); };
  $("btn-back-menu").onclick = () => show("screen-menu");
  $("btn-start").onclick = () => {
    S.state = newState(); S.history = [];
    resetLog();
    enterGame();
    advance("", false);
    setTimeout(() => companionSay("greet", "calm"), 1800);
  };
  // 游戏
  $("btn-voice").onclick = () => {
    if (S.currentAudio) { stopVoice(); return; }
    if (S.lastSegments.length) playSceneVoice(S.lastSegments);
    else if (S.pendingSceneText) playSceneVoice(sceneSegments({ scene: S.pendingSceneText }));
  };
  $("btn-skip-type").onclick = () => skipTyping();
  // 倍速 / 暂停
  $("speed-group").querySelectorAll(".speed-btn").forEach(b => {
    b.onclick = () => setSpeed(b.dataset.speed);
  });
  $("btn-pause").onclick = () => togglePause();
  $("btn-risk-tags").onclick = () => toggleRiskTags();
  // 空格键随时暂停 / 继续（在输入框内时不拦截）
  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.code === "Space") { e.preventDefault(); togglePause(); }
  });
  $("btn-status").onclick = () => {
    const st = S.state;
    showModal("状态", `❖ ${st.player_name} · ${st.class_name}\n等级 Lv.${st.level}（经验 ${st.exp}/${st.exp_to_next}）\nHP ${st.hp}/${st.max_hp} · MP ${st.mp}/${st.max_mp} · 运气 ${st.luck}\n攻击 ${st.attack} · 防御 ${st.defense} · 金币 ${st.gold}\n击杀 ${st.monsters_killed} · 回合 ${st.turn_count} · 立场 ${st.alignment > 0 ? "正义+" + st.alignment : st.alignment < 0 ? "混沌" + st.alignment : "中立"}`);
  };
  $("btn-inv").onclick = () => openInventory();
  $("btn-bonds").onclick = () => openBonds();
  $("btn-shop").onclick = () => openShop();
  $("btn-ach").onclick = () => openAch();
  $("btn-suspects").onclick = () => openSuspects();
  $("btn-evidence").onclick = () => openEvidence();
  $("btn-accuse").onclick = () => openAccusation();
  $("btn-clues").onclick = () => openClues();
  $("btn-dive").onclick = () => doTimeDive();
  $("btn-cards").onclick = () => openCards();
  // 战斗面板
  $("combat-atk").onclick = () => combatAct("atk");
  $("combat-def").onclick = () => combatAct("def");
  $("combat-skill").onclick = () => openSkillMenu();
  $("combat-item").onclick = () => combatAct("item");
  $("combat-flee").onclick = () => combatAct("flee");
  $("combat-dice").onclick = () => combatDice();
  $("combat-close").onclick = () => { if (combat) { combat = null; } $("combat-panel").classList.add("hidden"); };
  $("btn-quest").onclick = () => {
    const st = S.state;
    const qs = st.quests || [];
    showModal("任务日志", qs.length
      ? qs.map(q => `${q.done ? "✅" : "📜"} ${q.name}\n　 ${q.description}`).join("\n\n")
      : "暂无任务。冒险还在序章……");
  };
  $("btn-save").onclick = () => saveGame();
  // 常驻对话框：自由行动
  $("btn-action").onclick = () => submitPlayerAction($("action-input").value);
  $("action-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); submitPlayerAction($("action-input").value); }
  });
  $("quick-chips").querySelectorAll(".chip").forEach(ch => {
    ch.onclick = () => submitPlayerAction(ch.dataset.act);
  });
  $("btn-menu").onclick = () => {
    showModal("菜单", "冒险还在继续，确定要离开吗？\n（存档后退出不会丢失进度）");
    const body = $("modal-body");
    const row = document.createElement("div");
    row.className = "modal-actions";
    const b1 = document.createElement("button"); b1.className = "btn btn-primary"; b1.textContent = "存档并退出";
    b1.onclick = () => { saveGame(); $("modal").classList.add("hidden"); show("screen-menu"); };
    const b2 = document.createElement("button"); b2.className = "btn btn-ghost"; b2.textContent = "继续冒险";
    b2.onclick = () => $("modal").classList.add("hidden");
    row.appendChild(b1); row.appendChild(b2); body.appendChild(row);
  };
  $("btn-close-modal").onclick = () => $("modal").classList.add("hidden");
  $("btn-free-cancel").onclick = () => $("free-input-modal").classList.add("hidden");
  $("btn-free-go").onclick = () => submitFree();
  $("free-input").onkeydown = (e) => { if (e.key === "Enter") submitFree(); };
  // 结算
  $("btn-again").onclick = () => { initCreate(); show("screen-create"); };
  $("btn-over-menu").onclick = () => show("screen-menu");
  // 打字机期间点击对话框直接跳过
  $("dialog-text").onclick = () => skipTyping();
}

// ============================================================
//  角色配音系统：不同角色不同声线，不同情绪不同语气
// ============================================================

// 角色气质 → 声线（AI 给出 voice_hint，客户端映射到 edge-tts 声线）
const VOICE_HINT_MAP = {
  young_f:  "zh-CN-XiaoxiaoNeural",   // 少女 → 晓晓（温柔甜美）
  lively_f: "zh-CN-XiaoyiNeural",     // 活泼俏皮 → 晓伊
  mature_f: "zh-CN-XiaoxuanNeural",   // 成熟冷静 → 晓萱
  young_m:  "zh-CN-YunxiNeural",      // 少年 → 云希（阳光）
  mature_m: "zh-CN-YunyangNeural",    // 沉稳长者 → 云扬
  rough_m:  "zh-CN-YunjianNeural",    // 粗犷热血 → 云健
};
const CHAR_VOICES = Object.values(VOICE_HINT_MAP);

// 玩家形象 → 固定声线（同一角色一开口就是这把嗓子）
const PLAYER_VOICE = {
  protagonist: "zh-CN-XiaoxiaoNeural",  // 调查员沈夜 · 沉稳
  aqua: "zh-CN-XiaoxuanNeural",         // 痕迹分析师江临 · 安静外冷内热
  neon: "zh-CN-XiaoxuanNeural",         // 网络侦探苏夜 · 酷飒
  frost: "zh-CN-XiaoyiNeural",          // 法医白桦 · 空灵
  stellar: "zh-CN-YunyangNeural",       // 资深探员陆沉 · 沉稳
  storm: "zh-CN-YunxiNeural",           // 外勤探员周野 · 阳光
  silver: "zh-CN-YunyangNeural",        // 退休刑警老白 · 沉稳
  crimson: "zh-CN-YunjianNeural",       // 线人阿炎 · 激昂
  violet: "zh-CN-YunxiNeural",          // 辩护律师顾宸 · 斯文
};

// 情绪 → 语气参数（语速 rate / 音调 pitch / 音量 volume）
const EMOTION_PROSODY = {
  calm:     { rate: "+0%",  pitch: "+0Hz",  volume: "+0%"  },
  happy:    { rate: "+8%",  pitch: "+14Hz", volume: "+0%"  },
  excited:  { rate: "+14%", pitch: "+18Hz", volume: "+0%"  },
  angry:    { rate: "+12%", pitch: "+8Hz",  volume: "+15%" },
  sad:      { rate: "-14%", pitch: "-14Hz", volume: "-10%" },
  fear:     { rate: "+10%", pitch: "+20Hz", volume: "-5%"  },
  tense:    { rate: "+6%",  pitch: "+4Hz",  volume: "+0%"  },
  cold:     { rate: "-4%",  pitch: "-8Hz",  volume: "+0%"  },
  whisper:  { rate: "-12%", pitch: "-6Hz",  volume: "-35%" },
  serious:  { rate: "-2%",  pitch: "-4Hz",  volume: "+0%"  },
};
const EMOTION_WORDS = Object.keys(EMOTION_PROSODY);
// mood 字段 → 情绪词（segments 缺失时整段旁白的语气）
const MOOD_TO_EMOTION = {
  scene: "calm", battle: "tense", tense: "tense", mysterious: "calm",
  peaceful: "calm", sad: "sad", triumph: "excited",
};

function normEmotion(e) {
  const x = (e || "").toString().trim().toLowerCase();
  return EMOTION_WORDS.includes(x) ? x : "";
}
// 从 AI 返回中提取配音分段；没有 segments 时退化为「整段旁白 + mood 情绪」
function sceneSegments(data) {
  const segs = Array.isArray(data && data.segments) ? data.segments : null;
  if (segs && segs.length) {
    const out = [];
    for (const s of segs) {
      const t = (s && typeof s.text === "string") ? s.text.trim() : "";
      if (!t) continue;
      out.push({
        speaker: (s.speaker || "").toString().trim(),
        voice_hint: (s.voice_hint || "").toString().trim().toLowerCase(),
        emotion: normEmotion(s.emotion) || "calm",
        text: t,
      });
    }
    // 保险：分段拼接过短（AI 漏切）则退回整段旁白，避免丢内容
    const scene = (data && data.scene || "").trim();
    const concatLen = out.reduce((n, s) => n + s.text.length, 0);
    if (out.length && (!scene || concatLen >= scene.length * 0.5)) return out;
  }
  const scene = (data && data.scene || "").trim();
  if (!scene) return [];
  return [{ speaker: "", voice_hint: "narrator",
            emotion: normEmotion(MOOD_TO_EMOTION[(data && data.mood) || "scene"]) || "calm",
            text: scene }];
}
// 为说话者分配声线：同一角色固定声线；新角色按气质选，避开已用声线
function voiceFor(seg) {
  if (!seg.speaker) return S.voiceId;          // 旁白用用户选择的声线
  if (window.VOICE_CAST && window.VOICE_CAST[seg.speaker]) return window.VOICE_CAST[seg.speaker];  // 构建期预分配（与烘焙一致）
  if (S.cast[seg.speaker]) return S.cast[seg.speaker];
  const hintVoice = VOICE_HINT_MAP[seg.voice_hint];
  const used = new Set(Object.values(S.cast));
  let pick = null;
  if (hintVoice) {
    pick = used.has(hintVoice) ? null : hintVoice;   // 首选该气质声线，被占用则轮换
  }
  if (!pick) {
    const pool = (hintVoice ? CHAR_VOICES.filter(v => v !== hintVoice) : CHAR_VOICES)
      .concat(hintVoice ? [hintVoice] : []);
    // 稳定散列：同一角色名总是得到同一个候选顺序
    let h = 0;
    for (let i = 0; i < seg.speaker.length; i++) h = (h * 31 + seg.speaker.charCodeAt(i)) >>> 0;
    for (let i = 0; i < pool.length; i++) {
      const c = pool[(h + i) % pool.length];
      if (!used.has(c)) { pick = c; break; }
    }
    if (!pick) pick = pool[h % pool.length];   // 全部占用时允许重复
  }
  S.cast[seg.speaker] = pick;
  saveCast();
  return pick;
}
function saveCast() {
  try { localStorage.setItem("illusion_cast", JSON.stringify(S.cast)); } catch (e) {}
}
function loadCast() {
  try {
    const d = JSON.parse(localStorage.getItem("illusion_cast") || "{}");
    if (d && typeof d === "object") S.cast = d;
  } catch (e) { S.cast = {}; }
}
// 播放时在对话框标题处显示当前发声者
function updateSpeakerLabel() {
  const el = $("dialog-speaker");
  if (!el) return;
  if (S.curSpeaker) {
    el.textContent = "🎙 " + S.curSpeaker;
    el.classList.add("speaking");
  } else {
    el.textContent = `❖ ${S.state ? S.state.player_name : "你"} 的冒险`;
    el.classList.remove("speaking");
  }
}

// ------------------ 旁白声线选择 ------------------
function initVoiceSelect() {
  const sel = $("voice-select");
  if (!sel) return;
  const list = (S.screenApi && S.screenApi.voices) || [];
  sel.innerHTML = "";
  if (!list.length) {
    const o = document.createElement("option");
    o.textContent = "晓晓（默认）"; o.value = "zh-CN-XiaoxiaoNeural";
    sel.appendChild(o);
  } else {
    list.forEach(v => {
      const o = document.createElement("option");
      o.value = v.id;
      o.textContent = `${v.gender === "male" ? "♂" : "♀"} ${v.name} · ${v.desc}`;
      sel.appendChild(o);
    });
  }
  // 恢复上次选择（ localStorage 优先，其次服务端默认）
  const saved = localStorage.getItem("illusion_voice");
  S.voiceId = (saved && list.some(v => v.id === saved)) ? saved
            : (S.screenApi && S.screenApi.voice_default) || S.voiceId;
  sel.value = S.voiceId;
  sel.onchange = () => {
    S.voiceId = sel.value;
    localStorage.setItem("illusion_voice", S.voiceId);
    const v = list.find(x => x.id === S.voiceId);
    toast(`🔊 旁白声线已切换为「${v ? v.name : S.voiceId}」`);
    previewVoice(S.voiceId);   // 立即用新声线试听，无需等下一段剧情
  };
  // 语音不可用时禁用并提示
  if (S.screenApi && S.screenApi.voice_available === false) {
    sel.disabled = true;
    sel.title = "语音未启用：服务端安装 edge-tts 后重启";
  }
}

// 声线试听：优先播放预加载缓存，实现"点一下就响"
function voiceNameOf(id) {
  const v = ((S.screenApi && S.screenApi.voices) || []).find(x => x.id === id);
  return v ? v.name : "旁白";
}
function previewVoice(id) {
  if (!S.state) return;
  stopVoice();
  const name = voiceNameOf(id);
  const cached = S.voiceCache[id];
  const start = (url, revoke) => {
    const a = new Audio(url);
    a.playbackRate = S.voiceSpeed;
    S.currentAudio = a;
    $("btn-voice").classList.add("playing");
    a.onended = () => { stopVoice(); if (revoke) URL.revokeObjectURL(url); };
    a.play().catch(() => {});
  };
  if (cached) { start(cached, false); return; }
  apiVoice(`你好，我是${name}，接下来由我为你讲述这段传说。`, id)
    .then(r => {
      const local = r && r.__local;
      const url = local || URL.createObjectURL(r);
      S.voiceCache[id] = url;      // 缓存，下次秒切
      start(url, !local);
    })
    .catch(e => toast("声线试听失败：" + e.message));
}
// 后台预加载全部声线的试听音频（切换时零等待）
function preloadVoices() {
  const list = (S.screenApi && S.screenApi.voices) || [];
  if (!list.length || (S.screenApi && S.screenApi.voice_available === false)) return;
  (async () => {
    for (const v of list) {
      if (S.voiceCache[v.id]) continue;
      try {
        const blob = await apiVoice(`你好，我是${v.name}。`, v.id);
        S.voiceCache[v.id] = URL.createObjectURL(blob);
      } catch (e) { /* 预加载失败则切换时实时合成 */ }
      await new Promise(r => setTimeout(r, 80));
    }
  })();
}

// ------------------ 音效（启动界面 / 交互反馈） ------------------
let sfxGateDone = false;
function initSfx() {
  // 首次用户手势：激活音频 + 启动音效（浏览器要求先有手势才能出声）
  const activateAudio = () => {
    if (sfxGateDone) return;
    sfxGateDone = true;
    SFX.ensure();
    const gate = $("audio-gate");
    if (gate) gate.classList.add("hide");
    if (!SFX.enabled) return;
    SFX.startup();
  };
  document.addEventListener("pointerdown", () => activateAudio(), true);
  document.addEventListener("keydown", () => activateAudio(), true);

  // 全局按钮音效：悬停轻响 + 点击科技感音
  let lastHover = null;
  document.addEventListener("pointerover", (e) => {
    const b = e.target.closest("button, select, .speed-btn, .chip");
    if (b && b !== lastHover) { lastHover = b; SFX.hover(); }
  });
  document.addEventListener("pointerdown", (e) => {
    if (!sfxGateDone) return;
    if (e.target.closest("button, select")) SFX.click();
  });
  document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "voice-select") SFX.select();
  });
}
function curScreen() {
  const a = document.querySelector(".screen.active");
  return a ? a.id : "";
}

// ------------------ BGM（首页自动有声） ------------------
function initBgm() {
  const gate = $("start-gate");
  // 尝试自动播放；被浏览器拦截则显示「点击开始」页
  const ok = BGM.autoplay();
  if (!ok && gate) {
    setTimeout(() => {
      if (!BGM.playing || BGM.ctx.state !== "running") {
        gate.classList.remove("hidden");
        gate.classList.add("show");
      }
    }, 450);
  } else if (gate) {
    gate.classList.add("hidden");
  }
  // 点击开始 → 解锁音频，BGM 与启动音效同时响起
  $("btn-start-audio").onclick = (e) => {
    e.stopPropagation();
    gate.classList.add("hide");
    setTimeout(() => gate.classList.add("hidden"), 500);
    sfxGateDone = true;
    const g2 = $("audio-gate"); if (g2) g2.classList.add("hidden");
    SFX.ensure();
    if (SFX.enabled) SFX.startup();
    BGM.start();
    BGM.setLevel("menu");
  };
}

async function init() {
  makePetals();
  bindEvents();
  initSfx();
  initBgm();
  loadCast();
  // 试玩版：无服务端，强制离线案件库模式（运行时零云端调用）
  S.offline = true;
  initVoiceSelect();
  preloadVoices();   // 后台预加载全部声线，切换零等待
  const banner = $("api-banner");
  if (S.offline) {
    banner.classList.remove("hidden");
    banner.classList.add("warn");
    banner.textContent = "🗂 离线案件库模式：8 世界 · 16 桩案件本地预生成，无需联网。";
  } else if (!S.screenApi.api_available) {
    banner.classList.remove("hidden");
    banner.classList.add("warn");
    banner.textContent = "⚠ 未检测到 API Key，将使用内置离线案件库。配置 config.json 后重启可获得在线 AI 体验。";
  } else if (!S.screenApi.voice_available) {
    banner.classList.remove("hidden");
    banner.textContent = "ℹ AI 已就绪。语音未启用（服务端执行 pip install edge-tts 后重启即可）。";
  }
  show("screen-menu");
}
document.addEventListener("DOMContentLoaded", () => { Theme.refresh(); init(); });
