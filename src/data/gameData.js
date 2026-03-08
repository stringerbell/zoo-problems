// Beauty products that change the giraffe's appearance
export const BEAUTY_PRODUCTS = [
  { id: 'eyeliner', name: 'Dramatic Eyeliner', emoji: '👁️', desc: 'Long luxurious lashes', rarity: 'common' },
  { id: 'lipstick', name: 'Ruby Lipstick', emoji: '💄', desc: 'A bold red lip', rarity: 'common' },
  { id: 'blush', name: 'Rose Blush', emoji: '🌸', desc: 'Rosy glow on those cheeks', rarity: 'common' },
  { id: 'eyeshadow', name: 'Sparkle Shadow', emoji: '✨', desc: 'Shimmery purple lids', rarity: 'uncommon' },
  { id: 'nailpolish', name: 'Hoof Gloss', emoji: '💅', desc: 'Glossy pink hooves', rarity: 'uncommon' },
  { id: 'hairbow', name: 'Satin Bow', emoji: '🎀', desc: 'A cute bow between the ossicones', rarity: 'uncommon' },
  { id: 'pearls', name: 'Pearl Necklace', emoji: '📿', desc: 'Elegant neck pearls', rarity: 'rare' },
  { id: 'sunglasses', name: 'Star Shades', emoji: '🕶️', desc: 'Too cool for the zoo', rarity: 'rare' },
  { id: 'glitter', name: 'Body Glitter', emoji: '💎', desc: 'Sparkle from head to hoof', rarity: 'rare' },
  { id: 'tiara', name: 'Diamond Tiara', emoji: '👑', desc: 'Queen of the zoo', rarity: 'legendary' },
];

// Animal NPCs
// Each animal can be friendly OR saboteur — randomized each night.
// friendlyChance: probability of being helpful (0.0 - 1.0)
export const ANIMALS = {
  owl: {
    name: 'Oliver the Owl',
    color: 0x8B6914,
    accent: 0xFFD700,
    emoji: '🦉',
    personality: 'wise',
    friendlyChance: 0.75,
    helpType: 'hints',
    sabotageType: 'misdirect',
  },
  monkey: {
    name: 'Max the Monkey',
    color: 0x8B4513,
    accent: 0xFFD39B,
    emoji: '🐒',
    personality: 'mischievous',
    friendlyChance: 0.6,
    helpType: 'distraction',
    sabotageType: 'noise',
  },
  penguin: {
    name: 'Penny the Penguin',
    color: 0x2F2F2F,
    accent: 0xFFFFFF,
    emoji: '🐧',
    personality: 'cheerful',
    friendlyChance: 0.8,
    helpType: 'diversion',
    sabotageType: 'noise',
  },
  parrot: {
    name: 'Pablo the Parrot',
    color: 0xFF3333,
    accent: 0x33FF33,
    emoji: '🦜',
    personality: 'loud',
    friendlyChance: 0.55,
    helpType: 'warning',
    sabotageType: 'alert',
  },
  snake: {
    name: 'Sasha the Snake',
    color: 0x228B22,
    accent: 0x90EE90,
    emoji: '🐍',
    personality: 'deceptive',
    friendlyChance: 0.25,
    helpType: 'hints',
    sabotageType: 'misdirect',
  },
  peacock: {
    name: 'Preston the Peacock',
    color: 0x0066CC,
    accent: 0x00CCFF,
    emoji: '🦚',
    personality: 'jealous',
    friendlyChance: 0.3,
    helpType: 'warning',
    sabotageType: 'alert',
  },
  hyena: {
    name: 'Hank the Hyena',
    color: 0xB8860B,
    accent: 0x555555,
    emoji: '🦊',
    personality: 'chaotic',
    friendlyChance: 0.35,
    helpType: 'distraction',
    sabotageType: 'noise',
  },
  elephant: {
    name: 'Ellie the Elephant',
    color: 0x999999,
    accent: 0xBBBBBB,
    emoji: '🐘',
    personality: 'gentle',
    friendlyChance: 0.7,
    helpType: 'diversion',
    sabotageType: 'noise',
  },
  flamingo: {
    name: 'Fiona the Flamingo',
    color: 0xFF69B4,
    accent: 0xFF1493,
    emoji: '🦩',
    personality: 'fashionable',
    friendlyChance: 0.5,
    helpType: 'hints',
    sabotageType: 'alert',
  },
  turtle: {
    name: 'Terry the Turtle',
    color: 0x556B2F,
    accent: 0x8FBC8F,
    emoji: '🐢',
    personality: 'philosophical',
    friendlyChance: 0.65,
    helpType: 'diversion',
    sabotageType: 'misdirect',
  },
};

