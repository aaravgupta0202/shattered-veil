/* =====================================================================
   SHATTERED VEIL — Complete Game Engine
   Features: Save system (3 slots), Companions, Bosses, Artifacts,
             Full storyline, Quests, Economy, PWA, Mobile UI
   ===================================================================== */

'use strict';

// ===================================================================
// CONSTANTS & DATA
// ===================================================================

const SAVE_KEY = 'sv_save_';
const MAX_SAVES = 3;

// ---- SPELLS ----
const SPELL_DATA = [
  { name:'Spark',        cost:8,  damage:[4,8],   type:'damage',  icon:'⚡', desc:'A crackle of raw lightning.' },
  { name:'Heal',         cost:12, heal:[18,28],   type:'heal',    icon:'💚', desc:'Weave light into flesh.' },
  { name:'Fireball',     cost:18, damage:[10,16], type:'damage',  icon:'🔥', desc:'A roiling sphere of fire.' },
  { name:'Lightning Bolt',cost:25,damage:[16,24], type:'damage',  icon:'⚡', desc:'The sky\'s wrath in your palm.' },
  { name:'Greater Heal', cost:30, heal:[40,60],   type:'heal',    icon:'💚', desc:'Ancient restorative magic.' },
  { name:'Shadow Step',  cost:20, dodge:true,     type:'utility', icon:'🌑', desc:'Phase through an attack.' },
  { name:'Stone Skin',   cost:22, armor:true,     type:'buff',    icon:'🪨', desc:'Granite-hard flesh.' },
  { name:'Soul Drain',   cost:28, damage:[12,20], heal:[8,14],   type:'drain', icon:'💜', desc:'Rend life to feed your own.' },
  { name:'Veil Sight',   cost:10, reveal:true,    type:'utility', icon:'👁', desc:'See what hides in shadow.' },
  { name:'Teleport',     cost:35, teleport:true,  type:'utility', icon:'🌀', desc:'Unravel space and step through.' },
];

// ---- WEAPONS ----
const WEAPON_DATA = {
  starter: { name:'Rusty Dagger',     damage:[3,6],   type:'weapon', emoji:'🗡', desc:'Worn and chipped but still sharp.' },
  basic: [
    { name:'Iron Shortsword',  price:35,  damage:[6,10],  type:'weapon', emoji:'⚔', desc:'Solid and reliable.' },
    { name:'Hunter\'s Bow',   price:50,  damage:[5,11],  type:'weapon', emoji:'🏹', desc:'Silent as wind.' },
    { name:'War Hatchet',      price:40,  damage:[7,11],  type:'weapon', emoji:'🪓', desc:'Heavy and brutal.' },
  ],
  advanced: [
    { name:'Steel Longsword',  price:130, damage:[11,17], type:'weapon', emoji:'⚔', desc:'Finely balanced blade.' },
    { name:'Venom Fang',       price:160, damage:[7,15],  type:'weapon', emoji:'🗡', special:'poison', desc:'Coated with marsh toxin.' },
    { name:'Storm Lance',      price:210, damage:[13,19], type:'weapon', emoji:'⚡', special:'shock',  desc:'Channels lightning on impact.' },
    { name:'Ashwood Staff',    price:180, damage:[8,14],  type:'weapon', emoji:'🪄', magicBonus:8,     desc:'Amplifies spell power.' },
  ],
  legendary: [
    { name:'Veilpiercer',      damage:[20,28], type:'weapon', emoji:'⚔', special:'veilbane', desc:'Cuts through darkness and illusion alike. Forged from starfall iron.' },
    { name:'Soulreaper',       damage:[18,26], type:'weapon', emoji:'🌑', special:'soulsteal', desc:'Each kill feeds its hunger — and yours.' },
    { name:'Dawn\'s Edge',     damage:[16,24], type:'weapon', emoji:'☀', special:'undead_bane', desc:'Burns with righteous fire against the dead.' },
  ]
};

// ---- ITEMS / CONSUMABLES ----
const ITEM_DATA = {
  potions: [
    { name:'Minor Health Potion', price:15, type:'potion', effect:'heal', min:22, max:32, emoji:'🍯', desc:'A small vial of red liquid.' },
    { name:'Major Health Potion', price:40, type:'potion', effect:'heal', min:55, max:75, emoji:'🧪', desc:'Potent restorative brew.' },
    { name:'Magic Elixir',        price:28, type:'potion', effect:'mana', min:30, max:45, emoji:'💙', desc:'Restores magical energy.' },
    { name:'Berserker\'s Draft',  price:50, type:'potion', effect:'strength', amount:3, dur:5, emoji:'🟥', desc:'Rage in a bottle. +3 STR for 5 turns.' },
    { name:'Shadowmilk',          price:60, type:'potion', effect:'dodge', dur:3, emoji:'🖤', desc:'Makes you hard to hit. 3 turns.' },
  ]
};

// ---- ARTIFACTS ----
const ARTIFACTS = [
  { id:'shardstone',   name:'Shardstone Amulet',   emoji:'💎', desc:'A glowing fragment of the Veil itself. +15 max MP.', bonus:{ maxMp:15 } },
  { id:'bloodring',    name:'Ring of Bloodpact',    emoji:'💍', desc:'Seal your blood as power. +4 STR, -10 max HP.', bonus:{ str:4, maxHp:-10 } },
  { id:'wraithcloak',  name:'Wraith Cloak',         emoji:'🧥', desc:'Woven from the essence of ghosts. +3 DEX.', bonus:{ dex:3 } },
  { id:'seers_eye',    name:'Seer\'s Eye',          emoji:'👁', desc:'Reveals enemy weaknesses. +5 INT.', bonus:{ int:5 } },
  { id:'starfall',     name:'Starfall Crystal',     emoji:'⭐', desc:'Fallen from beyond the Veil. +20 max HP, +10 max MP.', bonus:{ maxHp:20, maxMp:10 } },
  { id:'grimoire',     name:'Grimoire of Lost Rites',emoji:'📕', desc:'Contains a forbidden spell. Teaches Soul Drain.', spell:'Soul Drain' },
  { id:'compass',      name:'Veiled Compass',        emoji:'🧭', desc:'Points toward hidden things. Passive: +1 treasure per search.' },
];

// ---- COMPANIONS ----
const COMPANION_DATA = {
  lyra: {
    id:'lyra', name:'Lyra Ashvale', role:'Rogue · Shadow Walker',
    emoji:'🧝', joinScene:'inn_lyra',
    baseHp:60, hp:60,
    desc:'A former thief turned reluctant hero. Quick blade, quicker wit.',
    lore:'Lyra grew up in Ashenreach\'s undercity, picking pockets to survive. She\'s never admitted it, but she secretly wants to be remembered as something more than a thief.',
    passive:'Finds extra gold after combat.',
    combatBonus:{ damageBonus:3 },
    dialogues:[
      '"This place reeks of old magic. I love it."',
      '"Watch my back and I\'ll watch yours. Probably."',
      '"I\'ve picked worse locks than death\'s door."',
    ]
  },
  torvin: {
    id:'torvin', name:'Torvin Steelborn', role:'Warrior · Oathguard',
    emoji:'🧔', joinScene:'blacksmith_torvin',
    baseHp:90, hp:90,
    desc:'A retired soldier haunted by an oath he hasn\'t yet fulfilled.',
    lore:'Torvin served in the Ashenreach city guard for twenty years. He lost three friends to the Wraithcaller\'s forces. He will not lose another.',
    passive:'Reduces damage taken by 2 per hit.',
    combatBonus:{ damageReduction:2 },
    dialogues:[
      '"I\'ve faced worse odds. Once. Just once."',
      '"Keep moving. We rest when the dead do."',
      '"Every foe I fell is one that can\'t hurt you."',
    ]
  },
  selene: {
    id:'selene', name:'Selene Moonwhisper', role:'Mage · Apothecary',
    emoji:'🧙‍♀️', joinScene:'apothecary_deep',
    baseHp:45, hp:45,
    desc:'Ashenreach\'s enigmatic apothecary, keeper of ancient secrets.',
    lore:'Selene was once apprenticed to the Wraithcaller — before she realized what he truly was. She has been trying to stop him ever since, one potion at a time.',
    passive:'Restores 5 HP to the party after each combat.',
    combatBonus:{ healAfterCombat:5 },
    dialogues:[
      '"The veil between worlds is tissue-thin here. Be careful what you call out."',
      '"Magic is a conversation. Most people only shout."',
      '"I knew him, once. The Wraithcaller. That\'s why I must help end this."',
    ]
  },
  kael: {
    id:'kael', name:'Kael the Unbroken', role:'Ranger · Veilhunter',
    emoji:'🧑‍🦱', joinScene:'marsh_kael',
    baseHp:70, hp:70,
    desc:'A lone hunter who has tracked the undead for years.',
    lore:'Kael lost his family to the marsh\'s creeping corruption three winters past. He swore to burn it all down — and he intends to keep that promise.',
    passive:'Attacks deal +5 damage to undead enemies.',
    combatBonus:{ undeadBonus:5 },
    dialogues:[
      '"I know every path through the marsh. Every grave, too."',
      '"Undead don\'t sleep. Neither do I."',
      '"You fight well. For a newcomer."',
    ]
  },
};

// ---- ENEMIES ----
const ENEMY_DATA = {
  // Common
  marsh_skeleton:   { name:'Marsh Skeleton',   hp:28,  damage:[4,8],   gold:[8,15],  xp:22, emoji:'💀', desc:'Animated bones held together by spite.' },
  corrupt_spirit:   { name:'Corrupted Spirit', hp:35,  damage:[7,11],  gold:[12,20], xp:28, emoji:'👻', desc:'A soul twisted by dark magic.' },
  mud_golem:        { name:'Mud Golem',        hp:50,  damage:[9,14],  gold:[18,28], xp:40, emoji:'🪨', desc:'A creature of cursed earth and will.' },
  shadow_wraith:    { name:'Shadow Wraith',    hp:42,  damage:[11,16], gold:[20,32], xp:50, emoji:'🌑', desc:'Darkness given hunger.' },
  // Mini-bosses
  bone_harbinger:   { name:'Bone Harbinger',   hp:75,  damage:[14,20], gold:[45,65], xp:90, emoji:'💀', boss:true, desc:'Commander of the marsh\'s undead legions.' },
  veilstalker:      { name:'Veilstalker',      hp:90,  damage:[16,22], gold:[55,75], xp:110, emoji:'🐍', boss:true, desc:'A creature from beyond the Veil itself.' },
  // Boss
  bonewright:       { name:'The Bonewright',   hp:140, damage:[18,24], gold:[100,130],xp:200, emoji:'💀', boss:true, finalPhase:true, desc:'Architect of the undead army. Second-in-command to the Wraithcaller.' },
  // Final Boss
  wraithcaller:     { name:'Wraithcaller',     hp:200, damage:[22,30], gold:[200,260],xp:500, emoji:'☠', boss:true, finalBoss:true, phases:2, desc:'The architect of Ashenreach\'s doom. Once a man. No longer.' },
};

