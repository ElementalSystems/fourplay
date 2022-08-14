/*
   Contains all the abstraction about how to make a turn.
*/

async function selTurn(gs, bd, p, pn) {
  switch (p.t) {
    case 'l':
      bd.setB("Your turn  "+p.n,"Select a spot to play");
      return await bd.selMove();
    case 'r':
      bd.setB("Waiting for "+p.n+" to play...");
      return new Promise((resolve,reject)=>{
        lobby.waitMsg((m) => resolve(m.move)); //wait for remote player to pub that turn.
      });
    case 'a': 
      bd.setB(p.n+" is thinking...");      
      return await aiPlay(gs);
  }
}

async function pubTurn(gs,pn, op,i) {
  if (op.t == 'r') { //for a remote opponent send a message
    lobby.msg({
      move: i,
    });
  }
}