// Dialogues for each animal
export const DIALOGUES = {
  owl: [
    { text: "Hoo hoo! The guards change shifts at the east gate in 30 seconds. That's your window!", choices: ['Thanks, Oliver!', 'Any other tips?'] },
    { text: "I've been watching from up here... the guard near the gift shop always stops to check his phone. Predictable humans.", choices: ['Noted!', 'What about the other guards?'] },
    { text: "Be careful near the reptile house. Sasha the Snake is NOT to be trusted.", choices: ['I\'ll remember that.', 'Why not?'] },
  ],
  monkey: [
    { text: "Psst! Want me to throw a banana at that guard? I've got great aim! ...mostly.", choices: ['Do it!', 'Maybe later.'] },
    { text: "I swiped the keys to the supply closet last week. Want me to create a distraction? 🍌", choices: ['Yes please!', 'Not now.'] },
    { text: "Hehe, I put a whoopee cushion on the guard's chair earlier. You should have SEEN his face!", choices: ['Ha! Nice one!', 'Stay focused, Max.'] },
  ],
  penguin: [
    { text: "I can waddle reeeally slowly in front of that guard if you need time to sneak by!", choices: ['That would help!', 'I\'m good for now.'] },
    { text: "Did you know penguins can hold their breath for 20 minutes? Not relevant, just proud of it.", choices: ['That IS impressive.', 'Focus, Penny!'] },
    { text: "I slid on my belly into the guard station once. They thought I was a lost exhibit. Good times.", choices: ['Amazing.', 'Can you do it again?'] },
  ],
  parrot: [
    { text: "SQUAWK! Guard coming from the north! I mean... *whispers* guard coming from the north.", choices: ['Thanks for the warning!', 'Volume, Pablo!'] },
    { text: "I can mimic the security radio! 'All clear in sector 7!' Want me to try?", choices: ['That\'s genius!', 'Too risky.'] },
    { text: "Pretty bird! Pretty giraffe! Pretty... wait, is that new lipstick? Looking FABULOUS!", choices: ['Why thank you!', 'Have you seen any chests?'] },
  ],
  snake: [
    { text: "Ssssay, I know a ssshortcut through the reptile house. Totally safe, I promisssse...", choices: ['Lead the way!', 'I don\'t trust you.'] },
    { text: "The coast is clear to the left. Definitely no guards that way. *flicks tongue*", choices: ['Thanks... I think.', 'You\'re lying, aren\'t you?'] },
    { text: "Oh what a lovely necklace! I bet there's an even nicer one... right past those guards.", choices: ['Nice try, Sasha.', 'Where exactly?'] },
  ],
  peacock: [
    { text: "Oh, you found eyeliner? How... quaint. MY feathers are naturally gorgeous, you know.", choices: ['Cool story, Preston.', 'They are pretty nice.'] },
    { text: "*fans tail feathers aggressively* SOME of us don't NEED beauty products to be stunning!", choices: ['Jealous much?', 'You do look nice.'] },
    { text: "Oh is that a guard coming? I should probably... OVER HERE! THERE'S A GIRAFFE LOOSE!", choices: ['Preston, NO!', '*runs*'] },
  ],
  hyena: [
    { text: "AHAHAHA! Oh sorry, was that too loud? I just can't help it! AHAHAHA!", choices: ['Shhhh!', 'Keep it down!'] },
    { text: "Wanna hear a joke? Why did the giraffe get caught? Because AHAHAHAHA—", choices: ['*covers his mouth*', 'Not funny, Hank.'] },
    { text: "HEHEHE you look ridiculous sneaking around! A giraffe! Sneaking! BAHAHAHA!", choices: ['*glares*', 'I\'m very stealthy!'] },
  ],
  elephant: [
    { text: "Oh, am I in your way? Sorry, let me just... *slowly turns*... this takes a moment.", choices: ['Take your time!', 'Could you hurry?'] },
    { text: "I remember every guard's patrol route. Elephants never forget! Want me to share?", choices: ['Yes please!', 'I\'m good.'] },
    { text: "I'd sneak around too but... well... *gestures at enormous body*... logistics.", choices: ['Fair point.', 'You could be a great distraction!'] },
  ],
  flamingo: [
    { text: "Darling, that blush is SO last season. But on a giraffe? Somehow it WORKS.", choices: ['Thanks, I think?', 'What\'s in season?'] },
    { text: "I heard there's a LIMITED EDITION glitter set near the aquarium. Very exclusive.", choices: ['Ooh, I need that!', 'Is it guarded?'] },
    { text: "Stand on one leg! It's very zen AND it makes you harder to spot. Trust me.", choices: ['*tries it*', 'I have four legs...'] },
  ],
  turtle: [
    { text: "Slow and steady wins the race. But also... the guards are slow too. So maybe be fast.", choices: ['Wise words.', 'That\'s contradictory.'] },
    { text: "I've been in this zoo for 87 years. The beauty? It was inside us all along... and also in those chests.", choices: ['Deep.', 'Where are the chests?'] },
    { text: "Why do you rush? The night is long. The guards are tired. Be like water... sneaky water.", choices: ['Sneaky water. Got it.', 'You\'re weird, Terry.'] },
  ],
};

