/* ════════════════════════════════════════════════════════════
   SHATTERED VEIL — app.js v3.0
   Full game engine: story, combat, lore, quiz gates, companions
   ════════════════════════════════════════════════════════════ */

'use strict';

// ── LORE DATABASE ────────────────────────────────────────────
const LORE = {
  veil_history: {
    topic: 'The Shattered Veil',
    text: 'Long ago, the Veil was a magical barrier between the living world and the realm of death. When the first Wraithcaller — a mage named Aldros — tore it apart in grief over a lost daughter, the dead began to walk.',
    hint: null
  },
  wraithcaller_origin: {
    topic: 'The Wraithcaller',
    text: 'The Wraithcaller is not purely evil. He was once Aldros, a scholar who lost his daughter Mira to a plague. His grief drove him to tear the Veil itself, seeking to bring her back. Now he is something between man and wraith.',
    hint: '⚔ Combat hint: Aldros is weakened by reminders of Mira. Selene knows a ritual to reach what remains of his humanity.'
  },
  wraithcaller_weakness: {
    topic: 'Weakness: Wraithcaller',
    text: 'The old herbalist Finnick once treated Aldros before he fell. He said: "Soul magic cuts deepest — it reminds him what he lost. The spell Soul Drain does twice the damage, and in his second form, two and a half times."',
    hint: '⚔ Use Soul Drain against the Wraithcaller for massive bonus damage!'
  },
  daughter_mira: {
    topic: "Aldros's Daughter",
    text: 'Ravyn the storyteller knows the old tale well: "The Wraithcaller\'s daughter was named Mira. She died at age nine of the Greyveil plague. Her name is the only thing that can pierce through his darkness and reach the man beneath."',
    hint: '🔮 Knowing Mira\'s name unlocks the Sanctum Gate — and a chance to end things without bloodshed.'
  },
  bone_harbinger: {
    topic: 'Weakness: Bone Harbinger',
    text: 'Captain Seris lost two soldiers to Bone Harbingers. "Their ribcage has a glowing core shard. If your Veil Sight reveals it, your next strike will shatter it — three times the normal damage." The Veil Sight spell unlocks this.',
    hint: '⚔ Use Veil Sight before attacking a Bone Harbinger — next hit does 3x damage!'
  },
  veilstalker: {
    topic: 'Weakness: Veilstalker',
    text: '"They slip between shadow-folds in the Veil," Grimwald warned, wiping forge-ash from his brow. "Light magic burns them proper. Your Spark or Fireball spell — they take sixty percent more damage from those."',
    hint: '⚔ Cast Spark or Fireball against Veilstalkers for +60% damage!'
  },
  iron_sentinel: {
    topic: 'Weakness: Iron Sentinel',
    text: 'The merchant Eryn traded notes with an adventurer who survived: "Magic barely scratches that armour. But poison gets into the joints — corrodes the inner mechanisms. Venom Fang or a Poison Flask will do extra damage each turn."',
    hint: '⚔ Use poison attacks (Venom Fang / Poison Flask) against the Iron Sentinel!'
  },
  bonewright: {
    topic: 'Weakness: Bonewright',
    text: 'Selene pored over ancient texts: "The Bonewright is held together by concentration. Aggressive, relentless attacks disrupt its focus. If you stagger it enough, it collapses into pieces — and its second phase begins at half HP."',
    hint: '⚔ Attack aggressively and without mercy against the Bonewright!'
  },
  veil_colossus: {
    topic: 'Weakness: Veil Colossus',
    text: 'The final guardian. No NPC has faced it and returned. Kael found a crumbled note: "The Colossus is built from stolen souls. Weapons imbued with Veilbane or Soulsteal enchantments deal extra damage — and may heal the wielder."',
    hint: '⚔ Equip Veilbane or Soulsteal weapons against the Veil Colossus!'
  },
  lyra_secret: {
    topic: "Lyra's Past",
    text: '"I used to work for the Thieves\' Enclave," Lyra confesses over ale. "Three years ago I stole a Veil fragment from a courier. I didn\'t know what it was. I think that\'s how Aldros found Ashenreach — I led him here."',
    hint: null
  },
  torvin_oath: {
    topic: "Torvin's Oath",
    text: 'Torvin speaks rarely of his past: "I swore an oath to the King of Ironhold to protect an artifact convoy. The Wraithcaller\'s servants ambushed us. I was the only survivor. I have carried that shame for seven years."',
    hint: null
  },
  selene_magic: {
    topic: "Selene's Knowledge",
    text: '"I have studied the Veil for thirty years," Selene says quietly. "There is a ritual — the Remembrance Rite — that can reach through a Veilborn\'s corruption and speak to whoever they once were. It requires someone they loved to initiate it."',
    hint: '🔮 If Selene is in your party when you face the Wraithcaller, she can attempt the Remembrance Rite.'
  },
  kael_family: {
    topic: "Kael's Family",
    text: '"My wife and son were taken by the marsh creatures three winters past," Kael says, eyes distant. "I\'ve tracked every creature that crosses from the Obsidian Marsh since. I will find them, or I will die trying."',
    hint: null
  },
  marsh_history: {
    topic: 'History of the Marsh',
    text: 'Before the Veil shattered, the Obsidian Marsh was called the Silverfen — a place of healing springs and rare medicinal herbs. The corruption turned its waters black. The old temple at its heart was once a sanctuary to the goddess Vael.',
    hint: null
  },
  sanctum_gate: {
    topic: 'The Sanctum Gate',
    text: 'The old fortune-teller Mirela whispers: "The Sanctum Gate will not open by force. It opens only for those who carry the weight of another\'s grief. You must speak the name of the one the Wraithcaller lost — only then will it yield."',
    hint: '🔮 Remember the name of the Wraithcaller\'s lost daughter to open the Sanctum Gate.'
  }
};

// ── COMPANION DEFINITIONS ────────────────────────────────────
const COMPANIONS = {
  lyra: {
    id: 'lyra', name: 'Lyra', icon: '🗡',
    role: 'Shadow Rogue',
    desc: 'Gold-fingered thief. Increases gold from combat by 30%. Knows the back alleys of Ashenreach.',
    passive: 'gold_bonus',
    loreKey: 'lyra_secret'
  },
  torvin: {
    id: 'torvin', name: 'Torvin', icon: '🛡',
    role: 'Ironhold Warrior',
    desc: 'Battle-scarred soldier. Reduces all damage taken by 20%. Will not flee from any enemy.',
    passive: 'damage_reduce',
    loreKey: 'torvin_oath'
  },
  selene: {
    id: 'selene', name: 'Selene', icon: '✨',
    role: 'Veil Scholar',
    desc: 'Ancient-lore herbalist. Heals 15–25 HP after every combat. Unlocks the Remembrance Rite.',
    passive: 'post_heal',
    loreKey: 'selene_magic'
  },
  kael: {
    id: 'kael', name: 'Kael', icon: '🏹',
    role: 'Marsh Ranger',
    desc: 'Expert tracker. Deals +8 damage to undead enemies. Reveals hidden paths in the marsh.',
    passive: 'undead_bane',
    loreKey: 'kael_family'
  }
};

// ── SPELL DEFINITIONS ────────────────────────────────────────
const SPELLS = [
  { name: 'Spark',        cost: 8,  damage: [4, 9],   type: 'light', description: 'Basic lightning — effective vs Veilstalkers' },
  { name: 'Heal',         cost: 12, heal:   [15,25],  type: 'heal',  description: 'Restore health with magic' },
  { name: 'Fireball',     cost: 18, damage: [10,18],  type: 'light', description: 'Explosive fire — effective vs Veilstalkers' },
  { name: 'Veil Sight',   cost: 14, special: 'veilsight', type: 'utility', description: 'Reveals hidden weaknesses — triple damage on next attack vs Bone Harbingers' },
  { name: 'Soul Drain',   cost: 22, damage: [12,20],  type: 'soul',  description: 'Soul magic — 2x damage vs Wraithcaller, 2.5x in phase 2' },
  { name: 'Venom Fang',   cost: 16, damage: [8,12],   type: 'poison', dot: 4, description: 'Poison attack — extra damage per turn, effective vs Iron Sentinel' },
  { name: 'Lightning Bolt',cost:25, damage: [16,24],  type: 'shock', description: 'Powerful electrical attack' },
  { name: 'Greater Heal', cost: 30, heal:   [35,55],  type: 'heal',  description: 'Powerful healing magic' },
  { name: 'Shield',       cost: 15, buff: 'defense',  type: 'buff',  description: 'Halves damage taken this turn' },
  { name: 'Teleport',     cost: 35, special: 'teleport', type: 'utility', description: 'Return to Ashenreach instantly' },
  { name: 'Remembrance',  cost: 40, special: 'remembrance', type: 'soul', description: 'Selene\'s ritual — reaches through the Wraithcaller\'s corruption' }
];

// ── ENEMY DEFINITIONS ────────────────────────────────────────
const ENEMIES = {
  marsh_skeleton:   { name: 'Marsh Skeleton',   hp: 30,  damage: [5,9],   gold: [8,15],   xp: 25, undead: true },
  corrupted_spirit: { name: 'Corrupted Spirit', hp: 38,  damage: [7,12],  gold: [12,20],  xp: 30, spirit: true },
  veilstalker:      { name: 'Veilstalker',      hp: 55,  damage: [10,16], gold: [20,32],  xp: 55, spirit: true, weakLight: true },
  bog_wraith:       { name: 'Bog Wraith',        hp: 45,  damage: [8,14],  gold: [15,25],  xp: 40, spirit: true },
  bone_archer:      { name: 'Bone Archer',       hp: 35,  damage: [9,14],  gold: [10,18],  xp: 35, undead: true },
  // BOSSES
  bone_harbinger: {
    name: 'Bone Harbinger', hp: 80, damage: [13,19], gold: [40,60], xp: 90,
    undead: true, boss: true, hasCoreShot: true,
    intro: '"A massive skeletal warrior rises from the marsh, its ribcage glowing with imprisoned souls. Captain Seris warned you about this — somewhere inside that chest, a core shard pulses with dark energy."'
  },
  iron_sentinel: {
    name: 'Iron Sentinel', hp: 100, damage: [14,20], gold: [55,75], xp: 110,
    construct: true, boss: true, magicResist: 0.4,
    intro: '"A hulking iron golem animated by necromantic runes blocks the inner sanctum passage. Its joints wheeze and spark. The merchant Eryn was right — magic barely scratches that armour."'
  },
  bonewright: {
    name: 'Bonewright', hp: 90, damage: [16,22], gold: [50,70], xp: 100,
    undead: true, boss: true, phaseTwo: false,
    intro: '"The Bonewright looms from the shadows — a titan stitched from dozens of skeletons, held together by sheer necromantic will. Selene\'s research said to be relentless — disrupt its concentration."'
  },
  veil_colossus: {
    name: 'Veil Colossus', hp: 140, damage: [18,26], gold: [80,110], xp: 180,
    boss: true, spirit: true, soulGuard: true,
    intro: '"The Colossus fills the inner sanctum — a towering figure woven from stolen souls, their anguished faces pressing against its translucent form. Its eyes find yours, and you feel your own soul tremble."'
  },
  wraithcaller_p1: {
    name: 'Wraithcaller', hp: 130, damage: [18,26], gold: [0,0], xp: 0,
    boss: true, finalBoss: true, phase: 1, undead: true,
    intro: '"The Wraithcaller — once Aldros the Scholar — stands at the heart of his ruined temple. Wreathed in swirling darkness, his eyes glow with pale fire. Yet beneath that... is that grief you see? Or fury?"'
  },
  wraithcaller_p2: {
    name: 'Wraithcaller — True Form', hp: 80, damage: [22,32], gold: [150,200], xp: 350,
    boss: true, finalBoss: true, phase: 2, undead: true,
    intro: '"With a shriek that shakes the walls, the Wraithcaller tears free of his mortal shell. The scholar Aldros is gone — only raw grief and necromantic power remain. His attacks are ferocious now."'
  }
};