// ---- QUESTS ----
const QUEST_DATA = {
  main1: {
    id:'main1', title:'Shadows at the Gate', type:'main',
    desc:'Investigate strange activity near Ashenreach\'s eastern gate.',
    stages:[
      { text:'Speak with Captain Seris about the disturbances.', complete:false },
      { text:'Investigate the eastern gate at night.', complete:false },
      { text:'Report findings to Mayor Eldric.', complete:false },
    ],
    reward:{ gold:60, xp:80 },
  },
  main2: {
    id:'main2', title:'Into the Obsidian Marsh', type:'main',
    desc:'The Wraithcaller grows bolder. Enter the marsh and push back the corruption.',
    stages:[
      { text:'Defeat 3 enemies in the marsh.', complete:false, kills:0, needed:3 },
      { text:'Find the Wraithcaller\'s herald, the Bonewright.', complete:false },
      { text:'Defeat the Bonewright.', complete:false },
    ],
    reward:{ gold:150, xp:200, item:'Seer\'s Eye' },
  },
  main3: {
    id:'main3', title:'The Shattered Veil', type:'main',
    desc:'Confront the Wraithcaller at the heart of the Obsidian Marsh.',
    stages:[
      { text:'Reach the Ancient Temple.', complete:false },
      { text:'Defeat the Wraithcaller.', complete:false },
    ],
    reward:{ gold:300, xp:500, weapon:'Veilpiercer' },
  },
  side1: {
    id:'side1', title:'Lost in the Marsh', type:'side',
    desc:'A merchant\'s apprentice went missing in the marsh. Find what became of him.',
    reward:{ gold:80, xp:60 },
  },
  side2: {
    id:'side2', title:'Orin\'s Debt', type:'side',
    desc:'The innkeeper Orin owes a dangerous man. Help him settle the score.',
    reward:{ gold:45, xp:50 },
  },
  side3: {
    id:'side3', title:'Ravyn\'s Lost Tome', type:'side',
    desc:'Ravyn the Storyteller lost a precious book in the marsh. Recover it.',
    reward:{ gold:60, xp:70, spell:'Veil Sight' },
  },
  companion1: {
    id:'companion1', title:'Lyra\'s Secret', type:'companion',
    desc:'Lyra has been hiding something. The time has come to ask her about it.',
    reward:{ xp:100, bond:'lyra' },
  },
};

// ---- LOCATIONS ----
const LOCATIONS = {
  ashenreach: { name:'Ashenreach',      desc:'City of eternal twilight. Home and haven.' },
  eastern_gate:{ name:'Eastern Gate',   desc:'Where fear begins its walk.' },
  obsidian_marsh:{ name:'Obsidian Marsh', desc:'Twisted bog. The dead do not rest here.' },
  ancient_temple:{ name:'Ancient Temple', desc:'Heart of corruption. Seat of the Wraithcaller.' },
  undercity:  { name:'Ashenreach Undercity', desc:'Where secrets hide from light.' },
};

// ===================================================================
// GAME STATE
// ===================================================================

class GameState {
  constructor() {
    this.playerName = '';
    this.saveSlot = 0;
    this.location = 'ashenreach';
    this.started = false;

    // Vitals
    this.hp = 100; this.maxHp = 100;
    this.mp = 40;  this.maxMp = 40;
    this.str = 6;  this.dex = 5; this.int = 8;
    this.gold = 30;
    this.level = 1;  this.xp = 0; this.xpNext = 100;

    // Equipment & Inventory
    this.weapon = { ...WEAPON_DATA.starter };
    this.armor  = null;
    this.accessory = null;
    this.inventory = [];     // items
    this.artifacts = [];     // artifact ids
    this.spells = ['Spark','Heal'];

    // Companions (active companion ids)
    this.companions = [];   // ids of joined companions
    this.companionHp = {};  // id -> current hp

    // Quests
    this.quests = {};     // id -> { ...questData, active, complete }
    this.questKills = 0;  // marsh kills for main2

    // Flags
    this.flags = {};
    this.searchedAreas = {};
    this.npcMet = {};
    this.storyHistory = [];

    // Buffs (temp)
    this.buffs = [];  // { type, value, turnsLeft }

    // Artifacts bonus cache (recompute on change)
    this._artifactBonus = {};
    // Temp combat dodge
    this._dodgeNext = false;
    this._armorNext = false;
  }

  /* ---------- VITALS ---------- */
  heal(amount) {
    const actual = Math.min(this.maxHp - this.hp, amount);
    this.hp = Math.min(this.maxHp, this.hp + amount);
    return actual;
  }
  takeDamage(amount) {
    // Companions reduce damage
    let reduction = 0;
    this.companions.forEach(id => {
      if (COMPANION_DATA[id]?.combatBonus?.damageReduction) reduction += COMPANION_DATA[id].combatBonus.damageReduction;
    });
    // Stone Skin
    if (this._armorNext) { reduction += 4; this._armorNext = false; }
    const final = Math.max(1, amount - reduction);
    this.hp = Math.max(0, this.hp - final);
    return final;
  }
  restoreMP(amount) {
    this.mp = Math.min(this.maxMp, this.mp + amount);
  }
  fullRest() {
    this.hp = this.maxHp; this.mp = this.maxMp;
  }

  /* ---------- XP / LEVEL ---------- */
  gainXP(amount) {
    this.xp += amount;
    let leveled = false;
    while (this.xp >= this.xpNext) { this.xp -= this.xpNext; this.levelUp(); leveled = true; }
    return leveled;
  }
  levelUp() {
    this.level++;
    this.xpNext = Math.floor(this.level * 110);
    const hpGain = 15 + rng(0,10);
    const mpGain = 8  + rng(0,5);
    this.maxHp += hpGain; this.hp = this.maxHp;
    this.maxMp += mpGain; this.mp = this.maxMp;
    this.str += rng(1,2);
    this.dex += rng(1,2);
    this.int += rng(1,2);
    GAME.emit('levelup', this.level);
  }

  /* ---------- INVENTORY ---------- */
  addItem(item) {
    this.inventory.push(item);
    GAME.emit('item_added', item);
  }
  removeItem(index) {
    this.inventory.splice(index, 1);
  }
  useItem(index) {
    const item = this.inventory[index];
    if (!item) return;
    if (item.type === 'potion') {
      if (item.effect === 'heal') {
        const h = this.heal(rng(item.min, item.max));
        GAME.log(`🍯 You drink the ${item.name} and restore ${h} HP.`, 'heal');
      } else if (item.effect === 'mana') {
        const m = rng(item.min, item.max);
        this.restoreMP(m);
        GAME.log(`💙 You drink the ${item.name} and restore ${m} MP.`, 'heal');
      } else if (item.effect === 'strength') {
        this.addBuff({ type:'strength', value:item.amount, dur:item.dur });
        GAME.log(`🟥 ${item.name} surges through you! +${item.amount} STR for ${item.dur} turns.`, 'loot');
      } else if (item.effect === 'dodge') {
        this.addBuff({ type:'dodge', value:1, dur:item.dur });
        GAME.log(`🖤 ${item.name} makes you harder to hit.`, 'loot');
      }
      this.removeItem(index);
      UI.updateStats();
    } else if (item.type === 'weapon') {
      this.equipWeapon(item, index);
    }
  }
  equipWeapon(weapon, inventoryIndex) {
    const old = this.weapon;
    this.weapon = weapon;
    if (inventoryIndex !== undefined) {
      this.removeItem(inventoryIndex);
      if (old && old.name !== WEAPON_DATA.starter.name) this.inventory.push(old);
    }
    GAME.log(`⚔️ Equipped <strong>${weapon.name}</strong> (${weapon.damage[0]}–${weapon.damage[1]} dmg).`, 'loot');
    UI.updateStats();
  }

  /* ---------- ARTIFACTS ---------- */
  addArtifact(artifact) {
    if (this.artifacts.includes(artifact.id)) return;
    this.artifacts.push(artifact.id);
    // Apply bonus
    if (artifact.bonus) {
      if (artifact.bonus.maxHp) { this.maxHp += artifact.bonus.maxHp; if (artifact.bonus.maxHp > 0) this.hp = Math.min(this.maxHp, this.hp + artifact.bonus.maxHp); }
      if (artifact.bonus.maxMp) { this.maxMp += artifact.bonus.maxMp; this.mp = Math.min(this.maxMp, this.mp + artifact.bonus.maxMp); }
      if (artifact.bonus.str)   this.str += artifact.bonus.str;
      if (artifact.bonus.dex)   this.dex += artifact.bonus.dex;
      if (artifact.bonus.int)   this.int += artifact.bonus.int;
    }
    if (artifact.spell && !this.spells.includes(artifact.spell)) {
      this.spells.push(artifact.spell);
      GAME.log(`📜 The ${artifact.name} teaches you <strong>${artifact.spell}</strong>!`, 'loot');
    }
    GAME.emit('artifact_added', artifact);
    UI.updateStats();
  }

  /* ---------- BUFFS ---------- */
  addBuff(b) { this.buffs.push({ ...b, turnsLeft: b.dur }); }
  tickBuffs() {
    this.buffs = this.buffs.filter(b => {
      b.turnsLeft--;
      return b.turnsLeft > 0;
    });
  }
  getStrBonus() {
    return this.buffs.filter(b=>b.type==='strength').reduce((s,b)=>s+b.value,0);
  }
  hasDodgeBuff() {
    return this.buffs.some(b=>b.type==='dodge' && b.turnsLeft > 0);
  }

  /* ---------- COMPANIONS ---------- */
  addCompanion(id) {
    if (this.companions.includes(id)) return;
    this.companions.push(id);
    this.companionHp[id] = COMPANION_DATA[id].baseHp;
    GAME.emit('companion_joined', id);
    UI.updateCompanions();
  }
  companionHealAfterCombat() {
    let healSum = 0;
    this.companions.forEach(id => {
      const c = COMPANION_DATA[id];
      if (c?.combatBonus?.healAfterCombat) healSum += c.combatBonus.healAfterCombat;
    });
    if (healSum > 0) {
      const actual = this.heal(healSum);
      if (actual > 0) GAME.log(`💚 Selene tends your wounds. +${actual} HP.`, 'heal');
    }
  }
  companionDamageBonus() {
    let bonus = 0;
    this.companions.forEach(id => {
      const c = COMPANION_DATA[id];
      if (c?.combatBonus?.damageBonus) bonus += c.combatBonus.damageBonus;
    });
    return bonus;
  }
  companionGoldBonus(base) {
    if (this.companions.includes('lyra')) return Math.floor(base * 0.15);
    return 0;
  }
  companionUndeadBonus(enemy) {
    if (this.companions.includes('kael') && enemy.undead !== false) {
      if (['marsh_skeleton','bone_harbinger','bonewright','wraithcaller','corrupt_spirit'].includes(enemy.id)) return 5;
    }
    return 0;
  }

  /* ---------- QUESTS ---------- */
  startQuest(id) {
    if (this.quests[id]) return;
    const q = { ...QUEST_DATA[id] };
    q.stages = q.stages ? q.stages.map(s=>({...s})) : [];
    q.active = true; q.complete = false;
    this.quests[id] = q;
    GAME.emit('quest_started', id);
    UI.updateQuests();
  }
  advanceQuest(id, stage) {
    const q = this.quests[id];
    if (!q || !q.stages[stage]) return;
    q.stages[stage].complete = true;
    // Check if all done
    if (q.stages.every(s=>s.complete)) {
      this.completeQuest(id);
    } else {
      UI.updateQuests();
      GAME.emit('quest_advanced', id, stage);
    }
  }
  completeQuest(id) {
    const q = this.quests[id];
    if (!q || q.complete) return;
    q.complete = true; q.active = false;
    const r = q.reward || {};
    if (r.gold) { this.gold += r.gold; GAME.log(`💰 Quest reward: ${r.gold} gold!`, 'loot'); }
    if (r.xp)   { this.gainXP(r.xp);   }
    if (r.spell && !this.spells.includes(r.spell)) { this.spells.push(r.spell); GAME.log(`📜 Learned spell: <strong>${r.spell}</strong>!`, 'loot'); }
    GAME.log(`✅ Quest complete: <strong>${q.title}</strong>!`, 'victory');
    GAME.emit('quest_complete', id);
    UI.updateStats(); UI.updateQuests();
  }

  /* ---------- SAVE / LOAD ---------- */
  toSaveData() {
    return {
      v: 1,
      playerName: this.playerName,
      saveSlot: this.saveSlot,
      location: this.location,
      hp: this.hp, maxHp: this.maxHp,
      mp: this.mp, maxMp: this.maxMp,
      str: this.str, dex: this.dex, int: this.int,
      gold: this.gold, level: this.level, xp: this.xp, xpNext: this.xpNext,
      weapon: this.weapon, armor: this.armor, accessory: this.accessory,
      inventory: this.inventory,
      artifacts: this.artifacts,
      spells: this.spells,
      companions: this.companions,
      companionHp: this.companionHp,
      quests: this.quests,
      questKills: this.questKills,
      flags: this.flags,
      searchedAreas: this.searchedAreas,
      npcMet: this.npcMet,
      timestamp: Date.now(),
    };
  }
  fromSaveData(data) {
    Object.assign(this, data);
  }
}