// Special items from the giant bonus chest
export const SPECIAL_ITEMS = [
  { id: 'fanny_pack', name: 'Fabulous Fanny Pack', emoji: '👜', desc: 'Peak fashion. Holds all your secrets.', effect: 'style' },
  { id: 'dress', name: 'Sparkly Ball Gown', emoji: '👗', desc: 'A dress fit for a giraffe queen.', effect: 'style' },
  { id: 'sword', name: 'Foam Sword', emoji: '⚔️', desc: 'Not sharp, but very intimidating.', effect: 'style' },
  { id: 'lion_costume', name: 'Lion Costume', emoji: '🦁', desc: 'ROAR! Become the king of the zoo.', effect: 'lion' },
];

// Mischief missions
export const MISSIONS = [
  { id: 'signs', name: 'Swap the Zoo Signs', desc: 'Switch the "Lions" and "Penguins" signs', points: 100 },
  { id: 'statue', name: 'Decorate the Founder Statue', desc: 'Paint a mustache on the zoo founder\'s statue', points: 150 },
  { id: 'fountain', name: 'Bubble Bath Fountain', desc: 'Pour bubble bath into the main fountain', points: 200 },
  { id: 'giftshop', name: 'Gift Shop Swap', desc: 'Replace all the gift shop postcards with silly photos', points: 150 },
  { id: 'cafeteria', name: 'Cafeteria Caper', desc: 'Rearrange the cafeteria menu to only serve grass', points: 200 },
  { id: 'speakers', name: 'DJ Giraffe', desc: 'Hijack the PA system and play funky music', points: 250 },
  { id: 'flags', name: 'Flag Fiasco', desc: 'Replace zoo flags with giraffe-print ones', points: 200 },
  { id: 'map', name: 'Map Madness', desc: 'Redraw the visitor maps with silly animal names', points: 150 },
  { id: 'lights', name: 'Disco Zoo', desc: 'Rewire the path lights into a disco ball', points: 300 },
  { id: 'office', name: 'Director\'s Office', desc: 'Leave a "Giraffe Employee of the Month" plaque', points: 350 },
];

// Level configurations
// zone: { minRow, maxRow } — which rows of the map are accessible
export const LEVELS = [
  {
    night: 1,
    name: 'First Steps',
    guardCount: 1,
    guardSpeed: 40,
    guardVision: 80,
    missions: ['signs'],
    chestCount: 2,
    npcs: ['owl', 'monkey'],
    timeLimit: 120,
    zone: { minRow: 0, maxRow: 13 },
  },
  {
    night: 2,
    name: 'Getting Bolder',
    guardCount: 2,
    guardSpeed: 45,
    guardVision: 90,
    missions: ['statue', 'giftshop'],
    chestCount: 3,
    npcs: ['owl', 'penguin', 'snake'],
    timeLimit: 150,
    zone: { minRow: 0, maxRow: 13 },
  },
  {
    night: 3,
    name: 'Mischief Managed',
    guardCount: 2,
    guardSpeed: 50,
    guardVision: 100,
    missions: ['fountain', 'cafeteria'],
    chestCount: 3,
    npcs: ['parrot', 'monkey', 'peacock', 'flamingo'],
    timeLimit: 150,
    zone: { minRow: 0, maxRow: 21 },
  },
  {
    night: 4,
    name: 'Double Trouble',
    guardCount: 3,
    guardSpeed: 55,
    guardVision: 110,
    missions: ['speakers', 'flags', 'map'],
    chestCount: 4,
    npcs: ['owl', 'penguin', 'hyena', 'elephant', 'turtle'],
    timeLimit: 180,
    zone: { minRow: 0, maxRow: 29 },
  },
  {
    night: 5,
    name: 'The Grand Finale',
    guardCount: 4,
    guardSpeed: 60,
    guardVision: 120,
    missions: ['lights', 'office'],
    chestCount: 5,
    npcs: ['parrot', 'monkey', 'penguin', 'snake', 'peacock', 'hyena', 'flamingo'],
    timeLimit: 200,
    zone: { minRow: 0, maxRow: 29 },
  },
];

