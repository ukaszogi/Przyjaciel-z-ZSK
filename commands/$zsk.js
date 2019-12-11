  const funk = require("./../funk.js");
exports.run = (client, message, args) => {
  
  if(args[0]=="spr") {
    if(args[1]=="up") {}
    else if(args[1]=="1") {
	if (funk.sprBlisko(1,1).length==0) message.channel.send("Brak sprawdzianów")
	funk.sprSend(1,parseInt(args[2]),message);
    }
    else if(args[1]=="2") {
	if (funk.sprBlisko(2,1).length==0) message.channel.send("Brak sprawdzianów")
    	funk.sprSend(2,parseInt(args[2]),message);
    }
  }
  else if(args[0]=="krt") {
    if(args[1]=="up") {}
    else if(args[1]=="1") {
	if (funk.krtBlisko(1,1).length==0) message.channel.send("Brak sprawdzianów")
	funk.krtSend(1,parseInt(args[2]),message);
    }
    else if(args[1]=="2") {
	if (funk.krtBlisko(2,1).length==0) message.channel.send("Brak sprawdzianów")
	funk.krtSend(2,parseInt(args[2]),message);
    }
  }
  else if(args[0]=="zad") {
    if(args[1]=="up") {}
    else if(args[1]=="1") {
	if (funk.zadBlisko(1,1).length==0) message.channel.send("Brak sprawdzianów")
	funk.zadSend(1,parseInt(args[2]),message);
    }
    else if(args[1]=="2") {
	if (funk.zadBlisko(1,1).length==0) message.channel.send("Brak sprawdzianów")
	funk.zadSend(2,parseInt(args[2]),message);
    }
  }
}