// ===================================================================
// GAME ENGINE
// ===================================================================

const GAME = {
  state: null,
  _listeners: {},

  on(event, fn) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(fn);
  },
  emit(event, ...args) {
    (this._listeners[event] || []).forEach(fn => fn(...args));
  },

  /* ---------- LOGGING ---------- */
  log(html, type = '') {
    const area = document.getElementById('story-text');
    const div = document.createElement('div');
    div.className = `story-paragraph ${type ? 'type-' + type : ''}`;
    div.innerHTML = html;
    area.appendChild(div);
    const scroll = document.getElementById('story-scroll');
    setTimeout(() => scroll.scrollTop = scroll.scrollHeight, 60);
    if (this.state) this.state.storyHistory.push({ html, type });
  },
  divider(label = '') {
    const div = document.createElement('div');
    div.className = 'story-divider';
    div.textContent = label ? `— ${label} —` : '· · ·';
    document.getElementById('story-text').appendChild(div);
  },

  /* ---------- ACTIONS ---------- */
  showActions(list) {
    const area = document.getElementById('action-buttons');
    area.innerHTML = '';
    list.forEach(a => {
      const btn = document.createElement('button');
      btn.className = 'action-btn' + (a.danger ? ' danger' : '');
      btn.innerHTML = a.text;
      btn.disabled = !!a.disabled;
      btn.onclick = () => {
        if (typeof a.action === 'function') a.action();
        else if (typeof a.action === 'string') {
          if (SCENES[a.action]) this.goScene(a.action);
          else if (ACTIONS[a.action]) ACTIONS[a.action]();
        }
      };
      area.appendChild(btn);
    });
  },
  goScene(key) {
    const scene = SCENES[key];
    if (!scene) return;
    const text = typeof scene.text === 'function' ? scene.text() : scene.text;
    this.log(text);
    const acts = typeof scene.actions === 'function' ? scene.actions() : scene.actions;
    this.showActions(acts);
    if (scene.onEnter) scene.onEnter();
  },
  setLocation(key) {
    const loc = LOCATIONS[key] || { name: key, desc: '' };
    if (this.state) this.state.location = key;
    document.getElementById('loc-name').textContent = loc.name;
    document.getElementById('loc-desc').textContent = loc.desc;
    document.getElementById('top-location-label').textContent = loc.name;
    UI.updateQuickNav(key);
  },

  /* ---------- INIT ---------- */
  init() {
    UI.init();
    SAVE.renderStartScreen();
  },

  startNewGame(name, slot) {
    this.state = new GameState();
    this.state.playerName = name;
    this.state.saveSlot = slot;
    this.state.started = true;
    this.state.quests = {};
    this.state.startQuest = GameState.prototype.startQuest;
    this.state.startQuest('main1');

    UI.transitionToGame();
    this.setLocation('ashenreach');
    UI.updateStats();
    UI.updateCompanions();
    UI.updateQuests();
    UI.renderEquipment();
    UI.renderSavePanel();

    setTimeout(() => {
      this.goScene('intro');
      SAVE.save(slot);
    }, 600);
  },

  loadGame(data) {
    this.state = new GameState();
    this.state.fromSaveData(data);
    this.state.started = true;

    UI.transitionToGame();
    this.setLocation(this.state.location);
    UI.updateStats();
    UI.updateCompanions();
    UI.updateQuests();
    UI.renderEquipment();
    UI.renderSavePanel();

    setTimeout(() => {
      this.log(`<strong>Welcome back, ${this.state.playerName}.</strong> The shadows remember you.`, 'system');
      this.goScene('ashenreach');
    }, 600);
  },
};

// ===================================================================
// SAVE SYSTEM
// ===================================================================

const SAVE = {
  key(slot) { return SAVE_KEY + slot; },

  get(slot) {
    try {
      const raw = localStorage.getItem(this.key(slot));
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  save(slot) {
    if (!GAME.state) return;
    GAME.state.saveSlot = slot;
    try {
      localStorage.setItem(this.key(slot), JSON.stringify(GAME.state.toSaveData()));
      UI.toast('Game saved ✓', 'success');
      UI.renderSavePanel();
    } catch {
      UI.toast('Failed to save', 'error');
    }
  },

  delete(slot) {
    localStorage.removeItem(this.key(slot));
  },

  renderStartScreen() {
    const container = document.getElementById('save-slots');
    container.innerHTML = '';
    for (let i = 0; i < MAX_SAVES; i++) {
      const data = this.get(i);
      const div = document.createElement('div');
      div.className = 'save-slot' + (data ? '' : ' save-slot-empty');
      if (data) {
        const date = new Date(data.timestamp);
        div.innerHTML = `
          <div class="save-slot-info">
            <div class="save-slot-name">${data.playerName}</div>
            <div class="save-slot-meta">Lv ${data.level} · ${LOCATIONS[data.location]?.name || data.location} · ${date.toLocaleDateString()}</div>
          </div>
          <div class="save-slot-actions">
            <button class="slot-load-btn">Load</button>
            <button class="slot-delete-btn">🗑</button>
          </div>`;
        div.querySelector('.slot-load-btn').onclick = () => GAME.loadGame(data);
        div.querySelector('.slot-delete-btn').onclick = (e) => {
          e.stopPropagation();
          if (confirm(`Delete save "${data.playerName}"?`)) {
            this.delete(i);
            this.renderStartScreen();
          }
        };
      } else {
        div.innerHTML = `<div class="save-slot-info"><div class="save-slot-name">Slot ${i+1} — Empty</div><div class="save-slot-meta">Start a new adventure</div></div>`;
        div.onclick = () => {
          document.getElementById('save-slots-section').classList.add('hidden');
          document.getElementById('name-entry-section').classList.remove('hidden');
          UI.setSelectedSlot(i);
        };
      }
      container.appendChild(div);
    }
  },
};

// ===================================================================
// UI
// ===================================================================

const UI = {
  _selectedSlot: 0,

  init() {
    this._initStars();
    this._initMobileToggles();
    this._initSaveSlotSelect();
    this._initNameEntry();
    this._initTopBarButtons();
  },

  _initStars() {
    const field = document.getElementById('star-field');
    if (!field) return;
    for (let i = 0; i < 120; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const size = Math.random() * 2.5 + 0.5;
      s.style.cssText = `
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        width:${size}px; height:${size}px;
        --dur:${2+Math.random()*4}s;
        animation-delay:${Math.random()*4}s;`;
      field.appendChild(s);
    }
  },

  _initMobileToggles() {
    const overlay = document.getElementById('sidebar-overlay');
    document.getElementById('menu-toggle').onclick = () => this.openSidebar('left');
    document.getElementById('stats-toggle').onclick = () => this.openSidebar('right');
    overlay.onclick = () => this.closeAllSidebars();
    document.getElementById('sidebar-left-close').onclick = () => this.closeAllSidebars();
    document.getElementById('sidebar-right-close').onclick = () => this.closeAllSidebars();
  },

  openSidebar(side) {
    const id = side === 'left' ? 'sidebar-left' : 'sidebar-right';
    document.getElementById(id).classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('active');
  },
  closeAllSidebars() {
    document.getElementById('sidebar-left').classList.remove('open');
    document.getElementById('sidebar-right').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
  },

  _initSaveSlotSelect() {
    const container = document.getElementById('slot-select-btns');
    container.innerHTML = '';
    for (let i = 0; i < MAX_SAVES; i++) {
      const btn = document.createElement('button');
      btn.className = 'slot-select-btn' + (i === 0 ? ' active' : '');
      btn.textContent = `Slot ${i+1}`;
      btn.dataset.slot = i;
      btn.onclick = () => this.setSelectedSlot(i);
      container.appendChild(btn);
    }
  },

  setSelectedSlot(i) {
    this._selectedSlot = i;
    document.querySelectorAll('.slot-select-btn').forEach((b,idx) => {
      b.classList.toggle('active', idx === i);
    });
  },

  _initNameEntry() {
    document.getElementById('new-game-btn').onclick = () => {
      document.getElementById('save-slots-section').classList.add('hidden');
      document.getElementById('name-entry-section').classList.remove('hidden');
      document.getElementById('player-name-input').focus();
    };
    document.getElementById('back-to-saves-btn').onclick = () => {
      document.getElementById('name-entry-section').classList.add('hidden');
      document.getElementById('save-slots-section').classList.remove('hidden');
    };
    const startFn = () => {
      const name = document.getElementById('player-name-input').value.trim();
      if (!name) { this.toast('Please enter a name', 'error'); return; }
      GAME.startNewGame(name, this._selectedSlot);
    };
    document.getElementById('begin-journey-btn').onclick = startFn;
    document.getElementById('player-name-input').addEventListener('keydown', e => { if (e.key === 'Enter') startFn(); });
  },

  _initTopBarButtons() {
    document.getElementById('save-btn').onclick = () => {
      if (GAME.state) {
        SAVE.save(GAME.state.saveSlot);
      }
    };
  },

  transitionToGame() {
    document.getElementById('startup-screen').classList.remove('active');
    setTimeout(() => {
      document.getElementById('game-screen').classList.add('active');
    }, 400);
  },

  updateStats() {
    const s = GAME.state;
    if (!s) return;
    document.getElementById('char-name-display').textContent = s.playerName;
    document.getElementById('char-class-display').textContent = `Wanderer · Lv ${s.level}`;
    document.getElementById('hp-bar').style.width = pct(s.hp, s.maxHp) + '%';
    document.getElementById('hp-text').textContent = `${s.hp}/${s.maxHp}`;
    document.getElementById('mp-bar').style.width = pct(s.mp, s.maxMp) + '%';
    document.getElementById('mp-text').textContent = `${s.mp}/${s.maxMp}`;
    document.getElementById('xp-bar').style.width = pct(s.xp, s.xpNext) + '%';
    document.getElementById('xp-text').textContent = `${s.xp}/${s.xpNext}`;
    document.getElementById('str-val').textContent = s.str;
    document.getElementById('dex-val').textContent = s.dex;
    document.getElementById('int-val').textContent = s.int;
    document.getElementById('gold-val').textContent = s.gold;
    this.renderEquipment();
    this.renderInventory();
    this.renderSpells();
  },

  renderEquipment() {
    const s = GAME.state;
    if (!s) return;
    const el = document.getElementById('equipment-display');
    el.innerHTML = '';
    const rows = [
      { label:'Weapon', item: s.weapon },
      { label:'Armor',  item: s.armor },
      { label:'Acc.',   item: s.accessory },
    ];
    rows.forEach(r => {
      const div = document.createElement('div');
      div.className = 'equip-row';
      if (r.item) {
        div.innerHTML = `<span class="equip-label">${r.label}</span><span class="equip-name">${r.item.emoji||''} ${r.item.name}</span><span class="equip-stat">${r.item.damage ? r.item.damage[0]+'-'+r.item.damage[1]+' dmg' : ''}</span>`;
      } else {
        div.innerHTML = `<span class="equip-label">${r.label}</span><span style="color:var(--mist);font-size:0.75rem;font-style:italic">Empty</span>`;
      }
      el.appendChild(div);
    });
    // Artifacts
    if (s.artifacts && s.artifacts.length > 0) {
      const ah = document.createElement('div');
      ah.style.cssText = 'margin-top:8px; font-size:0.68rem; color:var(--gold-dim); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:4px;';
      ah.textContent = 'Artifacts';
      el.appendChild(ah);
      s.artifacts.forEach(id => {
        const a = ARTIFACTS.find(x=>x.id===id);
        if (!a) return;
        const div = document.createElement('div');
        div.className = 'equip-row';
        div.innerHTML = `<span>${a.emoji}</span><span class="equip-name" style="color:var(--gold)">${a.name}</span>`;
        div.title = a.desc;
        el.appendChild(div);
      });
    }
  },

  renderInventory() {
    const s = GAME.state;
    if (!s) return;
    const grid = document.getElementById('inventory-grid');
    grid.innerHTML = '';
    if (!s.inventory.length) {
      const e = document.createElement('div');
      e.className = 'inv-empty';
      e.textContent = 'Empty';
      grid.appendChild(e);
      return;
    }
    s.inventory.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'inv-item';
      div.innerHTML = `<span>${item.emoji||'📦'}</span><span class="inv-item-label">${item.name}</span>`;
      div.title = item.desc || item.description || item.name;
      div.onclick = () => { s.useItem(idx); this.updateStats(); };
      grid.appendChild(div);
    });
  },

  renderSpells() {
    const s = GAME.state;
    if (!s) return;
    const list = document.getElementById('spell-list');
    list.innerHTML = '';
    s.spells.forEach(name => {
      const spell = SPELL_DATA.find(sp=>sp.name===name);
      if (!spell) return;
      const div = document.createElement('div');
      div.className = 'spell-chip';
      div.innerHTML = `<span class="spell-chip-name">${spell.icon} ${spell.name}</span><span class="spell-chip-cost">${spell.cost} MP</span>`;
      div.title = spell.desc;
      list.appendChild(div);
    });
  },

  updateCompanions() {
    const s = GAME.state;
    if (!s) return;
    const list = document.getElementById('companions-list');
    list.innerHTML = '';
    if (!s.companions.length) {
      list.innerHTML = '<p class="dim-text">No companions yet…</p>';
      return;
    }
    s.companions.forEach(id => {
      const c = COMPANION_DATA[id];
      if (!c) return;
      const curHp = s.companionHp[id] || 0;
      const div = document.createElement('div');
      div.className = 'companion-card';
      div.innerHTML = `
        <div class="companion-avatar">${c.emoji}</div>
        <div class="companion-info">
          <div class="companion-name">${c.name}</div>
          <div class="companion-role">${c.role}</div>
          <div class="companion-hp">
            <div class="companion-hp-bar-wrap"><div class="companion-hp-bar" style="width:${pct(curHp,c.baseHp)}%"></div></div>
            <span class="companion-hp-label">${curHp}/${c.baseHp}</span>
          </div>
        </div>`;
      list.appendChild(div);
    });
  },

  updateQuests() {
    const s = GAME.state;
    if (!s) return;
    const log = document.getElementById('quest-log');
    log.innerHTML = '';
    const qs = Object.values(s.quests || {});
    if (!qs.length) { log.innerHTML = '<p class="dim-text">Seek your destiny…</p>'; return; }
    qs.filter(q=>!q.complete).forEach(q => {
      const div = document.createElement('div');
      div.className = 'quest-item' + (q.complete ? ' completed' : '');
      const nextStage = q.stages ? q.stages.find(st=>!st.complete) : null;
      div.innerHTML = `
        <div class="quest-title">${q.title}</div>
        ${nextStage ? `<div class="quest-desc">${nextStage.text}</div>` : ''}
        <div class="quest-reward">🎁 ${q.reward?.gold||0}g · ${q.reward?.xp||0} XP</div>`;
      log.appendChild(div);
    });
    if (!log.children.length) log.innerHTML = '<p class="dim-text">All quests complete!</p>';
  },

  renderSavePanel() {
    const panel = document.getElementById('save-panel');
    panel.innerHTML = '';
    for (let i = 0; i < MAX_SAVES; i++) {
      const data = SAVE.get(i);
      const div = document.createElement('div');
      div.className = 'save-slot-mini';
      if (data) {
        div.innerHTML = `<span class="save-mini-name">Slot ${i+1}: ${data.playerName} Lv${data.level}</span><span class="save-mini-action">Save here</span>`;
        div.onclick = () => SAVE.save(i);
      } else {
        div.innerHTML = `<span class="save-mini-name" style="color:var(--mist)">Slot ${i+1}: Empty</span><span class="save-mini-action">Save here</span>`;
        div.onclick = () => SAVE.save(i);
      }
      panel.appendChild(div);
    }
  },

  updateQuickNav(currentLoc) {
    const nav = document.getElementById('quick-nav');
    nav.innerHTML = '';
    const locs = [
      { key:'ashenreach',   label:'🏙 Ashenreach' },
      { key:'obsidian_marsh',label:'🌿 Obsidian Marsh' },
      { key:'ancient_temple',label:'🏛 Ancient Temple' },
    ];
    locs.forEach(l => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn' + (currentLoc === l.key ? ' active' : '');
      btn.textContent = l.label;
      btn.onclick = () => {
        if (l.key === 'ashenreach') { GAME.setLocation('ashenreach'); GAME.goScene('ashenreach'); }
        else if (l.key === 'obsidian_marsh') ACTIONS.travel_marsh();
        else if (l.key === 'ancient_temple') ACTIONS.travel_temple();
        UI.closeAllSidebars();
      };
      nav.appendChild(btn);
    });
  },

  toast(msg, type = '') {
    const c = document.getElementById('toast-container');
    const div = document.createElement('div');
    div.className = `toast ${type}`;
    div.textContent = msg;
    c.appendChild(div);
    setTimeout(() => {
      div.classList.add('out');
      setTimeout(() => div.remove(), 400);
    }, 2800);
  },
};