// ── WEAPON DEFINITIONS ───────────────────────────────────────
const WEAPONS = {
  basic: [
    { name: 'Iron Shortsword',  price: 30,  damage: [6,10],  description: 'Standard blade' },
    { name: "Hunter's Bow",     price: 45,  damage: [5,11],  description: 'Ranged weapon' },
    { name: 'Bronze Warhammer', price: 70,  damage: [9,14],  description: 'Heavy, powerful' }
  ],
  advanced: [
    { name: 'Steel Sword',      price: 120, damage: [11,17], description: 'Well-forged blade' },
    { name: 'Enchanted Dagger', price: 150, damage: [7,15],  special: 'poison',  description: 'Poison on hit, 4 dmg/turn' },
    { name: 'Lightning Spear',  price: 200, damage: [13,19], special: 'shock',   description: 'Chance to stun' },
    { name: 'Shadow Blade',     price: 180, damage: [10,18], special: 'shadow',  description: 'Ignores 20% defense' }
  ],
  legendary: [
    { name: 'Soulbane Axe',     damage: [16,23], special: 'soulsteal', description: 'Steals 25% of damage as HP' },
    { name: 'Veilpiercer',      damage: [20,28], special: 'veilbane',  description: 'Legendary blade — extra damage to Veilborn' }
  ]
};

// ── GAME STATE ───────────────────────────────────────────────
class GameState {
  constructor() {
    this.playerName = '';
    this.currentLocation = 'ashenreach';
    this.health = 100; this.maxHealth = 100;
    this.magic  = 40;  this.maxMagic  = 40;
    this.strength = 6; this.dexterity = 5; this.intelligence = 8;
    this.gold = 30; this.level = 1; this.xp = 0; this.xpToNext = 100;
    this.weapon = { name: 'Rusty Dagger', damage: [3,6], description: 'A worn blade' };
    this.inventory = [];
    this.spells = ['Spark', 'Heal'];
    this.companions = [];         // array of companion IDs
    this.loreDiscovered = [];     // array of lore keys
    this.questFlags = {};
    this.flags = {};              // general story flags
    this.searchedLocations = [];
    this.saveSlot = null;
  }

  // Serialise for saving
  toJSON() {
    return {
      playerName: this.playerName, currentLocation: this.currentLocation,
      health: this.health, maxHealth: this.maxHealth,
      magic: this.magic, maxMagic: this.maxMagic,
      strength: this.strength, dexterity: this.dexterity, intelligence: this.intelligence,
      gold: this.gold, level: this.level, xp: this.xp, xpToNext: this.xpToNext,
      weapon: this.weapon, inventory: this.inventory, spells: this.spells,
      companions: this.companions, loreDiscovered: this.loreDiscovered,
      questFlags: this.questFlags, flags: this.flags,
      searchedLocations: this.searchedLocations,
      savedAt: new Date().toLocaleString()
    };
  }

  fromJSON(d) {
    Object.assign(this, d);
    return this;
  }

  hasLore(key) { return this.loreDiscovered.includes(key); }

  discoverLore(key) {
    if (this.hasLore(key)) return false;
    this.loreDiscovered.push(key);
    UI.renderLore();
    const l = LORE[key];
    if (l) {
      G.print(`<span style="color:var(--purple2)">📜 <em>Lore discovered: ${l.topic}</em></span>`, 'lore-entry');
    }
    return true;
  }

  hasCompanion(id) { return this.companions.includes(id); }

  addCompanion(id) {
    if (this.hasCompanion(id)) return false;
    this.companions.push(id);
    UI.renderCompanions();
    return true;
  }

  gainXP(amount) {
    this.xp += amount;
    G.print(`⭐ Gained ${amount} XP.`);
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.levelUp();
    }
    UI.updateStats();
  }

  levelUp() {
    this.level++;
    this.xpToNext = Math.floor(this.xpToNext * 1.4);
    const hpUp = 15 + Math.floor(Math.random() * 10);
    const mpUp = 8 + Math.floor(Math.random() * 6);
    this.maxHealth += hpUp; this.health = this.maxHealth;
    this.maxMagic  += mpUp; this.magic  = this.maxMagic;
    this.strength += 1 + Math.floor(Math.random() * 2);
    this.dexterity+= 1 + Math.floor(Math.random() * 2);
    this.intelligence += 1 + Math.floor(Math.random() * 2);
    G.print(`🎉 <strong>LEVEL UP! You are now Level ${this.level}!</strong> All stats increased.`, 'gold-glow');
    UI.updateStats();
  }
}

// ── UI HELPERS ───────────────────────────────────────────────
const UI = {
  updateStats() {
    const s = window.gameState;
    if (!s) return;

    // Bars
    const hpPct = Math.max(0, Math.min(100, (s.health / s.maxHealth) * 100));
    const mpPct = Math.max(0, Math.min(100, (s.magic  / s.maxMagic)  * 100));
    const xpPct = Math.max(0, Math.min(100, (s.xp     / s.xpToNext)  * 100));
    document.getElementById('health-bar').style.width = hpPct + '%';
    document.getElementById('magic-bar').style.width  = mpPct + '%';
    document.getElementById('xp-bar').style.width     = xpPct + '%';
    document.getElementById('health-text').textContent = `${Math.ceil(s.health)}/${s.maxHealth}`;
    document.getElementById('magic-text').textContent  = `${Math.ceil(s.magic)}/${s.maxMagic}`;
    document.getElementById('xp-text').textContent     = `${s.xp}/${s.xpToNext}`;

    // Attrs
    document.getElementById('strength-val').textContent    = s.strength;
    document.getElementById('dexterity-val').textContent   = s.dexterity;
    document.getElementById('intelligence-val').textContent = s.intelligence;
    document.getElementById('gold-val').textContent        = s.gold;
    document.getElementById('player-name-display').textContent = s.playerName || '—';
    document.getElementById('level-badge').textContent = `Lv ${s.level}`;

    // Topbar
    document.getElementById('tb-hp').textContent   = Math.ceil(s.health);
    document.getElementById('tb-gold').textContent = s.gold;

    // Weapon
    const w = s.weapon;
    document.getElementById('equipped-weapon').textContent = `⚔ ${w.name} (${w.damage[0]}–${w.damage[1]} dmg)${w.special ? ' · '+w.special : ''}`;

    this.renderInventory();
    this.renderSpells();
  },

  renderInventory() {
    const el = document.getElementById('inventory-items');
    const s = window.gameState;
    el.innerHTML = '';
    if (!s.inventory.length) { el.innerHTML = '<p class="empty-note">Empty</p>'; return; }
    s.inventory.forEach((item, i) => {
      const d = document.createElement('div');
      d.className = 'inventory-item';
      d.innerHTML = `${item.emoji || '📦'}<br>${item.name}`;
      d.title = item.description || '';
      d.onclick = () => G.useItem(i);
      el.appendChild(d);
    });
  },

  renderSpells() {
    const el = document.getElementById('spell-list');
    const s = window.gameState;
    el.innerHTML = '';
    s.spells.forEach(name => {
      const sp = SPELLS.find(x => x.name === name);
      if (!sp) return;
      const d = document.createElement('div');
      d.className = 'spell-item';
      d.innerHTML = `<span class="spell-name">🔮 ${sp.name}</span><span class="spell-cost">${sp.cost} MP</span>`;
      d.title = sp.description;
      el.appendChild(d);
    });
  },

  renderLore() {
    const el = document.getElementById('lore-list');
    const s = window.gameState;
    el.innerHTML = '';
    if (!s.loreDiscovered.length) { el.innerHTML = '<p class="empty-note">Speak to NPCs to learn lore</p>'; return; }
    s.loreDiscovered.forEach(key => {
      const l = LORE[key];
      if (!l) return;
      const d = document.createElement('div');
      d.className = 'lore-item';
      d.innerHTML = `<div class="lore-topic">${l.topic}</div>
        <div class="lore-text">${l.text}</div>
        ${l.hint ? `<div class="lore-hint">${l.hint}</div>` : ''}`;
      el.appendChild(d);
    });
  },

  renderCompanions() {
    const el = document.getElementById('companions-list');
    const s = window.gameState;
    el.innerHTML = '';
    if (!s.companions.length) { el.innerHTML = '<p class="empty-note">No companions yet</p>'; return; }
    s.companions.forEach(id => {
      const c = COMPANIONS[id];
      if (!c) return;
      const d = document.createElement('div');
      d.className = 'companion-item';
      d.innerHTML = `<span class="companion-icon">${c.icon}</span>
        <div><div class="companion-name">${c.name}</div><div class="companion-role">${c.role}</div></div>`;
      el.appendChild(d);
    });
  },

  renderQuests() {
    const el = document.getElementById('quest-list');
    const s = window.gameState;
    el.innerHTML = '';
    const quests = QUESTS.filter(q => s.questFlags[q.id] && s.questFlags[q.id] !== 'done');
    const done   = QUESTS.filter(q => s.questFlags[q.id] === 'done');
    const all = [...quests, ...done];
    if (!all.length) { el.innerHTML = '<p class="empty-note">No active quests</p>'; return; }
    all.forEach(q => {
      const isDone = s.questFlags[q.id] === 'done';
      const d = document.createElement('div');
      d.className = 'quest-item' + (isDone ? ' complete' : '');
      const stage = s.questFlags[q.id];
      const stageInfo = isDone ? 'Complete ✓' : (q.stages[stage] || '...');
      d.innerHTML = `<div class="quest-title">${q.title}</div><div class="quest-stage">${stageInfo}</div>`;
      el.appendChild(d);
    });
  },

  setLocation(name, desc) {
    document.getElementById('location-name').textContent = name;
    document.getElementById('location-desc').textContent = desc;
    document.getElementById('topbar-location').textContent = name;
  }
};

// ── QUEST DEFINITIONS ────────────────────────────────────────
const QUESTS = [
  {
    id: 'main1', title: '⚔ The Darkness Spreading',
    stages: { started: 'Speak to Mayor Eldric about the marsh' }
  },
  {
    id: 'main2', title: '🌿 Into the Obsidian Marsh',
    stages: { started: 'Defeat 3 marsh enemies', progress: 'Defeat enemies (0/3)', ready: 'Seek the Sanctum Gate' }
  },
  {
    id: 'main3', title: '🔮 The Sanctum Gate',
    stages: { started: 'Learn the Wraithcaller\'s secret — his daughter\'s name', unlocked: 'Speak Mira\'s name at the Gate' }
  },
  {
    id: 'main4', title: '☠ Face the Wraithcaller',
    stages: { started: 'Enter the inner sanctum', boss: 'Defeat the Veil Colossus', final: 'Confront the Wraithcaller' }
  },
  {
    id: 'side_harbinger', title: '💀 Bone Harbinger Bounty',
    stages: { started: 'Defeat the Bone Harbinger in the marsh' }
  },
  {
    id: 'side_sentinel', title: '⚙ The Iron Sentinel',
    stages: { started: 'Destroy the Iron Sentinel guarding the sanctum' }
  },
  {
    id: 'comp_selene', title: '✨ Selene\'s Rite',
    stages: { started: 'Bring Selene into the sanctum — let her attempt the Remembrance Rite' }
  },
  {
    id: 'comp_kael', title: '🏹 Kael\'s Missing Family',
    stages: { started: 'Search for signs of Kael\'s wife and son in the marsh', found: 'Report findings to Kael' }
  }
];

// ── SAVE/LOAD SYSTEM ─────────────────────────────────────────
const SaveSystem = {
  SLOTS: 3,
  KEY: 'shattered_veil_save_',

  get(slot) {
    try { return JSON.parse(localStorage.getItem(this.KEY + slot)); } catch { return null; }
  },
  set(slot, data) {
    localStorage.setItem(this.KEY + slot, JSON.stringify(data));
  },
  del(slot) {
    localStorage.removeItem(this.KEY + slot);
  },
  all() {
    return Array.from({length: this.SLOTS}, (_, i) => this.get(i + 1));
  }
};

