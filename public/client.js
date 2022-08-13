var _audC = new (window.AudioContext || window.webkitAudioContext)();

var _aud_MV = 1;

function tone(length, type) {
    if (!_audC || !_aud_MV) return {
        f: function() {
            return this;
        },
        v: function() {
            return this;
        }
    };
    var current = _audC.currentTime;
    var oscillator = _audC.createOscillator();
    var gain = _audC.createGain();
    if (type) oscillator.type = type;
    oscillator.frequency.value = 0;
    gain.gain.value = 0;
    oscillator.connect(gain);
    gain.connect(_audC.destination);
    oscillator.start(0);
    oscillator.stop(current + length);
    return {
        f: function() {
            if (arguments.length == 1) {
                oscillator.frequency.value = arguments[0];
                return this;
            }
            for (var i = 0; i < arguments.length; i += 1) oscillator.frequency.linearRampToValueAtTime(arguments[i], current + i / (arguments.length - 1) * length);
            return this;
        },
        v: function() {
            if (arguments.length == 1) {
                gain.gain.value = arguments[0] * _aud_MV;
                return this;
            }
            for (var i = 0; i < arguments.length; i += 1) gain.gain.linearRampToValueAtTime(arguments[i] * _aud_MV, current + i / (arguments.length - 1) * length);
            return this;
        }
    };
}

var ae = {
    clk: () => {
        tone(.2, "triangle").f(200, 220, 200).v(.1, .3, 0);
        tone(.2, "triangle").f(220, 200, 220).v(.3, .1, 0);
    },
    slide: () => {
        tone(1).f(100, 440).v(.1, .3, .1, .3, .1, .5, .6, 0);
    },
    death: () => {
        tone(2).f(100, 300, 100, 300).v(.3, .5, .1, 0);
        tone(2).f(200, 100, 200, 100).v(.1, .2, .5, 0);
    },
    weird: () => {
        tone(3).f(120, 420).v(0, .3);
        tone(3).f(220, 420).v(0, .3);
        tone(3).f(320, 420).v(0, .3);
    }
};

function m_bd(gs) {
    bdSpts = new Array(64);
    ge("gamebrd").textContent = "";
    for (i = 0; i < 4; i += 1) {
        var lev = clone("gamebrd", "brdlev");
        lev.style.top = i * 20 + "vh";
        for (j = 0; j < 16; j += 1) {
            bdSpts[i * 16 + j] = cloneIn(lev, "brdspot", "*");
        }
    }
    cloneSP("gamebrd", "brdlev", {
        "--off": "0s"
    }).classList.toggle("ex", true);
    cloneSP("gamebrd", "brdlev", {
        "--off": "1s"
    }).classList.toggle("ex", true);
    cloneSP("gamebrd", "brdlev", {
        "--off": "2s"
    }).classList.toggle("ex", true);
    cloneSP("gamebrd", "brdlev", {
        "--off": "3s"
    }).classList.toggle("ex", true);
    cloneSP("gamebrd", "brdlev", {
        "--off": "4s"
    }).classList.toggle("ex", true);
    let update = () => {
        for (var i = 0; i < 64; i += 1) {
            bdSpts[i].classList.toggle("p1", gs.bd[i] == 1);
            bdSpts[i].classList.toggle("p2", gs.bd[i] == 2);
            bdSpts[i].classList.toggle("sel", false);
        }
        ge("p1s").textContent = gs.sc.p1;
        ge("p2s").textContent = gs.sc.p2;
    };
    let setB = (t, st) => {
        ge("bantxt").textContent = t;
        ge("bantxts").textContent = st;
    };
    let selMove = async () => {
        return new Promise((resolve, reject) => {
            let clkfn = j => {
                bdSpts[j].classList.toggle("sel", gs.bd[j] == 0);
                bdSpts[j].onclick = () => {
                    resolve(j);
                };
            };
            for (var i = 0; i < 64; i += 1) clkfn(i);
        });
    };
    return {
        setB: setB,
        update: update,
        selMove: selMove
    };
}

async function selTurn(gs, bd, p, pn) {
    switch (p.t) {
      case "l":
        bd.setB("Your turn  " + p.n, "Select a spot to play");
        return await bd.selMove();

      case "r":
        bd.setB("Waiting for " + p.n + " to play...");
        return new Promise((resolve, reject) => {
            lobby.waitMsg(m => resolve(m.move));
        });

      case "a":
        return 0;
    }
}

async function pubTurn(gs, pn, op, i) {
    if (op.t == "r") {
        lobby.msg({
            move: i
        });
    }
}

