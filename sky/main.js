// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );

// Game.creeps['a'].move(TOP);

var roleBuilder = require('role.builder');

let roleHarvester = require('role.harvester');
let slcypath = require('slcypath');

module.exports.loop = function () {
    // Names for units
    const spawner = "Spawn1";
    const roles = {
        harvester: "harvester",
    };
    
    // Control Constants
    const NUMHARVESTERS = 4;
    
    // Delete memory of nonexistant creeps
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Take harvester census
    let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == roles.harvester);
    // If below quota, spawn a new one
    if (harvesters.length < NUMHARVESTERS) {
        var newName = roles.harvester + Game.time;
        Game.spawns[spawner].spawnCreep([WORK,WORK,CARRY,MOVE], newName, {memory: {role: roles.harvester}});
    }
    // If spawning, make a notification
    if (Game.spawns[spawner].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns[spawner].spawning.name];
        Game.spawns[spawner].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[spawner].pos.x + 1, 
            Game.spawns[spawner].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    // Make list of important sites to network
    let importantsites = [
        Game.spawns[spawner],
    ];
    for (let room of Object.keys(Game.rooms)) {
        importantsites.push(Game.rooms[room].controller);
    }
//    console.log(JSON.stringify(importantsites));
    //Game.rooms.sim.createConstructionSite(10, 15, STRUCTURE_ROAD);
    
    // Pass orders to units
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == roles.harvester) {
            roleHarvester.run(creep);
        }
    }
}