// ===================================================================
// COMBAT ENGINE
// ===================================================================

function startCombat(enemyKey, onVictory, onDefeat) {
  const template = ENEMY_DATA[enemyKey];
  if (!template) { GAME.log('⚠ Unknown enemy: ' + enemyKey, 'system'); return; }

  const enemy = { ...template, curHp: template.hp };
  const s = GAME.state;
  let playerDodging = false;

  GAME.divider('COMBAT');
  GAME.log(`⚔️ <strong>${enemy.emoji} ${enemy.name}</strong> attacks! (${enemy.curHp} HP) — ${enemy.desc}`, 'combat');

  function combatActions() {
    const acts = [
      { text:`⚔️ Attack with ${s.weapon.name}`, action: doAttack },
      { text:`🛡️ Defend`, action: doDefend },
    ];
    // Spell actions
    s.spells.forEach(spName => {
      const sp = SPELL_DATA.find(x=>x.name===spName);
      if (sp && s.mp >= sp.cost) {
        acts.push({ text:`${sp.icon} ${sp.name} (${sp.cost} MP)`, action: () => doSpell(sp) });
      }
    });
    // Inventory usable in combat
    s.inventory.forEach((item, idx) => {
      if (item.type === 'potion') {
        acts.push({ text:`${item.emoji} Use ${item.name}`, action: () => { s.useItem(idx); UI.updateStats(); combatActions(); } });
      }
    });
    acts.push({ text:`🏃 Flee`, action: doFlee, danger: true });
    GAME.showActions(acts);
  }

  function doAttack() {
    const base = rng(s.weapon.damage[0], s.weapon.damage[1]);
    const strBonus = Math.floor((s.str + s.getStrBonus()) / 2);
    const compBonus = s.companionDamageBonus();
    const undeadBonus = s.companionUndeadBonus(enemy);
    let dmg = base + strBonus + compBonus + undeadBonus;
    // Special weapon effects
    if (s.weapon.special === 'poison') { enemy.poisoned = (enemy.poisoned||0) + 3; }
    if (s.weapon.special === 'shock')  { dmg += rng(2,5); }
    if (s.weapon.special === 'veilbane' && enemy.finalBoss) dmg = Math.floor(dmg * 1.3);
    if (s.weapon.special === 'undead_bane') dmg += 4;
    enemy.curHp -= dmg;
    GAME.log(`⚔️ You strike <strong>${enemy.name}</strong> for <strong>${dmg}</strong> damage!`, 'combat');
    checkEnemyDead();
  }

  function doDefend() {
    playerDodging = true;
    GAME.log(`🛡️ You brace yourself, reducing the next hit by 50%.`, 'combat');
    enemyTurn();
  }

  function doSpell(sp) {
    s.mp -= sp.cost;
    if (sp.type === 'damage') {
      const intBonus = Math.floor(s.int / 3);
      const dmg = rng(sp.damage[0], sp.damage[1]) + intBonus;
      enemy.curHp -= dmg;
      GAME.log(`${sp.icon} <strong>${sp.name}</strong> blasts ${enemy.name} for <strong>${dmg}</strong> magic damage!`, 'combat');
      checkEnemyDead();
    } else if (sp.type === 'heal') {
      const h = s.heal(rng(sp.heal[0], sp.heal[1]));
      GAME.log(`${sp.icon} <strong>${sp.name}</strong> restores <strong>${h}</strong> HP.`, 'heal');
      UI.updateStats(); enemyTurn();
    } else if (sp.type === 'drain') {
      const intBonus = Math.floor(s.int / 3);
      const dmg = rng(sp.damage[0], sp.damage[1]) + intBonus;
      enemy.curHp -= dmg;
      const h = s.heal(rng(sp.heal[0], sp.heal[1]));
      GAME.log(`${sp.icon} <strong>${sp.name}</strong> drains ${dmg} from ${enemy.name} and restores ${h} HP.`, 'combat');
      UI.updateStats(); checkEnemyDead();
    } else if (sp.dodge) {
      s._dodgeNext = true;
      GAME.log(`🌑 You phase into shadow — next attack will miss.`, 'system');
      UI.updateStats(); enemyTurn();
    } else if (sp.armor) {
      s._armorNext = true;
      GAME.log(`🪨 Stone Skin hardens your flesh for 1 turn.`, 'system');
      UI.updateStats(); enemyTurn();
    } else if (sp.teleport) {
      GAME.log(`🌀 You tear a hole in space and vanish from the fight!`, 'system');
      GAME.setLocation('ashenreach');
      GAME.goScene('ashenreach');
    } else if (sp.reveal) {
      GAME.log(`👁 Veil Sight reveals: ${enemy.name} has <strong>${enemy.curHp}/${enemy.hp} HP</strong>. Its weakness: ${enemy.boss ? 'magic' : 'physical attacks'}.`, 'system');
      UI.updateStats(); combatActions();
    } else {
      UI.updateStats(); enemyTurn();
    }
  }

  function doFlee() {
    const fleeDex = s.dex + s.level * 2;
    const enemySpeed = 12;
    if (Math.random() * (fleeDex + enemySpeed) < fleeDex) {
      GAME.log(`🏃 You successfully flee the battle!`, 'system');
      GAME.goScene(s.location === 'obsidian_marsh' ? 'marsh_hub' : 'ashenreach');
    } else {
      GAME.log(`🏃 You try to flee but ${enemy.name} cuts you off!`, 'damage');
      enemyTurn();
    }
  }

  function checkEnemyDead() {
    // Poison tick
    if (enemy.poisoned) {
      const ptick = rng(1,3);
      enemy.curHp -= ptick;
      enemy.poisoned--;
      GAME.log(`☠ ${enemy.name} takes ${ptick} poison damage.`, 'combat');
    }
    UI.updateStats();
    if (enemy.curHp <= 0) {
      doVictory();
    } else {
      GAME.log(`${enemy.emoji} <em>${enemy.name}: ${enemy.curHp}/${enemy.hp} HP remaining</em>`, 'system');
      enemyTurn();
    }
  }

  function enemyTurn() {
    // Check dodge
    if (s._dodgeNext || s.hasDodgeBuff()) {
      s._dodgeNext = false;
      GAME.log(`🌑 ${enemy.name}'s attack passes through your shadow form!`, 'system');
      s.tickBuffs();
      UI.updateStats();
      if (s.hp <= 0) { doDefeat(); return; }
      combatActions();
      return;
    }

    let dmg = rng(enemy.damage[0], enemy.damage[1]);
    if (playerDodging) { dmg = Math.floor(dmg * 0.5); playerDodging = false; }

    // Boss multi-phase
    if (enemy.finalBoss && enemy.curHp < enemy.hp * 0.5 && !enemy._phase2) {
      enemy._phase2 = true;
      GAME.log(`☠ <strong>The Wraithcaller draws on forbidden power! Phase 2 begins!</strong>`, 'boss');
      enemy.damage = [enemy.damage[0]+5, enemy.damage[1]+8];
    }

    const finalDmg = s.takeDamage(dmg);
    GAME.log(`💥 ${enemy.emoji} ${enemy.name} attacks you for <strong>${finalDmg}</strong> damage!`, 'damage');
    s.tickBuffs();
    UI.updateStats();

    if (s.hp <= 0) { doDefeat(); return; }
    combatActions();
  }

  function doVictory() {
    GAME.divider('VICTORY');
    const goldBase = rng(enemy.gold[0], enemy.gold[1]);
    const goldBonus = s.companionGoldBonus(goldBase);
    const goldTotal = goldBase + goldBonus;
    s.gold += goldTotal;
    const leveled = s.gainXP(enemy.xp);

    GAME.log(`🎉 <strong>${enemy.name} defeated!</strong> +${goldTotal} gold · +${enemy.xp} XP${goldBonus ? ` (Lyra found ${goldBonus} extra!)` : ''}`, 'victory');
    if (leveled) {
      GAME.log(`⭐ <strong>LEVEL UP!</strong> You are now level ${s.level}. All stats improved!`, 'levelup');
    }

    // Companion heal after combat
    s.companionHealAfterCombat();

    // Quest progress: marsh kills
    if (['marsh_skeleton','corrupt_spirit','mud_golem','shadow_wraith'].includes(enemyKey)) {
      s.questKills = (s.questKills || 0) + 1;
      const q = s.quests['main2'];
      if (q && !q.stages[0].complete && s.questKills >= 3) {
        q.stages[0].complete = true;
        GAME.log(`📜 Quest updated: You\'ve driven back enough enemies. Find the Bonewright.`, 'system');
        UI.updateQuests();
      }
    }
    if (enemyKey === 'bonewright') {
      const q = s.quests['main2'];
      if (q) { q.stages[1].complete = true; q.stages[2].complete = true; s.completeQuest('main2'); }
      // Give artifact reward
      const art = ARTIFACTS.find(a=>a.id==='seers_eye');
      if (art) { s.addArtifact(art); GAME.log(`💎 You discovered the <strong>Seer\'s Eye</strong> artifact!`, 'loot'); }
    }
    if (enemyKey === 'wraithcaller') {
      onFinalVictory();
      return;
    }

    UI.updateStats();
    SAVE.save(s.saveSlot);

    if (onVictory) onVictory();
    else GAME.goScene(s.location === 'obsidian_marsh' ? 'marsh_hub' : 'ashenreach');
  }

  function doDefeat() {
    GAME.divider('DEFEAT');
    GAME.log(`💀 <strong>You have fallen in battle.</strong><br><em>The darkness claims another wanderer. But legends do not die so easily…</em>`, 'damage');
    s.hp = Math.max(1, Math.floor(s.maxHp * 0.3));
    s.mp = Math.floor(s.maxMp * 0.5);
    UI.updateStats();
    if (onDefeat) onDefeat();
    else {
      GAME.showActions([
        { text:'🔄 Limp back to Ashenreach', action: () => { GAME.setLocation('ashenreach'); GAME.goScene('ashenreach'); } },
        { text:'⚔️ Try again (reload last save)', action: () => location.reload() }
      ]);
    }
  }

  function onFinalVictory() {
    s.quests['main3'] && s.completeQuest('main3');
    // Grant Veilpiercer
    const vp = WEAPON_DATA.legendary.find(w=>w.name==='Veilpiercer');
    if (vp) {
      s.weapon = { ...vp };
      GAME.log(`⚔️ <strong>LEGENDARY WEAPON CLAIMED:</strong> The Veilpiercer is yours!`, 'loot');
    }
    GAME.log(`
      <strong>⚔️ THE VEIL IS SHATTERED ⚔️</strong><br><br>
      The Wraithcaller's dark form dissolves, his soul finally freed from the corruption
      that consumed him. The Obsidian Marsh begins to stir — as if breathing for the first 
      time in decades.<br><br>
      You stand at the heart of the Ancient Temple, Veilpiercer in hand, your companions
      at your side. Behind you lies the journey: the dark alleys of Ashenreach, the twisted
      paths of the marsh, the friendships forged in shadow.<br><br>
      They will sing of this day, ${s.playerName}. <em>The Wanderer who shattered the Veil.</em><br><br>
      <strong>🏆 YOU HAVE COMPLETED SHATTERED VEIL!</strong>
    `, 'victory');

    SAVE.save(s.saveSlot);
    UI.updateStats();
    GAME.showActions([
      { text:'🌐 Continue exploring', action: () => GAME.goScene('ashenreach') },
      { text:'🔄 New Journey', action: () => location.reload() },
    ]);
  }

  // Start first turn
  combatActions();
}

