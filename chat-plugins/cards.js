/**********************                        
*      PSGO Plugin      *
* Made by Naten, fender *
*     and Nineage       *
***********************/
'use strict';
 
let cards = require('../card-data.js');
 
let colors = {
    Mythic: '#D82A2A',
    Legendary: '#E8AB03',
    Epic: '#73DF14',
    Rare: '#2DD1B6',
    Uncommon: '#2D3ED1',
    Common: '#000',
};
 
let shop = [ //Actual shop display
    ['XY-Base', 'Get three cards from the first pack released in the Pokemon XY set.', 5],
    ['XY-Flashfire', 'Get three cards from the Flashfire pack released in the Pokemon XY set.', 5],
    ['XY-Furious Fists', 'Get three cards from the Furious Fists pack released in the Pokemon XY set.', 5],
    ['XY-Phantom Forces', 'Get three cards from the Phantom Forces pack released in the Pokemon XY set.', 5],
    ['XY-Primal Clash', 'Get three cards from the Primal Clash pack released in the Pokemon XY set.', 5],
    ['XY-Roaring Skies', 'Get three cards from the Roaring Skies pack released in the Pokemon XY set.', 5],
    ['XY-Ancient Origins', 'Get three cards from the Ancient Origins pack released in the Pokemon XY set', 5],
    ['XY-BREAKthrough', 'Get three cards from the BREAKthrough pack released in the Pokemon XY set', 5]
];
//Shop used in cardCache to reduce RAM usage of card caching
let packShop = ['XY-Base', 'XY-Flashfire', 'XY-Furious Fists', 'XY-Phantom Forces', 'XY-Primal Clash', 'XY-Roaring Skies', 'XY-Ancient Origins', 'XY-BREAKthrough', 'BREAK', 'Double Crisis', 'Water', 'Fire', 'Fighting', 'Fairy', 'Dragon', 'Colorless', 'Psychic', 'Lightning', 'Darkness', 'Grass', 'OU-Pack', 'UU-Pack', 'Uber-Pack', 'PU-Pack', 'NU-Pack', 'RU-Pack', 'LC-Pack', 'BL-Pack', 'BL2-Pack', 'BL3-Pack', 'Gen1', 'Gen2', 'Gen3', 'Gen4', 'Gen5', 'Gen6', 'Metal', 'Trainer', 'Supporter', 'Item', 'Stadium', 'EX-Pack', 'Legendary', 'Full'];
let tourCardRarity = ['No Card', 'Common', 'Uncommon', 'Rare', 'Epic', 'Epic', 'Legendary', 'Legendary', 'Mythic'];
let cardRarity = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
let allCards = [
    'Abomasnow', 'Absol', 'Accelgor', 'Acetrainer', 'Acrobike', 'Aegislash', 'Aegislash2', 'Aegislash3', 'Aegislashex', 'Aggronex', 'Aggronexfull', 'Aggronmagma', 'Aggronspiritlink', 'Alakazambaseset', 'Alomomola', 'Altaria', 'Altariadelta', 'Altariafull', 'Amaura', 'Ampharosex', 'Ampharosexfull', 'Ampharosspiritlink', 'Aquadiffuser', 'Arbok', 'Archiesaceinthehole', 'Archiesaceintheholefull', 'Ariados', 'Aromatisse', 'Aromatisse2', 'Aronmagma', 'Articuno', 'Articunodelta', 'Assaultvest', 'Aurorus', 'Avalugg', 'Axew', 'Axew2', 'Az', 'Azfull', 'Azumarill', 'Azumarilldelta',
    'Bagon', 'Bagon2', 'Baltoymagma', 'Baltoy', 'Baltoy2', 'Banette', 'Banettedelta', 'Barbaracle', 'Barboach', 'Battlecompressor', 'Battlereporter', 'Battlereporterfull', 'Beartic', 'Beautifly', 'Beedrill', 'Beedrill2', 'Beheeyem', 'Beldum', 'Bellossom', 'Bellsprout', 'Bergmite', 'Bibarel', 'Bibarel2', 'Bidoof', 'Bidoof2', 'Bidoof3', 'Bidoofdelta', 'Binacle', 'Binacle2', 'Bisharp', 'Bisharp2', 'Blacksmith', 'Blastoisebaseset', 'Blastoiseex', 'Blastoiseex2', 'Blastoiseexfull', 'Blaziken', 'Blaziken2', 'Blazikenex', 'Blissey', 'Boldore', 'Bouffalant', 'Braviary', 'Braixen', 'Braixen2', 'Braixen3', 'Breloom', 'Breloom2', 'Brigette', 'Brigettefull', 'Bronzong', 'Bronzong2', 'Bronzong3', 'Bronzor', 'Bronzor2', 'Buddybuddyrescue', 'Buizel', 'Buneary', 'Bunnelby', 'Bunnelby2', 'Bunnelby3', 'Bunnelby4', 'Bunnelbydelta', 'Burningenergy', 'Butterfree',
    'Cacnea', 'Cacturne', 'Cameruptex', 'Cameruptexfull', 'Cameruptmagma', 'Carbink', 'Carbink2', 'Carvahnaaqua', 'Cascoon', 'Cassius', 'Caterpie', 'Championsfestival', 'Chandelure', 'Chansey', 'Chanseybaseset', 'Charizardbaseset', 'Charizardex', 'Charizardex2', 'Charizardex3', 'Charizardex4', 'Charizardexfull', 'Chatot', 'Chesnaught', 'Chesnaught2', 'Chesnaught3', 'ChesnaughtBREAK', 'Chesnaughtex', 'Chespin', 'Chespin2', 'Chespin3', 'Chespin4', 'Chespin5', 'Chespin6', 'Chinchou', 'Clamperl', 'Clauncher', 'Clauncher2', 'Clawitzer', 'Claydolmagma', 'Claydol', 'Clefable', 'Clefairy', 'Clefairy2', 'Clefairybaseset', 'Cloyster', 'Combee', 'Combusken', 'Combusken2', 'Conkeldurr', 'Corphish', 'Corsola', 'Cottonee', 'Crawdaunt', 'Cresselia', 'Crobat', 'Croconaw', 'Crushinghammer', 'Cubchoo', 'Cubone', 'Cyndaquil',
    'Dangerousenergy', 'Darknessenergy', 'Darkrai', 'Dedenne', 'Dedenne2', 'Dedenne3', 'Deino', 'Delcatty', 'Delcatty2', 'Delphox', 'Delphox2', 'Delphoxex', 'Deoxys', 'Dialgaex', 'Diancie', 'Diancieex', 'Diggersby', 'Diggersby2', 'Diggersby3', 'Diglett', 'Dimensionvalley', 'Ditto', 'Diveball', 'Dodrio', 'Dodrio2', 'Doduo', 'Doduo2', 'Doduo3', 'Doublade', 'Doublade2','Doubleaquaenergy', 'Doublecolorlessenergy', 'Doubledragonenergy', 'Doublemagmaenergy', 'Dragalge', 'Dragalge2', 'Dragonair', 'Dragonite', 'Dragonitedelta', 'Dragoniteex', 'Dragoniteexfull', 'Drapion', 'Dratini', 'Drillbur', 'Drowzee', 'Druddigon', 'Dugtrio', 'Dunsparce', 'Dunsparce2', 'Durant', 'Dusclops', 'Dusknoir', 'Duskull', 'Dustox', 'Dustoxdelta', 
    'Ecoarm', 'Eelektrik', 'Eelektrikdelta', 'Eelektross', 'Eevee', 'Eeveeao', 'Ekans', 'Electabuzz', 'Electivire', 'Electrike', 'Electrike2', 'Electrikedelta', 'Electrode', 'Electrode2', 'Elgyem', 'Emolgaex', 'Emolgaexfull', 'Empoleon', 'Enhancedhammer', 'Energyrecycler', 'Energyretrieval', 'Energyretrievalao', 'Energyswitch', 'Entei', 'Entei2', 'Escaperope', 'Escavalier', 'Espurr', 'Evosoda', 'Excadrill', 'Excadrilldelta', 'Exeggcute', 'Exeggutor', 'Exploud', 'Expshare', 
    'Fadedtown', 'Fairyenergy', 'Fairygarden', 'Farfetchd', 'Fearow', 'Fearow2', 'Feebas', 'Feebas2', 'Fennekin', 'Fennekin2', 'Fennekin3', 'Fennekin4', 'Feraligatr', 'Fierytorch', 'Fightingenergy', 'Fightingstadium', 'Finneon', 'Fireenergy', 'Fisherman', 'Flabebe', 'Flabebe2', 'Flabebe3', 'Flareon', 'Flashenergy', 'Fletchinder', 'Fletchinder2', 'Fletchinder3', 'Fletchinder4', 'Fletchling', 'Fletchling2', 'Fletchling3', 'Fletchling4', 'Fletchling5', 'Floatstone', 'Floatzel', 'Floette', 'Floette2', 'Floette3', 'Florges', 'Florges2', 'FlorgesBREAK', 'Florgesex', 'Florgesexfull', 'Flygon', 'Flygon2', 'Focussash', 'Forestofgiantplants', 'Forretress', 'Fossilresearcher', 'Fossilresearcherfull', 'Fraxure', 'Freshwaterset', 'Frillish', 'Froakie', 'Froakie2', 'Froakie3', 'Froakie4', 'Frogadier', 'Frogadier2', 'Frogadier3', 'Fullheal', 'Furfrou', 'Furfrou2', 'Furfrou3', 'Furfrou4', 'Furfrou5', 'Furret', 
    'Gallade', 'Galladeex', 'Galladeexfull', 'Galladespiritlink', 'Galvantula', 'Garchompex', 'Gardevoirex', 'Gardevoirexfull', 'Gardevoirspiritlink', 'Gardevoir', 'Gastly', 'Gengar', 'Gengarex', 'Gengarexfull', 'Gengarspiritlink', 'Geodude', 'Gigalith', 'Giovannisscheme', 'Giovannisschemefull', 'Girafarig', 'Giratinaex', 'Giratinaexfull', 'Glaceon', 'Glalieex', 'Glalieexfull', 'Glaliespiritlink', 'Gligar', 'Gligar2', 'Gliscor', 'Gliscor2', 'Gloom', 'Gogoat', 'Gogoat2', 'Gogoat3', 'Golbat', 'Goldeen', 'Golem', 'Golett', 'Golettao', 'Golurk', 'Golurkao', 'Golurkao2', 'Goodra', 'Goodra2', 'Goodraao', 'Goomy', 'Goomy2', 'Goomyao', 'Gorebyss', 'Gorebyssdelta', 'Gothita', 'Gothitelle', 'Gothorita', 'Gourgeist', 'Gourgeist2', 'Granbull', 'Granbull2', 'Grassenergy', 'Graveler', 'Greatball', 'Greninja', 'Greninja2', 'Greninja3', 'Greninjaex', 'Grimeraqua', 'Groudon', 'Groudonex', 'Groudonex2', 'Groudonexfull', 'Groudonexmagmafull', 'Groudonspiritlink', 'Grovyle', 'Grumpig', 'Gulpin', 'Gurdurr', 'Gyaradosbaseset', 'Gyaradosao', 'Gyaradosao2', 
    'Handscope', 'Hardcharm', 'Hariyama', 'Haunter', 'Hawlucha', 'Hawlucha2', 'Hawlucha3', 'Hawluchaex', 'Haxorus', 'Headringer', 'Healingscarf', 'Heatran', 'Heavyball', 'Heavyboots', 'Heliolisk', 'Heliolisk2', 'Heliolisk3', 'Helioptile', 'Helioptile2', 'Helioptile3', 'Heracrossex', 'Heracrossexfull', 'Herbalenergy', 'Herdier', 'Hexmaniac', 'Hippopotas', 'Hippopotas2', 'Hippowdon', 'Hitmonchan', 'Hitmonchanbaseset', 'Hitmonlee', 'Hitmontop', 'Honchkrow', 'Honedge', 'Honedge2', 'Honedge3', 'Honedge4', 'Hoopaex', 'Hoopaexfull', 'Hoothoot', 'Horsea', 'Houndoomex', 'Houndoomexfull', 'Houndoomspiritlink', 'Huntail', 'Hydreigon', 'Hydreigonex', 'Hydreigonexfull', 'Hypno', 
    'Illumise', 'Illumise2', 'Inkay', 'Inkay2', 'Inkay3', 'Inkay4', 'Inkayao', 'Inkay5',
    'Jammingnet', 'Jawfossil', 'Jellicent', 'Jigglypuff', 'Jigglypuff2', 'Jirachi', 'Jolteon', 'Joltik', 'Judge', 'Jynx', 
    'Kakuna', 'Kakuna2', 'Kangaskhanex', 'Kangaskhanexfull', 'Karrablast', 'Kingdra', 'Kingdradelta', 'Kingdrafull', 'Kingler', 'Kirlia', 'Kirlia2', 'Klefki', 'Klefki2', 'Klefki3', 'Korrina', 'Korrinafull', 'Krabby', 'Krokorok', 'Krokorok2', 'Krookodile', 'Krookodileex', 'Kyogre', 'Kyogreex', 'Kyogreex2', 'Kyogreexaquafull', 'Kyogreexfull', 'Kyuremex', 'Kyuremexfull',
    'Laironmagma', 'Lampent', 'Landorus', 'Lanturn', 'Lapras', 'Larvesta', 'Latiosex', 'Latiosexfull', 'Latiosspiritlink', 'Leafeon', 'Leavanny', 'Ledian', 'Ledyba', 'Levelball', 'Lickilicky', 'Lickitung', 'Liepard', 'Lightningenergy', 'Lillipup', 'Linoone', 'Litleo', 'Litleo2', 'Litleo3', 'Litwick', 'Lombre', 'Lopunny', 'Lotad', 'Loudred', 'Lucarioex', 'Lucarioexfull', 'Luckyhelmet', 'Ludicolo', 'Ludicolodelta', 'Lugiaex', 'Lugiaexfull', 'Lumineon', 'Lunatone', 'Luvdisc', 'Luxio', 'Luxray', 'Lysandre', 'Lysandrestrumpcard', 'Lysandrestrumpcardfull', 
    'Machamp', 'Machamp2', 'Machampbaseset', 'Machampex', 'Machampexfull', 'Machoke', 'Machop', 'Magcargo', 'Magcargo2', 'Magcargodelta', 'Magikarp', 'Magmapointer', 'Magmar', 'Magmortar', 'Magnemite', 'Magnemite2', 'Magneton', 'Magnetonbaseset', 'Magnezone', 'Magnezoneex', 'Magnezoneexfull', 'Maintenance', 'Makuhita', 'Malamar', 'Malamar2', 'Malamarex', 'Malamarexfull', 'Malamarao', 'Mamoswine', 'Manaphy', 'Manectric', 'Manectric2', 'Manectricex', 'Manectricexfull', 'Manectricspiritlink', 'Maractus', 'Marill', 'Marowak', 'MarowakBREAK', 'Marshtomp', 'Masquerain', 'Maxieshiddenballtrick', 'Maxieshiddenballtrickfull', 'Maxrevive', 'Medicham', 'Medichamdelta', 'Meditite', 'Megaaggronex', 'Megaaggronexfull', 'Megaampharosex', 'Megaampharosexfull', 'Megablastoiseex', 'Megacharizardex', 'Megacharizardexa', 'Megacharizardexb', 'Megadiancieex', 'Megagalladeex', 'Megagalladeexfull', 'Megagardevoirex', 'Megagardevoirexfull', 'Megagengarex', 'Megaglalieex', 'Megaglalieexfull', 'Megaheracrossex', 'Megaheracrossex2', 'Megahoundoomex', 'Megahoundoomexfull', 'Megakangaskhanex', 'Megakangaskhanex2', 'Megalatiosex', 'Megalatiosexfull', 'Megalucarioex', 'Megalucarioex2', 'Megamanectricex', 'Megametagrossex', 'Megarayquazaex', 'Megamewtwoex', 'Megamewtwoex2', 'Megamewtwoexfull', 'Megamewtwoexfull2', 'Megarayquazaex2', 'Megarayquazaex3', 'Megarayquazaexfull', 'Megasceptileex', 'Megasceptileexfull', 'Megaturbo', 'Megatyranitarex', 'Megatyranitarexfull', 'Megavenusaurex', 'Meloetta', 'Meowstic', 'Meowstic2', 'Meowth', 'Meowth2', 'Meowthao', 'Metagross', 'Metagross2', 'Metagrossex', 'Metalenergy', 'Metang', 'Metapod', 'Mewancient', 'Mewtwobaseset', 'Mewtwoex', 'Mewtwoex2', 'Mewtwoexfull', 'Mewtwoexfull2', 'Mewtwoexfull3', 'Mewtwoexfull4', 'Mewtwospiritlink', 'Mienfoo', 'Mienshao', 'Mightyena', 'Mightyena2', 'Mightyenaaqua', 'Mightyenamagma', 'Milotic', 'Milotic2', 'Miltank', 'Miltank2', 'Minun', 'Mismagius', 'Misdreavus', 'Mountainring', 'Mrmime', 'Mrmime2', 'Mrmime3', 'Mudkip', 'Mudkip2', 'Mukaqua', 'Munna', 'Murkrow', 'Muscleband', 'Musharna', 'Mysteryenergy', 
    'Natu', 'Natudelta', 'Nidokingbaseset', 'Nidoqueen', 'Nidoqueendelta', 'Nidoranf', 'Nidorina', 'Nincanda', 'Ninetales', 'Ninetalesbaseset', 'Ninjask', 'Noctowl', 'Noibat', 'Noibat2', 'Noibat3', 'Noivern', 'Noivern2', 'NoivernBREAK', 'Nosepass', 'Numelmagma', 'Nuzleaf',
    'Octillery', 'Oddish',
    'Pachirisu', 'Paintroller', 'Palpad', 'Pancham', 'Pancham2', 'Pancham3', 'Pangoro', 'Pangoro2', 'Panpour', 'Panpour2', 'Panpour3', 'Pansage', 'Pansage2', 'Pansage3', 'Pansear', 'Pansear2', 'Pansear3', 'Parallelcity', 'Paras', 'Parasect', 'Patrat', 'Pawniard', 'Pawniard2', 'Pelipper', 'Persian', 'Phantump', 'Pidgeot', 'Pidgeotto', 'Pidgey', 'Pidove', 'Pikachu', 'Pikachu2', 'Pikachu3', 'Pikachu4', 'Piloswine', 'Pineco', 'Pinsir', 'Piplup', 'Plusle', 'Pokeball', 'Pokemoncatcher', 'Pokemoncenterlady', 'Pokemonfanclub', 'Politoed', 'Poliwag', 'Poliwhirl', 'Poliwrath', 'Poliwrathbaseset', 'Ponyta', 'Poochyena', 'Poochyena2', 'Poochyenaaqua', 'Poochyenamagma', 'Potion', 'Porygon', 'Porygon2', 'Porygonz', 'Porygonz2', 'Primalgroudonex', 'Primalgroudonex2', 'Primalgroudonex3', 'Primalkyogreex', 'Primalkyogreex2', 'Primalkyogreex3', 'Prinplup', 'Probopass', 'Professorbirchsobservations', 'Professorbirchsobservationsfull', 'Professorsletter', 'Professorsletter2', 'Professorsycamore', 'Protectioncube', 'Psychicenergy', 'Pumpkaboo', 'Pumpkaboo2', 'Purrloin', 'Pyroar', 'Pyroar2', 
    'Quagsire', 'Quilava', 'Quilladin', 'Quilladin2', 'Quilladin3', 'Qwilfish', 
    'Raichu', 'Raichu2', 'Raichu3', 'RaichuBREAK', 'Raichubaseset', 'Raikou', 'Ralts', 'Ralts2', 'Ralts3', 'Rainbowenergy', 'Rainbowenergy2', 'Rapidash', 'Rarecandy', 'Rayquazaex', 'Rayquazaex2', 'Rayquazaex3', 'Rayquazaexfull', 'Rayquazaspiritlink', 'Redcard', 'Regice', 'Regigigas', 'Regirock', 'Regirockdelta', 'Registeel', 'Relicanth', 'Remoraid', 'Remoraid2', 'Repeatball', 'Reservedticket', 'Reshiram', 'Revive', 'Rhydon', 'Rhydon2', 'Rhyhorn', 'Rhyhorn2', 'Rhyperior', 'Rhyperior2', 'Rhyperiordelta', 'Robosubstitute', 'Roggenrola', 'Rollerskates', 'Roselia', 'Roserade', 'Rotom', 'Roughseas', 'Rufflet',
    'Sableye', 'Sableyeao', 'Sacredash', 'Salamence', 'Sandfossil', 'Sandile', 'Sandile2', 'Sandshrew', 'Sandslash', 'Scatterbug', 'Scatterbug2', 'Sceptile', 'Sceptiledelta', 'Sceptileex', 'Sceptileexao', 'Sceptileexfull', 'Sceptilespiritlink', 'Scolipede', 'Scorchedearth', 'Scrafty', 'Scrafty2', 'Scraggy', 'Scraggy2', 'Seadra', 'Seaking',  'Sealeo', 'Sealeo2', 'Sealeoaqua', 'Seedot', 'Seismitoadex', 'Seismitoadexfull', 'Sentret', 'Seviperaqua', 'Sewaddle', 'Shadowcircle', 'Sharpedoaqua', 'Sharpedoex', 'Sharpedoexfull', 'Shauna', 'Shayminskyex', 'Shayminskyexfull', 'Shedinja', 'Shelgon', 'Shellder', 'Shelmet', 'Shieldenergy', 'Shiftry', 'Shiftry2', 'Shinx', 'Shrineofmemories', 'Shroomish', 'Shroomish2', 'Shuppet', 'Silcoon', 'Silentlab', 'Simipour', 'Simipour2', 'Simisage', 'Simisage2', 'Simisear', 'Simisear2', 'Skarmory', 'Skarmory2', 'Skarmoryex', 'Skarmoryexfull', 'Skiddo', 'Skiddo2', 'Skiddo3', 'Skitty', 'Skitty1', 'Skitty2', 'Skorupi', 'Skrelp', 'Skuntank', 'Skyfield', 'Skyla', 'Slaking', 'Slakoth', 'Sliggoo', 'Sliggoo2', 'Sliggooao', 'Slugma', 'Slugma2', 'Slugma3', 'Slurpuff', 'Slurpuff2', 'Slurpuff3', 'Smeargle', 'Sneasel', 'Sneasel2', 'Snorlax', 'Snorlax2', 'Snorlax3', 'Snover', 'Snubbull', 'Snubbull2', 'Solrock', 'Sparklingrobe', 'Spearow', 'Spearow2', 'Spewpa', 'Spewpa2', 'Spheal', 'Spheal2', 'Spheal3', 'Sphealaqua', 'Spinarak', 'Spinda', 'Spiritomb', 'Spoink', 'Spritzee', 'Spritzee2', 'Spritzee3', 'Staraptor', 'Staravia', 'Starly', 'Starmie', 'Starmie2', 'Starmie3', 'Startlingmegaphone', 'Staryu', 'Staryu2', 'Staryu3', 'Steelshelter', 'Steven', 'Stevenfull', 'Stoutland', 'Strongenergy', 'Stunfisk', 'Stunky', 'Stunky2', 'Superpotion', 'Superrod', 'Superscoopup', 'Surskit', 'Swablu', 'Swablu2', 'Swadloon', 'Swalot', 'Swampert', 'Swampertdelta', 'Swampertex', 'Swellow', 'Swellow2', 'Swellowdelta', 'Swinub', 'Swirlix', 'Swirlix2', 'Swirlix3', 'Switch', 'Swoobat', 'Sylveon', 'Sylveon2', 
    'Taillow', 'Taillow2', 'Talonflame', 'Talonflame2', 'Talonflame3', 'Tangela', 'Tangrowth', 'Targetwhistle', 'Tauros', 'Teamaquaadmin', 'Teamaquagrunt', 'Teamaquasgreatball', 'Teamaquassecretbase', 'Teamflaregrunt', 'Teammagmaadmin', 'Teammagmagrunt', 'Teammagmasgreatball', 'Teammagmassecretbase', 'Teammates', 'Teammatesfull', 'Teddiursa', 'Tentacool', 'Tentacooldelta', 'Tentacruel', 'Thundurus', 'Thundurusex', 'Thundurusexfull', 'Tierno', 'Timburr', 'Togekiss', 'Togekissdelta', 'Togepi', 'Togetic', 'Toolretriever', 'Torchic', 'Torchic2', 'Torchic3', 'Torchicdelta', 'Torkoal', 'Tornadus', 'Totodile', 'Townmap', 'Toxicroakex', 'Toxicroakexfull', 'Trainersmail', 'Trainersmailao', 'Trainingcenter', 'Tranquill', 'Trapinch', 'Trapinch2', 'Treecko', 'Treecko2', 'Trevenant', 'Trevenant2', 'Trevenantex', 'Trevenantexfull', 'Trevor', 'Trickcoin', 'Trickshovel', 'Tropius', 'Tyhplosion', 'Tynamo', 'Tyranitarex', 'Tyranitarexfull', 'Tyranitarspiritlink', 'Tyrantrum', 'Tyrunt', 
    'Ultraball', 'Unfezant', 'Unfezantdelta', 'Unown', 'Ursaring', 
    'Vanillite', 'Vanillish', 'Vanilluxe','Vaporeon', 'Venipede', 'Venomoth', 'Venonat', 'Venusaurbaseset', 'Venusaurex', 'Venusaurex2', 'Venusaurexfull', 'Vespiquen', 'Vespiquen2', 'Vibrava', 'Vibrava2', 'Victini', 'Victreebel', 'Vigoroth', 'Vileplume', 'Virizion', 'Vivillon', 'Vivillon2', 'Volbeat', 'Volbeat2', 'Volcarona', 'Volcarona2', 'Voltorb', 'Voltorb2', 'Vsseeker', 'Vulpix',
    'Wailordex', 'Wailordexfull', 'Wally', 'Wallyfull', 'Walrein', 'Walrein2', 'Walreinaqua', 'Watchog', 'Waterenergy', 'Weaknesspolicy', 'Weavile', 'Weedle', 'Weedle2', 'Weedle3', 'Weepinbell', 'Whimsicott', 'Whirlipede', 'Whiscash', 'Whiscashdelta', 'Whismur', 'Widelens', 'Wigglytuff', 'Wigglytuff2', 'Wingull', 'Winona', 'Winonafull', 'Wobbuffet', 'Wobbuffet2', 'Woobat', 'Wooper', 'Wonderenergy', 'Wurmple',
    'Xatu', 'Xerneas', 'Xerneas2', 'Xerneas3', 'Xerneas4', 'Xerneasex', 'Xerneasex2', 'Xerneasex3', 'Xerosic', 'Xerosicfull',
    'Yanma', 'Yanmega', 'Yveltal', 'Yveltal2', 'Yveltal3', 'Yveltal4', 'Yveltalex', 'Yveltalex2', 'Yveltalex3',
    'Zangoosemagma', 'Zapdos', 'Zapdosbaseset', 'Zekrom', 'Zigzagoon', 'Zoroark', 'Zoroark2', 'ZoroarkBREAK', 'Zorua', 'Zorua2', 'Zorua3', 'Zubat', 'Zweilous'];
