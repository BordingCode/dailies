// The catalog. Every URL here was checked to be a live daily game (Nov 2026).
// cat = one of CATS keys. tags drive the recommendations. min = rough minutes.
window.CATS = {
  logic:  { name: 'Logic grids', color: 'var(--c-logic)' },
  words:  { name: 'Words',       color: 'var(--c-words)' },
  numbers:{ name: 'Numbers',     color: 'var(--c-numbers)' },
  colour: { name: 'Colour & matching', color: 'var(--c-colour)' },
  world:  { name: 'Trivia & world', color: 'var(--c-world)' },
};

window.GAMES = [
  // ── Logic grids ─────────────────────────────────────────
  { id: 'queens', name: 'Queens', by: 'LinkedIn', cat: 'logic', min: 3, tags: ['grid', 'placement', 'colour'], url: 'https://www.linkedin.com/games/queens', desc: 'One crown per row, column and coloured region — no two touching.' },
  { id: 'tango', name: 'Tango', by: 'LinkedIn', cat: 'logic', min: 3, tags: ['grid', 'placement', 'binary'], url: 'https://www.linkedin.com/games/tango', desc: 'Fill the grid with suns and moons, balanced in every row and column.' },
  { id: 'zip', name: 'Zip', by: 'LinkedIn', cat: 'logic', min: 2, tags: ['grid', 'path', 'quick'], url: 'https://www.linkedin.com/games/zip', desc: 'Draw one path through every cell, hitting the numbers in order.' },
  { id: 'minisudoku', name: 'Mini Sudoku', by: 'LinkedIn', cat: 'logic', min: 3, tags: ['grid', 'numbers', 'quick'], url: 'https://www.linkedin.com/games/mini-sudoku', desc: 'A 6×6 sudoku — a quick warm-up.' },
  { id: 'pips', name: 'Pips', by: 'NYT', cat: 'logic', min: 5, tags: ['grid', 'placement', 'numbers', 'colour'], url: 'https://www.nytimes.com/games/pips', desc: 'Place dominoes so every coloured region meets its rule.' },
  { id: 'nytsudoku', name: 'Sudoku', by: 'NYT', cat: 'logic', min: 10, tags: ['grid', 'numbers', 'long'], url: 'https://www.nytimes.com/puzzles/sudoku', desc: 'Classic sudoku in easy, medium and hard.' },
  { id: 'cluesbysam', name: 'Clues by Sam', by: 'cluesbysam.com', cat: 'logic', min: 10, tags: ['deduction', 'grid', 'story'], url: 'https://cluesbysam.com', desc: 'Who is innocent, who is criminal? Pure deduction from the clues.' },
  { id: 'murdle', name: 'Murdle', by: 'G. T. Karber', cat: 'logic', min: 8, tags: ['deduction', 'story', 'mystery'], url: 'https://murdle.com', desc: 'A tiny murder mystery solved with a logic grid.' },
  { id: 'nonograms', name: 'Daily Nonograms', by: 'puzzle-nonograms.com', cat: 'logic', min: 8, tags: ['grid', 'picture', 'numbers'], url: 'https://www.puzzle-nonograms.com', desc: 'Paint-by-numbers: fill cells from row and column clues. Pick "Daily".' },
  { id: 'starbattle', name: 'Daily Star Battle', by: 'puzzle-star-battle.com', cat: 'logic', min: 8, tags: ['grid', 'placement', 'colour'], url: 'https://www.puzzle-star-battle.com', desc: 'Like Queens, harder: stars per row, column and region. Pick "Daily".' },
  { id: 'hashi', name: 'Daily Hashi', by: 'puzzle-bridges.com', cat: 'logic', min: 6, tags: ['grid', 'path', 'numbers'], url: 'https://www.puzzle-bridges.com', desc: 'Connect islands with bridges so each has its number. Pick "Daily".' },
  { id: 'lightup', name: 'Daily Light Up', by: 'puzzle-light-up.com', cat: 'logic', min: 6, tags: ['grid', 'placement'], url: 'https://www.puzzle-light-up.com', desc: 'Place bulbs to light every cell without bulbs seeing each other. Pick "Daily".' },
  { id: 'horse', name: 'enclose.horse', by: 'enclose.horse', cat: 'logic', min: 5, tags: ['grid', 'spatial', 'optimise'], url: 'https://enclose.horse', desc: 'Place fences to build the biggest safe meadow for your horse.' },
  { id: 'pipes', name: 'Broken Pipes', by: 'sudoku-online.org', cat: 'logic', min: 4, tags: ['grid', 'path', 'spatial'], url: 'https://www.sudoku-online.org/en/games/broken-pipes/', desc: 'Rotate pipe pieces until the water flows.' },
  { id: 'puzzmo', name: 'Puzzmo', by: 'puzzmo.com', cat: 'logic', min: 15, tags: ['variety', 'words', 'grid', 'long'], url: 'https://www.puzzmo.com', desc: 'A whole daily bundle of fresh, thoughtful puzzles.' },
  { id: 'lichess', name: 'Daily Puzzle', by: 'Lichess', cat: 'logic', min: 3, tags: ['chess', 'tactics', 'quick'], url: 'https://lichess.org/training/daily', desc: 'One chess tactic a day. Find the winning move.' },

  // ── Words ───────────────────────────────────────────────
  { id: 'wordle', name: 'Wordle', by: 'NYT', cat: 'words', min: 3, tags: ['guess', 'letters', 'quick'], url: 'https://www.nytimes.com/games/wordle/index.html', desc: 'Guess the five-letter word in six tries.' },
  { id: 'connections', name: 'Connections', by: 'NYT', cat: 'words', min: 5, tags: ['groups', 'meaning', 'colour'], url: 'https://www.nytimes.com/games/connections', desc: 'Sort 16 words into four secret groups.' },
  { id: 'strands', name: 'Strands', by: 'NYT', cat: 'words', min: 6, tags: ['grid', 'search', 'meaning'], url: 'https://www.nytimes.com/games/strands', desc: 'Find themed words hidden in a letter grid.' },
  { id: 'spellingbee', name: 'Spelling Bee', by: 'NYT', cat: 'words', min: 10, tags: ['letters', 'vocab', 'long'], url: 'https://www.nytimes.com/puzzles/spelling-bee', desc: 'Make words from seven letters. Find the pangram.' },
  { id: 'mini', name: 'The Mini', by: 'NYT', cat: 'words', min: 2, tags: ['crossword', 'quick', 'trivia'], url: 'https://www.nytimes.com/crosswords/game/mini', desc: 'A tiny crossword you finish over coffee.' },
  { id: 'letterboxed', name: 'Letter Boxed', by: 'NYT', cat: 'words', min: 6, tags: ['letters', 'path', 'vocab'], url: 'https://www.nytimes.com/puzzles/letter-boxed', desc: 'Chain words around a square using every letter.' },
  { id: 'waffle', name: 'Waffle', by: 'wafflegame.net', cat: 'words', min: 5, tags: ['grid', 'letters', 'swap', 'colour'], url: 'https://wafflegame.net/daily', desc: 'Swap letters to fix six words in a waffle grid.' },
  { id: 'squaredle', name: 'Squaredle', by: 'squaredle.app', cat: 'words', min: 8, tags: ['grid', 'search', 'vocab'], url: 'https://squaredle.app', desc: 'Swipe through a letter square to find every word.' },
  { id: 'contexto', name: 'Contexto', by: 'contexto.me', cat: 'words', min: 6, tags: ['guess', 'meaning', 'hot-cold'], url: 'https://contexto.me', desc: 'Find the secret word — each guess tells you how close in meaning.' },
  { id: 'semantle', name: 'Semantle', by: 'semantle.com', cat: 'words', min: 10, tags: ['guess', 'meaning', 'hot-cold', 'long'], url: 'https://semantle.com', desc: 'Contexto\'s harder cousin: hot-and-cold by meaning.' },
  { id: 'quordle', name: 'Quordle', by: 'Merriam-Webster', cat: 'words', min: 6, tags: ['guess', 'letters', 'multi'], url: 'https://www.merriam-webster.com/games/quordle', desc: 'Four Wordles at once in nine guesses.' },
  { id: 'octordle', name: 'Octordle', by: 'octordle.com', cat: 'words', min: 10, tags: ['guess', 'letters', 'multi', 'long'], url: 'https://www.octordle.com', desc: 'Eight Wordles at once. Chaos.' },
  { id: 'wordiply', name: 'Wordiply', by: 'The Guardian', cat: 'words', min: 4, tags: ['letters', 'vocab', 'quick'], url: 'https://www.wordiply.com', desc: 'Find the longest word containing today\'s starter.' },
  { id: 'cryptic', name: 'Minute Cryptic', by: 'minutecryptic.com', cat: 'words', min: 3, tags: ['crossword', 'wordplay', 'quick'], url: 'https://www.minutecryptic.com', desc: 'One cryptic crossword clue a day, with hints.' },
  { id: 'pinpoint', name: 'Pinpoint', by: 'LinkedIn', cat: 'words', min: 2, tags: ['groups', 'meaning', 'quick'], url: 'https://www.linkedin.com/games/pinpoint', desc: 'Guess the category from as few words as possible.' },
  { id: 'crossclimb', name: 'Crossclimb', by: 'LinkedIn', cat: 'words', min: 4, tags: ['letters', 'trivia', 'ladder'], url: 'https://www.linkedin.com/games/crossclimb', desc: 'Solve trivia clues and order them into a word ladder.' },
  { id: 'redactle', name: 'Redactle', by: 'redactle.net', cat: 'words', min: 12, tags: ['guess', 'trivia', 'long'], url: 'https://www.redactle.net', desc: 'A blacked-out Wikipedia article. Reveal words, name the title.' },
  { id: 'sqword', name: 'Sqword', by: 'sqword.com', cat: 'words', min: 5, tags: ['grid', 'letters', 'placement'], url: 'https://www.sqword.com', desc: 'Place letters on a 5×5 grid to build as many words as you can.' },
  { id: 'catfishing', name: 'catfishing', by: 'catfishing.net', cat: 'words', min: 5, tags: ['guess', 'trivia', 'deduction'], url: 'https://catfishing.net', desc: 'Guess the Wikipedia article from its categories alone.' },

  // ── Numbers ─────────────────────────────────────────────
  { id: 'nerdle', name: 'Nerdle', by: 'nerdlegame.com', cat: 'numbers', min: 4, tags: ['guess', 'math', 'quick'], url: 'https://nerdlegame.com', desc: 'Wordle for maths: guess the hidden equation.' },
  { id: 'mathler', name: 'Mathler', by: 'mathler.com', cat: 'numbers', min: 4, tags: ['guess', 'math', 'quick'], url: 'https://www.mathler.com', desc: 'Find the equation that equals today\'s number.' },
  { id: 'numberle', name: 'Numberle', by: 'numberle.org', cat: 'numbers', min: 4, tags: ['guess', 'math'], url: 'https://numberle.org', desc: 'Another equation-guessing game, with harder modes.' },
  { id: 'sumplete', name: 'Sumplete', by: 'sumplete.com', cat: 'numbers', min: 5, tags: ['grid', 'math', 'logic'], url: 'https://www.sumplete.com', desc: 'Delete numbers so every row and column hits its total.' },
  { id: 'angle', name: 'Angle', by: 'angle.wtf', cat: 'numbers', min: 1, tags: ['estimate', 'visual', 'quick'], url: 'https://www.angle.wtf', desc: 'Guess the angle in four tries. Thirty seconds.' },

  // ── Colour & matching ───────────────────────────────────
  { id: 'colorbricks', name: 'Daily Colorbricks', by: 'sudoku-online.org', cat: 'colour', min: 5, tags: ['matching', 'chain', 'colour', 'gravity'], url: 'https://www.sudoku-online.org/en/games/colorbricks/', desc: 'Clear groups of coloured blocks; the rest fall into new chains.' },
  { id: 'ballsort', name: 'Daily Color Ball Sort', by: 'sudoku-online.org', cat: 'colour', min: 4, tags: ['sorting', 'colour', 'orbs'], url: 'https://www.sudoku-online.org/en/games/color-ball-sort/', desc: 'Sort the coloured balls into tubes, one colour each.' },
  { id: 'tiles', name: 'Tiles', by: 'NYT', cat: 'colour', min: 4, tags: ['matching', 'pattern', 'chain', 'visual'], url: 'https://www.nytimes.com/puzzles/tiles', desc: 'Match patterned tiles in long, relaxing combos.' },
  { id: 'hexcodle', name: 'Hexcodle', by: 'hexcodle.com', cat: 'colour', min: 3, tags: ['guess', 'colour', 'numbers'], url: 'https://hexcodle.com', desc: 'Guess today\'s colour by its hex code.' },
  { id: 'colorfle', name: 'Colorfle', by: 'colorfle.com', cat: 'colour', min: 3, tags: ['guess', 'colour', 'mixing'], url: 'https://colorfle.com', desc: 'Mix three colours to match the target in six tries.' },
  { id: 'dialed', name: 'Dialed', by: 'dialed.gg', cat: 'colour', min: 3, tags: ['memory', 'colour', 'visual'], url: 'https://dialed.gg', desc: 'See a colour, then recreate it from memory.' },

  // ── Trivia & world (the "something different" pool) ─────
  { id: 'worldle', name: 'Worldle', by: 'teuteuf', cat: 'world', min: 2, tags: ['geography', 'guess', 'visual', 'quick'], url: 'https://worldle.teuteuf.fr', desc: 'Name the country from its outline.' },
  { id: 'globle', name: 'Globle', by: 'globle-game.com', cat: 'world', min: 3, tags: ['geography', 'hot-cold'], url: 'https://globle-game.com', desc: 'Find the mystery country — the globe gets hotter as you close in.' },
  { id: 'travle', name: 'Travle', by: 'travle.earth', cat: 'world', min: 4, tags: ['geography', 'path'], url: 'https://travle.earth', desc: 'Get from one country to another via the fewest neighbours.' },
  { id: 'flagle', name: 'Flagle', by: 'flagle.io', cat: 'world', min: 2, tags: ['geography', 'visual', 'quick'], url: 'https://flagle.io', desc: 'Guess the country from its flag, then bonus rounds.' },
  { id: 'tradle', name: 'Tradle', by: 'tradle.net', cat: 'world', min: 3, tags: ['geography', 'deduction', 'numbers'], url: 'https://tradle.net', desc: 'Which country exports this mix of products?' },
  { id: 'timeguessr', name: 'TimeGuessr', by: 'timeguessr.com', cat: 'world', min: 6, tags: ['geography', 'history', 'visual', 'estimate'], url: 'https://timeguessr.com', desc: 'Where and when was this photo taken?' },
  { id: 'foodguessr', name: 'FoodGuessr', by: 'foodguessr.com', cat: 'world', min: 5, tags: ['geography', 'food', 'visual'], url: 'https://foodguessr.com', desc: 'Guess where in the world each dish comes from.' },
  { id: 'framed', name: 'Framed', by: 'framed.wtf', cat: 'world', min: 3, tags: ['movies', 'visual', 'guess'], url: 'https://framed.wtf', desc: 'Name the movie from six frames.' },
  { id: 'gamedle', name: 'Gamedle', by: 'gamedle.wtf', cat: 'world', min: 3, tags: ['videogames', 'visual', 'guess'], url: 'https://www.gamedle.wtf', desc: 'Name the video game from its cover and art.' },
  { id: 'bandle', name: 'Bandle', by: 'bandle.app', cat: 'world', min: 3, tags: ['music', 'guess', 'audio'], url: 'https://bandle.app', desc: 'Guess the song, one instrument at a time.' },
  { id: 'costcodle', name: 'Costcodle', by: 'costcodle.com', cat: 'world', min: 2, tags: ['estimate', 'numbers', 'quick'], url: 'https://costcodle.com', desc: 'Guess the price of a Costco product.' },
  { id: 'dozen', name: 'The Dozen', by: 'dailydozentrivia.com', cat: 'world', min: 6, tags: ['trivia', 'quiz'], url: 'https://dailydozentrivia.com', desc: 'Twelve trivia questions a day.' },
];
