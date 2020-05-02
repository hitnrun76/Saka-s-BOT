const Discord = require('discord.js');
const weather = require('weather-js');
const bot = new Discord.Client();


//////////////////////////////////////////////////////FONCTIONS
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
///////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////// INDICATEUR CONSOLE
bot.on('ready', function () {
    console.log("Je suis connecté !");
    bot.user.setAvatar('./edward.jpg')
    .then(() => console.log('Avatar mis en place avec succès.'));
  })
////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////// Création d'une commande ping ! pong !
bot.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
});
////////////////////////////////

//////////////////////////////////////////////////////// Pile ou face
bot.on('message', msg => {
  if (msg.content.startsWith('flipcoin')) {
    let args = msg.content.split(" ").slice(1);
    
    if(args[0] == null){
      msg.channel.send('** Veuillez entrer pile ou face ! **');
    }
    else{
      var tab = ["Pile","Face"];
      rep = getRandomInt(2);
      var random = tab[rep];

      if(random.toUpperCase() == args[0].toUpperCase()){
        msg.reply(random +" ** Bravo beau gosse ta gagné ! **");
      }
      else{
        msg.reply(random +" ** Tu pu la merde gamin... **");
      }
    }
  }
});
//////////////////////////////////////////////////////

////////////////////////////////////////////////////// Clear Messages

bot.on('message', msg => {
  if (msg.content.startsWith('clear')) {
    let args = msg.content.split(" ").slice(1);

    if (isNaN(args[0])){
      return msg.channel.send('** Veuillez rentrer un nombre valide de messages**').then(msg => msg.delete({timeout: 3000}));
    }
    if (args[0] > 100){
      return msg.channel.send('** Le nombre de message a supprimer doit etre inférieur à 100 **').then(msg => msg.delete({timeout: 3000}));
    }
    if(!isNaN(args[0]) && args[0] < 100){
      msg.channel.bulkDelete(args[0]);
      return msg.channel.send('** Messages supprimés **').then(msg => msg.delete({timeout: 3000}));
    } 
  }
});
//////////////////////////////////////////////////////

////////////////////////////////////////////////////// Météo

bot.on('message', msg => {
  if (msg.content.startsWith('meteo')) {
    let args = msg.content.split(" ").slice(1);
    if(args[0] == null){
      msg.channel.send('** Veuillez entrer un nom de ville. **')
    }
    else{
    weather.find({search: args.join(" "), degreeType: 'C'}, function (err,result) {
      if(err) msg.channel.send(err);

    try
    {
      var current = result[0].current;
      var location = result[0].location;
    }
    catch
    {
      console.log("erreur !");
    }
    
    if(result.length === 0 || result.length === undefined)
    {
      msg.channel.send('** Veuillez entrer un nom de ville valide. **');
      return;
    }

    const embed = new Discord.MessageEmbed()
      .setDescription(`**${current.skytext}**`)
      .setAuthor(`Meteo pour ${current.observationpoint}`)
      .setThumbnail(current.imageUrl)
      .setColor(0X00AE86)
      .addField('Timezone',`UTC ${location.timezone}`, true)
      .addField('Echelles de température', location.degreetype, true)
      .addField('Termperature', `${current.temperature} Degres`, true)
      .addField('Temperature rensentie', `${current.feelslike} Degres`, true)
      .addField('Vent', `${current.winddisplay}`, true)
      .addField('Humidité', `${current.humidity}%`, true)

      msg.channel.send({embed});
  
})}
}});
//////////////////////////////////////////////////////

var Tabpunch = ["T’as pas léché un téton depuis que ta mère a stoppé de te donner le sein.","Ton visage n’est pas très joli à voir, pour toi, le port de la burqa devrait être obligatoire.","Avec tous les boutons que t’as, mon BlackBerry est jaloux.","T’es tellement fragile que si tu fais un tacle à Gourcuff, c’est toi qui te casses la jambe.","Le FBI se sert de ta mere comme une base de donnée ADN, vu qu’elle a coffré plus de foutre que les banques de sperme européennes.","Il a fallu que ta meuf te trompe pour qu’elle ait autre chose que le missionnaire.","Ta bouche c’est comme ta braguette, ta mère aurait dû t’apprendre à la fermer en public.","T’as été conçu pour un être branleur : youporn to be alive.","ta mere c'est comme un barbec on compte plus le nombre de saucisses qui y sont passées","T'es tellement con que tu crois que des archipelle ça creuse des architrous !","T'es tellement con que t'as réussi à raté un sondage.","T'es tellement con que t'as déjà essayer de noyer un poisson.","Si ta laideur était une brique, tu serais la Grande Muraille de Chine.","..."];
bot.on('message', msg => {
  if (msg.content.startsWith('punchline')) {
    let args = msg.content.split(" ").slice(1);
    if(args[0] === 0 || args[0] === undefined){
      msg.channel.send("**Entre le pseudo d'une personne.**");
    }
    else{   
      var random = getRandomInt(Tabpunch.length);
      msg.channel.send(args[0] + " " +Tabpunch[random]);
    }
    
  }
});

//////////////////////////////////////////////////////

let taskArray = [];

bot.on('message', msg => {
  if (msg.content.startsWith('task')) {
    if(taskArray.length != 0){
      //todo afficher taches
      const embed = new Discord.MessageEmbed()
      .setDescription("Taches à faire :")
      .setColor(0X00AE86)
      for (let index = 0; index < taskArray.length; index++) {
        const element = taskArray[index];
        embed.addField("#"+index,element);
      }
      msg.channel.send({embed});
    }
    else{
      return msg.channel.send("**Il n'y a pas de taches pour le moment**");
    }
  }
});

bot.on('message', msg => {
  if (msg.content.startsWith('addtask')) {
    let args = msg.content.split(" ").slice(1);
    if(args[0] === 0 || args[0] === undefined){
      msg.channel.send("**Tu doit donner un nom à la tache.**");
    }
    else{
      
      taskArray.push(args.join(' '));
    }
  }

});

bot.on('message', msg => {
  if (msg.content.startsWith('deltask')) {
    let args = msg.content.split(" ").slice(1);
    if(args[0] === 0 || args[0] === undefined){
      msg.channel.send("**Tu doit donner le nom de la tache à supprimer.**");
    }
    else{
      try {
        taskArray.splice(taskArray.indexOf(args.join(' ')));
      } catch (error) {
        msg.channel.send(error);
      }
    }
  }
});
//////////////////////////////////////////////////////
bot.login(process.env.TOKEN)