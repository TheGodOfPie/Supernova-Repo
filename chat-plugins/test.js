exports.commands = {

    tclist: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {return this.sendReply("/tclist - Access denied.");}
		this.sendReplyBox(Shop.getTrainerCardList());
	},

	trainercard: 'tc',
	tc: function (target, room, user) {
		var autoData = false;
		if (!target) autoData = true;
		if (!this.canBroadcast()) return false;
		if (room.decision) return this.sendReply('No se pueden poner TCs en las batallas.');

		var pds = 0;
		var userName = user.name;
		var tcData = {};
		if (autoData) {
			tcData = Shop.getTrainerCard(user.name);
		} else {
			tcData = Shop.getTrainerCard(target);
			userName = toId(target);
			var userh = Users.getExact(target);
			if (userh) userName = userh.name;
		}
		if (!tcData) return this.sendReply(userName + " no tenía ninguna tarjeta de entrenador.");
		if (tcData.customTC) {
			if (room.id === 'lobby') return this.sendReply('|raw|<div class="infobox infobox-limited">' + tcData.customHtml + '</div>');
			return this.sendReplyBox(tcData.customHtml);
		}
		var pokeData = '<hr />';
		for (var t in tcData.pokemon) {
			pokeData += '<img src="http://play.pokemonshowdown.com/sprites/xyani/' + Tools.escapeHTML(Shop.getPokemonId(tcData.pokemon[t])) + '.gif" width="auto" /> &nbsp;';
		}
		if (tcData.nPokemon === 0) pokeData = '';
		if (room.id === 'lobby') return this.sendReply('|raw|<div class="infobox infobox-limited"><center><h2>' + userName + '</h2><img src="' + encodeURI(tcData.image) + '" width="80" height="80" title="' + userName + '" /><br /><br /><b>"' + Tools.escapeHTML(tcData.phrase) + '"</b>' + pokeData + '</center></div>');
		this.sendReplyBox('<center><h2>' + userName + '</h2><img src="' + encodeURI(tcData.image) + '" width="80" height="80" title="' + userName + '" /><br /><br /><b>"' + Tools.escapeHTML(tcData.phrase) + '"</b>' + pokeData + '</center>');

},
	removetc: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		if (!target) return this.sendReply("Usage: /removetc usuario");
		if (Shop.removeTrainerCard(target)) {
			return this.sendReply("Tarjeta de entrenador del usuario " + toId(target) + ' eliminada.');
		} else {
			return this.sendReply("El usuario no poseía Tc.");
		}
	},

	setcustomtc: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		var params = target.split(',');
		if (!params || params.length !== 2) return this.sendReply("Usage: /setcustomtc usuario, [on/off]");
		var permision = false;
		if (toId(params[1]) !== 'on' && toId(params[1]) !== 'off') return this.sendReply("Usage: /setcustomtc usuario, [on/off]");
		if (toId(params[1]) === 'on') permision = true;
		if (permision) {
			var userh = Users.getExact(params[0]);
			if (!userh || !userh.connected) return this.sendReply("El usuario no existe o no está disponible");
			if (Shop.setCustomTrainerCard(params[0], permision)) return this.sendReply("Permiso para customtrainercards concedido a " + userh.name);
			return this.sendReply("El usuario no poseía Tc o ya tenía el permiso para customtrainercards.");
		} else {
			if (Shop.setCustomTrainerCard(params[0], permision)) return this.sendReply("Permiso para customtrainercards retirado a " + params[0]);
			return this.sendReply("El usuario no poseía Tc o no tenía el permiso para customtrainercards.");
		}
	},

	tcimage: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /tcimage link");
		var tcData = Shop.getTrainerCard(user.name);
		if (!tcData) return this.sendReply("No posees ninguna tarjeta de entrenador.");
		if (tcData.customTC) return this.sendReply("Tu tarjeta es personalizada. usa /tchtml para cambiarla.");
		if (target.length > 120) return this.sendReply("El enlace es demasiado largo.");
		if (Shop.imageTrainerCard(user.name, target)) {
			return this.sendReply("Imagen de la TC cambiada con éxito.");
		} else {
			return this.sendReply("Error al cambiar la imagen de la TC.");
		}
	},

	tcphrase: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /tcphrase text");
		var tcData = Shop.getTrainerCard(user.name);
		if (!tcData) return this.sendReply("No posees ninguna tarjeta de entrenador.");
		if (tcData.customTC) return this.sendReply("Tu tarjeta es personalizada. usa /tchtml para cambiarla.");
		if (target.length > 120) return this.sendReply("La frase es muy larga.");
		if (Shop.phraseTrainerCard(user.name, target)) {
			return this.sendReply("Frase de la TC cambiada con éxito.");
		} else {
			return this.sendReply("Error al cambiar la frase de la TC.");
		}
	},

	tcpokemon: function (target, room, user) {
		if (!target) return this.sendReply("Usage: /tcpokemon [Pokemon1], [Pokemon2]...");
		var params = target.split(',');
		var tcData = Shop.getTrainerCard(user.name);
		if (!tcData) return this.sendReply("No posees ninguna tarjeta de entrenador.");
		if (tcData.customTC) return this.sendReply("Tu tarjeta es personalizada. usa /tchtml para cambiarla.");
		if (params.length > tcData.nPokemon) return this.sendReply("Has especificado más Pokemon de los que has comprado.");
		var pokemonList = {};
		var pokemonId = '';
		for (var h in params) {
			pokemonId = Tools.escapeHTML(params[h]);
			if (pokemonId.length > 20) return this.sendReply("Alguno de los nombres de los Pokemon era muy largo.");
			pokemonList[h] = pokemonId;
		}
		if (Shop.pokemonTrainerCard(user.name, pokemonList)) {
			return this.sendReply("Los pokemon de la Tc han sido modificados.");
		} else {
			return this.sendReply("Error al cambiar los pokemon de la TC.");
		}
	},

	tchtml: 'tccustom',
	tccustom: function (target, room, user) {
		var tcData = Shop.getTrainerCard(user.name);
		if (!tcData) return this.sendReply("No posees ninguna tarjeta de entrenador.");
		if (!tcData.customTC) return this.sendReply("Tu tarjeta no es personalizada.");
		if (!target) {
			this.sendReply('Html de tu Tarjeta de entrenador:');
			this.sendReplyBox(Tools.escapeHTML(tcData.customHtml));
			return;
		}
		if (target.length > 1000) return this.sendReply("Tu código es demasiado largo. Contacta con un administrador para modificar la TC custom.");
		var targetABS = Shop.deleteValues(target);
		if (Shop.htmlTrainerCard(user.name, targetABS)) {
			return this.sendReply("La tarjeta de entrenador personalizada ha sido modificada.");
		} else {
			return this.sendReply("Error al cambiar los datos.");
		}
	},

	sethtmltc: function (target, room, user) {
		if (!this.can('givemoney')) return false;
		var params = target.split(',');
		if (!params || params.length < 2) return this.sendReply("Usage: /sethtmltc usuario, html");
		var tcData = Shop.getTrainerCard(params[0]);
		if (!tcData) return this.sendReply("El usuario no posee ninguna tarjeta de entrenador.");
		if (!tcData.customTC) return this.sendReply("La tarjeta no es personalizada.");
		var targetABS = Shop.deleteValues(target.substr(params[0].length + 1));
		if (Shop.htmlTrainerCard(params[0], targetABS)) {
			return this.sendReply("La tarjeta de entrenador personalizada ha sido modificada.");
		} else {
			return this.sendReply("Error al cambiar los datos.");
		}