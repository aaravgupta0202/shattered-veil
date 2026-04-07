// Game State
class GameState {
    constructor() {
        this.playerName = '';
        this.currentLocation = 'ashenreach';
        this.gameStarted = false;
        
        // Player stats
        this.health = 100;
        this.maxHealth = 100;
        this.magic = 40;
        this.maxMagic = 40;
        this.strength = 6;
        this.dexterity = 5;
        this.intelligence = 8;
        this.gold = 30;
        this.level = 1;
        this.xp = 0;
        this.xpToNext = 100;
        
        // Equipment & Inventory
        this.weapon = {
            name: 'Rusty Dagger',
            damage: [3, 6],
            description: 'A worn blade that has seen better days'
        };
        this.inventory = [];
        this.spells = ['Spark', 'Heal'];
        
        // Game flags
        this.searchedLocations = [];
        this.questFlags = {};
        this.npcInteractions = {};
        
        // Story state
        this.storyHistory = [];
        this.currentScene = 'start';
    }
    
    addToInventory(item) {
        this.inventory.push(item);
        this.addStoryText(`📦 Added ${item.name} to inventory.`);
    }
    
    addStoryText(text, className = '') {
        const storyArea = document.getElementById('story-text');
        const paragraph = document.createElement('div');
        paragraph.className = `story-paragraph ${className}`;
        paragraph.innerHTML = text;
        storyArea.appendChild(paragraph);
        
        // Auto-scroll to bottom
        setTimeout(() => {
            storyArea.scrollTop = storyArea.scrollHeight;
        }, 100);
        
        this.storyHistory.push(text);
    }
    
    updateStats() {
        // Update health bar
        const healthBar = document.getElementById('health-bar');
        const healthText = document.getElementById('health-text');
        const healthPercent = (this.health / this.maxHealth) * 100;
        healthBar.style.width = healthPercent + '%';
        healthText.textContent = `${this.health}/${this.maxHealth}`;
        
        // Update magic bar
        const magicBar = document.getElementById('magic-bar');
        const magicText = document.getElementById('magic-text');
        const magicPercent = (this.magic / this.maxMagic) * 100;
        magicBar.style.width = magicPercent + '%';
        magicText.textContent = `${this.magic}/${this.maxMagic}`;
        
        // Update attributes
        document.getElementById('strength-val').textContent = this.strength;
        document.getElementById('dexterity-val').textContent = this.dexterity;
        document.getElementById('intelligence-val').textContent = this.intelligence;
        document.getElementById('level-val').textContent = this.level;
        document.getElementById('gold-val').textContent = this.gold;
        
        // Update player name display
        document.getElementById('player-name-display').textContent = this.playerName;
        
        this.updateSpellList();
        this.updateInventoryDisplay();
    }
    
    updateSpellList() {
        const spellList = document.getElementById('spell-list');
        spellList.innerHTML = '';
        
        this.spells.forEach(spellName => {
            const spell = gameData.spells.find(s => s.name === spellName);
            if (spell) {
                const spellDiv = document.createElement('div');
                spellDiv.className = 'spell-item';
                spellDiv.innerHTML = `
                    <span class="spell-name">🔮 ${spell.name}</span>
                    <span class="spell-cost">${spell.cost} MP</span>
                `;
                spellDiv.title = spell.description;
                spellList.appendChild(spellDiv);
            }
        });
    }
    
