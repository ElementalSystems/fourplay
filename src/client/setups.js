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
   "Practice against the lesser demons to steal their tricks!";

let introText=
"👤: Where am I?\n\n"+
"👺: You're dead.\n\n"+
"👤: What?!! It's quite warm here.\n\n"+
"👺: Yes. You're in Hell. Deal with it.\n The good news is that you've been bad but not very bad. Your soul is in the balance. You have 1 chance to save yourself."+
" Beat the Devil at the game of your choice and you're free.\n We'll even let you practice first.\n\n"+
"👤: What?! Any game? I  choose tic-tac-toe but only if I can play the first turn.\n\n"+
"👺: Ooh, good choice! We have a version of that - we call it 𝟜-Play. It's just like tic-tac-toe, and you can go first if you think that will help\n\n"+
"👺: Perhaps you will be the first to beat the devil himself.\n";
   