// Zoo map tiles
export const TILE = {
  GRASS: 0,
  PATH: 1,
  WALL: 2,
  FENCE: 3,
  WATER: 4,
  BUSH: 5,
  EXHIBIT: 6,
  GATE: 7,
};

// Zoo map layout (40x30 tiles, each tile is 32px)
export const ZOO_MAP = [
  // Row 0
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  // Row 1
  [3,0,0,0,0,5,0,0,0,3,6,6,6,6,3,0,0,5,0,0,1,0,0,5,0,3,6,6,6,6,3,0,0,0,5,0,0,0,0,3],
  // Row 2
  [3,0,0,0,0,0,0,0,0,3,6,6,6,6,3,0,0,0,0,0,1,0,0,0,0,3,6,6,6,6,3,0,0,0,0,0,0,0,0,3],
  // Row 3
  [3,0,0,5,0,0,0,5,0,3,6,6,6,6,3,0,5,0,0,0,1,0,0,0,5,3,6,6,6,6,3,0,5,0,0,0,5,0,0,3],
  // Row 4
  [3,0,0,0,0,0,0,0,0,3,3,3,7,3,3,0,0,0,0,0,1,0,0,0,0,3,3,3,7,3,3,0,0,0,0,0,0,0,0,3],
  // Row 5
  [3,5,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,5,0,1,0,5,0,0,0,0,0,1,0,0,0,0,0,0,0,0,5,0,3],
  // Row 6
  [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
  // Row 7
  [3,0,0,5,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,5,0,0,0,0,3],
  // Row 8
  [3,0,0,0,0,0,0,0,0,3,3,3,7,3,3,0,0,5,0,0,1,0,0,5,0,3,3,3,7,3,3,0,0,0,0,0,0,0,0,3],
  // Row 9
  [3,0,5,0,0,0,5,0,0,3,6,6,6,6,3,0,0,0,0,0,1,0,0,0,0,3,6,6,6,6,3,0,0,5,0,0,0,0,5,3],
  // Row 10
  [3,0,0,0,0,0,0,0,0,3,6,6,6,6,3,0,0,0,0,0,1,0,0,0,0,3,6,6,6,6,3,0,0,0,0,0,0,0,0,3],
  // Row 11
  [3,0,0,0,0,0,0,0,0,3,6,6,6,6,3,0,5,0,0,0,1,0,0,0,5,3,6,6,6,6,3,0,0,0,0,0,0,0,0,3],
  // Row 12
  [3,0,0,0,5,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,1,0,0,0,0,3,3,3,3,3,3,0,0,0,5,0,0,0,0,3],
  // Row 13
  [3,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,3],
  // Row 14
  [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
  // Row 15
  [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
  // Row 16
  [3,0,0,5,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,5,0,0,0,0,0,0,5,0,0,0,3],
  // Row 17
  [3,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,1,2,1,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,3],
  // Row 18
  [3,0,0,0,0,5,0,0,4,4,4,4,4,4,4,0,0,5,0,1,2,1,0,5,0,4,4,4,4,4,4,4,0,0,5,0,0,0,0,3],
  // Row 19
  [3,0,0,0,0,0,0,0,4,4,4,4,4,4,4,0,0,0,0,1,2,1,0,0,0,4,4,4,4,4,4,4,0,0,0,0,0,0,0,3],
  // Row 20
  [3,0,0,0,0,0,0,0,0,4,4,4,4,4,0,0,0,0,0,1,2,1,0,0,0,0,4,4,4,4,4,0,0,0,0,0,0,0,0,3],
  // Row 21
  [3,0,5,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,5,0,3],
  // Row 22
  [3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
  // Row 23
  [3,0,0,0,0,0,0,0,0,3,3,3,7,3,3,0,0,0,0,0,1,0,0,0,0,3,3,3,7,3,3,0,0,0,0,0,0,0,0,3],
  // Row 24
  [3,0,5,0,0,0,0,5,0,3,6,6,6,6,3,0,5,0,0,0,1,0,0,0,5,3,6,6,6,6,3,0,0,5,0,0,5,0,0,3],
  // Row 25
  [3,0,0,0,0,0,0,0,0,3,6,6,6,6,3,0,0,0,0,0,1,0,0,0,0,3,6,6,6,6,3,0,0,0,0,0,0,0,0,3],
  // Row 26
  [3,0,0,0,0,0,0,0,0,3,6,6,6,6,3,0,0,0,0,0,1,0,0,0,0,3,6,6,6,6,3,0,0,0,0,0,0,0,0,3],
  // Row 27
  [3,0,0,5,0,0,0,0,0,3,3,3,3,3,3,0,0,5,0,0,1,0,0,5,0,3,3,3,3,3,3,0,0,0,0,5,0,0,0,3],
  // Row 28
  [3,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,3],
  // Row 29
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];