    updateInventoryDisplay() {
        const inventoryItems = document.getElementById('inventory-items');
        inventoryItems.innerHTML = '';
        
        this.inventory.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.innerHTML = `${item.emoji || '📦'}<br>${item.name}`;
            itemDiv.title = item.description;
            itemDiv.onclick = () => this.useItem(index);
            inventoryItems.appendChild(itemDiv);
        });
    }
    
    updateLocation(locationKey, locationName, description) {
        this.currentLocation = locationKey;
        document.querySelector('.location-name').textContent = locationName;
        document.querySelector('.location-desc').textContent = description;
    }
    
    useItem(index) {
        const item = this.inventory[index];
        if (!item) return;
        
        if (item.type === 'potion') {
            if (item.effect === 'heal') {
                const healAmount = Math.floor(Math.random() * (item.max - item.min + 1)) + item.min;
                this.health = Math.min(this.maxHealth, this.health + healAmount);
                this.addStoryText(`🍯 You drink the ${item.name} and restore ${healAmount} health!`, 'heal-flash');
                this.inventory.splice(index, 1);
                this.updateStats();
            }
        } else if (item.type === 'weapon') {
            this.equipWeapon(item);
            this.inventory.splice(index, 1);
            this.updateStats();
        }
    }
    
    equipWeapon(weapon) {
        const oldWeapon = this.weapon;
        this.weapon = weapon;
        document.getElementById('equipped-weapon').innerHTML = 
            `<strong>⚔️ Weapon:</strong> <span>${weapon.name} (${weapon.damage[0]}-${weapon.damage[1]} damage)</span>`;
        this.addStoryText(`⚔️ You equip the ${weapon.name}. Previous weapon: ${oldWeapon.name}`);
    }
    
    gainXP(amount) {
        this.xp += amount;
        this.addStoryText(`⭐ You gained ${amount} XP!`);
        
        if (this.xp >= this.xpToNext) {
            this.levelUp();
        }
    }
    
    levelUp() {
        this.level++;
        this.xp = 0;
        this.xpToNext = this.level * 100;
        
        // Stat increases
        const healthIncrease = 15 + Math.floor(Math.random() * 10);
        const magicIncrease = 8 + Math.floor(Math.random() * 6);
        
        this.maxHealth += healthIncrease;
        this.maxMagic += magicIncrease;
        this.health = this.maxHealth; // Full heal on level up
        this.magic = this.maxMagic;
        
        this.strength += 1 + Math.floor(Math.random() * 2);
        this.dexterity += 1 + Math.floor(Math.random() * 2);
        this.intelligence += 1 + Math.floor(Math.random() * 2);
        
        this.addStoryText(`🎉 LEVEL UP! You are now level ${this.level}! All stats increased!`, 'gold-glow');
        this.updateStats();
    }
}

// Game Data
const gameData = {
    spells: [
        { name: 'Spark', cost: 8, damage: [3, 7], description: 'Basic lightning attack' },
        { name: 'Heal', cost: 12, heal: [15, 25], description: 'Restore health with magic' },
        { name: 'Fireball', cost: 18, damage: [8, 15], description: 'Explosive fire magic' },
        { name: 'Lightning Bolt', cost: 25, damage: [15, 22], description: 'Powerful electrical attack' },
        { name: 'Greater Heal', cost: 30, heal: [35, 50], description: 'Powerful healing magic' },
        { name: 'Shield', cost: 15, buff: 'defense', description: 'Increases defense for several turns' },
        { name: 'Strength', cost: 20, buff: 'attack', description: 'Increases attack power temporarily' },
        { name: 'Teleport', cost: 35, utility: true, description: 'Return to Ashenreach instantly' },
        { name: 'Detect Magic', cost: 10, utility: true, description: 'Reveals hidden magical items' },
        { name: 'Charm', cost: 25, utility: true, description: 'Influence NPCs in conversations' }
    ],
    
    weapons: {
        basic: [
            { name: 'Iron Shortsword', price: 30, damage: [5, 8], description: 'Standard blade for new adventurers' },
            { name: 'Hunter\'s Bow', price: 45, damage: [4, 10], description: 'Light ranged weapon' },
            { name: 'Bronze Warhammer', price: 70, damage: [8, 12], description: 'Heavy but powerful' }
        ],
        advanced: [
            { name: 'Steel Sword', price: 120, damage: [10, 16], description: 'Well-forged steel weapon' },
            { name: 'Enchanted Dagger', price: 150, damage: [6, 14], special: 'poison', description: 'Blade coated with magical poison' },
            { name: 'Lightning Spear', price: 200, damage: [12, 18], special: 'shock', description: 'Crackling with electrical energy' }
        ],
        legendary: [
            { name: 'Veilpiercer', damage: [18, 25], special: 'undead_bane', description: 'Legendary blade that cuts through darkness' }
        ]
    },
    
    locations: {
        ashenreach: {
            name: 'Ashenreach',
            description: 'Central hub city shrouded in eternal twilight',
            npcs: ['Mayor Eldric', 'Orin the Gambler', 'Ravyn the Storyteller', 'Captain Seris', 'Grimwald', 'Selene']
        },
        obsidian_marsh: {
            name: 'Obsidian Marsh',
            description: 'Twisted bog filled with necromancy and undead',
            enemies: ['Bone Harbinger', 'Wraithcaller']
        }
    }
};

// Global game state
let game = new GameState();