//System Command: you should prolly never put anything in here
var cleanShop = [];
var cleanCard = [];
 
var rareCache = []; //Used to cache cards for tours
var cardCache = []; //Used to cache cards in packs
var userPacks = {}; //Used to store users unopened packs
 
let packImage = {
    'xybase': 'http://www.snfhobbies.com/uploads/4/6/9/8/46980109/s827363015135821806_p125_i2_w330.png',
    'xyflashfire': 'http://www.snfhobbies.com/uploads/4/6/9/8/46980109/s827363015135821806_p124_i2_w330.png',
    'xyfuriousfists': 'http://www.snfhobbies.com/uploads/4/6/9/8/46980109/s827363015135821806_p123_i3_w330.png',
    'xyphantomforces': 'http://cdn.bulbagarden.net/upload/thumb/8/81/XY4_Booster_Aegislash.jpg/170px-XY4_Booster_Aegislash.jpg',
    'xyprimalclash': 'http://www.snfhobbies.com/uploads/4/6/9/8/46980109/s827363015135821806_p121_i2_w330.png',
    'xyroaringskies': 'http://www.snfhobbies.com/uploads/4/6/9/8/46980109/s827363015135821806_p122_i1_w330.png',
    'xyancientorigins': 'http://i.imgur.com/sC5VAhU.png',
    'xybreakthrough': 'http://i.imgur.com/2M8yzWZ.png',

};