// ===================================================================
// SCENES
// ===================================================================

const SCENES = {

  /* ---- INTRO ---- */
  intro: {
    text: () => {
      const s = GAME.state;
      return `The cart that carried you to <strong>Ashenreach</strong> shudders to a halt at the city gates. 
      You pull your cloak tighter — this place breathes differently. The sky is the color of old ash, 
      permanently caught between dusk and night. They say the sun hasn't touched Ashenreach in three years.<br><br>
      Merchants push past you. Guards eye you with the weary suspicion of people who've seen too much. 
      Somewhere in the distance, a bell tolls — one, two, three — then stops. An old woman beside you 
      mutters: <em>"Count the bells. When they stop before seven, someone's been taken."</em><br><br>
      You are <strong>${s.playerName}</strong>, and you've come here for a reason. The letter. 
      The one that said: <em>"Come to Ashenreach. The Veil is breaking. We need someone who isn't afraid of the dark."</em><br><br>
      You fold the letter, pocket it, and step into the twilight city.`;
    },
    actions: [
      { text:'🏛️ Head to Town Hall — find Mayor Eldric', action:'town_hall' },
      { text:'🍺 Enter the Blackthorn Inn first', action:'inn' },
      { text:'🗺 Explore the city streets', action:'city_streets' },
    ]
  },

  /* ---- ASHENREACH HUB ---- */
  ashenreach: {
    text: () => {
      const s = GAME.state;
      const companionLine = s.companions.length > 0
        ? `<br><br>Your companions — ${s.companions.map(id=>COMPANION_DATA[id].name).join(', ')} — are close by.`
        : '';
      return `You stand in the center of <strong>Ashenreach</strong>. 
      The eternal twilight casts long purple shadows across the cobblestones. 
      Somewhere a merchant haggles. A guard patrol passes with spears alight.${companionLine}<br><br>
      <em>Where do you go?</em>`;
    },
    actions: () => {
      const s = GAME.state;
      const acts = [
        { text:'🏛️ Town Hall — speak with Mayor Eldric', action:'town_hall' },
        { text:'🍺 Blackthorn Inn', action:'inn' },
        { text:'⚔️ Grimwald\'s Forge', action:'blacksmith' },
        { text:'🧪 Moonveil Apothecary', action:'apothecary' },
        { text:'🛍 Market Stalls', action:'market' },
        { text:'🌿 Journey to the Obsidian Marsh', action: () => ACTIONS.travel_marsh() },
      ];
      if (s.flags.seris_met && !s.quests['side2']?.complete) {
        acts.push({ text:'⚓ Find Captain Seris', action:'seris' });
      }
      return acts;
    }
  },

  /* ---- TOWN HALL ---- */
  town_hall: {
    text: () => {
      const s = GAME.state;
      if (!s.npcMet.eldric) {
        s.npcMet.eldric = true;
        return `The <strong>Town Hall</strong> is grand but worn — its columns cracked, its mosaics faded. 
        Mayor <strong>Eldric</strong>, silver-haired and red-eyed from too many sleepless nights, 
        looks up when you enter.<br><br>
        "Another adventurer. Good — we need them." He sets down a scroll. 
        "You arrived today, yes? Then you haven't heard. Three people taken last night. Pulled right off 
        the eastern bridge." He lowers his voice. "We think it's the Wraithcaller. 
        His reach grows longer every week."<br><br>
        He slides a parchment toward you. <em>"This is a commission. Whoever can push back the marsh's 
        corruption — we'll pay. Well."</em>`;
      }
      return `Mayor <strong>Eldric</strong> looks tired but manages a nod of greeting.
      "Any progress? The city holds its breath."`;
    },
    onEnter: () => {
      const s = GAME.state;
      if (!s.quests['main1']) s.startQuest('main1');
    },
    actions: [
      { text:'❓ Ask about the Obsidian Marsh', action:'marsh_info' },
      { text:'⚔️ Ask about the Wraithcaller', action:'wraithcaller_info' },
      { text:'📋 Quest Board', action:'quest_board' },
      { text:'🔮 Ask about the Veil', action:'veil_lore' },
      { text:'← Back to Ashenreach', action:'ashenreach' },
    ]
  },

  /* ---- INN ---- */
  inn: {
    text: () => {
      const s = GAME.state;
      let lyraLine = '';
      if (!s.companions.includes('lyra') && !s.flags.lyra_met) {
        lyraLine = `<br><br>Near the hearth sits a young woman you don't recognize. She's watching the room 
        with the practiced attention of someone who knows exactly which patrons are drunk enough to be careless with their coin purses. 
        Your eyes meet. She raises her mug with a half-smile.`;
      }
      return `The <strong>Blackthorn Inn</strong> is loud and warm — a rare combination in Ashenreach. 
      <strong>Orin</strong> the innkeeper bellows a greeting across the common room. 
      <em>"New face! First drink is free — city rule!"</em><br><br>
      The air smells of stew, wood smoke, and the faint copper tang of adventurers who've had bad nights. 
      <strong>Ravyn the Storyteller</strong> holds court in the corner, her voice dropping to a hush 
      as she describes something that makes her audience lean forward.${lyraLine}`;
    },
    actions: () => {
      const s = GAME.state;
      const acts = [
        { text:'🍻 Buy a round — listen for news', action:'inn_drink' },
        { text:'🃏 Play cards with Orin', action:'inn_cards' },
        { text:'📚 Listen to Ravyn\'s stories', action:'inn_ravyn' },
        { text:'🛏 Rent a room (15g — full rest)', action:'inn_rest' },
      ];
      if (!s.companions.includes('lyra') && !s.flags.lyra_met) {
        acts.push({ text:'🧝 Approach the woman by the hearth', action:'inn_lyra' });
      } else if (s.companions.includes('lyra')) {
        acts.push({ text:'🧝 Talk to Lyra', action:'companion_lyra_talk' });
      }
      acts.push({ text:'← Back to Ashenreach', action:'ashenreach' });
      return acts;
    }
  },

  /* ---- BLACKSMITH ---- */
  blacksmith: {
    text: () => {
      const s = GAME.state;
      let torvinLine = '';
      if (!s.companions.includes('torvin') && !s.flags.torvin_met) {
        torvinLine = `<br><br>At the back, a broad-shouldered man in civilian clothes inspects a sword 
        with the careful eye of someone who knows how to use one. He glances at you without expression.`;
      }
      return `<strong>Grimwald's Forge</strong> shakes with the rhythm of hammer on steel. 
      The smith himself — built like a mountain given bad temper — glances up and gives you a nod 
      that passes for warm around here.<br><br>
      <em>"You look like trouble. Good. Trouble needs good steel."</em><br><br>
      Racks of weapons line every wall. The forge breathes heat in waves.${torvinLine}`;
    },
    actions: () => {
      const s = GAME.state;
      const acts = [
        { text:'🛒 Browse basic weapons', action:'shop_basic_weapons' },
        { text:'✨ Browse advanced weapons', action:'shop_advanced_weapons' },
        { text:'💪 Strength training', action:'train_strength' },
      ];
      if (!s.companions.includes('torvin') && !s.flags.torvin_met) {
        acts.push({ text:'🧔 Speak to the soldier', action:'blacksmith_torvin' });
      } else if (s.companions.includes('torvin')) {
        acts.push({ text:'🧔 Talk to Torvin', action:'companion_torvin_talk' });
      }
      acts.push({ text:'← Back to Ashenreach', action:'ashenreach' });
      return acts;
    }
  },

  /* ---- APOTHECARY ---- */
  apothecary: {
    text: () => {
      const s = GAME.state;
      return `<strong>Moonveil Apothecary</strong> hums with contained magic. 
      Bottles glow on every shelf. The smell is complex — lavender and sulfur and something sweeter, darker.<br><br>
      <strong>Selene</strong> emerges from behind a curtain. She's been expecting you. She always seems to be expecting you.<br><br>
      <em>"${s.playerName}. I wondered when you'd come in. Sit. I'll make tea. 
      And then I'll tell you something about the Wraithcaller that the Mayor doesn't know."</em>`;
    },
    actions: () => {
      const s = GAME.state;
      const acts = [
        { text:'🍯 Buy potions', action:'shop_potions' },
        { text:'📜 Buy spells', action:'shop_spells' },
        { text:'🧠 Intelligence training', action:'train_intelligence' },
        { text:'🔮 Ask about the Wraithcaller (lore)', action:'apothecary_lore' },
      ];
      if (!s.companions.includes('selene') && s.flags.apothecary_lore_heard) {
        acts.push({ text:'🧙‍♀️ Ask Selene to join you', action:'apothecary_deep' });
      } else if (s.companions.includes('selene')) {
        acts.push({ text:'🧙‍♀️ Talk to Selene', action:'companion_selene_talk' });
      }
      acts.push({ text:'← Back to Ashenreach', action:'ashenreach' });
      return acts;
    }
  },

  /* ---- MARKET ---- */
  market: {
    text: `The <strong>Market Stalls</strong> sprawl across the central square. 
    Merchants hawk everything from salted marsh-fish to enchanted trinkets of dubious provenance. 
    A fortune teller's tent glows at the far end. A spice merchant argues loudly with a dockworker. 
    Life, chaotic and stubborn, happening despite everything.`,
    actions: [
      { text:'🔮 Visit the fortune teller', action:'fortune_teller' },
      { text:'🧿 Browse curiosities', action:'market_browse' },
      { text:'💰 Do odd jobs for coin', action:'odd_jobs' },
      { text:'← Back to Ashenreach', action:'ashenreach' },
    ]
  },

  /* ---- MARSH HUB ---- */
  marsh_hub: {
    text: () => {
      const s = GAME.state;
      return `The <strong>Obsidian Marsh</strong> stretches before you — an endless expanse of black water 
      and skeletal trees. The sky here is darker than even Ashenreach. Things move in the mist.
      <br><br>Your instincts scream. Your curiosity is louder.<br><br>
      <em>${s.companions.length > 0 ? s.companions.map(id=>`${COMPANION_DATA[id].emoji} ${COMPANION_DATA[id].name}: "${COMPANION_DATA[id].dialogues[Math.floor(Math.random()*3)]}"<br>`).join('') : 'You are alone out here.'}</em>`;
    },
    onEnter: () => {
      GAME.setLocation('obsidian_marsh');
      const s = GAME.state;
      if (!s.quests['main2']) s.startQuest('main2');
      if (!s.companions.includes('kael') && !s.flags.kael_met) {
        setTimeout(()=>{
          GAME.log(`👤 A figure steps out from the mist. He carries a crossbow, has three days of stubble, and the eyes of someone who hasn't slept indoors in weeks.<br><em>"You're headed into the marsh? Alone? Bold. Or stupid. I haven't decided."</em>`, 'companion');
          GAME.showActions([
            { text:'🧑‍🦱 Talk to the stranger', action:'marsh_kael' },
            ...SCENES.marsh_hub.actions
          ]);
        }, 400);
      }
    },
    actions: [
      { text:'⚔️ Hunt enemies', action:'marsh_hunt' },
      { text:'🔍 Search for treasures / artifacts', action:'marsh_search' },
      { text:'🌿 Go deeper into the marsh', action:'marsh_deeper' },
      { text:'🏛 Approach the Ancient Temple', action:'marsh_temple' },
      { text:'🏙 Return to Ashenreach', action:'ashenreach' },
    ]
  },
};