// Game Scenes
const scenes = {
    start: {
        text: `Welcome to Shattered Veil, ${game.playerName || 'adventurer'}! You find yourself in the mysterious city of Ashenreach, where eternal twilight casts long shadows across cobblestone streets. The air is thick with magic and whispers of ancient secrets.<br><br>🌆 The city bustles with activity despite the perpetual dusk. Merchants hawk their wares, guards patrol the streets, and adventurers like yourself seek fame and fortune in the dangerous lands beyond the city walls.<br><br>What would you like to do first?`,
        actions: [
            { text: '🏛️ Visit the Town Hall', action: 'townHall' },
            { text: '🍺 Enter the Blackthorn Inn', action: 'inn' },
            { text: '⚔️ Visit Grimwald\'s Forge', action: 'blacksmith' },
            { text: '🧪 Go to Moonveil Apothecary', action: 'apothecary' },
            { text: '🛍️ Browse Market Stalls', action: 'market' },
            { text: '🌊 Journey to Obsidian Marsh', action: 'marshTravel' }
        ]
    },
    
    townHall: {
        text: `🏛️ You enter the grand Town Hall, its marble columns rising toward vaulted ceilings. Mayor Eldric, a distinguished man with silver hair and kind eyes, greets you warmly.<br><br>"Ah, ${game.playerName}! Word of your arrival has already reached my ears. Ashenreach has need of capable adventurers such as yourself. The Obsidian Marsh grows more dangerous by the day, and strange creatures have been spotted near our borders."<br><br>He leans forward conspiratorially. "There are also rumors of a powerful artifact hidden within the marsh - the Veilpiercer, a legendary sword said to cut through the very fabric of darkness itself."`,
        actions: [
            { text: '❓ Ask about the Obsidian Marsh', action: 'marshInfo' },
            { text: '⚔️ Inquire about the Veilpiercer', action: 'veilpiercerInfo' },
            { text: '💰 Ask about available quests', action: 'questBoard' },
            { text: '🚪 Return to town square', action: 'start' }
        ]
    },
    
    inn: {
        text: `🍺 The Blackthorn Inn welcomes you with warm light and the aroma of hearty stew. The common room buzzes with conversation from travelers, merchants, and locals alike.<br><br>Behind the bar stands Orin, a jovial man with a thick beard and twinkling eyes. "Welcome, ${game.playerName}! First drink's on the house for new faces. Care to hear some tales from other adventurers, or perhaps try your luck at cards?"<br><br>In the corner, you notice Ravyn the Storyteller, an elderly woman with piercing blue eyes and silver hair, regaling a small crowd with tales of ancient magic.`,
        actions: [
            { text: '🍻 Buy a drink and gather information', action: 'drinkInfo' },
            { text: '🃏 Play cards with Orin', action: 'cardGame' },
            { text: '📚 Listen to Ravyn\'s stories', action: 'stories' },
            { text: '🛏️ Rent a room for the night', action: 'rentRoom' },
            { text: '🚪 Leave the inn', action: 'start' }
        ]
    },
    
    blacksmith: {
        text: `⚔️ Grimwald's Forge rings with the sound of hammer on anvil. The massive blacksmith, his arms thick as tree trunks, looks up from his work and nods respectfully.<br><br>"${game.playerName}, is it? I\'ve got quality weapons and armor for those brave enough to venture beyond our walls. Take a look at what I have in stock, or if you\'ve got the gold, I can craft something special."<br><br>The forge glows with intense heat, and racks of gleaming weapons line the walls.`,
        actions: [
            { text: '🛒 Browse basic weapons', action: 'buyBasicWeapons' },
            { text: '✨ Look at advanced weapons', action: 'buyAdvancedWeapons' },
            { text: '🔨 Commission a custom weapon', action: 'customWeapon' },
            { text: '💪 Ask about training', action: 'strTraining' },
            { text: '🚪 Leave the forge', action: 'start' }
        ]
    },
    
    apothecary: {
        text: `🧪 Moonveil Apothecary is filled with the scents of herbs and brewing potions. Shelves lined with bottles of various sizes contain mysterious liquids that glow with inner light.<br><br>Selene, a wise-looking woman with silver-streaked hair and knowing eyes, emerges from behind a curtain of hanging herbs. "Greetings, ${game.playerName}. I sense great potential in you. Perhaps my potions and knowledge can aid you on your journey?"<br><br>"I also offer training in the magical arts, should you wish to expand your mind and magical capabilities."`,
        actions: [
            { text: '🍯 Buy healing potions', action: 'buyPotions' },
            { text: '📜 Purchase new spells', action: 'buySpells' },
            { text: '🧠 Train Intelligence', action: 'intTraining' },
            { text: '🔮 Learn about magic theory', action: 'magicTheory' },
            { text: '🚪 Leave the apothecary', action: 'start' }
        ]
    }
};

