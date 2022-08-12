

async function startGame(p1,p2) {
  ge_gone("lobby",true);
  ge_gone("game",false);
  
  let gs = m_gs(p1,p2); //make a game
  let bd = m_bd(gs); //make a board
  bd.setB("Starting Game...");

  let doTurn = async () => {
    let pn = gs.tn % 2; //which player    
    bd.update();
    console.log(gs);
    bd.setB(gs.p[pn].n + "'s turn Score "+gs.sc.p1+" vs "+gs.sc.p2 + " --- Left "+gs.sc.av);    
    let i=await selTurn(gs, bd, gs.p[pn],pn); //ask this player for his move
    await pubTurn(gs, pn ? 0 : 1,gs.p[pn ? 0 : 1],i) //inform the opponent of the move
    gs.move(i); //change the board status    
    bd.update();     
    return true;
  };

  while (await doTurn()) {
    //play the turns until someone retruns false.    
  }

  lobby.reset();
  
}