// ── STARTUP UI ───────────────────────────────────────────────
const StartupUI = {
  deferredPrompt: null,
  activeSlot: null,

  init() {
    this.renderStars();
    this.renderRunes();
    this.renderSaveSlots();
    this.initTabs();
    this.detectPlatform();
    this.initInstallPrompt();
  },

  renderStars() {
    const canvas = document.getElementById('star-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; drawStars(); };
    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 200; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const r = Math.random() * 1.4 + 0.2;
        const a = Math.random() * 0.7 + 0.15;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fill();
      }
      // Nebula streaks
      for (let i = 0; i < 4; i++) {
        const grd = ctx.createRadialGradient(
          Math.random()*canvas.width, Math.random()*canvas.height, 0,
          Math.random()*canvas.width, Math.random()*canvas.height, 150
        );
        grd.addColorStop(0, 'rgba(123,79,212,0.06)');
        grd.addColorStop(1, 'rgba(123,79,212,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    window.addEventListener('resize', resize);
    resize();
  },

  renderRunes() {
    const container = document.getElementById('rune-particles');
    const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];
    for (let i = 0; i < 20; i++) {
      const span = document.createElement('span');
      span.className = 'rune';
      span.textContent = runes[Math.floor(Math.random() * runes.length)];
      span.style.left = Math.random() * 100 + 'vw';
      span.style.top = (Math.random() * 80 + 10) + 'vh';
      span.style.animationDelay = (Math.random() * 8) + 's';
      span.style.animationDuration = (5 + Math.random() * 6) + 's';
      container.appendChild(span);
    }
  },

  renderSaveSlots() {
    const el = document.getElementById('save-slots');
    el.innerHTML = '';
    SaveSystem.all().forEach((save, i) => {
      const slot = i + 1;
      const div = document.createElement('div');
      div.className = 'save-slot' + (save ? '' : ' empty');
      if (save) {
        div.innerHTML = `
          <div class="save-slot-num">${slot}</div>
          <div class="save-slot-info">
            <div class="save-slot-name">⚔ ${save.playerName}</div>
            <div class="save-slot-meta">Level ${save.level} · ${save.currentLocation === 'ashenreach' ? 'Ashenreach' : 'Obsidian Marsh'} · ${save.savedAt || ''}</div>
          </div>
          <span class="save-slot-action">Continue →</span>
          <button class="save-slot-del" title="Delete save" data-slot="${slot}">✕</button>
        `;
        div.querySelector('.save-slot-del').addEventListener('click', e => {
          e.stopPropagation();
          if (confirm(`Delete save slot ${slot}?`)) {
            SaveSystem.del(slot);
            this.renderSaveSlots();
          }
        });
        div.addEventListener('click', e => {
          if (e.target.classList.contains('save-slot-del')) return;
          this.loadGame(slot, save);
        });
      } else {
        div.innerHTML = `
          <div class="save-slot-num">${slot}</div>
          <div class="save-slot-info">
            <div class="save-slot-name" style="color:var(--text-muted)">Empty Slot</div>
            <div class="save-slot-meta">Start a new adventure</div>
          </div>
          <span class="save-slot-action">New →</span>
        `;
        div.addEventListener('click', () => this.showNewGameForm(slot));
      }
      el.appendChild(div);
    });
  },

  showNewGameForm(slot) {
    this.activeSlot = slot;
    const form = document.getElementById('new-game-form');
    form.style.display = 'block';
    const input = document.getElementById('player-name');
    input.value = '';
    input.focus();
    document.getElementById('begin-btn').onclick = () => this.startNewGame();
    input.onkeydown = e => { if (e.key === 'Enter') this.startNewGame(); };
  },

  startNewGame() {
    const name = document.getElementById('player-name').value.trim();
    if (!name) { document.getElementById('player-name').focus(); return; }
    const state = new GameState();
    state.playerName = name;
    state.saveSlot = this.activeSlot;
    window.gameState = state;
    this.transitionToGame();
  },

  loadGame(slot, data) {
    const state = new GameState();
    state.fromJSON(data);
    state.saveSlot = slot;
    window.gameState = state;
    this.transitionToGame();
  },

  transitionToGame() {
    const screen = document.getElementById('startup-screen');
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.classList.add('hidden');
      document.getElementById('game-container').classList.add('active');
      G.init();
    }, 600);
  },

  initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });
  },

  detectPlatform() {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    const isAndroid = /Android/.test(ua);
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    // Hide all first
    document.querySelectorAll('.install-platform').forEach(el => el.style.display = 'none');

    if (isInstalled) {
      document.getElementById('install-installed').style.display = 'block';
    } else if (isIOS) {
      document.getElementById('install-ios').style.display = 'block';
    } else if (isAndroid) {
      document.getElementById('install-android').style.display = 'block';
    } else {
      document.getElementById('install-desktop').style.display = 'block';
    }
    document.getElementById('install-fallback').style.display = 'none';
  },

  initInstallPrompt() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
      const btns = [
        document.getElementById('android-install-btn'),
        document.getElementById('desktop-install-btn')
      ];
      btns.forEach(btn => {
        if (!btn) return;
        btn.disabled = false;
        btn.addEventListener('click', async () => {
          if (!this.deferredPrompt) return;
          this.deferredPrompt.prompt();
          const { outcome } = await this.deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            this.deferredPrompt = null;
            btn.textContent = '✓ Installing…';
            btn.disabled = true;
          }
        });
      });
    });
  }
};