// Game Actions
const actions = {
    marshInfo: () => {
        game.addStoryText(`🌊 Mayor Eldric's expression grows serious. "The Obsidian Marsh was once a beautiful wetland, but dark magic has twisted it into something sinister. Undead creatures roam its paths, and at its heart lies the lair of the Wraithcaller - a powerful necromancer who threatens all of Ashenreach."<br><br>"Many brave souls have ventured there, but few return. Those who do speak of bone harbingers that guard the outer reaches, and of treasures hidden in the murky depths."`);
        showActions(scenes.townHall.actions);
    },
    
    veilpiercerInfo: () => {
        game.addStoryText(`⚔️ The Mayor\'s eyes light up. "Ah, the Veilpiercer! Legend says it was forged by the first mages of Ashenreach, imbued with the power to cut through illusion and darkness. It\'s said that only by defeating the Wraithcaller can one claim this legendary blade."<br><br>"The sword chooses its wielder, ${game.playerName}. Perhaps you are destined to wield it?"`);
        showActions(scenes.townHall.actions);
    },
    
    questBoard: () => {
        game.addStoryText(`📋 Mayor Eldric shows you a board covered with various requests:<br><br>🦴 <strong>Clear the Bone Harbingers</strong> - 50 gold, 75 XP<br>👻 <strong>Defeat the Wraithcaller</strong> - 200 gold, 300 XP, Veilpiercer<br>🔍 <strong>Investigate Strange Sounds</strong> - 25 gold, 30 XP<br>📦 <strong>Recover Lost Supplies</strong> - 30 gold, 40 XP`);
        showActions(scenes.townHall.actions);
    },
    
    drinkInfo: () => {
        if (game.gold >= 5) {
            game.gold -= 5;
            game.addStoryText(`🍻 You buy a drink for 5 gold and listen to the tavern gossip. Orin leans in close: "I\'ve heard tell of secret passages in the marsh, hidden treasures, and a merchant who occasionally sells rare spells. Also, Captain Seris sometimes recruits adventurers for dangerous missions - pays well too!"`);
            game.updateStats();
        } else {
            game.addStoryText(`💰 You don\'t have enough gold for a drink (5 gold needed).`);
        }
        showActions(scenes.inn.actions);
    },
    
    cardGame: () => {
        if (game.gold >= 10) {
            const outcome = Math.random();
            if (outcome > 0.6) {
                const winnings = 15 + Math.floor(Math.random() * 10);
                game.gold += winnings;
                game.addStoryText(`🎲 Lucky! You win ${winnings} gold at cards!`);
            } else if (outcome > 0.3) {
                game.addStoryText(`🎲 You break even at cards. Better luck next time!`);
            } else {
                game.gold -= 10;
                game.addStoryText(`🎲 You lose 10 gold at cards. Orin grins sympathetically.`);
            }
            game.updateStats();
        } else {
            game.addStoryText(`💰 You need at least 10 gold to play cards.`);
        }
        showActions(scenes.inn.actions);
    },
    
    stories: () => {
        const stories = [
            `📚 Ravyn speaks of ancient magic: "Long ago, mages could bend reality itself. Some say this power still exists, waiting for those wise enough to unlock its secrets."`,
            `📚 "The Wraithcaller was once human," Ravyn whispers, "consumed by grief and twisted by dark magic. Perhaps there is still hope for redemption..."`,
            `📚 "In the deepest parts of the marsh lie ruins older than Ashenreach itself. What secrets do they hold?" Ravyn\'s eyes gleam mysteriously.`
        ];
        const randomStory = stories[Math.floor(Math.random() * stories.length)];
        game.addStoryText(randomStory);
        game.intelligence += 1;
        game.addStoryText(`🧠 Your Intelligence increased by 1 from listening to ancient wisdom!`);
        game.updateStats();
        showActions(scenes.inn.actions);
    },
    
    rentRoom: () => {
        if (game.gold >= 15) {
            game.gold -= 15;
            game.health = game.maxHealth;
            game.magic = game.maxMagic;
            game.addStoryText(`🛏️ You rent a room for 15 gold and rest peacefully. Health and magic fully restored!`);
            game.updateStats();
        } else {
            game.addStoryText(`💰 A room costs 15 gold. You don\'t have enough.`);
        }
        showActions(scenes.inn.actions);
    },
    
    buyBasicWeapons: () => {
        let weaponList = `🛒 <strong>Basic Weapons Available:</strong><br>`;
        gameData.weapons.basic.forEach((weapon, index) => {
            weaponList += `⚔️ ${weapon.name} - ${weapon.price} gold (${weapon.damage[0]}-${weapon.damage[1]} damage)<br>`;
        });
        game.addStoryText(weaponList);
        
        const buyActions = gameData.weapons.basic.map((weapon, index) => ({
            text: `💰 Buy ${weapon.name} (${weapon.price}g)`,
            action: () => buyWeapon(weapon)
        }));
        buyActions.push({ text: '🚪 Back to forge', action: 'blacksmith' });
        showActions(buyActions);
    },
    
    buyAdvancedWeapons: () => {
        let weaponList = `🛒 <strong>Advanced Weapons Available:</strong><br>`;
        gameData.weapons.advanced.forEach((weapon, index) => {
            weaponList += `⚔️ ${weapon.name} - ${weapon.price} gold (${weapon.damage[0]}-${weapon.damage[1]} damage)${weapon.special ? ` [${weapon.special}]` : ''}<br>`;
        });
        game.addStoryText(weaponList);
        
        const buyActions = gameData.weapons.advanced.map((weapon, index) => ({
            text: `💰 Buy ${weapon.name} (${weapon.price}g)`,
            action: () => buyWeapon(weapon)
        }));
        buyActions.push({ text: '🚪 Back to forge', action: 'blacksmith' });
        showActions(buyActions);
    },
    
    strTraining: () => {
        const cost = game.strength * 25;
        if (game.gold >= cost) {
            game.gold -= cost;
            game.strength += 1;
            game.addStoryText(`💪 Grimwald puts you through intense physical training. Your Strength increased by 1! (Cost: ${cost} gold)`);
            game.updateStats();
        } else {
            game.addStoryText(`💰 Strength training costs ${cost} gold. You don\'t have enough.`);
        }
        showActions(scenes.blacksmith.actions);
    },
    
    buyPotions: () => {
        const potions = [
            { name: 'Minor Health Potion', price: 15, type: 'potion', effect: 'heal', min: 20, max: 30, emoji: '🍯' },
            { name: 'Major Health Potion', price: 40, type: 'potion', effect: 'heal', min: 50, max: 70, emoji: '🧪' },
            { name: 'Magic Elixir', price: 25, type: 'potion', effect: 'mana', min: 30, max: 45, emoji: '🔮' }
        ];
        
        let potionList = `🧪 <strong>Potions Available:</strong><br>`;
        potions.forEach(potion => {
            potionList += `${potion.emoji} ${potion.name} - ${potion.price} gold<br>`;
        });
        game.addStoryText(potionList);
        
        const buyActions = potions.map(potion => ({
            text: `💰 Buy ${potion.name} (${potion.price}g)`,
            action: () => {
                if (game.gold >= potion.price) {
                    game.gold -= potion.price;
                    game.addToInventory(potion);
                    game.updateStats();
                } else {
                    game.addStoryText(`💰 You don\'t have enough gold for the ${potion.name}.`);
                }
            }
        }));
        buyActions.push({ text: '🚪 Back to apothecary', action: 'apothecary' });
        showActions(buyActions);
    },
    
    buySpells: () => {
        const availableSpells = gameData.spells.filter(spell => !game.spells.includes(spell.name));
        
        if (availableSpells.length === 0) {
            game.addStoryText(`📜 "You already know all the spells I can teach you, ${game.playerName}. Seek out ancient tomes or powerful mages for more advanced magic."`);
            showActions(scenes.apothecary.actions);
            return;
        }
        
        let spellList = `📜 <strong>Spells Available to Learn:</strong><br>`;
        availableSpells.slice(0, 5).forEach(spell => {
            const cost = spell.cost * 10; // Learning cost
            spellList += `🔮 ${spell.name} - ${cost} gold (${spell.description})<br>`;
        });
        game.addStoryText(spellList);
        
        const buyActions = availableSpells.slice(0, 5).map(spell => ({
            text: `📚 Learn ${spell.name} (${spell.cost * 10}g)`,
            action: () => {
                const cost = spell.cost * 10;
                if (game.gold >= cost) {
                    game.gold -= cost;
                    game.spells.push(spell.name);
                    game.addStoryText(`📜 You learned the spell: ${spell.name}!`);
                    game.updateStats();
                } else {
                    game.addStoryText(`💰 You don\'t have enough gold to learn ${spell.name}.`);
                }
            }
        }));
        buyActions.push({ text: '🚪 Back to apothecary', action: 'apothecary' });
        showActions(buyActions);
    },
    
    intTraining: () => {
        const cost = game.intelligence * 30;
        if (game.gold >= cost) {
            game.gold -= cost;
            game.intelligence += 1;
            const magicIncrease = 5;
            game.maxMagic += magicIncrease;
            game.magic += magicIncrease;
            game.addStoryText(`🧠 Selene guides you through complex magical theory. Your Intelligence increased by 1 and maximum magic increased by ${magicIncrease}! (Cost: ${cost} gold)`);
            game.updateStats();
        } else {
            game.addStoryText(`💰 Intelligence training costs ${cost} gold. You don\'t have enough.`);
        }
        showActions(scenes.apothecary.actions);
    },
    
    magicTheory: () => {
        const theories = [
            `🔮 "Magic flows through all living things," Selene explains. "The key is learning to channel it without being consumed by it."`,
            `🔮 "Each spell has its own personality," she continues. "Treat them with respect, and they will serve you well."`,
            `🔮 "The Veil between worlds grows thin in places like the Obsidian Marsh. Be careful not to attract unwanted attention from the other side."`
        ];
        const randomTheory = theories[Math.floor(Math.random() * theories.length)];
        game.addStoryText(randomTheory);
        showActions(scenes.apothecary.actions);
    },
    
    marshTravel: () => {
        game.updateLocation('obsidian_marsh', 'Obsidian Marsh', 'Twisted bog filled with necromancy and undead');
        game.addStoryText(`🌊 You travel to the Obsidian Marsh. The air grows thick and oppressive as you approach the twisted wetlands. Gnarled trees reach toward the sky like skeletal fingers, and the very ground seems to pulse with dark energy.<br><br>In the distance, you can see the crumbling ruins of an ancient temple, likely the Wraithcaller\'s lair. But the path is treacherous, and you sense hostile presences lurking in the shadows.`);
        
        const marshActions = [
            { text: '🗡️ Search for enemies to fight', action: 'searchEnemies' },
            { text: '🔍 Look for hidden treasures', action: 'searchTreasure' },
            { text: '🏛️ Approach the ancient temple', action: 'templeApproach' },
            { text: '💨 Use Teleport spell to return', action: 'teleportBack' },
            { text: '🚶 Carefully return to Ashenreach', action: 'returnToTown' }
        ];
        showActions(marshActions);
    },
    
    searchEnemies: () => {
        const enemies = [
            { name: 'Marsh Skeleton', health: 25, damage: [4, 8], gold: [8, 15], xp: 20 },
            { name: 'Corrupted Spirit', health: 30, damage: [6, 10], gold: [12, 20], xp: 25 },
            { name: 'Bone Harbinger', health: 60, damage: [12, 18], gold: [35, 50], xp: 75, boss: true }
        ];
        
        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        startCombat(enemy);
    },
    
    searchTreasure: () => {
        const searchKey = `treasure_${Math.floor(game.storyHistory.length / 10)}`;
        
        if (game.searchedLocations.includes(searchKey)) {
            game.addStoryText(`🔍 You\'ve already searched this area thoroughly. The murky waters and twisted roots hold no more secrets for you here.`);
        } else {
            game.searchedLocations.push(searchKey);
            const treasures = [
                { name: 'Ancient Coin', value: 25, description: 'A tarnished coin from a forgotten era' },
                { name: 'Mystic Herb', type: 'potion', effect: 'heal', min: 15, max: 25, emoji: '🌿', description: 'A rare herb with healing properties' },
                { name: 'Enchanted Ring', type: 'accessory', bonus: 'magic', value: 10, emoji: '💍', description: 'Increases maximum magic by 10' },
                { name: 'Scroll of Knowledge', type: 'scroll', xp: 50, emoji: '📜', description: 'Ancient knowledge grants experience' }
            ];
            
            const treasure = treasures[Math.floor(Math.random() * treasures.length)];
            
            if (treasure.type === 'scroll') {
                game.gainXP(treasure.xp);
                game.addStoryText(`📜 You found a ${treasure.name}! ${treasure.description}`);
            } else if (treasure.type === 'accessory') {
                game.maxMagic += treasure.value;
                game.magic += treasure.value;
                game.addStoryText(`💍 You found an ${treasure.name}! Your maximum magic increases by ${treasure.value}!`);
                game.updateStats();
            } else if (treasure.value) {
                game.gold += treasure.value;
                game.addStoryText(`💰 You found an ${treasure.name} worth ${treasure.value} gold!`);
                game.updateStats();
            } else {
                game.addToInventory(treasure);
            }
        }
        
        const marshActions = [
            { text: '🗡️ Search for enemies to fight', action: 'searchEnemies' },
            { text: '🔍 Look for hidden treasures', action: 'searchTreasure' },
            { text: '🏛️ Approach the ancient temple', action: 'templeApproach' },
            { text: '🚶 Return to Ashenreach', action: 'returnToTown' }
        ];
        showActions(marshActions);
    },
    
    templeApproach: () => {
        if (game.level >= 3) {
            game.addStoryText(`🏛️ You approach the crumbling temple at the heart of the marsh. Dark energy radiates from within, and you can hear an otherworldly chanting echoing from the depths.<br><br>As you step closer, a powerful figure emerges from the shadows - the Wraithcaller! Wreathed in dark magic and commanding an aura of death, this is the source of the marsh\'s corruption.<br><br>"So, another mortal seeks to challenge me," the Wraithcaller hisses. "You will join my army of the dead!"`);
            
            const wraithcaller = {
                name: 'Wraithcaller',
                health: 120,
                damage: [18, 25],
                gold: [150, 200],
                xp: 300,
                boss: true,
                finalBoss: true
            };
            
            startCombat(wraithcaller);
        } else {
            game.addStoryText(`🏛️ You approach the ancient temple, but a powerful dark presence pushes you back. You sense that you need to be stronger before challenging whatever lies within. (Reach level 3 first)`);
            
            const marshActions = [
                { text: '🗡️ Search for enemies to fight', action: 'searchEnemies' },
                { text: '🔍 Look for hidden treasures', action: 'searchTreasure' },
                { text: '🚶 Return to Ashenreach', action: 'returnToTown' }
            ];
            showActions(marshActions);
        }
    },
    
    teleportBack: () => {
        if (game.spells.includes('Teleport') && game.magic >= 35) {
            game.magic -= 35;
            game.updateLocation('ashenreach', 'Ashenreach', 'Central hub city shrouded in eternal twilight');
            game.addStoryText(`🌀 You cast Teleport and instantly return to the safety of Ashenreach!`);
            game.updateStats();
            showActions(scenes.start.actions);
        } else if (!game.spells.includes('Teleport')) {
            game.addStoryText(`🚫 You don\'t know the Teleport spell.`);
        } else {
            game.addStoryText(`🚫 You don\'t have enough magic to cast Teleport (35 MP required).`);
        }
    },
    
    returnToTown: () => {
        game.updateLocation('ashenreach', 'Ashenreach', 'Central hub city shrouded in eternal twilight');
        game.addStoryText(`🚶 You carefully make your way back to Ashenreach, leaving the dark marsh behind.`);
        showActions(scenes.start.actions);
    }
};

