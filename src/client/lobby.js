function _init_lobby() {
  let mp_bt = null;

  let _msgT = null;
  let waitMsg = (f) => {
    _msgT = f;
  }

  let socket = null
  try {
    socket = io({
        upgrade: false,
        transports: ["websocket"]
      });
    socket.on("connect", () => {});
    socket.on("lobby", (data) => {
      let op_m = data.available.filter(u => (u.nick != ge('nick').value))
        .map(u => ({
          t: 'Play with ' + u.nick,
          lt: 'Play online with this player',
          u,
          em: '🔗',
        }));
      if (!op_m.length) op_m=[{
        t: 'No opponent',
        lt: 'There are no others players in the lobby right now.',
        em: '😞',
      }]
      menu("Player vs Player Online: Select Opponent", true, op_m, (op, i) => {
        socket.emit("reqstart", {
          opponent: op.u.id
        })
      })
    });

    socket.on("disconnect", () => {});

    socket.on("gm", (msg) => {
      let t = _msgT;
      _msgT = null; //clear this listener
      if (t) t(msg);
    });

    socket.on("playstart", (d) => {
      let op = {
        n: d.op,
        t: 'r',
      }
      let tp = {
        n: ge('nick').value,
        t: 'l',
      }

      if (d.lead) { //if d.lead init your game
        startGame(tp,op);
      } else {
        startGame(op,tp);        
      }
    });

    socket.on("playend", () => {
      gamedone();
    });

    socket.on("error", () => {});
  } catch (e) {
    //no socket no problem we don't do multi player
  }


  let msg = (m) => {
    socket.emit("gm", m)
  }

  geclk("bck", () => {
    ae.clk();
    leave_mp();
    reset();
  });


  menu = (title, showB, ops, act) => {
    ge('menu').innerHTML = '';
    ge_qs('bot', 'legend').textContent = title;
    ops.forEach((op, i) => {
      let b = clone('menu', 'menui');
      qs_txt(b, 'h1', op.em);
      qs_txt(b, 'h2', op.t);
      qs_txt(b, 'h3', op.lt);
      b.onclick = () => {
        ae.clk(); //audio click
        act(op, i);
      };
    })
    ge_gone('bck', !showB)
  }

  display = (title, text) => {
    ge('menu').innerHTML = '';
    ge_qs('bot', 'legend').textContent = title;    
    let b = clone('menu', 'displayi');
    qs_txt(b, 'pre', text);          
    ge_gone('bck', false);
  }


  let enter_mp = () => {    
    socket.emit("el", {
      nick: ge('nick').value,
    });
    ge_no('top', true);
  }

  leave_mp = () => {
    socket.emit("ll", {})
    ge_no('top', false);
    reset();
  }

  gamedone = () => {
    if (mp_bt) socket.emit("reqend");
    document.body.classList.toggle('ms', true);
  }

  reset = () => {
    ge_gone("lobby",false);
    ge_gone("game",true);
  
    menu("Select Game Type", false, m_main, (mi, go) => {
      switch (go) {
        case 0:
          display("Instructions","Instructions go here");
          break;
        case 1:
          menu("Player vs Computer: Opponent", true, m_ais, (ai, i) => {
              p1 = {
                n: ge('nick').value,
                t: 'l'
              };
              p2 = {
                n: ai.t,
                t: 'a',
                pp: ai.pp,
              };
              startGame(p1, p2);
            })          
          break;
        case 2:
          p1 = {
            n: ge('nick').value,
            t: 'l'
          };
          p2 = {
            n: 'Player 2',
            t: 'l'
          };
          startGame(p1, p2);
          break;
        case 3:
          enter_mp();
          break;
      }
    })


  }



  return {
    waitMsg,
    msg,
    menu,
    enter_mp,
    reset,
    gamedone,
  }
};

var lobby = null;

function start_lobby() {
  if (!lobby)
    lobby = _init_lobby();
  ge('nick').value =  oneof(['Fried','Crazy','Wise','Smart','Clever'])+' '+
     oneof(['Alex','Storm','Petra','Zena'])+' '+(+(new Date()) % 100);
  //set up the intro board
  lobby.reset();
}