async function startGame(p1, p2) {
    ge_gone("lobby", true);
    ge_gone("game", false);
    let gs = m_gs(p1, p2);
    let bd = m_bd(gs);
    bd.setB("Starting Game");
    await wait(3e3);
    let doTurn = async () => {
        let pn = gs.tn % 2;
        bd.update();
        console.log(gs);
        let i = await selTurn(gs, bd, gs.p[pn], pn);
        await pubTurn(gs, pn ? 0 : 1, gs.p[pn ? 0 : 1], i);
        gs.move(i);
        bd.update();
        if (gs.sc.av == 0 || gs.sc.p1 >= 7 || gs.sc.p2 >= 7) return false;
        return true;
    };
    while (await doTurn());
    if (gs.sc.p1 == gs.sc.p2) bd.setB("DRAW!"); else if (gs.sc.p1 > gs.sc.p2) bd.setB(gs.p[0].n + " Wins"); else bd.setB(gs.p[1].n + " Wins");
    await wait(2e3);
    lobby.reset();
}

function m_gs(p0, p1) {
    return {
        tn: 0,
        p: [ {
            ...p0
        }, {
            ...p1
        } ],
        bd: new Array(64).fill(0),
        ls: new Array(allLines.length),
        sc: {
            p1: 0,
            p2: 0,
            av: 0
        },
        move: function(mv) {
            this.bd[mv] = this.tn % 2 ? 2 : 1;
            this.analysis();
            this.tn += 1;
        },
        analysis: function() {
            this.sc.p1 = this.sc.p2 = this.sc.av = 0;
            allLines.forEach((v, i) => {
                this.ls[i] = {
                    p1: 0,
                    p2: 0,
                    scored: 0,
                    open: true
                };
                v.forEach(li => {
                    if (this.bd[li] == 1) this.ls[i].p1 += 1;
                    if (this.bd[li] == 2) this.ls[i].p2 += 1;
                });
                if (this.ls[i].p1 == 4) {
                    this.ls[i].scored = 1;
                    this.ls[i].open = false;
                    this.sc.p1 += 1;
                }
                if (this.ls[i].p2 == 4) {
                    this.ls[i].scored = 2;
                    this.ls[i].open = false;
                    this.sc.p2 += 1;
                }
                if (this.ls[i].p1 > 0 && this.ls[i].p2 > 0) this.ls[i].open = false;
                if (this.ls[i].open) this.sc.av += 1;
            });
        }
    };
}

mkL = (x, y, z, xi, yi, zi) => {
    var over = [ 0, 1, 2, 3 ];
    xl = x == null ? over : [ x ];
    yl = y == null ? over : [ y ];
    zl = z == null ? over : [ z ];
    var lns = [];
    xl.forEach(x => yl.forEach(y => zl.forEach(z => {
        lns.push(over.map(v => x + xi * v + (y + yi * v) * 4 + (z + zi * v) * 16));
    })));
    return lns;
};

var allLines = [ ...mkL(0, null, null, 1, 0, 0), ...mkL(null, 0, null, 0, 1, 0), ...mkL(null, null, 0, 0, 0, 1), ...mkL(0, 0, null, 1, 1, 0), ...mkL(3, 0, null, -1, 1, 0), ...mkL(0, null, 0, 1, 0, 1), ...mkL(3, null, 0, -1, 0, 1), ...mkL(null, 0, 0, 0, 1, 1), ...mkL(null, 3, 0, 0, -1, 1), ...mkL(0, 0, 0, 1, 1, 1), ...mkL(3, 0, 0, -1, 1, 1), ...mkL(3, 3, 0, -1, -1, 1), ...mkL(0, 3, 0, 1, -1, 1) ];

console.log("allLines:", allLines);