// ===================================================================
// ACTIONS
// ===================================================================

const ACTIONS = {

  /* ---- NAVIGATION ---- */
  travel_marsh: () => {
    const s = GAME.state;
    if (s.level < 2) {
      GAME.log(`🌿 The path to the Obsidian Marsh unnerves you. You sense you need more experience before venturing there. <em>(Reach level 2 first)</em>`, 'system');
      GAME.goScene('ashenreach');
      return;
    }
    GAME.goScene('marsh_hub');
  },
  travel_temple: () => {
    const s = GAME.state;
    if (s.level < 5) {
      GAME.log(`🏛 A wall of dark energy pushes you back. You are not yet strong enough. <em>(Reach level 5)</em>`, 'system');
      return;
    }
    GAME.setLocation('ancient_temple');
    GAME.goScene('marsh_temple');
  },

  /* ---- TOWN HALL ACTIONS ---- */
  marsh_info: () => {
    GAME.log(`🌿 Eldric's face darkens. <em>"Three years ago the marsh was a wetland where children caught frogs. 
    Now it's a necromancer's playground. The Wraithcaller — we don't know who he was before the corruption — 
    commands legions of undead. They grow bolder. Last month they reached the eastern gate."</em><br><br>
    <em>"The marsh has layers. Outer paths — manageable. The inner marsh — dangerous. 
    The temple at its heart — don't go alone."</em>`, 'system');
    GAME.goScene('town_hall');
  },

  wraithcaller_info: () => {
    GAME.log(`☠ Eldric stands. <em>"The Wraithcaller was once a man. A mage, actually — quite brilliant. 
    He came to study the Veil, the barrier between worlds, here in the marsh where it's thinnest. 
    Something on the other side spoke to him. What it offered, I don't know. 
    What it took was everything."</em><br><br>
    <em>"He is powerful. Do not face him alone or underprepared."</em>`, 'boss');
    GAME.goScene('town_hall');
  },

  quest_board: () => {
    GAME.log(`📋 <strong>Ashenreach Quest Board:</strong><br><br>
    🟡 <strong>Shadows at the Gate</strong> — Investigate eastern gate incidents · 60g, 80 XP<br>
    🟡 <strong>Into the Obsidian Marsh</strong> — Fight back the undead · 150g, 200 XP<br>
    🟡 <strong>The Shattered Veil</strong> — Defeat the Wraithcaller · 300g, 500 XP, Veilpiercer<br>
    ⚪ <strong>Lost in the Marsh</strong> — Find the missing apprentice · 80g, 60 XP<br>
    ⚪ <strong>Orin's Debt</strong> — Help the innkeeper · 45g, 50 XP<br>
    ⚪ <strong>Ravyn's Lost Tome</strong> — Recover a book from the marsh · 60g, 70 XP, Veil Sight<br>`, 'system');
    GAME.goScene('town_hall');
  },

  veil_lore: () => {
    GAME.log(`🔮 <em>"The Veil,"</em> Eldric says slowly, <em>"is what separates our world from whatever lies beyond. 
    Magic bleeds through it. Sometimes worse things do. 
    The marsh is where it's thinnest — always has been. That's why the first mages built here. 
    That's why the Wraithcaller chose it."</em><br><br>
    <em>"They say if the Veil tears completely, the boundary dissolves. What comes through…"</em> 
    He shakes his head. <em>"We cannot let that happen."</em>`, 'system');
    GAME.goScene('town_hall');
  },

  /* ---- INN ACTIONS ---- */
  inn_drink: () => {
    const s = GAME.state;
    if (s.gold < 5) { GAME.log(`💰 You can't afford a drink. (5g needed)`, 'system'); GAME.goScene('inn'); return; }
    s.gold -= 5;
    const gossip = [
      `Orin leans in: <em>"Captain Seris recruited three adventurers last week. Only one came back. She didn't say what happened to the other two."</em>`,
      `A merchant at the end of the bar: <em>"I heard the Bonewright — that's the Wraithcaller's lieutenant — can raise the dead mid-battle. Take the head clean off, that's what you need to do."</em>`,
      `A young guard, cups in: <em>"My grandmother says the marsh used to sing. Pretty songs, like bells underwater. Now it just… screams. Quietly."</em>`,
    ];
    const info = gossip[Math.floor(Math.random()*gossip.length)];
    GAME.log(`🍻 You buy a round and the room loosens up. ${info}`, 'system');
    UI.updateStats();
    GAME.goScene('inn');
  },

  inn_cards: () => {
    const s = GAME.state;
    if (s.gold < 10) { GAME.log(`💰 You need 10g to play.`, 'system'); GAME.goScene('inn'); return; }
    const roll = Math.random() + (s.dex * 0.01);
    if (roll > 0.65) {
      const win = rng(15,28);
      s.gold += win;
      GAME.log(`🃏 <strong>You win!</strong> A combination of luck and sharp eyes nets you ${win} gold.`, 'loot');
    } else if (roll > 0.35) {
      GAME.log(`🃏 You break even — Orin nods respectfully. <em>"You've played before."</em>`, 'system');
    } else {
      s.gold -= 10;
      GAME.log(`🃏 You lose 10 gold. Orin scoops the coins with a practiced hand. <em>"Better luck."</em>`, 'system');
    }
    UI.updateStats();
    GAME.goScene('inn');
  },

  inn_ravyn: () => {
    const s = GAME.state;
    const tales = [
      `<strong>Ravyn</strong> speaks of the Veil's origin: <em>"The first mages didn't discover the Veil. They made it. 
      They tore something open trying to reach the stars, and what they had to do to close it again — well. 
      That's why we don't speak their names."</em>`,
      `<em>"The Wraithcaller has a name,"</em> Ravyn says, almost to herself. <em>"I knew it once. 
      I've been careful to forget it. Names have power over things that wear them."</em>`,
      `<em>"Did you know,"</em> Ravyn asks with unsettling brightness, <em>"that the marsh used to be called the Silverfen? 
      Beautiful place. Children swam there in summer. Three years changes everything."</em>`,
    ];
    const tale = tales[Math.floor(Math.random()*tales.length)];
    GAME.log(`📚 ${tale}<br><br><em>Your Intelligence sharpens from listening to ancient wisdom.</em>`, 'system');
    s.int++;
    UI.updateStats();
    // Quest
    if (!s.quests['side3']) {
      s.startQuest('side3');
      GAME.log(`📜 <strong>New Quest:</strong> Ravyn's Lost Tome — she mentions a book she left in the marsh.`, 'loot');
    }
    GAME.goScene('inn');
  },

  inn_rest: () => {
    const s = GAME.state;
    if (s.gold < 15) { GAME.log(`💰 A room costs 15g. You don't have enough.`, 'system'); GAME.goScene('inn'); return; }
    s.gold -= 15;
    s.fullRest();
    GAME.log(`🛏 You take a room at the top of the inn. The bed is narrow and the pillow smells of lavender. 
    You sleep better than you have in months. <strong>Full HP and MP restored.</strong>`, 'heal');
    UI.updateStats();
    GAME.goScene('inn');
  },

  inn_lyra: () => {
    const s = GAME.state;
    s.flags.lyra_met = true;
    GAME.log(`🧝 You sit across from the woman. Up close she's younger than she seemed — maybe a year or two younger than you — 
    with quick green eyes and a practiced casualness that hides how alert she is.<br><br>
    <em>"Lyra,"</em> she says, without you asking. <em>"Former… acquisitions consultant. 
    Currently between careers."</em> A pause. <em>"I've been watching you since you walked in. 
    You have the look of someone heading somewhere dangerous. I could use dangerous right now."</em><br><br>
    She slides a folded piece of paper across the table. It's a map. Rough, hand-drawn — 
    but you can see it marks paths through the marsh you didn't know existed.
    <em>"That's yours if you want a partner."</em>`, 'companion');
    GAME.showActions([
      { text:'🧝 Accept — Lyra joins you', action: () => { s.addCompanion('lyra'); s.startQuest('companion1'); GAME.log(`🧝 <strong>Lyra Ashvale joins your party!</strong> <em>"Good choice. Probably."</em>`, 'companion'); GAME.goScene('inn'); } },
      { text:'❌ Decline for now', action: 'inn' },
    ]);
  },

  companion_lyra_talk: () => {
    const s = GAME.state;
    const line = COMPANION_DATA['lyra'].dialogues[Math.floor(Math.random()*3)];
    GAME.log(`🧝 <strong>Lyra:</strong> ${line}`, 'companion');
    if (s.quests['companion1'] && !s.quests['companion1'].complete) {
      GAME.log(`🧝 She hesitates, then: <em>"I should tell you something. About why I'm really here. About what I took from the Wraithcaller's people before they took everything from mine."</em>`, 'companion');
      s.completeQuest('companion1');
    }
    GAME.goScene('inn');
  },

  /* ---- BLACKSMITH ACTIONS ---- */
  blacksmith_torvin: () => {
    const s = GAME.state;
    s.flags.torvin_met = true;
    GAME.log(`🧔 The soldier sets down the sword when you approach. He studies you with flat, professional eyes.<br><br>
    <em>"Torvin. Twenty years city guard, retired two months ago — the same week the marsh got bad enough that the council wouldn't send anyone to hold the line. 
    I'm looking for work that matters."</em><br><br>
    He glances at your equipment. <em>"You're headed to the marsh. I can see it. You'll need someone who knows how to take a hit so you don't have to."</em>`, 'companion');
    GAME.showActions([
      { text:'🧔 Accept — Torvin joins you', action: () => { s.addCompanion('torvin'); GAME.log(`🧔 <strong>Torvin Steelborn joins your party!</strong> <em>"No retreating. We agreed on that."</em>`, 'companion'); GAME.goScene('blacksmith'); } },
      { text:'❌ Not right now', action: 'blacksmith' },
    ]);
  },

  companion_torvin_talk: () => {
    const s = GAME.state;
    const line = COMPANION_DATA['torvin'].dialogues[Math.floor(Math.random()*3)];
    GAME.log(`🧔 <strong>Torvin:</strong> ${line}`, 'companion');
    GAME.goScene('blacksmith');
  },

  /* ---- APOTHECARY ACTIONS ---- */
  apothecary_lore: () => {
    const s = GAME.state;
    s.flags.apothecary_lore_heard = true;
    GAME.log(`🧙‍♀️ Selene pours two cups of tea the color of night sky. 
    <em>"I was his apprentice. The Wraithcaller's. Before the Veil took him — before he let it."</em><br><br>
    She wraps both hands around her cup. <em>"He wasn't evil. He was grieving. 
    His daughter died of the marsh fever, three years before any of this. He went looking for a way to bring her back. 
    The Veil offered him one. The price was everything that made him human."</em><br><br>
    <em>"I ran. I've been building an antidote ever since. Not to cure him — it's too late for that. 
    But the corruption he spread…"</em> She meets your eyes. <em>"I think I can unmake it. 
    If someone can get me close enough."</em>`, 'companion');
    GAME.goScene('apothecary');
  },

  apothecary_deep: () => {
    const s = GAME.state;
    GAME.log(`🧙‍♀️ Selene is already packing when you ask. 
    <em>"I wondered how long it would take you."</em> She lifts a worn satchel. 
    <em>"My knowledge of the marsh, my potions — they're yours. Just… get me to the temple. 
    I need to be there at the end."</em>`, 'companion');
    s.addCompanion('selene');
    GAME.log(`🧙‍♀️ <strong>Selene Moonwhisper joins your party!</strong>`, 'companion');
    GAME.goScene('apothecary');
  },

  companion_selene_talk: () => {
    const line = COMPANION_DATA['selene'].dialogues[Math.floor(Math.random()*3)];
    GAME.log(`🧙‍♀️ <strong>Selene:</strong> ${line}`, 'companion');
    GAME.goScene('apothecary');
  },

  /* ---- MARKET ACTIONS ---- */
  fortune_teller: () => {
    const s = GAME.state;
    if (s.gold < 10) { GAME.log(`💰 The fortune teller wants 10 gold.`, 'system'); GAME.goScene('market'); return; }
    s.gold -= 10;
    const fortunes = [
      `The fortune teller turns over a card: a tower struck by lightning. <em>"You will face something ancient. It will know your name. Do not tell it anything else."</em>`,
      `She draws three cards. Studies them. Then puts them away. <em>"The cards are… reticent. But they agree on one thing: you will not die in the marsh. You will die later, which means you will survive it."</em>`,
      `<em>"You have companions who carry secrets. One will surprise you. Not in a bad way."</em> She closes her eyes. <em>"The compass and the sword will both be needed."</em>`,
    ];
    GAME.log(`🔮 ${fortunes[Math.floor(Math.random()*fortunes.length)]}`, 'system');
    UI.updateStats();
    GAME.goScene('market');
  },

  market_browse: () => {
    const s = GAME.state;
    // Random artifact for sale
    const art = ARTIFACTS.filter(a=>!s.artifacts.includes(a.id))[0];
    if (!art) { GAME.log(`🛍 The stalls have little of interest today.`, 'system'); GAME.goScene('market'); return; }
    const price = 80 + Math.floor(Math.random()*60);
    GAME.log(`🛍 A dusty merchant pulls something from beneath his counter. <em>"Found this in the marsh, I did. 
    Not going back for more."</em> He holds up the <strong>${art.emoji} ${art.name}</strong>.<br>
    <em>${art.desc}</em><br>Price: ${price} gold.`, 'loot');
    GAME.showActions([
      { text:`💰 Buy ${art.name} (${price}g)`, action: () => {
        if (s.gold < price) { GAME.log(`💰 Not enough gold.`, 'system'); }
        else { s.gold -= price; s.addArtifact(art); GAME.log(`💎 You acquire the <strong>${art.name}</strong>!`, 'loot'); UI.updateStats(); }
        GAME.goScene('market');
      }},
      { text:'❌ Not today', action:'market' },
    ]);
  },

  odd_jobs: () => {
    const s = GAME.state;
    const jobs = [
      { desc:'Move crates at the docks', gold: rng(8,15), str:true },
      { desc:'Copy scrolls for a scholar', gold: rng(6,12), int:true },
      { desc:'Deliver packages across the city', gold: rng(5,10), dex:true },
    ];
    const job = jobs[Math.floor(Math.random()*jobs.length)];
    const earned = job.gold;
    s.gold += earned;
    GAME.log(`🔨 You spend a few hours — ${job.desc}. Honest work. +${earned} gold.`, 'loot');
    UI.updateStats();
    GAME.goScene('market');
  },

  /* ---- TRAINING ---- */
  train_strength: () => {
    const s = GAME.state;
    const cost = s.str * 25;
    if (s.gold < cost) { GAME.log(`💰 Strength training costs ${cost}g.`, 'system'); GAME.goScene('blacksmith'); return; }
    s.gold -= cost; s.str++;
    GAME.log(`💪 Grimwald puts you through brutal drills. <strong>STR +1</strong> (cost: ${cost}g)`, 'loot');
    UI.updateStats();
    GAME.goScene('blacksmith');
  },

  train_intelligence: () => {
    const s = GAME.state;
    const cost = s.int * 28;
    if (s.gold < cost) { GAME.log(`💰 Intelligence training costs ${cost}g.`, 'system'); GAME.goScene('apothecary'); return; }
    s.gold -= cost; s.int++; s.maxMp += 5; s.mp = Math.min(s.maxMp, s.mp + 5);
    GAME.log(`🧠 Selene guides you through complex magical theory. <strong>INT +1, max MP +5</strong> (cost: ${cost}g)`, 'loot');
    UI.updateStats();
    GAME.goScene('apothecary');
  },

  /* ---- SHOPS ---- */
  shop_basic_weapons: () => {
    const weapons = WEAPON_DATA.basic;
    let html = `⚔️ <strong>Basic Weapons</strong><br>`;
    weapons.forEach(w => { html += `${w.emoji} ${w.name} — ${w.damage[0]}–${w.damage[1]} dmg — ${w.price}g<br>`; });
    GAME.log(html, 'system');
    GAME.showActions([
      ...weapons.map(w => ({
        text:`💰 Buy ${w.emoji} ${w.name} (${w.price}g)`,
        action: () => {
          const s = GAME.state;
          if (s.gold < w.price) { GAME.log(`💰 Not enough gold.`, 'system'); }
          else { s.gold -= w.price; s.addItem({...w}); UI.updateStats(); GAME.log(`⚔️ Purchased <strong>${w.name}</strong>.`, 'loot'); }
          GAME.goScene('blacksmith');
        }
      })),
      { text:'← Back to forge', action:'blacksmith' },
    ]);
  },

  shop_advanced_weapons: () => {
    const weapons = WEAPON_DATA.advanced;
    let html = `⚔️ <strong>Advanced Weapons</strong><br>`;
    weapons.forEach(w => { html += `${w.emoji} ${w.name} — ${w.damage[0]}–${w.damage[1]} dmg — ${w.price}g${w.special?` [${w.special}]`:''}<br>`; });
    GAME.log(html, 'system');
    GAME.showActions([
      ...weapons.map(w => ({
        text:`💰 Buy ${w.emoji} ${w.name} (${w.price}g)`,
        action: () => {
          const s = GAME.state;
          if (s.gold < w.price) { GAME.log(`💰 Not enough gold.`, 'system'); }
          else { s.gold -= w.price; s.addItem({...w}); UI.updateStats(); GAME.log(`⚔️ Purchased <strong>${w.name}</strong>.`, 'loot'); }
          GAME.goScene('blacksmith');
        }
      })),
      { text:'← Back to forge', action:'blacksmith' },
    ]);
  },

  shop_potions: () => {
    const potions = ITEM_DATA.potions;
    let html = `🧪 <strong>Potions</strong><br>`;
    potions.forEach(p => { html += `${p.emoji} ${p.name} — ${p.price}g<br>`; });
    GAME.log(html, 'system');
    GAME.showActions([
      ...potions.map(p => ({
        text:`💰 Buy ${p.emoji} ${p.name} (${p.price}g)`,
        action: () => {
          const s = GAME.state;
          if (s.gold < p.price) { GAME.log(`💰 Not enough gold.`, 'system'); }
          else { s.gold -= p.price; s.addItem({...p}); UI.updateStats(); GAME.log(`🧪 Purchased <strong>${p.name}</strong>.`, 'loot'); }
          GAME.goScene('apothecary');
        }
      })),
      { text:'← Back to apothecary', action:'apothecary' },
    ]);
  },

  shop_spells: () => {
    const s = GAME.state;
    const available = SPELL_DATA.filter(sp=>!s.spells.includes(sp.name)).slice(0,5);
    if (!available.length) {
      GAME.log(`📜 <em>"You know all the spells I can teach. Seek out ancient grimoires for more."</em>`, 'system');
      GAME.goScene('apothecary'); return;
    }
    let html = `📜 <strong>Spells to Learn</strong><br>`;
    available.forEach(sp => { html += `${sp.icon} ${sp.name} — ${sp.cost*10}g — ${sp.desc}<br>`; });
    GAME.log(html, 'system');
    GAME.showActions([
      ...available.map(sp => ({
        text:`📚 Learn ${sp.icon} ${sp.name} (${sp.cost*10}g)`,
        action: () => {
          const cost = sp.cost * 10;
          if (s.gold < cost) { GAME.log(`💰 Not enough gold.`, 'system'); }
          else { s.gold -= cost; s.spells.push(sp.name); UI.updateStats(); GAME.log(`📜 You learned <strong>${sp.name}</strong>!`, 'loot'); }
          GAME.goScene('apothecary');
        }
      })),
      { text:'← Back to apothecary', action:'apothecary' },
    ]);
  },

  /* ---- MARSH ACTIONS ---- */
  marsh_hunt: () => {
    const s = GAME.state;
    const pool = s.level <= 2
      ? ['marsh_skeleton','corrupt_spirit']
      : s.level <= 4
        ? ['marsh_skeleton','corrupt_spirit','mud_golem','shadow_wraith']
        : ['mud_golem','shadow_wraith','bone_harbinger'];
    const key = pool[Math.floor(Math.random()*pool.length)];
    startCombat(key, null, null);
  },

  marsh_search: () => {
    const s = GAME.state;
    const searchKey = `marsh_${Math.floor(Object.keys(s.searchedAreas).length/2)}`;
    if (s.searchedAreas[searchKey]) {
      GAME.log(`🔍 You search this patch of marsh. Already picked over.`, 'system');
    } else {
      s.searchedAreas[searchKey] = true;
      const roll = Math.random();
      const extraTreasure = s.artifacts.some(a=>a==='compass');
      if (roll < 0.25 || extraTreasure) {
        // Artifact chance
        const unownedArts = ARTIFACTS.filter(a=>!s.artifacts.includes(a.id));
        if (unownedArts.length && Math.random() < 0.3) {
          const art = unownedArts[Math.floor(Math.random()*unownedArts.length)];
          s.addArtifact(art);
          GAME.log(`💎 Half-buried in black mud: the <strong>${art.emoji} ${art.name}</strong>!<br><em>${art.desc}</em>`, 'loot');
          UI.updateStats();
        } else {
          const gold = rng(20,45);
          s.gold += gold;
          GAME.log(`💰 You find a waterlogged satchel — ${gold} gold inside. Someone didn't make it out.`, 'loot');
          UI.updateStats();
        }
      } else if (roll < 0.55) {
        const potion = ITEM_DATA.potions[Math.floor(Math.random()*2)];
        s.addItem({...potion});
        GAME.log(`🧪 You find a ${potion.name} wedged in a dead tree.`, 'loot');
        UI.updateStats();
      } else if (roll < 0.75) {
        // Quest item for Ravyn
        if (s.quests['side3'] && !s.flags.ravyn_book_found) {
          s.flags.ravyn_book_found = true;
          s.addItem({ name:'Ravyn\'s Tome', type:'quest', emoji:'📕', desc:'A waterlogged but legible book of stories.' });
          GAME.log(`📕 Tangled in roots: a book, still readable. <strong>Ravyn's Tome</strong> — quest item!`, 'loot');
          UI.updateStats();
        } else {
          GAME.log(`🔍 You find signs of a camp — long abandoned. The fire ring is cold. You don't want to know what happened here.`, 'system');
        }
      } else {
        // Ambush
        GAME.log(`🔍 As you search, something lunges from the water!`, 'damage');
        startCombat('marsh_skeleton', () => { GAME.goScene('marsh_hub'); });
        return;
      }
    }
    GAME.goScene('marsh_hub');
  },

  marsh_deeper: () => {
    const s = GAME.state;
    GAME.log(`🌿 You push deeper into the Obsidian Marsh. The sounds of the living world fade. 
    Phosphorescent fungi light your path in cold blue. Something watches from between the trees — 
    too still to be a trick of the light.`, 'system');
    if (!s.companions.includes('kael') && s.flags.kael_met) {
      startCombat('veilstalker', () => { GAME.goScene('marsh_hub'); });
    } else if (Math.random() < 0.5) {
      startCombat('shadow_wraith', () => { GAME.goScene('marsh_hub'); });
    } else {
      const gold = rng(15,30);
      s.gold += gold;
      GAME.log(`💰 You discover the remains of another adventurer. You take their coin (${gold}g) and leave them to their rest.`, 'loot');
      UI.updateStats();
      GAME.goScene('marsh_hub');
    }
  },

  marsh_kael: () => {
    const s = GAME.state;
    s.flags.kael_met = true;
    GAME.log(`🧑‍🦱 <strong>Kael the Unbroken:</strong> <em>"Name's Kael. I've been hunting the Wraithcaller's people 
    for two winters. Alone."</em> He says "alone" like a habit, not a complaint.<br><br>
    <em>"I know the inner paths. The safe ones — and the ones that aren't safe but are faster. 
    I know how the undead move, where they cluster, when to fight and when to wait."</em><br><br>
    He extends a hand. <em>"You look like you might actually reach the temple. I want to be there when someone does."</em>`, 'companion');
    GAME.showActions([
      { text:'🧑‍🦱 Accept — Kael joins you', action: () => { s.addCompanion('kael'); GAME.log(`🧑‍🦱 <strong>Kael the Unbroken joins your party!</strong>`, 'companion'); GAME.goScene('marsh_hub'); } },
      { text:'❌ Not right now', action:'marsh_hub' },
    ]);
  },

  marsh_temple: () => {
    const s = GAME.state;
    GAME.setLocation('ancient_temple');
    if (s.level < 5) {
      GAME.log(`🏛 A wall of darkness stops you cold — not physical, but felt. 
      <em>"Not yet,"</em> something seems to whisper. You need more power. <em>(Reach level 5)</em>`, 'boss');
      GAME.goScene('marsh_hub');
      return;
    }
    if (!s.quests['main3']) s.startQuest('main3');
    if (!s.flags.bonewright_defeated) {
      GAME.log(`🏛 The Ancient Temple looms at the heart of the marsh. Its stones weep black water. 
      The chanting from within has been growing louder for days.<br><br>
      Before you can reach the entrance, a massive figure blocks your path. 
      <strong>The Bonewright</strong> — the Wraithcaller's lieutenant, half man and half assembled skeleton — 
      spreads his arms.<br><br>
      <em>"The architect sends his regards."</em>`, 'boss');
      startCombat('bonewright', () => {
        s.flags.bonewright_defeated = true;
        GAME.log(`🏛 The Bonewright collapses in a pile of ash and old bone. 
        The temple doors grind open. The chanting inside stops — 
        then resumes, lower, more purposeful.`, 'victory');
        s.quests['main2'] && s.advanceQuest('main2', 2);
        UI.updateStats();
        GAME.showActions([
          { text:'🏛 Enter the Ancient Temple', action: () => ACTIONS.final_confrontation() },
          { text:'🌿 Retreat and prepare', action:'marsh_hub' },
        ]);
      });
    } else {
      GAME.showActions([
        { text:'🏛 Enter the Ancient Temple', action: () => ACTIONS.final_confrontation() },
        { text:'🌿 Return to the marsh', action:'marsh_hub' },
      ]);
    }
  },

  final_confrontation: () => {
    const s = GAME.state;
    const compLines = s.companions.length > 0
      ? s.companions.map(id => `${COMPANION_DATA[id].emoji} ${COMPANION_DATA[id].name}: <em>${COMPANION_DATA[id].dialogues[0]}</em><br>`).join('')
      : '';
    GAME.log(`🏛 The temple interior is vast and cold. Mosaics on the walls depict the Veil — 
    beautiful, terrible, alive. At the center of the chamber, surrounded by a circle of undead kneeling in devotion, 
    stands the <strong>Wraithcaller</strong>.<br><br>
    He turns. His eyes are the color of the space between stars.<br><br>
    <em>"${s.playerName}. I've watched you cross my marsh. I've watched you gather your companions, your artifacts, your courage. 
    All of it leading here."</em><br><br>
    He raises one hand. The undead rise.<br><br>
    <em>"The Veil will shatter. The worlds will merge. There will be no more death — no more loss. 
    Everything that was taken will return."</em><br><br>
    He looks, for a moment, only human.<br><br>
    <em>"Tell me I'm wrong."</em><br><br>
    ${compLines}`, 'boss');
    GAME.showActions([
      { text:'⚔️ Fight the Wraithcaller', action: () => startCombat('wraithcaller') },
      { text:'🗣 Reason with him (requires INT 12+)', action: () => {
        if (s.int >= 12) {
          GAME.log(`🗣 <em>"You can bring her back,"</em> you say. <em>"But she won't be her. You know that."</em><br><br>
          A long silence. Something crosses his face — grief, ancient and still raw.<br><br>
          <em>"I know,"</em> he whispers.<br><br>
          But then his eyes harden. <em>"I know. And I don't care."</em><br><br>
          The undead advance.`, 'boss');
          startCombat('wraithcaller');
        } else {
          GAME.log(`🗣 You try to speak, but the words aren't there yet. He doesn't listen. <em>(Need INT 12+)</em>`, 'system');
          GAME.showActions([
            { text:'⚔️ Fight the Wraithcaller', action: () => startCombat('wraithcaller') },
          ]);
        }
      }},
    ]);
  },

  /* ---- SERIS ---- */
  seris: () => {
    const s = GAME.state;
    s.flags.seris_met = true;
    GAME.log(`⚓ <strong>Captain Seris</strong>, armor-scarred and blunt, hands you an envelope. 
    <em>"I hear you're capable. I don't trust rumors. So I'll be direct: 
    I'm paying good coin for someone to investigate the eastern gate. 
    Three nights ago something large came through. The guards won't talk about what they saw."</em><br><br>
    She slides 40 gold across the table. <em>"Half up front. Half when you report back."</em>`, 'system');
    s.gold += 40;
    s.startQuest && s.startQuest('main1');
    s.advanceQuest && s.advanceQuest('main1', 0);
    UI.updateStats();
    GAME.showActions([
      { text:'🌙 Investigate the eastern gate at night', action: () => {
        GAME.log(`🌙 You wait until the city quiets, then make your way to the eastern gate. 
        The guards are pale. One of them — barely a man, really — is staring at nothing.<br><br>
        At the base of the gate you find claw marks in the stone. Deep ones. 
        And a symbol — the same symbol that's on the map Lyra gave you.<br><br>
        You know where this leads.`, 'system');
        s.advanceQuest && s.advanceQuest('main1', 1);
        s.advanceQuest && s.advanceQuest('main1', 2);
        UI.updateStats();
        GAME.goScene('ashenreach');
      }},
      { text:'← Not yet', action:'ashenreach' },
    ]);
  },
};

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pct(cur, max) {
  if (!max) return 0;
  return Math.max(0, Math.min(100, (cur / max) * 100));
}