function cachePacks() {
    for (var i = 0; i < packShop.length; i++) {
        cardCache.push(new Array());
        for (var key in cards) {
            if (cards.hasOwnProperty(key)) {
                var obj = cards[key];
                if (obj.hasOwnProperty('collection') && obj.collection.indexOf(packShop[i]) > -1) cardCache[i].push(key);
            }
        }
    }
    for (i = 0; i < packShop.length; i++) {
        cleanShop.push(toId(packShop[i]));
    }
}
 
function cacheRarity() {
    for (var i = 0; i < cardRarity.length; i++) {
        rareCache.push(new Array());
        for (var key in cards) {
            if (cards.hasOwnProperty(key)) {
                var obj = cards[key];
                if (obj.hasOwnProperty('rarity') && obj.rarity.indexOf(cardRarity[i]) > -1) rareCache[i].push(key);
            }
        }
    }
    for (i = 0; i < cardRarity.length; i++) {
        cleanCard.push(toId(cardRarity[i]));
    }
}
 
global.tourCard = function (tourSize, userid) {
    if (tourSize > 32) tourSize = 32;
    var tourRarity = tourCardRarity[Math.floor(tourSize / 4)];
    var cacheValue = rareCache[cleanCard.indexOf(toId(tourRarity))];
    var card = cacheValue[Math.round(Math.random() * (cacheValue.length - 1))];
    if (tourRarity === 'No Card') return;
    addCard(userid, card);
    return [cards[card].rarity, cards[card].title, cards[card].name];

};

