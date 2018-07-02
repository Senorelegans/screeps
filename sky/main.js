// https://docs.screeps.com/api/#Constants
// https://docs.screeps.com/api/#Creep

// for (let creep of Object.keys(Game.creeps)) {console.log(creep);}
// Game.spawns['Spawn1'].room.controller.activateSafeMode();
// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );
// Game.creeps['a'].move(TOP);
// https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API

let support = require('support');
let main1 = require('main1');
let main2 = require('main2');
let main3 = require('main3');
let main4 = require('main4');

module.exports.loop = function () {
    const spawnername = "Spawn1";
    const MYSPAWNER = Game.spawns[spawnername];
    const MYROOM = MYSPAWNER.room;

    // Activate safe mode if hostile attackers are found
    support.autosafe(MYROOM);

    switch (MYROOM.controller.level) {
        case 1:
            main1.loop();
            break;
        case 2:
            main2.loop();
            break;
        case 3:
            main3.loop();
            break;
        case 4:
            main4.loop();
            break;
        default:
            main4.loop();
            break;
    }
}