// Helper Functions
function buyWeapon(weapon) {
    if (game.gold >= weapon.price) {
        game.gold -= weapon.price;
        const weaponCopy = { ...weapon, type: 'weapon' };
        game.addToInventory(weaponCopy);
        game.updateStats();
    } else {
        game.addStoryText(`💰 You don\'t have enough gold for the ${weapon.name}.`);
    }
}

function startCombat(enemy) {
    let enemyHealth = enemy.health;
    let enemyMaxHealth = enemy.health;
    
    game.addStoryText(`⚔️ <strong>COMBAT BEGINS!</strong><br>You face ${enemy.name} (${enemyHealth}/${enemyMaxHealth} HP)`);
    
    function combatTurn() {
        const combatActions = [
            { text: '⚔️ Attack with weapon', action: () => playerAttack() },
            { text: '🛡️ Defend (reduce damage)', action: () => playerDefend() }
        ];
        
        // Add spell actions
        game.spells.forEach(spellName => {
            const spell = gameData.spells.find(s => s.name === spellName);
            if (spell && game.magic >= spell.cost) {
                combatActions.push({
                    text: `🔮 Cast ${spell.name} (${spell.cost} MP)`,
                    action: () => castSpell(spell)
                });
            }
        });
        
        showActions(combatActions);
        
        function playerAttack() {
            const damage = Math.floor(Math.random() * (game.weapon.damage[1] - game.weapon.damage[0] + 1)) + game.weapon.damage[0];
            const totalDamage = damage + Math.floor(game.strength / 2);
            enemyHealth -= totalDamage;
            
            game.addStoryText(`⚔️ You attack with your ${game.weapon.name} for ${totalDamage} damage!`);
            
            if (enemyHealth <= 0) {
                victoryReward(enemy);
                return;
            }
            
            enemyTurn();
        }
        
        function playerDefend() {
            game.addStoryText(`🛡️ You raise your guard, preparing to reduce incoming damage.`);
            enemyTurn(0.5); // 50% damage reduction
        }
        
        function castSpell(spell) {
            game.magic -= spell.cost;
            
            if (spell.damage) {
                const damage = Math.floor(Math.random() * (spell.damage[1] - spell.damage[0] + 1)) + spell.damage[0];
                const totalDamage = damage + Math.floor(game.intelligence / 3);
                enemyHealth -= totalDamage;
                game.addStoryText(`🔮 You cast ${spell.name} for ${totalDamage} magical damage!`);
            } else if (spell.heal) {
                const healing = Math.floor(Math.random() * (spell.heal[1] - spell.heal[0] + 1)) + spell.heal[0];
                game.health = Math.min(game.maxHealth, game.health + healing);
                game.addStoryText(`💚 You cast ${spell.name} and restore ${healing} health!`);
            }
            
            game.updateStats();
            
            if (enemyHealth <= 0) {
                victoryReward(enemy);
                return;
            }
            
            enemyTurn();
        }
        
        function enemyTurn(damageReduction = 1) {
            const damage = Math.floor(Math.random() * (enemy.damage[1] - enemy.damage[0] + 1)) + enemy.damage[0];
            const finalDamage = Math.max(1, Math.floor(damage * damageReduction));
            game.health -= finalDamage;
            
            game.addStoryText(`💥 ${enemy.name} attacks you for ${finalDamage} damage!`, 'damage-flash');
            game.updateStats();
            
            if (game.health <= 0) {
                gameOver();
                return;
            }
            
            game.addStoryText(`⚔️ ${enemy.name} has ${enemyHealth}/${enemyMaxHealth} HP remaining.`);
            combatTurn();
        }
    }
    
    combatTurn();
}

