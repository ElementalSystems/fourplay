"use strict";

const users = [];

function pubUsers() {
  const lp = users.filter(u => u.status == 1)
    .map(u => ({
			id: u.id,
      nick: u.nick,
      level: u.level,
    }));
  const pp = users.filter(u => u.status > 1)
    .map(u => ({
      id: u.id,
      nick: u.nick,
      level: u.level,
    }));

  users.filter(u => u.status == 1).forEach(u => u.emit("lobby", {
    available: lp,
    playing: pp,
  }));
};

function removeUser(user)
{
  let i=users.findIndex(u=>u.id==user.id);
	if (i>=0)
    users.splice(i, 1);
}

/**
 * Socket.IO on connect event
 * @param {Socket} socket
 */
module.exports = {

  io: (socket) => {
    const user = {
      id: +(new Date()),
      nick: null,
      level: null,
      status: 0,
      emit: (k, d) => socket.emit(k, d),
    };
    console.log("Connected: " + socket.id);

    socket.on("disconnect", () => {
      console.log("Disconnected: " + socket.id);
      removeUser(user);
			pubUsers();
    });

    socket.on("el", (ui) => { //enter lobby request
			removeUser(user)
      user.nick = ui.nick;
      user.level = ui.level;
      user.status = 1;
      users.push(user);
      pubUsers();
    });

		socket.on("ll", (ui) => { //leave lobby request
			removeUser(user)
			pubUsers();
		});

		socket.on("reqstart", (d) => {
       console.log("got request - matching")
       let lead=users.find(u=>u.id==d.opponent);
			 if (lead&&(lead.status==1)) { //we match
				 lead.status=2;
				 lead.match=user;
				 user.status=3;
				 user.match=lead;
				 lead.emit("playstart",{lead: true, op: user.nick});
				 user.emit("playstart",{lead: false, op: lead.nick});
				 pubUsers();
			 }
		});

		socket.on("gm", (d) => {
    	 if (user.match) { //we match
         console.log("forwarded gm:"+JSON.stringify(d));
				 user.match.emit("gm",d);
			 }
		});

		socket.on("reqend", (d) => {
       if (user.match) {
         user.match.emit("playend",d);
    	   user.match.match=null;
         user.match.status=1;
       }
       user.emit("playend",d);
       user.match=null;
			 user.status=1;
			 pubUsers();
		});
  },

};