// New Function To Award Packs
global.tourPack = function (userid, pack) {
   userid = toId(userid);
   if (!userPacks[userid]) userPacks[userid] = [];
   userPacks[userid].push(pack);

};
 
function addCard(name, card) {
    var newCard = {};
    newCard.title = cards[card].title;
    newCard.card = cards[card].card;
    newCard.name = cards[card].name;
    newCard.rarity = cards[card].rarity;
    newCard.points = cards[card].points;
 
    var userid = toId(name);
    Db('cards').set(userid, Db('cards').get(userid, []).concat([newCard]));
    Db('points').set(userid, Db('points').get(userid, 0) + newCard.points);
}
 
function getShopDisplay(shop) {
	let display = '<table style="width: 100%; border-top-right-radius: 4px; border-top-left-radius: 4px; background: rgba(230, 0, 115, 0.6)"' +
					'<tr><th color="#fff">Pack</th><th color="#fff">Description</th><th color="white">Cost</th></tr>';
    let start = 0;
    while (start < shop.length) {
        display += "<tr>" + '<td style="background: rgba(128, 0, 64, 0.6); border: 1px solid black; padding: 5px; border-radius: 4px; text-align: center; color: white;"><button name="send" value="/buypack ' + shop[start][0] + '" style="border: 1px solid black; background: #cc3399; color: black; padding: 2px; border-radius: 4px;">' + shop[start][0] + '</button></button></td>' +
            '<td style="background: rgba(128, 0, 64, 0.6); border: 1px solid black; padding: 5px; border-radius: 4px; text-align: center; color: white;">' + shop[start][1] + '</td>' +
            '<td style="background: rgba(128, 0, 64, 0.6); border: 1px solid black; padding: 5px; border-radius: 4px; text-align: center; color: white;">' + shop[start][2] + '</td>' +
            "</tr>";
        start++;
    }
    display += "</table><div style='border: 1px solid rgba(255, 26, 140, 0.6); border-top: none; background: rgba(255, 26, 140, 0.6); color: black; text-shadow: 0px 0px 2px ; padding: 5px; border-bottom-right-radius: 4px; border-bottom-left-radius: 4px;'></table><center>To buy a pack from the shop, use /buypack <em>pack</em>.</div>";
    return display;
}
 
