async function evalMove(igs, mv, ad) {
    if (igs.bd[mv] > 0) return {
        mv: mv,
        sc: -99999
    };
    let gs = m_gs(igs.p[1], igs.p[1], igs);
    let cp = gs.p[gs.tn % 2 ? 1 : 0].pp;
    gs.move(mv);
    if (cp.d > ad) return {
        mv: mv,
        sc: (await chooseMove(gs, ad + 1)).sc
    };
    let sc = gs.sc.p1 * 100 - gs.sc.p2 * 100;
    if (gs.sc.p1 > 6) sc += 1e4;
    if (gs.sc.p2 > 6) sc -= 1e4;
    gs.ls.forEach(l => {
        if (l.open == true) {
            sc += l.p1 - l.p2;
        }
    });
    sc += Math.random() * cp.rn - Math.random() * cp.rn;
    return {
        mv: mv,
        sc: sc
    };
}

async function chooseMove(gs, ad) {
    let pm = gs.tn % 2 ? 1 : -1;
    await wait(1);
    let moves = await Promise.all(gs.bd.map((v, i) => evalMove(gs, i, ad)));
    moves = moves.filter(v => v.sc != -99999).sort((a, b) => (a.sc - b.sc) * pm);
    return moves[0];
}

async function aiPlay(gs) {
    let mv = (await chooseMove(gs, 1)).mv;
    return mv;
}

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
    score: () => {
        tone(2).f(120, 420).v(0, .3);
        tone(2).f(220, 420).v(0, .5);
        tone(2).f(320, 420).v(0, .3);
    },
    place: () => {
        tone(.9, "square").f(100, 200, 50, 50).v(.1, .3, 0, 0, .1, .05, 0);
    },
    clk: () => {
        tone(.1, "triangle").f(200, 220, 200).v(.1, .3, 0);
        tone(.1, "triangle").f(220, 200, 220).v(.3, .1, 0);
    }
};