// ── GAME ENGINE (G) ──────────────────────────────────────────
const G = {
  // Core print / actions
  print(html, cls = '') {
    const el = document.getElementById('story-text');
    const p = document.createElement('div');
    p.className = 'story-paragraph' + (cls ? ' ' + cls : '');
    p.innerHTML = html;
    el.appendChild(p);
    setTimeout(() => { el.scrollTop = el.scrollHeight; }, 80);
  },

  showActions(actions) {
    const zone = document.getElementById('action-buttons');
    zone.innerHTML = '';
    actions.forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'action-btn' + (a.combat ? ' combat' : '');
      btn.innerHTML = a.label;
      btn.onclick = a.action;
      zone.appendChild(btn);
    });
  },

  modal(title, body, options, onClose) {
    const overlay = document.getElementById('modal-overlay');
    const inner   = document.getElementById('modal-inner');
    inner.innerHTML = `<div class="modal-title">${title}</div>
      <div class="modal-text">${body}</div>
      <div class="modal-options" id="modal-opts"></div>
      ${onClose ? '<button class="modal-close" id="modal-close-btn">Close</button>' : ''}`;
    const opts = inner.querySelector('#modal-opts');
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'modal-opt';
      btn.textContent = opt.label;
      btn.onclick = () => opt.action(btn);
      opts.appendChild(btn);
    });
    if (onClose) {
      inner.querySelector('#modal-close-btn').onclick = () => { this.closeModal(); onClose && onClose(); };
    }
    overlay.classList.remove('hidden');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
  },

  // Initialise game screen
  init() {
    const s = window.gameState;
    UI.updateStats();
    UI.renderLore();
    UI.renderCompanions();
    UI.renderQuests();
    UI.setLocation('Ashenreach', 'The city of eternal twilight');
    this.setupSidebars();
    this.setupServiceWorker();

    // Opening scene
    if (!s.questFlags.main1) {
      this.startingScene();
    } else {
      // Resuming game
      this.print(`<em>You return to your adventure, ${s.playerName}. The shadows of the Shattered Veil still loom over the land...</em>`);
      this.showMainMenu();
    }
  },

  setupSidebars() {
    const leftSB  = document.getElementById('sidebar-left');
    const rightSB = document.getElementById('sidebar-right');
    const overlay = document.getElementById('sidebar-overlay');
    const closeBoth = () => {
      leftSB.classList.remove('open'); rightSB.classList.remove('open');
      overlay.classList.remove('visible');
    };
    document.getElementById('left-toggle').onclick  = () => { leftSB.classList.toggle('open');  overlay.classList.toggle('visible'); rightSB.classList.remove('open'); };
    document.getElementById('right-toggle').onclick = () => { rightSB.classList.toggle('open'); overlay.classList.toggle('visible'); leftSB.classList.remove('open'); };
    document.getElementById('close-left').onclick   = closeBoth;
    document.getElementById('close-right').onclick  = closeBoth;
    overlay.onclick = closeBoth;
  },

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  },

  saveGame() {
    const s = window.gameState;
    SaveSystem.set(s.saveSlot, s.toJSON());
    this.print(`💾 Game saved to slot ${s.saveSlot}.`);
  },

  returnToMenu() {
    if (confirm('Return to main menu? Unsaved progress will be lost.')) {
      location.reload();
    }
  },

  goTo(loc) {
    const s = window.gameState;
    if (loc === 'ashenreach') {
      s.currentLocation = 'ashenreach';
      UI.setLocation('Ashenreach', 'The city of eternal twilight');
      this.print(`🏙 You return to Ashenreach, the city of eternal twilight.`);
      this.showMainMenu();
    } else if (loc === 'marsh') {
      this.travelToMarsh();
    }
  },

  useItem(index) {
    const s = window.gameState;
    const item = s.inventory[index];
    if (!item) return;
    if (item.type === 'potion' && item.effect === 'heal') {
      const amt = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
      s.health = Math.min(s.maxHealth, s.health + amt);
      this.print(`🧪 You drink the ${item.name} and restore <strong>${amt} HP</strong>!`, 'heal-flash');
      s.inventory.splice(index, 1);
      UI.updateStats();
    } else if (item.type === 'weapon') {
      const old = s.weapon;
      s.weapon = item;
      s.inventory.splice(index, 1);
      this.print(`⚔ You equip the ${item.name}. (Previous: ${old.name})`);
      UI.updateStats();
    } else if (item.type === 'scroll') {
      s.gainXP(item.xp);
      this.print(`📜 You read the ${item.name} and gain <strong>${item.xp} XP</strong>!`);
      s.inventory.splice(index, 1);
      UI.updateStats();
    }
  },

  // ── STORY SCENES ─────────────────────────────────────────
  startingScene() {
    const s = window.gameState;
    s.questFlags.main1 = 'started';
    UI.renderQuests();

    this.print(`
      <strong>Welcome to Shattered Veil, ${s.playerName}.</strong><br><br>
      You arrive in Ashenreach at dusk — though in this city, it is always dusk. The amber sun hangs frozen at the horizon, as it has for forty years, ever since the Veil was torn. Lanterns glow with pale fire on every corner. The cobblestones are wet from a rain that no one saw fall.<br><br>
      A man in a grey cloak approaches before you've even found an inn. His eyes are kind, but tired. He wears the silver chain of a city mayor.
    `, 'gold-glow');

    this.print(`
      <em>"You are the adventurer from the road? I'm Eldric, mayor of Ashenreach. I won't waste your time — our city is dying. The Obsidian Marsh grows. Its creatures reach our walls nightly. And at the marsh's heart... something ancient stirs."</em><br><br>
      He presses a rolled map into your hands. <em>"Come find me at the Town Hall when you're ready. But first — get to know the city. The people here have knowledge that could save your life in the marsh."</em>
    `);

    this.showMainMenu();
  },

  showMainMenu() {
    const s = window.gameState;
    this.showActions([
      { label: '🏛 Visit the Town Hall',     action: () => this.townHall() },
      { label: '🍺 Enter the Blackthorn Inn', action: () => this.inn() },
      { label: '⚒ Grimwald\'s Forge',         action: () => this.forge() },
      { label: '🧪 Moonveil Apothecary',      action: () => this.apothecary() },
      { label: '🔮 The Fortune Teller',       action: () => this.fortuneTeller() },
      { label: '🏪 Market Stalls',            action: () => this.market() },
      { label: '🌿 Journey to Obsidian Marsh',action: () => this.travelToMarsh() }
    ]);
  },

  // ── TOWN HALL ──────────────────────────────────────────────
  townHall() {
    const s = window.gameState;
    this.print(`
      🏛 The Town Hall is a grand building of pale stone and iron. Mayor Eldric stands at his desk, surrounded by maps of the Obsidian Marsh marked with red crosses — locations where travellers were last seen.<br><br>
      <em>"${s.playerName}. Good. There's a great deal I need to tell you. But more importantly — there is a great deal you must learn from the people of this city before venturing into that marsh."</em>
    `);
    this.showActions([
      { label: '📋 View the Quest Board',         action: () => this.questBoard() },
      { label: '🌿 Ask about the Marsh',           action: () => this.marshInfo() },
      { label: '🔮 Ask about the Wraithcaller',    action: () => this.wraithcallerInfo() },
      { label: '💰 Accept the Harbinger Bounty',   action: () => this.acceptHarbingerBounty() },
      { label: '⚙ Accept the Sentinel Contract',  action: () => this.acceptSentinelContract() },
      { label: '← Back to town',                  action: () => this.showMainMenu() }
    ]);
  },

  questBoard() {
    this.print(`
      📋 <strong>Quest Board — Ashenreach</strong><br><br>
      ☠ <strong>Bone Harbinger Bounty</strong> — A massive skeletal warrior patrols the marsh's edge. 50 gold, 90 XP.<br>
      ⚙ <strong>The Iron Sentinel</strong> — Destroy the golem guarding the inner sanctum. 70 gold, 110 XP.<br>
      ⚔ <strong>Defeat the Wraithcaller</strong> — End the corruption at its source. The legendary Veilpiercer awaits. 200 gold, 350 XP.<br><br>
      <em>Eldric's voice drops: "Before you go into that marsh — speak to Ravyn at the inn. And old Mirela the fortune teller. What they know may be the difference between life and death in there."</em>
    `);
    this.showActions([
      { label: '← Back', action: () => this.townHall() }
    ]);
  },

  marshInfo() {
    const s = window.gameState;
    this.print(`
      🌿 Eldric spreads a map across the table.<br><br>
      <em>"The Obsidian Marsh was once the Silverfen — a place of healing. Forty years ago, when the Veil shattered, the dark energy seeped into the ground and corrupted everything. The water turned black. The creatures died and rose again."</em><br><br>
      <em>"There are multiple tiers of danger in there. The outer paths have skeletons and spirits — manageable. Deeper in, you'll find Veilstalkers — they slip between shadow-folds. Light magic burns them. Then the bosses... a Bone Harbinger, an Iron Sentinel the necromancer built to guard his sanctum, and a Bonewright made of dozens of skeletons fused together."</em><br><br>
      <em>"At the very heart — behind the Sanctum Gate — is whatever used to be human that started all this."</em>
    `);
    s.discoverLore('marsh_history');
    this.showActions([
      { label: '← Back', action: () => this.townHall() }
    ]);
  },

  wraithcallerInfo() {
    const s = window.gameState;
    this.print(`
      🔮 Eldric sits down heavily.<br><br>
      <em>"The Wraithcaller. I have studied everything we know about him. He was once a scholar named Aldros — a brilliant man who taught at the Academy of Vael before it fell. He had a daughter he adored. When she died of the Greyveil plague, he... changed."</em><br><br>
      <em>"He spent years researching resurrection. And then one night he tore the Veil itself. Not out of malice — out of grief. The dead poured through. He couldn't control what he'd started."</em><br><br>
      <em>"I don't know if there's anything left of the man. But if there is — speak to Selene at the apothecary. She has an idea. A wild idea, perhaps. But an idea."</em>
    `);
    s.discoverLore('wraithcaller_origin');
    UI.renderQuests();
    this.showActions([
      { label: '← Back', action: () => this.townHall() }
    ]);
  },

  acceptHarbingerBounty() {
    const s = window.gameState;
    if (s.questFlags.side_harbinger) { this.print(`You've already accepted this contract.`); this.townHall(); return; }
    s.questFlags.side_harbinger = 'started';
    UI.renderQuests();
    this.print(`📋 You accept the Bone Harbinger bounty. Eldric adds: <em>"Captain Seris at the garrison knows something about how to fight those things. Find her."</em>`);
    this.showActions([{ label: '← Back', action: () => this.townHall() }]);
  },

  acceptSentinelContract() {
    const s = window.gameState;
    if (s.questFlags.side_sentinel) { this.print(`You've already accepted this contract.`); this.townHall(); return; }
    s.questFlags.side_sentinel = 'started';
    UI.renderQuests();
    this.print(`📋 You accept the Iron Sentinel contract. <em>"A merchant named Eryn knows its weakness. She's at the market. Find her before you go in."</em>`);
    this.showActions([{ label: '← Back', action: () => this.townHall() }]);
  },

  // ── INN ────────────────────────────────────────────────────
  inn() {
    const s = window.gameState;
    this.print(`
      🍺 The Blackthorn Inn is warm and smells of woodsmoke and stew. Laughter from a corner table, the clink of tankards, a bard playing something melancholy on a lute.<br><br>
      Behind the bar: <strong>Orin</strong>, the innkeeper — barrel-chested, grinning. <em>"First drink's on the house, stranger. Name's your own business."</em><br><br>
      In a shadowed corner: <strong>Ravyn the Storyteller</strong>, an elderly woman with silver braids and eyes the colour of old ice. She meets your gaze and nods slightly.<br><br>
      Propped against the bar: <strong>Lyra</strong>, a lean woman in dark leather, a scar crossing her left cheek. She's watching you with interest.
    `);
    this.showActions([
      { label: '🍺 Buy a drink — hear gossip (5 gold)', action: () => this.innDrink() },
      { label: '🎲 Play cards with Orin (10 gold)',     action: () => this.cardGame() },
      { label: '📖 Listen to Ravyn\'s stories',         action: () => this.ravynStory() },
      { label: '🗡 Talk to Lyra',                       action: () => this.meetLyra() },
      { label: '🛏 Rent a room — rest (15 gold)',        action: () => this.rentRoom() },
      { label: '← Back to town',                        action: () => this.showMainMenu() }
    ]);
  },

  innDrink() {
    const s = window.gameState;
    if (s.gold < 5) { this.print(`💰 You don't have enough gold for a drink (5 gold needed).`); this.inn(); return; }
    s.gold -= 5;
    UI.updateStats();
    this.print(`
      🍺 Orin slides you a dark ale without being asked. Smart man.<br><br>
      <em>"Adventurers. You all end up here sooner or later, heading for the marsh. Let me save you some time."</em><br><br>
      He lowers his voice. <em>"Ravyn knows the real story of the Wraithcaller. Not the rumour — the truth. Buy her a drink too if she'll tell it. Old Mirela the fortune teller knows about the Sanctum Gate — how to open it without your teeth getting knocked out. Captain Seris at the garrison knows how to fight those big bone things."</em><br><br>
      <em>"Oh, and Eryn at the market? If you're going near that iron golem, you absolutely need to talk to her. Paid for three funerals because people went in without asking first."</em>
    `);
    this.showActions([{ label: '← Back to inn', action: () => this.inn() }]);
  },

  cardGame() {
    const s = window.gameState;
    if (s.gold < 10) { this.print(`💰 You need at least 10 gold to play cards.`); this.inn(); return; }
    s.gold -= 10;
    const roll = Math.random();
    if (roll > 0.55) {
      const win = 15 + Math.floor(Math.random() * 20);
      s.gold += win;
      this.print(`🎲 The cards fall in your favour. You win <strong>${win} gold</strong>! Orin throws his head back and laughs.`, 'gold-glow');
    } else if (roll > 0.25) {
      s.gold += 10;
      this.print(`🎲 You break even — not a coin gained or lost. Orin nods respectfully.`);
    } else {
      this.print(`🎲 A bad hand. You lose your 10 gold. Orin pats your shoulder. <em>"Come back when you're feeling lucky."</em>`);
    }
    UI.updateStats();
    this.showActions([
      { label: '🎲 Play again',   action: () => this.cardGame() },
      { label: '← Back to inn',  action: () => this.inn() }
    ]);
  },

  ravynStory() {
    const s = window.gameState;
    this.print(`
      📖 Ravyn gestures to the chair across from her. Up close, her eyes are unsettling — like she's looking at something just behind your shoulder.<br><br>
      <em>"You want the Wraithcaller's story. Not the official version — the true one. I knew Aldros, once. Before he became... that."</em><br><br>
      She wraps both hands around her cup.<br><br>
      <em>"He had a daughter. Mira. She was everything to him — bright as sunlight, curious as a cat. She died at nine years old. The Greyveil plague took her in four days."</em><br><br>
      <em>"He came to me afterwards and said, 'Ravyn, I've found a way.' I didn't know what he meant until the night the sky cracked open and the dead began to walk. He had torn the Veil itself, trying to bring her back."</em><br><br>
      <em>"Mira."</em> She says the name softly. <em>"That was the girl's name. I tell you this because I think, somewhere inside that darkness, Aldros still loves her. And that love might be the only key that opens the door."</em>
    `);
    s.discoverLore('daughter_mira');
    UI.renderQuests();
    if (!s.questFlags.main3) {
      s.questFlags.main3 = 'started';
      UI.renderQuests();
    }
    this.showActions([
      { label: '🔮 Ask about the Sanctum Gate', action: () => this.ravynGateInfo() },
      { label: '← Back to inn',                 action: () => this.inn() }
    ]);
  },

  ravynGateInfo() {
    const s = window.gameState;
    this.print(`
      <em>"The Sanctum Gate,"</em> Ravyn says. <em>"Aldros sealed it with grief magic — the strongest kind. It won't yield to swords or spells. It will only open for someone who carries the weight of understanding what he lost."</em><br><br>
      <em>"When you stand before it — speak Mira's name. Not as a trick. As an acknowledgement of the grief that created all of this. Then it will open."</em>
    `);
    s.discoverLore('sanctum_gate');
    this.showActions([{ label: '← Back to inn', action: () => this.inn() }]);
  },

  meetLyra() {
    const s = window.gameState;
    if (s.hasCompanion('lyra')) {
      this.print(`Lyra raises her cup. <em>"Still with you, aren't I? Let's go find some trouble."</em>`);
      this.inn(); return;
    }
    this.print(`
      🗡 Lyra looks you up and down with the cool assessment of someone who has robbed better people than you.<br><br>
      <em>"You've got that look. Going into the marsh, yeah? I've been waiting for someone competent enough to go with."</em><br><br>
      She leans in. <em>"I won't pretend I'm noble. I'm here because there's something valuable in that sanctum beyond the Wraithcaller — old coins, artifacts, Veil crystals. I get a cut, you get someone who knows how to pick a lock and move in the dark."</em><br><br>
      <em>"But I should tell you something first. Something I've been carrying."</em>
    `);
    this.showActions([
      { label: '👂 Hear what she has to say', action: () => this.lyraConfession() },
      { label: '✅ Accept her as a companion', action: () => this.addCompanionScene('lyra') },
      { label: '← Not right now',             action: () => this.inn() }
    ]);
  },

  lyraConfession() {
    const s = window.gameState;
    this.print(`
      Lyra stares at her drink.<br><br>
      <em>"Three years ago I lifted a parcel from a courier passing through Ashenreach's east gate. Sealed box, felt heavy. I thought it was jewellery or spellbooks."</em><br><br>
      <em>"It was a Veil fragment. A shard of the original barrier Aldros tore. I didn't know what it was — but I held it for two weeks, and during that time... I think whatever ward was hiding this city from the marsh creatures weakened. That was when the first undead reached the walls."</em><br><br>
      She finally looks up. <em>"I may have made all of this worse. I'll understand if that changes your answer."</em>
    `);
    s.discoverLore('lyra_secret');
    this.showActions([
      { label: '✅ Accept her — what\'s done is done', action: () => this.addCompanionScene('lyra') },
      { label: '← Decline for now',                   action: () => this.inn() }
    ]);
  },

  // ── FORGE ──────────────────────────────────────────────────
  forge() {
    const s = window.gameState;
    this.print(`
      ⚒ Grimwald's Forge is heat and noise and the smell of iron. Grimwald himself is a man built like a gate — wide shoulders, hands the size of shields, a tattoo on his neck that reads <em>Ironhold Vanguard</em>.<br><br>
      <em>"${s.playerName}. Heard you might be heading into the marsh. Come to get equipped? Smart. Those that go in with a rusty dagger don't come back."</em>
    `);
    this.showActions([
      { label: '🛒 Basic weapons',           action: () => this.shopWeapons('basic') },
      { label: '✨ Advanced weapons',         action: () => this.shopWeapons('advanced') },
      { label: '💪 Train Strength (30 gold)', action: () => this.trainStr() },
      { label: '💬 Ask about enemies',        action: () => this.grimwaldEnemyInfo() },
      { label: '🛡 Speak with Torvin',        action: () => this.meetTorvin() },
      { label: '← Back to town',             action: () => this.showMainMenu() }
    ]);
  },

  grimwaldEnemyInfo() {
    const s = window.gameState;
    this.print(`
      Grimwald sets down his hammer.<br><br>
      <em>"Veilstalkers. People keep underestimating them. They're not like skeletons — you can't just hit them. They slip between layers of the Veil itself. But they're made of shadow, and shadow burns. Light magic — your Spark, Fireball, anything bright — they take a lot more damage from that."</em><br><br>
      He taps a scarred knuckle on the anvil. <em>"Iron Sentinel — that thing I won't fight without poison on my blade. The armour is necromantically reinforced. Magic barely scratches it. But the joints corrode. Poison gets in and keeps working."</em>
    `);
    s.discoverLore('veilstalker');
    s.discoverLore('iron_sentinel');
    this.showActions([{ label: '← Back to forge', action: () => this.forge() }]);
  },

  trainStr() {
    const s = window.gameState;
    if (s.gold < 30) { this.print(`💰 Training costs 30 gold.`); this.forge(); return; }
    s.gold -= 30; s.strength += 2;
    UI.updateStats();
    this.print(`💪 Grimwald drills you for hours. <strong>Strength +2</strong>. Your arms ache but you feel stronger.`);
    this.showActions([{ label: '← Back to forge', action: () => this.forge() }]);
  },

  shopWeapons(tier) {
    const weapons = WEAPONS[tier];
    const actions = weapons.map(w => ({
      label: `${w.name} — ${w.damage[0]}–${w.damage[1]} dmg${w.special ? ' · '+w.special : ''} · ${w.price}g`,
      action: () => this.buyWeapon(w, tier)
    }));
    actions.push({ label: '← Back to forge', action: () => this.forge() });
    this.showActions(actions);
  },

  buyWeapon(w, tier) {
    const s = window.gameState;
    if (s.gold < w.price) { this.print(`💰 You need ${w.price} gold for the ${w.name}.`); this.shopWeapons(tier); return; }
    s.gold -= w.price;
    s.inventory.push({ ...w, type: 'weapon', emoji: '⚔' });
    this.print(`⚔ You purchase the <strong>${w.name}</strong>. Check your inventory to equip it.`, 'gold-glow');
    UI.updateStats();
    this.showActions([
      { label: '🛒 Keep shopping', action: () => this.shopWeapons(tier) },
      { label: '← Back to forge', action: () => this.forge() }
    ]);
  },

  // ── APOTHECARY ─────────────────────────────────────────────
  apothecary() {
    const s = window.gameState;
    const seleneJoined = s.hasCompanion('selene');
    this.print(`
      🧪 The Moonveil Apothecary is a labyrinth of shelves, every surface crowded with flasks and dried herbs and small bones hanging from the ceiling. A cat with mismatched eyes watches you from a high shelf.<br><br>
      <strong>Selene</strong> appears from behind a curtain of hanging lavender. Her silver-streaked hair is pinned back, her hands stained with ink and herb-green. She looks at you with absolute calm.<br><br>
      <em>"I've been expecting someone like you. The marsh's corruption is intensifying — which means someone is going to face it soon. I hope that someone is prepared."</em>
      ${seleneJoined ? '<br><br><em>She smiles warmly. "And I\'m glad I\'ll be there with you."</em>' : ''}
    `);
    const actions = [
      { label: '🧴 Buy healing potions',         action: () => this.buyPotions() },
      { label: '📜 Purchase spells',              action: () => this.buySpells() },
      { label: '🧠 Train Intelligence (30 gold)', action: () => this.trainInt() },
      { label: '💬 Ask about the Wraithcaller',  action: () => this.seleneWraithcaller() },
    ];
    if (!seleneJoined) {
      actions.push({ label: '✅ Ask Selene to join you', action: () => this.addCompanionScene('selene') });
    }
    actions.push({ label: '← Back to town', action: () => this.showMainMenu() });
    this.showActions(actions);
  },

  seleneWraithcaller() {
    const s = window.gameState;
    this.print(`
      Selene sets down a mortar and pestle.<br><br>
      <em>"I've spent thirty years studying the Veil. And here is what I believe: Aldros is not gone. He is buried under decades of grief and corrupted power, but the man still exists in there."</em><br><br>
      <em>"There is an ancient ritual — the Remembrance Rite. It creates a moment of forced clarity, a gap in the corrupted consciousness. During that gap, the person being held inside can make a choice."</em><br><br>
      <em>"I can perform it. But I need to be there when you face him. And — this is important — Soul Drain magic resonates with the Veil. It bypasses his defences more effectively than anything else. In his second form, even more so."</em><br><br>
      <em>"Also, if Ravyn has told you the name of his daughter... it matters. Use it."</em>
    `);
    s.discoverLore('wraithcaller_weakness');
    s.discoverLore('selene_magic');
    if (!s.questFlags.comp_selene) {
      s.questFlags.comp_selene = 'started';
      UI.renderQuests();
    }
    this.showActions([{ label: '← Back', action: () => this.apothecary() }]);
  },

  buyPotions() {
    const potions = [
      { name: 'Minor Healing Potion', price: 20, type: 'potion', effect: 'heal', min: 20, max: 35, emoji: '🧴', description: 'Restore 20–35 HP' },
      { name: 'Greater Healing Potion',price:45, type: 'potion', effect: 'heal', min: 40, max: 60, emoji: '💊', description: 'Restore 40–60 HP' },
      { name: 'Poison Flask',         price: 35, type: 'weapon_buff', special: 'poison', emoji: '🧪', description: 'One-use poison coating for your weapon' }
    ];
    const actions = potions.map(p => ({
      label: `${p.emoji} ${p.name} — ${p.price}g`,
      action: () => {
        const s = window.gameState;
        if (s.gold < p.price) { this.print(`💰 Not enough gold.`); return; }
        s.gold -= p.price;
        s.inventory.push(p);
        this.print(`${p.emoji} Purchased ${p.name}.`);
        UI.updateStats();
      }
    }));
    actions.push({ label: '← Back to apothecary', action: () => this.apothecary() });
    this.showActions(actions);
  },

  buySpells() {
    const s = window.gameState;
    const spellShop = [
      { name: 'Veil Sight',    price: 80,  description: 'Reveals weaknesses — triple damage next attack on Bone Harbingers' },
      { name: 'Soul Drain',    price: 120, description: '2x damage vs Wraithcaller. 2.5x in phase 2' },
      { name: 'Venom Fang',    price: 90,  description: 'Poison attack — extra damage per turn vs Iron Sentinel' },
      { name: 'Lightning Bolt',price: 70,  description: 'Powerful electrical attack' },
      { name: 'Greater Heal',  price: 80,  description: 'Restore 35–55 HP' },
      { name: 'Teleport',      price: 100, description: 'Return to Ashenreach instantly from the marsh' }
    ];
    const available = spellShop.filter(sp => !s.spells.includes(sp.name));
    if (!available.length) { this.print(`You already know all available spells.`); this.apothecary(); return; }
    const actions = available.map(sp => ({
      label: `🔮 ${sp.name} — ${sp.price}g`,
      action: () => {
        if (s.gold < sp.price) { this.print(`💰 Not enough gold.`); return; }
        s.gold -= sp.price; s.spells.push(sp.name);
        this.print(`🔮 You learn <strong>${sp.name}</strong>!`, 'gold-glow');
        UI.updateStats();
      }
    }));
    actions.push({ label: '← Back to apothecary', action: () => this.apothecary() });
    this.showActions(actions);
  },

  trainInt() {
    const s = window.gameState;
    if (s.gold < 30) { this.print(`💰 Training costs 30 gold.`); this.apothecary(); return; }
    s.gold -= 30; s.intelligence += 2;
    UI.updateStats();
    this.print(`🧠 Selene leads you through hours of mental exercises. <strong>Intelligence +2</strong>.`);
    this.showActions([{ label: '← Back', action: () => this.apothecary() }]);
  },

  // ── FORTUNE TELLER ─────────────────────────────────────────
  fortuneTeller() {
    const s = window.gameState;
    this.print(`
      🔮 At the end of a narrow alley, past a curtain of hanging bones and wind-chimes, you find old <strong>Mirela's</strong> tent. Inside it smells of smoke and something older — like turned earth and old library.<br><br>
      Mirela is ancient. Her hands are the colour of dark wood, covered in ink symbols you don't recognise. She doesn't look up when you enter.<br><br>
      <em>"I wondered when you'd come. Sit."</em>
    `);
    this.showActions([
      { label: '🃏 Have your fortune told (10 gold)',   action: () => this.getFortuneRead() },
      { label: '🚪 Ask about the Sanctum Gate',         action: () => this.mirelaGate() },
      { label: '☠ Ask about the Bonewright',           action: () => this.mirelaBonewright() },
      { label: '💀 Ask about the Veil Colossus',       action: () => this.mirelaColossus() },
      { label: '← Back to town',                       action: () => this.showMainMenu() }
    ]);
  },

  getFortuneRead() {
    const s = window.gameState;
    if (s.gold < 10) { this.print(`💰 Mirela requires 10 gold.`); this.fortuneTeller(); return; }
    s.gold -= 10; UI.updateStats();
    const fortunes = [
      `<em>"I see a locked door. You already carry the key, though you don't know it yet."</em>`,
      `<em>"A companion of yours hides a secret wound. They will reveal it when they trust you."</em>`,
      `<em>"The enemy you face is not what it seems. It was made by love, not hate."</em>`,
      `<em>"There is gold buried beneath a twisted oak in the marsh's eastern reach."</em>`,
      `<em>"You will face a choice at the end. The answer that feels wrong may be the right one."</em>`
    ];
    this.print(`🔮 Mirela takes your hand and closes her eyes for a long moment.<br><br>${fortunes[Math.floor(Math.random() * fortunes.length)]}`);
    this.showActions([{ label: '← Back', action: () => this.fortuneTeller() }]);
  },

  mirelaGate() {
    const s = window.gameState;
    this.print(`
      Mirela finally looks up. Her eyes are filmed white — she's blind, yet you feel she sees you clearly.<br><br>
      <em>"The Sanctum Gate. You want to know how to open it."</em><br><br>
      <em>"It will not open for strength. It will not open for cunning. It opens only for those who carry the weight of another's grief — who understand what was lost and do not judge it."</em><br><br>
      <em>"When you stand before the Gate, speak the name of the one the Wraithcaller lost. Say it as you would say the name of someone you mourn yourself. That is the only key."</em>
    `);
    s.discoverLore('sanctum_gate');
    this.showActions([{ label: '← Back', action: () => this.fortuneTeller() }]);
  },

  mirelaBonewright() {
    const s = window.gameState;
    this.print(`
      <em>"The Bonewright,"</em> Mirela says softly. <em>"It is held together not by bones and sinew but by concentration — by the Wraithcaller's focused will. Break that concentration and it falls apart."</em><br><br>
      <em>"You do this by being relentless. Do not give it time to rebuild itself. Strike again, and again, and again. At half its strength it will collapse and reassemble into something faster and more desperate — that is when you redouble your attacks."</em>
    `);
    s.discoverLore('bonewright');
    this.showActions([{ label: '← Back', action: () => this.fortuneTeller() }]);
  },

  mirelaColossus() {
    const s = window.gameState;
    this.print(`
      Mirela is still for a long moment.<br><br>
      <em>"The Veil Colossus. Made from stolen souls, each one still screaming inside it. I have not spoken of this to many."</em><br><br>
      <em>"It is vulnerable to weapons that carry Veilbane or Soulsteal enchantments — they resonate with the stolen souls and damage the binding. Kael the ranger found a note about this, I believe. Or perhaps the ranger's note was destroyed."</em><br><br>
      <em>"If you have such a weapon, use it. If you do not... fight carefully and do not let it rest."</em>
    `);
    s.discoverLore('veil_colossus');
    this.showActions([{ label: '← Back', action: () => this.fortuneTeller() }]);
  },

  // ── MARKET ─────────────────────────────────────────────────
  market() {
    const s = window.gameState;
    this.print(`
      🏪 The market is a row of stalls under canvas awnings. Merchants sell everything from common provisions to stranger things — bottled moonlight, teeth of creatures you don't recognise, maps to places that may or may not exist.<br><br>
      You spot <strong>Eryn</strong>, a small precise woman with a merchant's ledger and the eyes of someone who has catalogued every mistake she's ever made.<br><br>
      Nearby, leaning against a post, is <strong>Captain Seris</strong> — the garrison commander, her arm in a sling.
    `);
    this.showActions([
      { label: '💬 Speak to Eryn (Iron Sentinel info)', action: () => this.erynInfo() },
      { label: '💬 Speak to Captain Seris (Bone Harbinger)', action: () => this.serisInfo() },
      { label: '🛒 Browse wares',                       action: () => this.marketShop() },
      { label: '← Back to town',                       action: () => this.showMainMenu() }
    ]);
  },

  erynInfo() {
    const s = window.gameState;
    this.print(`
      Eryn puts down her ledger without being asked.<br><br>
      <em>"You're going into the sanctum. You'll meet the Iron Sentinel."</em> It isn't a question.<br><br>
      <em>"I've traded notes with four adventurers who went in. Two came back. They all said the same thing: magic barely touches it. The Wraithcaller built that golem to resist spell damage — forty percent reduction, roughly."</em><br><br>
      <em>"But the joints. Aldros built it from salvaged iron and he didn't account for corrosion. Poison gets into the mechanisms and deals damage every turn. A Venom Fang spell, Enchanted Dagger, Poison Flask — any of those. The golem can't heal, so the poison keeps working."</em>
    `);
    s.discoverLore('iron_sentinel');
    this.showActions([{ label: '← Back to market', action: () => this.market() }]);
  },

  serisInfo() {
    const s = window.gameState;
    this.print(`
      Captain Seris gestures at her sling with her good arm.<br><br>
      <em>"Bone Harbinger did this. Twelve feet of animated skeleton with a glowing core shard in its ribcage."</em><br><br>
      <em>"The normal approach — hack at it — takes forever and it regenerates. But inside that ribcage there's a shard of imprisoned soul-energy. If you can use a Veil Sight spell — the kind that reveals magical auras — you can see it. And if you land your next strike on that shard, it shatters. Three times the normal damage."</em><br><br>
      <em>"Cast Veil Sight. Then hit it hard. That's the only smart way to fight that thing."</em>
    `);
    s.discoverLore('bone_harbinger');
    this.showActions([{ label: '← Back to market', action: () => this.market() }]);
  },

  marketShop() {
    const s = window.gameState;
    const items = [
      { name: 'Trail Rations', price: 10, type: 'potion', effect: 'heal', min: 10, max: 18, emoji: '🍖', description: 'Basic food that restores some HP' },
      { name: 'Torch Bundle',  price: 8,  type: 'misc', emoji: '🔦', description: 'Light for dark places' },
      { name: 'Rope & Grapple',price: 15, type: 'misc', emoji: '🪢', description: 'Useful in tight spots' },
      { name: 'Antidote',      price: 25, type: 'potion', effect: 'cure', min: 0, max: 0, emoji: '💚', description: 'Cures poison' }
    ];
    const actions = items.map(item => ({
      label: `${item.emoji} ${item.name} — ${item.price}g`,
      action: () => {
        if (s.gold < item.price) { this.print(`💰 Not enough gold.`); return; }
        s.gold -= item.price; s.inventory.push(item);
        this.print(`${item.emoji} Purchased ${item.name}.`); UI.updateStats();
      }
    }));
    actions.push({ label: '← Back to market', action: () => this.market() });
    this.showActions(actions);
  },

  // ── KAEL ENCOUNTER ─────────────────────────────────────────
  meetKael() {
    const s = window.gameState;
    if (s.hasCompanion('kael')) {
      this.print(`🏹 Kael readies his bow. <em>"Which way are we going?"</em>`);
      this.marshActions();
      return;
    }
    this.print(`
      🏹 At the edge of the marsh, crouched by a twisted oak with a weathered tracker's kit spread before him, is a man you almost didn't see. He's very still — the kind of still that comes from years of not wanting to startle things that bite.<br><br>
      He looks up. His face is hard-worn but his eyes are careful.<br><br>
      <em>"You're going into the marsh. I've been watching the paths — there's a Bone Harbinger route that doesn't pass the Veilstalker territory, if you know what you're doing."</em><br><br>
      He stands. <em>"Name's Kael. My wife and son went missing in there three winters ago. I'm going in whether you like it or not. Easier together."</em>
    `);
    s.discoverLore('kael_family');
    if (!s.questFlags.comp_kael) { s.questFlags.comp_kael = 'started'; UI.renderQuests(); }
    this.showActions([
      { label: '✅ Accept Kael as companion', action: () => this.addCompanionScene('kael') },
      { label: '← Continue alone',           action: () => this.marshActions() }
    ]);
  },

  addCompanionScene(id) {
    const s = window.gameState;
    const c = COMPANIONS[id];
    s.addCompanion(id);
    this.print(`
      <strong>${c.icon} ${c.name} joins your party!</strong><br>
      <em>${c.desc}</em>
    `, 'gold-glow');
    if (id === 'kael') { this.marshActions(); return; }
    if (id === 'torvin') { this.forge(); return; }
    this.showMainMenu();
  },

  // ── TORVIN ENCOUNTER ───────────────────────────────────────
  meetTorvin() {
    const s = window.gameState;
    if (s.hasCompanion('torvin')) { this.print(`🛡 Torvin nods. "Ready."`)  ; this.forge(); return; }
    this.print(`
      🛡 You notice a man sitting alone at Grimwald's secondary workbench, sharpening a sword with mechanical patience. His arms are criss-crossed with old scars. The tattoo on his wrist reads <em>Ironhold Vanguard</em>.<br><br>
      He speaks without looking up. <em>"You're heading into the marsh. I can tell. I've watched three others do the same walk this week. Two didn't come back."</em><br><br>
      <em>"I'm Torvin. I have a debt I need to pay in that place — not in gold. I swore an oath to protect a convoy seven years ago. The Wraithcaller's servants took it. I was the only survivor."</em><br><br>
      <em>"Let me come with you."</em>
    `);
    s.discoverLore('torvin_oath');
    this.showActions([
      { label: '✅ Accept Torvin as companion', action: () => this.addCompanionScene('torvin') },
      { label: '← Not now',                    action: () => this.forge() }
    ]);
  },

  // ── TRAVEL TO MARSH ────────────────────────────────────────
  travelToMarsh() {
    const s = window.gameState;
    s.currentLocation = 'obsidian_marsh';
    UI.setLocation('Obsidian Marsh', 'Ancient twisted bog — evil stirs within');

    if (!s.flags.marsh_entered) {
      s.flags.marsh_entered = true;
      if (!s.questFlags.main2) {
        s.questFlags.main2 = 'started';
        s.flags.marshKills = 0;
        UI.renderQuests();
      }
      this.print(`
        🌿 The road to the Obsidian Marsh ends where the cobblestones simply stop, as if the city refused to extend any further. Beyond the last lamppost, the path becomes mud, then dark water, then nothing you can classify as either.<br><br>
        The air is cold and smells of iron and old rain. Gnarled trees rise from black water, their bark stripped white, branches reaching like arms mid-gesture. The marsh doesn't just look dead — it looks like something that watched everything die.<br><br>
        In the far distance, half-obscured by mist, you can see the crumbling spires of an ancient temple. The Wraithcaller's sanctum.<br><br>
        Between you and it — the marsh's many creatures, and three guardian bosses that Aldros placed as insurance.
      `, 'gold-glow');
    }

    this.meetKael();
  },

  marshActions() {
    const s = window.gameState;
    const actions = [
      { label: '⚔ Search for enemies',        action: () => this.searchEnemies() },
      { label: '🔍 Search for treasure',       action: () => this.searchTreasure() },
    ];
    if (s.level >= 2 || (s.flags.marshKills || 0) >= 3) {
      actions.push({ label: '💀 Fight the Bone Harbinger', action: () => this.fightBoss('bone_harbinger') });
    }
    if (s.flags.harbinger_dead) {
      actions.push({ label: '🚪 Approach the Sanctum Gate', action: () => this.sanctumGate() });
    }
    actions.push({ label: '🏙 Return to Ashenreach', action: () => this.goTo('ashenreach') });
    this.showActions(actions);
  },

  searchEnemies() {
    const s = window.gameState;
    const pool = ['marsh_skeleton', 'corrupted_spirit', 'bog_wraith', 'bone_archer'];
    // Add veilstalker if player has been here a while
    if ((s.flags.marshKills || 0) >= 2) pool.push('veilstalker');
    const key = pool[Math.floor(Math.random() * pool.length)];
    const enemy = { ...ENEMIES[key] };
    this.startCombat(enemy, () => {
      s.flags.marshKills = (s.flags.marshKills || 0) + 1;
      if (s.questFlags.main2 === 'started' && s.flags.marshKills >= 3) {
        s.questFlags.main2 = 'ready';
        UI.renderQuests();
        this.print(`📋 You've proven yourself in the marsh. The path to the Bone Harbinger is now open.`);
      }
      this.marshActions();
    });
  },

  searchTreasure() {
    const s = window.gameState;
    const key = `t_${Math.floor(Math.random() * 8)}`;
    if (s.searchedLocations.includes(key)) {
      this.print(`🔍 You search this stretch of marsh but find nothing more — you've already taken what was hidden here.`);
      this.marshActions(); return;
    }
    s.searchedLocations.push(key);
    const pool = [
      { type: 'gold', amount: 20 + Math.floor(Math.random() * 30) },
      { type: 'item', item: { name: 'Mystic Herb', type: 'potion', effect: 'heal', min: 20, max: 35, emoji: '🌿', description: 'Rare marsh herb with healing properties' }},
      { type: 'xp',   amount: 40 },
      { type: 'lore', key: 'marsh_history' }
    ];
    const find = pool[Math.floor(Math.random() * pool.length)];
    if (find.type === 'gold') {
      s.gold += find.amount;
      this.print(`💰 You find ${find.amount} gold hidden under a mossy stone.`);
      UI.updateStats();
    } else if (find.type === 'item') {
      s.inventory.push(find.item);
      this.print(`🌿 You find a ${find.item.name} growing in a shaft of pale light.`);
      UI.updateStats();
    } else if (find.type === 'xp') {
      this.print(`📜 You find a water-damaged journal with tactical notes about the marsh's creatures.`);
      s.gainXP(find.amount);
    } else if (find.type === 'lore') {
      s.discoverLore(find.key);
    }
    this.marshActions();
  },

  // ── BOSS FIGHTS ────────────────────────────────────────────
  fightBoss(bossKey) {
    const s = window.gameState;
    if (s.flags[bossKey + '_dead']) {
      this.print(`☑ You have already defeated the ${ENEMIES[bossKey].name}.`);
      this.marshActions(); return;
    }
    const boss = { ...ENEMIES[bossKey] };
    this.print(boss.intro || `⚔ The ${boss.name} approaches!`, 'gold-glow');
    this.startCombat(boss, () => {
      s.flags[bossKey + '_dead'] = true;
      if (bossKey === 'bone_harbinger') {
        s.questFlags.side_harbinger = 'done';
        s.gold += 50;
        this.print(`💰 You claim the Bone Harbinger bounty reward: <strong>50 gold</strong>!`, 'gold-glow');
        this.print(`🌿 With the Harbinger defeated, a clearer path opens toward the Sanctum Gate.`);
        s.flags.harbinger_dead = true;
        s.questFlags.main2 = 'ready';
        UI.renderQuests();
      } else if (bossKey === 'iron_sentinel') {
        s.questFlags.side_sentinel = 'done';
        s.gold += 70;
        this.print(`💰 Sentinel contract fulfilled: <strong>70 gold</strong>!`, 'gold-glow');
      } else if (bossKey === 'bonewright') {
        // nothing special
      } else if (bossKey === 'veil_colossus') {
        s.questFlags.main4 = 'final';
        UI.renderQuests();
        this.print(`🌑 The Colossus collapses, and a corridor of raw energy opens behind it — leading directly to the Wraithcaller's inner sanctum.`);
      }
      UI.renderQuests();
    });
  },

  // ── SANCTUM GATE QUIZ ───────────────────────────────────────
  sanctumGate() {
    const s = window.gameState;
    if (s.flags.gate_passed) {
      this.sanctumInterior();
      return;
    }
    if (s.questFlags.main3 !== 'started' && !s.hasLore('daughter_mira') && !s.hasLore('sanctum_gate')) {
      this.print(`
        🚪 The Sanctum Gate rises before you — carved black stone, two storeys high, with no visible handle or lock. Grief-runes spiral across its surface.<br><br>
        You push against it. Pull. Speak a command word. Nothing.<br><br>
        <em>You sense that this requires something other than force. You need to speak to people in Ashenreach — find out what the Wraithcaller lost. The gate demands understanding, not strength.</em>
      `);
      this.showActions([
        { label: '🏙 Return to Ashenreach to gather information', action: () => this.goTo('ashenreach') },
        { label: '← Back to marsh', action: () => this.marshActions() }
      ]);
      return;
    }

    this.print(`
      🚪 The Sanctum Gate rises before you. Black stone. Grief-runes spiralling across every surface. No handle, no keyhole, no mechanism you can see.<br><br>
      But you know something now. You know what was lost here. You know who it was.<br><br>
      The runes begin to pulse faintly — as if the gate is listening.
    `, 'gold-glow');

    s.questFlags.main3 = 'unlocked';
    UI.renderQuests();

    const hasKnowledge = s.hasLore('daughter_mira') || s.hasLore('sanctum_gate');

    this.modal(
      '🔮 The Sanctum Gate',
      `The gate's runes glow with a cold light. A voice — not quite sound, more like a feeling — enters your mind:<br><br><em>"Who did he lose? What was her name?"</em><br><br>You must answer correctly to pass. The answer lies in the stories people have told you.`,
      [
        {
          label: 'Elara',
          action: (btn) => {
            btn.classList.add('wrong');
            setTimeout(() => {
              this.closeModal();
              this.print(`The gate flares with painful light and hurls you back a step. Wrong name.`);
              this.showActions([
                { label: '🏙 Return to Ashenreach', action: () => this.goTo('ashenreach') },
                { label: '← Back to marsh', action: () => this.marshActions() }
              ]);
            }, 700);
          }
        },
        {
          label: 'Mira',
          action: (btn) => {
            btn.classList.add('correct');
            setTimeout(() => {
              this.closeModal();
              s.flags.gate_passed = true;
              s.questFlags.main3 = 'done';
              s.questFlags.main4 = 'started';
              UI.renderQuests();
              this.print(`
                🔮 <strong>"Mira."</strong><br><br>
                The name leaves your lips quietly — as acknowledgment, as grief, not as triumph. The runes blaze gold. The gate trembles. And then, slowly, it opens inward.<br><br>
                A passage of black stone stretches before you, torches burning with cold blue fire. The air inside is dense with magic, almost visible. Somewhere ahead — the sounds of something enormous moving.
              `, 'gold-glow');
              this.sanctumInterior();
            }, 800);
          }
        },
        {
          label: 'Serafine',
          action: (btn) => {
            btn.classList.add('wrong');
            setTimeout(() => {
              this.closeModal();
              this.print(`Wrong. The gate doesn't react. Somewhere in the distance, something shifts.`);
              this.showActions([
                { label: '🏙 Return to Ashenreach', action: () => this.goTo('ashenreach') },
                { label: '← Back to marsh', action: () => this.marshActions() }
              ]);
            }, 700);
          }
        },
        {
          label: 'Lyanna',
          action: (btn) => {
            btn.classList.add('wrong');
            setTimeout(() => {
              this.closeModal();
              this.print(`The gate remains sealed. Not that name.`);
              this.showActions([
                { label: '🏙 Return to Ashenreach', action: () => this.goTo('ashenreach') },
                { label: '← Back to marsh', action: () => this.marshActions() }
              ]);
            }, 700);
          }
        }
      ]
    );
  },

  // ── SANCTUM INTERIOR ───────────────────────────────────────
  sanctumInterior() {
    const s = window.gameState;
    UI.setLocation('The Sanctum', 'Aldros\'s inner sanctum — cold and ancient');

    if (!s.flags.bonewright_dead && !s.flags.bonewright_intro_shown) {
      s.flags.bonewright_intro_shown = true;
      this.print(`
        The sanctum's first chamber is vast, its ceiling lost in darkness. At its centre, a mass of bones shifts and rises — assembling itself as you watch. Dozens of skeletons fusing into one enormous form.<br><br>
        The Bonewright. Aldros built it to think like him — to fight without mercy, to reassemble from anything short of complete destruction.
      `);
      this.showActions([
        { label: '⚔ Fight the Bonewright',  action: () => this.fightBoss('bonewright') },
        { label: '← Back to the gate',      action: () => this.marshActions() }
      ]);
      return;
    }

    if (!s.flags.iron_sentinel_dead && s.flags.bonewright_dead) {
      if (!s.flags.sentinel_intro_shown) {
        s.flags.sentinel_intro_shown = true;
        this.print(`
          Past the Bonewright's remains — still twitching — a second passage leads deeper. This chamber is narrower, and in it stands the Iron Sentinel. Seven feet of reinforced iron, necromantic runes burned into every plate.<br><br>
          It turns towards you with grinding mechanical slowness. It has no face — just a brass mask with empty holes where eyes should be.
        `);
      }
      this.showActions([
        { label: '⚔ Fight the Iron Sentinel', action: () => {
            const s = window.gameState;
            this.fightBoss('iron_sentinel');
            s.flags.iron_sentinel_dead = s.flags['iron_sentinel_dead'];
          }
        },
        { label: '← Back', action: () => this.sanctumInterior() }
      ]);
      return;
    }

    if (s.flags.iron_sentinel_dead && !s.flags.veil_colossus_dead) {
      if (!s.flags.colossus_intro_shown) {
        s.flags.colossus_intro_shown = true;
        this.print(`
          The inner sanctum opens into a vast circular chamber. And there — filling it entirely — is the Veil Colossus. A giant woven from stolen souls. You can see their faces pressing against its translucent form from the inside, mouths open, eyes wide.<br><br>
          Kael grabs your arm. <em>"Those souls — I think — I think I see—"</em> He falls silent, jaw tight.
        `);
        s.questFlags.main4 = 'boss';
        UI.renderQuests();
      }
      this.showActions([
        { label: '⚔ Fight the Veil Colossus', action: () => this.fightBoss('veil_colossus') },
        { label: '← Back',                    action: () => this.sanctumInterior() }
      ]);
      return;
    }

    if (s.flags.veil_colossus_dead) {
      this.finalConfrontation();
    }
  },

  // ── FINAL CONFRONTATION ─────────────────────────────────────
  finalConfrontation() {
    const s = window.gameState;
    if (s.flags.game_won) {
      this.print(`The Shattered Veil has been sealed. Your story is complete.`, 'gold-glow');
      this.showActions([{ label: '🏠 Return to menu', action: () => this.returnToMenu() }]);
      return;
    }

    const hasSelene = s.hasCompanion('selene');
    const knowsMira = s.hasLore('daughter_mira') || s.hasLore('wraithcaller_origin');

    this.print(`
      ⚫ The final chamber.<br><br>
      He stands at the centre — the Wraithcaller. Once Aldros the scholar. Now something that exists between grief and fury, wrapped in dark energy that hasn't slept in forty years.<br><br>
      His robes are tattered. His face — what remains of it — carries the ghost of someone who used to love things. His hands are still a scholar's hands.<br><br>
      He raises his head. When he speaks, his voice is layered — two voices, the scholar and the wraith, neither winning.<br><br>
      <em>"You came through the Gate. You knew her name. You... understand something then."</em> A long pause. <em>"Or you guessed."</em>
    `, 'gold-glow');

    const actions = [
      { label: '⚔ Attack immediately',             action: () => this.startWraithcallerFight() },
      { label: '💬 "I know what you lost, Aldros."', action: () => this.speakToAldros() }
    ];
    if (hasSelene) {
      actions.push({ label: '✨ Have Selene perform the Remembrance Rite', action: () => this.remembranceRite() });
    }
    this.showActions(actions);
  },

  speakToAldros() {
    const s = window.gameState;
    this.print(`
      <em>"I know what you lost, Aldros."</em><br><br>
      Something shifts in the chamber. The swirling dark energy slows, just slightly. His head tilts — the scholar's gesture.<br><br>
      <em>"You know her name. You said it at the Gate."</em> His voice shakes. <em>"Do you know what it cost me? Do you know that I watched her die and could do nothing? I had all that power and it meant nothing."</em><br><br>
      <em>"I tore the Veil looking for her. I looked for forty years. She was never there. The dead don't stay where we leave them."</em><br><br>
      He looks at you with something approaching exhaustion. <em>"Why are you here? To kill me?"</em>
    `);
    s.flags.wraith_weakened = true;
    this.showActions([
      { label: '"To end this — however that needs to happen."', action: () => this.startWraithcallerFight() },
      { label: '"Is there any way to repair the Veil?"',        action: () => this.veilRepairDialogue() }
    ]);
  },

  veilRepairDialogue() {
    const s = window.gameState;
    this.print(`
      For a long moment, Aldros is silent. The dark energy around him dims further.<br><br>
      <em>"Repair it."</em> He says the words slowly, as if testing them. <em>"I hadn't thought about repairing it. I had only thought about... going through it."</em><br><br>
      <em>"The Veil cannot be repaired without the one who tore it. If I die here, it stays broken — perhaps forever. If I..."</em><br><br>
      He reaches up and takes hold of his own chest — the dark energy there — and you understand suddenly that he is made of this, now. That ending the corruption means ending him.<br><br>
      <em>"Give me a worthy fight,"</em> he says quietly. <em>"Let me choose this. Don't make it a slaughter."</em>
    `);
    s.flags.wraith_honorable = true;
    this.showActions([
      { label: '⚔ Honor his request — fight with intent, not malice', action: () => this.startWraithcallerFight() }
    ]);
  },

  remembranceRite() {
    const s = window.gameState;
    this.print(`
      ✨ Selene steps forward, arms raised. She begins to speak in Old Vaelish — the language of the first mages. You don't understand the words, but you feel them.<br><br>
      The Wraithcaller flinches. Staggers. For a moment the dark energy parts like smoke in wind — and you see his face clearly. A middle-aged scholar, terrified, exhausted, grief-worn. He is weeping.<br><br>
      <em>"Mira,"</em> he says — not to any of you. To someone who isn't there. <em>"I'm sorry. I couldn't find you. I'm sorry."</em><br><br>
      Selene speaks one final word. The Wraithcaller closes his eyes.<br><br>
      <em>"It won't end without a fight,"</em> she tells you quietly. <em>"But the rite has reached him. He will be... less defended. And he knows, now, that what he did cannot be undone. That changes how he fights."</em>
    `, 'gold-glow');
    s.flags.wraith_weakened = true;
    s.flags.remembrance_done = true;
    s.questFlags.comp_selene = 'done';
    UI.renderQuests();
    this.showActions([
      { label: '⚔ Begin the final battle', action: () => this.startWraithcallerFight() }
    ]);
  },

  startWraithcallerFight() {
    const s = window.gameState;
    s.questFlags.main4 = 'final';
    UI.renderQuests();
    const boss = { ...ENEMIES['wraithcaller_p1'] };
    if (s.flags.wraith_weakened) {
      boss.hp = Math.floor(boss.hp * 0.8);
      this.print(`⚔ <em>The Wraithcaller's defences are weakened — the grief has cracked his resolve.</em>`, 'gold-glow');
    }
    this.startCombat(boss, () => {
      // Phase 2
      this.print(`
        ⚫ The Wraithcaller's mortal shell collapses — and something bursts free. The scholar Aldros is gone entirely. What remains is forty years of raw grief, shaped into power and fury. His second form fills the chamber with dark energy.<br><br>
        <em>This is what was left when the man gave up.</em>
      `, 'damage-flash');
      const p2 = { ...ENEMIES['wraithcaller_p2'] };
      if (s.flags.wraith_weakened) p2.hp = Math.floor(p2.hp * 0.75);
      this.startCombat(p2, () => this.gameVictory());
    });
  },

  // ── VICTORY ────────────────────────────────────────────────
  gameVictory() {
    const s = window.gameState;
    s.flags.game_won = true;
    s.questFlags.main4 = 'done';
    UI.renderQuests();

    // Give legendary weapon
    const veilpiercer = { ...WEAPONS.legendary[1], type: 'weapon', emoji: '⚔' };
    s.inventory.push(veilpiercer);
    s.gold += 200;
    s.gainXP(350);
    UI.updateStats();

    this.print(`
      ✨ <strong>The Wraithcaller falls.</strong><br><br>
      The dark energy doesn't explode — it withdraws. Like a tide going out. The black water in the marsh beyond begins to clear. The sky over Ashenreach, which has been frozen at false dusk for forty years, shifts — just slightly — towards something that might become night, and then morning.<br><br>
      In the silence of the chamber, Selene kneels beside the fading remains. <em>"He's gone, finally. The grief released him. And the Veil — I can feel it mending."</em>
    `, 'gold-glow');

    // Companion epilogues
    let epilogue = `<br><strong>Epilogue:</strong><br>`;
    if (s.hasCompanion('lyra')) epilogue += `<br>🗡 <em>Lyra carries three chests of recovered artifacts out of the sanctum. She donates one of them to the city. "Don't read anything into it," she says.</em>`;
    if (s.hasCompanion('torvin')) epilogue += `<br>🛡 <em>Torvin stands in the sanctum for a long time before following you out. His oath is fulfilled. He looks, for the first time in seven years, like someone who might sleep well.</em>`;
    if (s.hasCompanion('selene')) epilogue += `<br>✨ <em>Selene begins the long work of documenting how the Veil mends. She dedicates the research to Aldros, whose name she never uses carelessly.</em>`;
    if (s.hasCompanion('kael')) {
      if (s.questFlags.comp_kael) {
        epilogue += `<br>🏹 <em>Among the souls freed from the Veil Colossus — Kael finds two familiar faces. They are translucent now, freed, already fading into what comes next. He has time to say goodbye.</em>`;
      } else {
        epilogue += `<br>🏹 <em>Kael looks long at the freed souls ascending from the collapsed Colossus. None of them are his family. But he doesn't stop searching.</em>`;
      }
    }
    epilogue += `<br><br>🏆 <em>${s.playerName} — you have sealed the Shattered Veil. The legendary <strong>Veilpiercer</strong> is yours. The city of Ashenreach sees its first true sunrise in forty years.</em>`;

    this.print(epilogue, 'gold-glow');

    this.showActions([
      { label: '💾 Save your legacy',          action: () => { this.saveGame(); } },
      { label: '🏠 Return to the main menu', action: () => this.returnToMenu() }
    ]);
  },

  // ── COMBAT ENGINE ──────────────────────────────────────────
  startCombat(enemy, onVictory) {
    const s = window.gameState;
    let eHP = enemy.hp;
    const eMaxHP = enemy.hp;
    let playerShielded = false;
    let poisonTicks = 0;
    let nextAttackTriple = false;
    let bossPhase2 = false;

    this.print(`⚔ <strong>COMBAT BEGINS!</strong> You face <strong>${enemy.name}</strong> (${eHP} HP)`, 'gold-glow');

    const showCombatActions = () => {
      const acts = [
        { label: `⚔ Attack with ${s.weapon.name}`, action: () => playerAttack(), combat: true },
        { label: '🛡 Defend — halve incoming damage', action: () => playerDefend(), combat: true }
      ];

      // Spells
      s.spells.forEach(name => {
        const sp = SPELLS.find(x => x.name === name);
        if (!sp || s.magic < sp.cost) return;
        acts.push({
          label: `🔮 ${sp.name} (${sp.cost} MP)`,
          action: () => castSpell(sp),
          combat: true
        });
      });

      // Flee
      acts.push({
        label: '🏃 Flee',
        action: () => {
          const chance = 0.4 + (s.dexterity * 0.03);
          if (Math.random() < chance) {
            this.print(`🏃 You flee from the ${enemy.name}!`);
            this.goTo('ashenreach');
          } else {
            this.print(`🏃 You try to flee but the ${enemy.name} cuts you off!`);
            enemyTurn(1);
          }
        }
      });

      this.showActions(acts);
    };

    const calcPlayerDmg = () => {
      let dmg = Math.floor(Math.random() * (s.weapon.damage[1] - s.weapon.damage[0] + 1)) + s.weapon.damage[0];
      dmg += Math.floor(s.strength / 3);
      // Companion passives
      if (s.hasCompanion('kael') && enemy.undead) dmg += 8;
      // Weapon specials vs enemies
      const special = s.weapon.special;
      if (special === 'veilbane' && (enemy.spirit || enemy.finalBoss)) dmg = Math.floor(dmg * 1.4);
      if (special === 'shadow') dmg = Math.floor(dmg * 1.2);
      return dmg;
    };

    const playerAttack = () => {
      let dmg = calcPlayerDmg();

      // Triple attack from Veil Sight
      if (nextAttackTriple && enemy.hasCoreShot) {
        dmg *= 3;
        nextAttackTriple = false;
        this.print(`💥 <strong>CORE STRIKE!</strong> The core shard shatters — <strong>${dmg}</strong> damage!`, 'gold-glow');
      } else {
        this.print(`⚔ You attack ${enemy.name} for <strong>${dmg}</strong> damage.`);
      }

      // Weapon poison DOT
      if (s.weapon.special === 'poison') poisonTicks = 4;
      if (s.weapon.special === 'soulsteal') {
        const steal = Math.floor(dmg * 0.25);
        s.health = Math.min(s.maxHealth, s.health + steal);
        this.print(`💜 Soulsteal absorbs <strong>${steal} HP</strong> from the attack!`, 'heal-flash');
      }

      eHP -= dmg;
      checkEnemyDeath(onVictory) || enemyTurn(1);
    };

    const playerDefend = () => {
      playerShielded = true;
      this.print(`🛡 You raise your guard. Incoming damage halved this turn.`);
      enemyTurn(0.5);
    };

    const castSpell = (sp) => {
      s.magic -= sp.cost;
      UI.updateStats();

      if (sp.special === 'veilsight') {
        if (enemy.hasCoreShot) {
          nextAttackTriple = true;
          this.print(`🔮 Veil Sight reveals the Bone Harbinger's core shard! Your <em>next attack</em> will deal triple damage!`, 'gold-glow');
        } else {
          this.print(`🔮 Veil Sight reveals... no special weakness here.`);
        }
        enemyTurn(1); return;
      }

      if (sp.special === 'teleport') {
        this.print(`🌀 You cast Teleport and vanish from combat!`);
        this.goTo('ashenreach'); return;
      }

      if (sp.special === 'remembrance') {
        this.print(`✨ The Remembrance spell washes over the ${enemy.name}...`);
        if (enemy.finalBoss) {
          const reduction = Math.floor(eHP * 0.2);
          eHP -= reduction;
          this.print(`The spell reaches through the corruption — <strong>${reduction}</strong> HP stripped away.`, 'gold-glow');
          checkEnemyDeath(onVictory) || enemyTurn(1);
        } else {
          this.print(`It has no special effect here.`);
          enemyTurn(1);
        }
        return;
      }

      if (sp.buff === 'defense') {
        playerShielded = true;
        this.print(`🛡 Shield spell — incoming damage halved this turn.`);
        enemyTurn(0.5); return;
      }

      if (sp.heal) {
        const amount = Math.floor(Math.random() * (sp.heal[1] - sp.heal[0] + 1)) + sp.heal[0] + Math.floor(s.intelligence / 4);
        s.health = Math.min(s.maxHealth, s.health + amount);
        this.print(`💚 You cast ${sp.name} and restore <strong>${amount} HP</strong>!`, 'heal-flash');
        UI.updateStats();
        enemyTurn(1); return;
      }

      if (sp.damage) {
        let spDmg = Math.floor(Math.random() * (sp.damage[1] - sp.damage[0] + 1)) + sp.damage[0];
        spDmg += Math.floor(s.intelligence / 4);

        // Type bonuses
        if (sp.type === 'light' && enemy.weakLight) spDmg = Math.floor(spDmg * 1.6);
        if (sp.type === 'soul' && enemy.finalBoss) {
          const mult = enemy.phase === 2 ? 2.5 : 2.0;
          spDmg = Math.floor(spDmg * mult);
        }
        if (sp.type === 'poison' && enemy.construct) spDmg = Math.floor(spDmg * 1.5);

        if (sp.dot) poisonTicks = sp.dot;

        this.print(`🔮 You cast <strong>${sp.name}</strong> for <strong>${spDmg}</strong> magic damage!`);
        eHP -= spDmg;
        checkEnemyDeath(onVictory) || enemyTurn(1);
        return;
      }

      enemyTurn(1);
    };

    const enemyTurn = (reduction) => {
      // Poison DOT on enemy
      if (poisonTicks > 0) {
        const poisonDmg = Math.floor(Math.random() * 5) + 4;
        eHP -= poisonDmg;
        poisonTicks--;
        this.print(`🟢 Poison deals <strong>${poisonDmg}</strong> damage to ${enemy.name}! (${poisonTicks} turns remaining)`);
        if (checkEnemyDeath(onVictory)) return;
      }

      // Bonewright phase 2 check
      if (enemy.name === 'Bonewright' && !bossPhase2 && eHP <= eMaxHP / 2) {
        bossPhase2 = true;
        this.print(`💀 <strong>The Bonewright collapses — and reassembles faster, more dangerous!</strong> Phase 2 begins!`, 'damage-flash');
      }

      // Enemy attack
      let eDmg = Math.floor(Math.random() * (enemy.damage[1] - enemy.damage[0] + 1)) + enemy.damage[0];
      if (bossPhase2) eDmg = Math.floor(eDmg * 1.25);

      // Player defenses
      let finalDmg = Math.max(1, Math.floor(eDmg * reduction));
      if (s.hasCompanion('torvin')) finalDmg = Math.max(1, Math.floor(finalDmg * 0.8));
      playerShielded = false;

      s.health -= finalDmg;
      s.health = Math.max(0, s.health);
      this.print(`💥 ${enemy.name} attacks you for <strong>${finalDmg}</strong> damage!`, 'damage-flash');
      UI.updateStats();

      if (s.health <= 0) {
        this.gameOver();
        return;
      }

      this.print(`⚔ ${enemy.name}: <strong>${Math.max(0, eHP)}/${eMaxHP} HP</strong> · You: <strong>${Math.ceil(s.health)}/${s.maxHealth} HP</strong>`);
      showCombatActions();
    };

    const checkEnemyDeath = (callback) => {
      if (eHP > 0) return false;
      const goldReward = Math.floor(Math.random() * (enemy.gold[1] - enemy.gold[0] + 1)) + enemy.gold[0];
      let totalGold = goldReward;
      if (s.hasCompanion('lyra')) totalGold = Math.floor(totalGold * 1.3);
      s.gold += totalGold;

      this.print(`🎉 <strong>VICTORY!</strong> You defeated <strong>${enemy.name}</strong>!`, 'gold-glow');
      if (enemy.xp > 0) s.gainXP(enemy.xp);
      if (goldReward > 0) this.print(`💰 You gained <strong>${totalGold} gold</strong>${s.hasCompanion('lyra') ? ' (Lyra\'s gold sense: +30%)' : ''}.`);

      // Selene post-combat heal
      if (s.hasCompanion('selene')) {
        const healAmt = Math.floor(Math.random() * 10) + 15;
        s.health = Math.min(s.maxHealth, s.health + healAmt);
        this.print(`✨ Selene treats your wounds — restored <strong>${healAmt} HP</strong>.`, 'heal-flash');
      }
      UI.updateStats();

      if (callback) setTimeout(() => callback(), 300);
      return true;
    };

    showCombatActions();
  },

  // ── GAME OVER ──────────────────────────────────────────────
  gameOver() {
    const s = window.gameState;
    this.print(`
      💀 <strong>FALLEN.</strong><br><br>
      You have fallen, ${s.playerName}. The marsh claims another brave soul. The Wraithcaller's dark laughter echoes through the Veil.<br><br>
      <em>But heroes are remembered. And the Shattered Veil still awaits someone willing to mend it.</em>
    `, 'damage-flash');
    this.showActions([
      { label: '🔄 Try again from this save slot', action: () => {
        const saved = SaveSystem.get(s.saveSlot);
        if (saved) { const ns = new GameState(); ns.fromJSON(saved); ns.saveSlot = s.saveSlot; window.gameState = ns; G.init(); }
        else { location.reload(); }
      }},
      { label: '🏠 Return to main menu', action: () => this.returnToMenu() }
    ]);
  }
};

// ── STARTUP ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  StartupUI.init();
});
