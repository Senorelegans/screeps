// https://docs.screeps.com/api/#Constants
// https://docs.screeps.com/api/#Creep

// Game.spawns['Spawn1'].room.controller.activateSafeMode();
// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );
// Game.creeps['a'].move(TOP);
// https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API

let main1 = require('main1');
let main2 = require('main2');
let main3 = require('main3');

module.exports.loop = function () {
    const spawner = "Spawn1";
    switch (Game.spawns[spawner].room.controller.level) {
        case 1:
            main1.loop();
            break;
        case 2:
            main2.loop();
            break;
        case 3:
            main3.loop();
            break;
        default:
            main3.loop();
            break;
    }
}