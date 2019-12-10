exports.run = (client, message, args) => {
  const funk = require("./../funk.js");
  if(args[0]=="spr") {
    if(args[1]=="up") {}
    else if(args[1]=="1") {funk.sprSend(1,parseInt(args[2]),message);}
    else if(args[1]=="2") {funk.sprSend(2,parseInt(args[2]),message);}
  }
  else if(args[0]=="krt") {
    if(args[1]=="up") {}
    else if(args[1]=="1") {funk.krtSend(1,parseInt(args[2]),message);}
    else if(args[1]=="2") {funk.krtSend(2,parseInt(args[2]),message);}
  }
  else if(args[0]=="zad") {
    if(args[1]=="up") {}
    else if(args[1]=="1") {funk.zadSend(1,parseInt(args[2]),message);}
    else if(args[1]=="2") {funk.zadSend(2,parseInt(args[2]),message);}
  }
}
