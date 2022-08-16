let m_main = [
  {
    t: "The Devil's Rules",
    em: '🎓',
    lt: "Learn the simple rules of 𝟜-Play"
  },
  {
    t: "The Minions of Hell",
    em: '⛧',
    lt: "Practice against various demonic opponents"
  },
  {
    t: "Two Players Local",
    em: '🎎',
    lt: "Practice against a human on one device"
  },
  {
    t: "Two Players Online",
    em: '🌐',
    lt: "Practice against a human online"
  }
];

let m_ais = [
  {
    t: "Servant Imp",
    em: "👿",
    lt:"A foolish little thing - stupid and careless",
    pp: { d:1, pm: 1, opm:1, rn: 40  }
  },
  {
    t: "Goblin Intellectual",
    em: "😈",
    lt:"A well trained player, but goblins aren't bright",
    pp: { d:1, pm: 1, opm:1, rn: 10  }
  },
  {
    t: "Vengence Demon",
    em: "👺",
    lt: "Plays well but easy to trick.",
    pp: { d:1, pm: 1, opm:1, rn: 1 }
  },
  {
    t: "Duke of Hell",
    em: "👹",
    lt: "Skilled and dangerous, very hard to beat",
    pp: { d:2, pm: 1, opm:1, rn: 10 }
  },
  {
    t: "Prince of Death",
    em: "☠",
    lt:"The famous prince of 𝟜-Play",
    pp: { d:2, pm: 1, opm:1, rn: 1 }
  },
  {
    t: "Satan Lord of Hell",
    em: "✪",
    lt:"Never beaten by a Mortal",
    pp: { d:3, pm: 1, opm:1, rn: .01 }
  },
];

let gameRules=
   "It's tic-tac-toe. Everyone knows how to play tic-tac-toe, right?\n\n"+
   "Except...\n\n"+
   "It's played on a 3D 4 x 4 x 4 cubic grid.\n\n"+
   "On your turn make your mark on any open square. Place 4 markers in a straight line to score a point."+
   "The first player to reach 7 points wins.\n"+
   "Good Luck!\n\n\n"+
   "A hint to give you hope:\n"+
   "Markers can form a straight line in any direction - vertically, horizontally and diagonally"+
   " across each board and through the boards.\n"+
   "Practice against the lesser demons to steal their tricks!"


   /*"The game is played by placing tokens in turn on a 4 x 4 x 4 cubic grid much like 3D version of tic-tac-toe.\n\n"+
   "You need to get 4 green tokens in a straight line in any directions to score.\n"+
   "A line of tokens can be in any direction including downwards through the boards vertically; diagonally and diagonally through the boards.\n\n"+
   "The first player to get 7 straight lines wins.\n\nGood Luck!\n\n"*/;

let introText="\nAfter death you find your soul in the balance; you must beat the devil in a game of chance or skill to save yourself.\n\n"+
   "'What - any game?', you ask while desparately trying to think of something that you are good at.\n\n"+
   "'I will choose tic-tac-toe.', you say at last, 'but only if I can play the first turn.'\n\n"+
   "'Well', said the Devil, 'no problem there, we have a version of that around here - we call it 𝟜-Play. \n\n"+
   "'It is just like tic-tac-toe, and you can go first if you think that will help.'\n\n\n"+
   "'Perhaps you will be the first to beat me.'\n\n";


