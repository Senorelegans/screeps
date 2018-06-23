// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );
// Game.creeps['a'].move(TOP);
// https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API

let support = require('support');
let roleHarvester = require('role.harvester');
let roleMiner = "";
let roleDistributor = require('role.distributor');

module.exports.loop = function () {
    // Names for units
    const spawner = "Spawn1";

    support.erasedead();
    
    
    
    // Creep census
    let roles = {
        'harvester': {amount:3, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleHarvester},
        'miner': {amount:0, parts:[WORK,WORK,WORK,WORK,CARRY,MOVE], cost:500, actions:roleMiner},
        'distributor': {amount:0, parts:[CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], cost:300, actions:roleDistributor},
    };
//    console.log("miner", support.getCost(roles.miner.parts));
    for (let role of Object.keys(roles)) {
        var census =  _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(census.length < roles[role].amount) {
            var newName = role + Game.time;
            Game.spawns[spawner].spawnCreep(roles[role].parts, newName, {memory: {role: role}});
        }
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
    
    // Run creep roles
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        roles[creep.memory.role].actions.run(creep);
    }
}