function _init_lobby() {
    let mp_bt = null;
    let _msgT = null;
    let waitMsg = f => {
        _msgT = f;
    };
    let socket = null;
    try {
        socket = io({
            upgrade: false,
            transports: [ "websocket" ]
        });
        socket.on("connect", () => {});
        socket.on("lobby", data => {
            let op_m = data.available.filter(u => u.nick != ge("nick").value).map(u => ({
                t: "Play with " + u.nick,
                lt: "Play online with this player",
                u: u,
                em: "🔗"
            }));
            if (!op_m.length) op_m = [ {
                t: "No opponent",
                lt: "There are no others players in the lobby right now.",
                em: "😞"
            } ];
            menu("Player vs Player Online: Select Opponent", true, op_m, (op, i) => {
                socket.emit("reqstart", {
                    opponent: op.u.id
                });
            });
        });
        socket.on("disconnect", () => {});
        socket.on("gm", msg => {
            let t = _msgT;
            _msgT = null;
            if (t) t(msg);
        });
        socket.on("playstart", d => {
            let op = {
                n: d.op,
                t: "r"
            };
            let tp = {
                n: ge("nick").value,
                t: "l"
            };
            if (d.lead) {
                startGame(tp, op);
            } else {
                startGame(op, tp);
            }
        });
        socket.on("playend", () => {
            gamedone();
        });
        socket.on("error", () => {});
    } catch (e) {}
    let msg = m => {
        socket.emit("gm", m);
    };
    geclk("bck", () => {
        ae.clk();
        leave_mp();
        reset();
    });
    menu = (title, showB, ops, act) => {
        ge("menu").innerHTML = "";
        ge_qs("bot", "legend").textContent = title;
        ops.forEach((op, i) => {
            let b = clone("menu", "menui");
            qs_txt(b, "h1", op.em);
            qs_txt(b, "h2", op.t);
            qs_txt(b, "h3", op.lt);
            b.onclick = () => {
                ae.clk();
                act(op, i);
            };
        });
        ge_gone("bck", !showB);
    };
    display = (title, text) => {
        ge("menu").innerHTML = "";
        ge_qs("bot", "legend").textContent = title;
        let b = clone("menu", "displayi");
        b.innerHTML = text;
        ge_gone("bck", false);
    };
    let enter_mp = () => {
        socket.emit("el", {
            nick: ge("nick").value
        });
        ge_no("top", true);
    };
    leave_mp = () => {
        socket.emit("ll", {});
        ge_no("top", false);
        reset();
    };
    gamedone = () => {
        if (mp_bt) socket.emit("reqend");
        document.body.classList.toggle("ms", true);
    };
    reset = () => {
        ge_gone("lobby", false);
        ge_gone("game", true);
        menu("Select Game Type", false, m_main, (mi, go) => {
            switch (go) {
              case 0:
                display("Instructions", gameRules);
                break;

              case 1:
                menu("Player vs Computer: Opponent", true, m_ais, (ai, i) => {
                    p1 = {
                        n: ge("nick").value,
                        t: "l"
                    };
                    p2 = {
                        n: ai.t,
                        t: "a",
                        pp: ai.pp
                    };
                    startGame(p1, p2);
                });
                break;

              case 2:
                p1 = {
                    n: ge("nick").value,
                    t: "l"
                };
                p2 = {
                    n: "Player 2",
                    t: "l"
                };
                startGame(p1, p2);
                break;

              case 3:
                enter_mp();
                break;
            }
        });
    };
    return {
        waitMsg: waitMsg,
        msg: msg,
        menu: menu,
        enter_mp: enter_mp,
        reset: reset,
        gamedone: gamedone
    };
}

var lobby = null;

function start_lobby() {
    if (!lobby) lobby = _init_lobby();
    ge("nick").value = oneof([ "Fried", "Crazy", "Wise", "Smart", "Clever" ]) + " " + oneof([ "Alex", "Storm", "Petra", "Zena" ]) + " " + +new Date() % 100;
    lobby.reset();
}

function init() {
    start_lobby();
    p1 = {
        n: "Play1",
        t: "l"
    };
    p2 = {
        n: "Player 2",
        t: "l"
    };
}

let m_main = [ {
    t: "How to Play",
    em: "🎓",
    lt: "Learn the simple rules"
}, {
    t: "Play vs Computer",
    em: "🤖",
    lt: "Play against various AI opponents"
}, {
    t: "Player vs Local Player",
    em: "🎎",
    lt: "Play against a friend on one device"
}, {
    t: "Player vs Online Player",
    em: "🌐",
    lt: "Play against a human online"
} ];

let m_ais = [ {
    t: "Easy Opponent",
    em: "💻",
    lt: "Not very good, does it's best to score.",
    pp: {
        s: 4,
        o: 1,
        p: 0,
        r: 5,
        d: 0
    }
}, {
    t: "Novice",
    em: "💻",
    lt: "A novice player, good to learn against.",
    pp: {
        s: 5,
        o: 2,
        p: 1,
        r: 5,
        d: 1
    }
} ];

let gameRules = "The game is played by placing tokens in turn on a 4 x 4 x 4 grid much like 3D tic-tac-toe.\n\n" + "You need to get 4 tokens of your colour in a straight line in any directions (including vertically and diagonally) to score.\n\n" + "The first player to get 7 straight lines wins.\n\nGood Luck!\n\n";

let ge = id => document.getElementById(id);

let gecl = (id, c, s) => ge(id).classList.toggle(c, s);

let geclk = (id, f) => ge(id).onclick = f;

let ge_gone = (id, s) => gecl(id, "gone", s);

let ge_no = (id, s) => gecl(id, "no", s);

let cloneIn = (par, tempid, q) => {
    let clone = document.querySelector("#" + tempid).content.querySelector(q).cloneNode(true);
    par.appendChild(clone);
    return clone;
};

let clone = (pid, tempid) => {
    return cloneIn(ge(pid), tempid, "*");
};

let cloneSP = (pid, tempid, varMap) => {
    let e = cloneIn(ge(pid), tempid, "*");
    Object.keys(varMap).forEach(k => e.style.setProperty(k, varMap[k]));
    return e;
};

let ge_qs = (id, qs) => ge(id).querySelector(qs);

let qs_txt = (e, qs, txt) => e.querySelector(qs).textContent = txt;

let oneof = x => {
    if (!Array.isArray(x)) return x;
    return x[Math.floor(Math.random() * x.length)];
};

let wait = ms => new Promise(resolve => setTimeout(resolve, ms));