function victoryReward(enemy) {
    const goldReward = Math.floor(Math.random() * (enemy.gold[1] - enemy.gold[0] + 1)) + enemy.gold[0];
    game.gold += goldReward;
    game.gainXP(enemy.xp);
    
    game.addStoryText(`🎉 <strong>VICTORY!</strong> You defeated ${enemy.name}!<br>💰 Gained ${goldReward} gold and ${enemy.xp} XP!`, 'gold-glow');
    
    if (enemy.finalBoss) {
        // Grant Veilpiercer
        const veilpiercer = {
            name: 'Veilpiercer',
            damage: [18, 25],
            special: 'undead_bane',
            description: 'Legendary blade that cuts through darkness',
            type: 'weapon'
        };
        game.addToInventory(veilpiercer);
        game.addStoryText(`⚔️ <strong>LEGENDARY REWARD!</strong> You claimed the Veilpiercer sword!`, 'gold-glow');
        
        // Victory ending
        setTimeout(() => {
            game.addStoryText(`🏆 <strong>CONGRATULATIONS!</strong><br><br>${game.playerName}, you have completed your epic journey through the Shattered Veil! The Wraithcaller has been defeated, the Obsidian Marsh is cleansed, and you now wield the legendary Veilpiercer.<br><br>The people of Ashenreach hail you as a hero, and your name will be remembered for generations to come. But this is just the beginning of your adventures...`, 'gold-glow');
        }, 1000);
    }
    
    game.updateStats();
    
    if (game.currentLocation === 'obsidian_marsh') {
        const marshActions = [
            { text: '🗡️ Search for more enemies', action: 'searchEnemies' },
            { text: '🔍 Look for hidden treasures', action: 'searchTreasure' },
            { text: '🏛️ Approach the ancient temple', action: 'templeApproach' },
            { text: '🚶 Return to Ashenreach', action: 'returnToTown' }
        ];
        showActions(marshActions);
    } else {
        showActions(scenes.start.actions);
    }
}