// ===================================================================
// EVENT LISTENERS
// ===================================================================

GAME.on('levelup', level => {
  UI.toast(`⭐ Level ${level}!`, 'success');
});
GAME.on('companion_joined', id => {
  UI.toast(`${COMPANION_DATA[id].emoji} ${COMPANION_DATA[id].name} joined!`, 'success');
  UI.updateCompanions();
});
GAME.on('artifact_added', art => {
  UI.toast(`💎 ${art.name} acquired!`, 'success');
  UI.renderEquipment();
});
GAME.on('quest_started', id => {
  UI.toast(`📜 New quest: ${QUEST_DATA[id]?.title}`, 'info');
});
GAME.on('quest_complete', id => {
  UI.toast(`✅ Quest complete!`, 'success');
});
GAME.on('item_added', item => {
  UI.toast(`${item.emoji||'📦'} Got ${item.name}`, '');
  UI.renderInventory();
});

// GameState needs access to startQuest / advanceQuest / completeQuest
// (they're defined on prototype, but also patch them into loaded saves)
GameState.prototype.startQuest   = GameState.prototype.startQuest;
GameState.prototype.advanceQuest = GameState.prototype.advanceQuest;
GameState.prototype.completeQuest= GameState.prototype.completeQuest;

// ===================================================================
// BOOT
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  GAME.init();
});