function toTitleCase(str) {

    return str.replace(/\w\S*/g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
 }
 
cachePacks();
cacheRarity();

function buypackDisplay(target) {
    let packId = toId(target);
    let display = '<div class="infobox" style="background: #A975D1; border: 1px solid #8044B8; border-radius: 4px; box-shadow: inset 1px 1px 3px #FFF; padding: 10px;">' + 
	'<center><h2>Click to open it!</h2><br>';
	display += '<button style="background: none; border: none" name="send" value="/openpack ' + packId + '"> ' + 
            '<img src="' + packImage[packId] + '" width="170" title="' + packId + '"></button><br>You have until the server restarts to open your pack.</center></div>';
    return display;
}
 
exports.commands = {
    packs: 'pack',
    pack: function (target, room, user) {
        if (!this.runBroadcast()) return;
        target = toId(target);
        if (!target) target = user.userid;
        if (!userPacks[target]) return this.errorReply((target === user.userid ? 'You have ' : target + ' has') + ' no packs.');
        let len = userPacks[target].length;
        console.log([userPacks, userPacks[target], len]);
        if (!len) return this.errorReply((target === user.userid ? 'You have ' : target + ' has') + ' no packs.');       
        let display = '<div style="background: rgba(175, 73, 223, 0.65); padding: 5px; font-size: 12px"><center><u><b>Your packs:</b></u><br /><br><h4>Click to open!</h4><br></center>';
        for (let i = 0; i < len; i++) {
            display += '<center><button style="background: rgba(128, 0, 64, 0.6); border: 1px solid black; padding: 5px; border-radius: 4px; text-align: center; color: white;" name= "send" value= "/openpack ' + userPacks[target][i] + '">' + userPacks[target][i] + '</button><br /></center><br>';
        }
        this.sendReplyBox(display + '</div>');
    },

    buypacks: 'buypack',
    buypack: function (target, room, user) {
        if (!target) return this.sendReply('/buypack - Buys a pack from the pack shop. Alias: /buypacks');
        var self = this;
        var packId = toId(target);
        var amount = Db('money').get(user.userid, 0);
        if (cleanShop.indexOf(packId) < 0) return self.sendReply('This is not a valid pack. Use /packshop to see all packs.');
        var shopIndex = cleanShop.indexOf(toId(target));
        if (packId !== 'xybase' && packId !== 'xyfuriousfists' && packId !== 'xyflashfire' && packId !== 'xyphantomforces' && packId !== 'xyroaringskies' && packId !== 'xyprimalclash' && packId !== 'xyancientorigins' && packId !== 'xybreakthrough') return self.sendReply('This pack is not currently in circulation.  Please use /packshop to see the current packs.');
        var cost = shop[shopIndex][2];
        if (cost > amount) return self.errorReply('You need ' + (cost - amount) + ' more bucks to buy this pack.');
        var total = Db('money').set(user.userid, amount - cost).get(user.userid);
        var pack = toId(target);
        if (!userPacks[user.userid]) userPacks[user.userid] = [];
        userPacks[user.userid].push(pack);
        room.update();
        return this.sendReply('|raw|' + buypackDisplay(target));
    },
 
    packshop: function (target, room, user) {
        if (!this.runBroadcast()) return;
        return this.sendReply('|raw|' + getShopDisplay(shop));
    },
 
    open: 'openpack',
    openpacks: 'openpack',
    openpack: function (target, room, user) {
        if (!this.runBroadcast()) return;
        if (!target) {
            this.sendReply('/openpack [pack] - Open a Pokemon Card Pack. Alias: /open, /openpacks');
            return this.parse('/packs');
        }
        if (cleanShop.indexOf(toId(target)) < 0) return this.sendReply('This pack does not exist.');
        if (!userPacks[user.userid] || userPacks[user.userid].length === 0) return this.sendReply('You have no packs.');
        if (userPacks[user.userid].indexOf(toId(target)) < 0) return this.sendReply('You do not have this pack.');
        let display = '<div class="infobox" style="background: #A975D1; border: 1px solid #8044B8; border-radius: 4px; box-shadow: inset 1px 1px 3px #FFF; padding: 10px;"><center><h3>Here\'s what you got! Congratulations!</h3></center><br><marquee behavior="slide" direction="left" style="padding-left: 4%;">';
        for (var i = 0; i < 3; i++) {
            var pack = toId(target);
            var cacheValue = cardCache[cleanShop.indexOf(toId(target))];
            var card = cacheValue[Math.round(Math.random() * (cacheValue.length - 1))];
            addCard(user.userid, card);
            var cardName = cards[card].name;
            var packName = packShop[cleanShop.indexOf(toId(target))];
            display += '<button name="send" value="/card ' + cards[card].title + '" style="border: none; background: none">' + 
            '<img src="' + cards[card].card + '" width="120" title="' + cardName + '"></button> &nbsp;';
        }
        display += '</marquee></div>';
        var usrIndex = userPacks[user.userid].indexOf(pack);
        userPacks[user.userid].splice(usrIndex, 1);
        return this.sendReply('|raw|' + display);
    },
 
    givepacks: 'givepack',
    givepack: function (target, room, user) {
        if (!user.can('declare')) return this.errorReply('/givepack - Access denied.');
        if (!target) return this.sendReply('/givepack [user], [pack] - Give a user a pack. Alias: /givepacks');
        var parts = target.split(',');
        this.splitTarget(parts[0]);
        if (!parts[1]) return this.sendReply('/givepack [user], [pack] - Give a user a pack. Alias: /givepacks');
        var pack = toId(parts[1]);
        var userid = toId(this.targetUsername);
        if (cleanShop.indexOf(pack) < 0) return this.sendReply('This pack does not exist.');
        if (!this.targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (!userPacks[userid]) userPacks[userid] = [];
        userPacks[userid].push(pack);
        this.sendReply(this.targetUsername + ' was given ' + pack + ' pack. This user now has ' + userPacks[userid].length + ' pack(s).');
        Users.get(this.targetUsername).connections[0].sendTo(room.id,
            '|raw|' + user.name + ' has given you ' + pack + ' pack. You have until the server restarts to open your pack. \
            Use <button name="send" value="/openpack ' + pack + '"><b>/openpack ' + pack + '</b></button> to open your pack.');

    },

    takepacks: 'takepack',
    takepack: function (target, room, user) {
        if (!user.can('takepack')) return this.errorReply('/takepack - Access denied.');
        if (!target) return this.sendReply('/takepack [user], [pack] - Take a pack from a user. Alias: /takepacks');
        var parts = target.split(',');
        this.splitTarget(parts[0]);
        if (!parts[1]) return this.sendReply('/takepack [user], [pack] - Take a pack from a user. Alias: /takepacks');
        var pack = toId(parts[1]);
        var packIndex = userPacks[userid].indexOf(pack);
        var userid = toId(this.targetUsername);
        if (packsKeys.indexOf(pack) < 0) return this.sendReply('This pack does not exist.');
        if (!this.targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
        if (!userPacks[userid]) userPacks[userid] = [];
        if (packIndex < 0) return this.sendReply('This user does not have this pack.');
        userPacks[userid].splice(packIndex, 1);
        this.sendReply(this.targetUsername + ' lost ' + pack + ' pack. This user now has ' + users[userid].length + ' pack(s).');
        Users.get(this.targetUsername).send('|raw|' + user.name + ' has taken ' + pack + ' pack from you. You now have ' +  users[userid].length + ' pack(s).');


    },

    showcards: 'showcase',
    showcard: 'showcase',
    showcase: function (target, room, user) {
        if (!this.runBroadcast()) return;
 
        if (!target) target = user.userid;
        let targetUser = toId(target);
 
        const cards = Db('cards').get(targetUser, []);
        const points = Db('points').get(targetUser, 0);
 
        if (!cards.length) return this.sendReplyBox(targetUser + " has no cards.");
 
        const cardsMapping = cards.map(function (card) {
            return '<button name="send" value="/card ' + card.title + '" style="margin: 2px; border-radius: 10px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2) inset;" class="card-button"><img src="' + card.card + '" width="60" title="' + card.name + '"></button>';
        });
 
        const bottom = '<center><br><br><b>' + targetUser + ' Has ' + points + (points > 1 ? ' Points' : ' Point')  + ' And A Total Of ' + cards.length + (cards.length > 1 ? ' Cards' : ' Card') + '.</b><br><br><center>';
        const display = cardsMapping.slice(0, cards.length);
 
 
        this.sendReplyBox('<center><div class="infobox-limited">' + display.join('') + bottom + '</div></center>');
    },
 
    card: function (target, room, user) {
        if (!target) return this.sendReply('/card [name] - Shows information about a card.');
        if (!this.runBroadcast()) return;
        let cardName = toId(target);
        if (!cards.hasOwnProperty(cardName)) return this.sendReply(target + ': card not found.');
        let card = cards[cardName];
        const html = '<div style="background: rgba(175, 73, 223, 0.65); padding: 5px"><img src="' + card.card + '" height="220" title="'  + card.title +  '" align="right">' +
            '<center><span style="border-bottom-right-radius: 2px; border-bottom-left-radius: 2px; background-image: -moz-linear-gradient(center top , #EBF3FC, #DCE9F9);  box-shadow: 0px 1px 0px rgba(255, 255, 255, 0.8) inset, 0px 0px 2px rgba(0, 0, 0, 0.2);"><h1>'  + card.name +   '</h1></span></center>' +
            '<br><center><h1><font color="' + colors[card.rarity] + '">' + card.rarity + '</font></h1></center>' +
            '<center><h3><font color="black"><i>Points: </i></b></font> ' + card.points + '</h3>' +
            '</center><center><h3><b><font color="black"><i>Found in Packs: </h3></i></b></font></center><center>' + card.collection.join(', ') +
            '</center><br></div>';
        this.sendReplyBox(html);
    },
 
    cardladder: function (target, room, user) {
        if (!this.runBroadcast()) return;
        let display = '<center><u><b>Card Ladder</b></u></center><br><table border="1" cellspacing="0" cellpadding="5" width="100%"><tbody><tr><th>Rank</th><th>Username</th><th>Points</th></tr>';
        var keys = Object.keys(Db('points').object()).map(function (name) {
            return {name: name, points: Db('points').get(name)};
        });
        if (!keys.length) return this.sendReplyBox("Card ladder is empty.");
        keys = keys.sort(function (a, b) {
            if (b.points > a.points) return 1;
            return -1;
        });
        keys.slice(0, 10).forEach(function (user, index) {
            display += "<tr><td>" + (index + 1) + "</td><td>" + user.name + "</td><td>" + user.points + "</td></tr>";
        });
        if (this.broadcasting && Number(target) > 10) target = null;
        if (!isNaN(target)) {
            if (Number(target) > 100) target = 100;
            keys.slice(10, target).forEach(function (user, index) {
                display += "<tr><td>" + (index + 11) + "</td><td>" + user.name + "</td><td>" + user.points + "</td></tr>";
            });
        }
        display += "</tbody></table>";
        this.sendReply("|raw|" + display);

    },
 
    psgo: 'cardshelp',
    cardshelp: function (target, room, user) {
        if (!this.runBroadcast()) return;
        if (target === 'rank') {
            return this.sendReplyBox('\
                1st Place - 100 Bucks<br>\
                2nd Place - 90 Bucks + (Total Points / 200 Points) Bucks<br>\
                3rd Place - 80 Bucks + (Total Points / 200 Points) Bucks<br>\
                4th Place - 70 Bucks + (Total Points / 200 Points) Bucks<br>\
                5th Place - 60 Bucks + (Total Points / 200 Points) Bucks<br>\
                6th Place - 50 Bucks + (Total Points / 200 Points) Bucks<br>\
                7th Place - 40 Bucks + (Total Points / 200 Points) Bucks<br>\
                8th Place - 30 Bucks + (Total Points / 200 Points) Bucks<br>\
                9th Place - 20 Bucks + (Total Points / 200 Points) Bucks<br>\
                10th Place - 10 Bucks + (Total Points / 200 Points) Bucks\
                ');
        }
        return this.sendReplyBox('\
            <center><b><u>Supernova Trading Card Game:</u></b></center><br>\
            This is a Trading Card Game based off of CS:GO opening cases. \
            Currently, the main objective of the game is to get the best cards. \
            The top 10 users every month who has the best cards in the <i>/cardladder</i> will \
            win bucks. In future updates, there will be a metagame where you can use your cards to battle. \
            For more information about STCG:<br><br>\
            <b>/psgo rank</b> - Shows how many bucks do the people get for being on the card ladder.<br>\
            <b>/packs</b> - Shows the amount of packs that were purchased.<br>\
            <b>/buypack</b> - Buys a pack from the pack shop.<br>\
            <b>/packshop</b> - Shows the shop for buying packs.<br>\
            <b>/openpack</b> - Opens a pack that has been purchased from the shop.<br>\
            <b>/showcase</b> - Shows a display of all cards that you have. Specify a page number to see more cards.<br>\
            <b>/card</b> - Shows data and information on any specifc card.<br>\
            <b>/cardladder</b> - Shows the leaderboard of the users with the most card points.<br>\
        ');
    

   },
 
    searchcards: function (target, room, user) {
        if (!this.runBroadcast()) return;
        if (!target) return this.errorReply('you need a search term');
        if (target === "ALL" && user.name === 'AuraStormLucario') {
            for (var x = 0; x < 888; x++) {
                this.parse('/card ' + allCards[x]);
            }
        } else {
            var j = 0;
            for (var i = 0; i < 900; i++) {
                if (allCards[i].slice(0, target.length) === target/*&& j <= 50*/) {
                    this.parse('/card ' + allCards[i]);
                    j++;
                }
            }
        }
    },
  };