function gameOver() {
    game.addStoryText(`💀 <strong>GAME OVER</strong><br><br>You have fallen in battle, ${game.playerName}. Your adventure ends here, but heroes never truly die - they live on in legend.<br><br>Would you like to start a new adventure?`, 'damage-flash');
    
    showActions([
        { text: '🔄 Start New Game', action: () => location.reload() }
    ]);
}

function showActions(actionList) {
    const actionButtons = document.getElementById('action-buttons');
    actionButtons.innerHTML = '';
    
    actionList.forEach(action => {
        const button = document.createElement('button');
        button.className = 'action-btn';
        button.innerHTML = action.text;
        
        if (typeof action.action === 'string') {
            button.onclick = () => {
                if (actions[action.action]) {
                    actions[action.action]();
                } else if (scenes[action.action]) {
                    game.addStoryText(scenes[action.action].text);
                    showActions(scenes[action.action].actions);
                }
            };
        } else if (typeof action.action === 'function') {
            button.onclick = action.action;
        }
        
        actionButtons.appendChild(button);
    });
}

// Game Initialization
document.addEventListener('DOMContentLoaded', function() {
    const startupScreen = document.getElementById('startup-screen');
    const gameContainer = document.getElementById('game-container');
    const playerNameInput = document.getElementById('player-name');
    const startButton = document.getElementById('start-game');
    
    // Focus on name input
    playerNameInput.focus();
    
    // Handle start game
    function startGame() {
        const name = playerNameInput.value.trim();
        if (name.length === 0) {
            alert('Please enter your name to begin your adventure!');
            return;
        }
        
        game.playerName = name;
        game.gameStarted = true;
        
        // Transition to game
        startupScreen.classList.remove('active');
        setTimeout(() => {
            gameContainer.classList.add('active');
            game.updateStats();
            
            // Start the game
            const startText = scenes.start.text.replace('${game.playerName || \'adventurer\'}', game.playerName);
            game.addStoryText(startText);
            showActions(scenes.start.actions);
        }, 500);
    }
    
    startButton.onclick = startGame;
    
    // Allow Enter key to start game
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGame();
        }
    });
});