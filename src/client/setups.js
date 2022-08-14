let m_main = [
  {
    t: "How to Play",
    em: '🎓',
    lt: "Learn the simple rules"
  },
  {
    t: "Play vs Computer",
    em: '🤖',
    lt: "Play against various AI opponents"
  },
  {
    t: "Player vs Local Player",
    em: '🎎',
    lt: "Play against a friend on one device"
  },
  {
    t: "Player vs Online Player",
    em: '🌐',
    lt: "Play against a human online"
  }
];

let m_ais = [
  {
    t: "Easy Opponent",
    em: "💻",
    lt:"Not very good, does it's best to score.",
    pp: { d:1, pm: 1, opm:1, rn: 20  }
  },
  {
    t: "Novice",
    em: "💻",
    lt:"A novice player, good to learn against.",
    pp: { d:1, pm: 1, opm:1, rn: 1 }
  },
  {
    t: "Better",
    em: "💻",
    lt:"A novice player, good to learn against.",
    pp: { d:2, pm: 1, opm:1, rn: 1 }
  },
  {
    t: "Deep",
    em: "💻",
    lt:"A novice player, good to learn against.",
    pp: { d:3, pm: 1, opm:1, rn: 1 }
  },
];

let gameRules="The game is played by placing tokens in turn on a 4 x 4 x 4 grid much like 3D tic-tac-toe.\n\n"+
   "You need to get 4 tokens of your colour in a straight line in any directions (including vertically and diagonally) to score.\n\n"+
   "The first player to get 7 straight lines wins.\n\nGood Luck!\n\n";