function m_bd(gs) {
    bdSpts = new Array(64);
    ge("p1n").textContent = gs.p[0].n;
    ge("p2n").textContent = gs.p[1].n;
    ge("gamebrd").textContent = "";
    let levels = [];
    for (i = 0; i < 4; i += 1) {
        var lev = clone("gamebrd", "brdlev");
        for (j = 0; j < 16; j += 1) {
            bdSpts[i * 16 + j] = cloneIn(lev, "brdspot", "*");
        }
        levels.push(lev);
    }
    setTimeout(() => {
        [ 20, 35, 52, 72 ].forEach((v, i) => levels[i].style.top = v + "vh");
    }, 10);
    for (var i = 0; i < 2; i += 1) clone("gamebrd", "brdlevd").classList.toggle("x" + i, true);
    let update = () => {
        for (var i = 0; i < 64; i += 1) {
            bdSpts[i].classList.toggle("p1", gs.bd[i] == 1);
            bdSpts[i].classList.toggle("p2", gs.bd[i] == 2);
            bdSpts[i].classList.toggle("sel", false);
            bdSpts[i].classList.toggle("fl", false);
            bdSpts[i].classList.toggle("high", i == gs.lastmv);
        }
        ge("p1s").textContent = gs.sc.p1;
        ge("p2s").textContent = gs.sc.p2;
    };
    let setB = (t, st, big) => {
        ge("bantxt").textContent = t;
        ge("bantxts").textContent = st;
        ge("bantxth").classList.toggle("big", !!big);
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
    let flashLine = li => {
        allLines[li].forEach((l, i) => {
            console.log("setting fl on " + l);
            bdSpts[l].style.setProperty("--off", i * .25 + "s");
            bdSpts[l].classList.toggle("fl", true);
        });
    };
    return {
        setB: setB,
        update: update,
        selMove: selMove,
        flashLine: flashLine
    };
}

async function selTurn(gs, bd, p, pn) {
    switch (p.t) {
      case "l":
        bd.setB("Your turn  " + p.n, gs.tn < 6 ? "Select a spot to play" : gs.sc.av + " scoring opportunities left");
        return await bd.selMove();

      case "r":
        bd.setB("Waiting for " + p.n + " to play...");
        return new Promise((resolve, reject) => {
            lobby.waitMsg(m => resolve(m.move));
        });

      case "a":
        bd.setB(p.n + " is thinking...");
        return await aiPlay(gs);
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
    bd.setB("Starting Game", "", true);
    await wait(3e3);
    let doTurn = async () => {
        let pn = gs.tn % 2;
        bd.update();
        let i = await selTurn(gs, bd, gs.p[pn], pn);
        await pubTurn(gs, pn ? 0 : 1, gs.p[pn ? 0 : 1], i);
        gs.move(i);
        bd.update();
        bd.setB(gs.p[pn].n + " has played.");
        ae.place();
        await wait(1e3);
        let sl = gs.lastSLs();
        if (sl.length) {
            bd.setB(gs.p[pn].n + " Scored.");
            sl.forEach(l => bd.flashLine(l));
            ae.score();
            await wait(2e3);
        }
        if (gs.sc.av == 0 || gs.sc.p1 >= 7 || gs.sc.p2 >= 7) return false;
        return true;
    };
    while (await doTurn());
    if (gs.sc.p1 == gs.sc.p2) bd.setB("DRAW!"); else if (gs.sc.p1 > gs.sc.p2) bd.setB(gs.p[0].n + " Wins", "", true); else bd.setB(gs.p[1].n + " Wins", "", true);
    await wait(1e4);
    lobby.reset();
}

function m_gs(p0, p1, ogs) {
    return {
        tn: ogs ? ogs.tn : 0,
        p: [ {
            ...p0
        }, {
            ...p1
        } ],
        bd: ogs ? [ ...ogs.bd ] : new Array(64).fill(0),
        ls: new Array(allLines.length),
        lastmv: -1,
        sc: {
            p1: 0,
            p2: 0,
            av: 0
        },
        move: function(mv) {
            this.bd[mv] = this.tn % 2 ? 2 : 1;
            this.lastmv = mv;
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
        },
        lastSLs: function() {
            let lx = [];
            this.ls.forEach((l, i) => {
                if (l.scored) if (allLines[i].includes(this.lastmv)) lx.push(i);
            });
            return lx;
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
    });
    geclk("nxt", () => {
        ae.clk();
        reset();
        document.documentElement.requestFullscreen();
    });
    menu = (title, showB, ops, act) => {
        ge("menu").innerHTML = "";
        ge_gone("top", false);
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
        ge_gone("nxt", true);
    };
    display = (title, text) => {
        ge_gone("lobby", false);
        ge_gone("game", true);
        ge_gone("top", true);
        ge("menu").innerHTML = "";
        ge_qs("bot", "legend").textContent = title;
        let b = clone("menu", "displayi");
        b.innerHTML = text;
        ge_gone("bck", true);
        ge_gone("nxt", false);
    };
    let enter_mp = () => {
        socket.emit("el", {
            nick: ge("nick").value
        });
        ge_no("top", true);
    };
    leave_mp = () => {
        if (socket) socket.emit("ll", {});
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
        menu("", false, m_main, (mi, go) => {
            switch (go) {
              case 0:
                display("The Rules of 𝟜-Play", gameRules);
                break;

              case 1:
                menu("Choose your opponent", true, m_ais, (ai, i) => {
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
        display: display,
        enter_mp: enter_mp,
        reset: reset,
        gamedone: gamedone
    };
}

var lobby = null;

function start_lobby() {
    if (!lobby) lobby = _init_lobby();
    ge("nick").value = oneof([ "Alex", "Storm", "Petra", "Zena", "Xeno", "Yuman", "Jyn", "Raith" ]) + oneof([ " ⨊ ", " ∐ ", " § ", " ∞ ", " ⌘ ", " ★ ", "-", "de", "a" ]) + oneof([ "Xi", "Gen", "My", "Ti", "Xi" ]);
    lobby.display("", introText);
}

function init() {
    start_lobby();
    p1 = {
        n: "Player 1",
        t: "l"
    };
    p2 = {
        n: "Player 2",
        t: "l"
    };
}

let m_main = [ {
    t: "The Devil's Rules",
    em: "🎓",
    lt: "Learn the simple rules of 𝟜-Play"
}, {
    t: "The Minions of Hell",
    em: "⛧",
    lt: "Practice against various demonic opponents"
}, {
    t: "Two Players Local",
    em: "🎎",
    lt: "Practice against a human on one device"
}, {
    t: "Two Players Online",
    em: "🌐",
    lt: "Practice against a human online"
} ];

let m_ais = [ {
    t: "Servant Imp",
    em: "👿",
    lt: "A foolish little thing - stupid and careless",
    pp: {
        d: 1,
        pm: 1,
        opm: 1,
        rn: 40
    }
}, {
    t: "Goblin Intellectual",
    em: "😈",
    lt: "A well trained player, but goblins aren't bright",
    pp: {
        d: 1,
        pm: 1,
        opm: 1,
        rn: 10
    }
}, {
    t: "Vengence Demon",
    em: "👺",
    lt: "Plays well but easy to trick.",
    pp: {
        d: 1,
        pm: 1,
        opm: 1,
        rn: 1
    }
}, {
    t: "Duke of Hell",
    em: "👹",
    lt: "Skilled and dangerous, very hard to beat",
    pp: {
        d: 2,
        pm: 1,
        opm: 1,
        rn: 10
    }
}, {
    t: "Prince of Death",
    em: "☠",
    lt: "The famous prince of 𝟜-Play",
    pp: {
        d: 2,
        pm: 1,
        opm: 1,
        rn: 1
    }
}, {
    t: "Satan Lord of Hell",
    em: "✪",
    lt: "Never beaten by a Mortal",
    pp: {
        d: 3,
        pm: 1,
        opm: 1,
        rn: .01
    }
} ];

let gameRules = "It's tic-tac-toe. Everyone knows how to play tic-tac-toe, right?\n\n" + "Except...\n\n" + "It's played on a 3D 4 x 4 x 4 cubic grid.\n\n" + "On your turn make your mark on any open square. Place 4 markers in a straight line to score a point." + "The first player to reach 7 points wins.\n" + "Good Luck!\n\n\n" + "A hint to give you hope:\n" + "Markers can form a straight line in any direction - vertically, horizontally and diagonally" + " across each board and through the boards.\n" + "Practice against the lesser demons to steal their tricks!";

let introText = "\nAfter death you find your soul in the balance; you must beat the devil in a game of chance or skill to save yourself.\n\n" + "'What - any game?', you ask while desparately trying to think of something that you are good at.\n\n" + "'I will choose tic-tac-toe.', you say at last, 'but only if I can play the first turn.'\n\n" + "'Well', said the Devil, 'no problem there, we have a version of that around here - we call it 𝟜-Play. \n\n" + "'It is just like tic-tac-toe, and you can go first if you think that will help.'\n\n\n" + "'Perhaps you will be the first to beat me.'\n\n";

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