// Game.spawns['Spawn1'].room.controller.activateSafeMode();
// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );
// Game.creeps['a'].move(TOP);
// https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API

let support = require('support');
let roleHarvester = require('role.harvester');
let roleMiner = require('role.miner');
let roleDistributor = require('role.distributor');
let roleRoadBuilder = require('role.roadbuilder');
let roleRecycle = require('role.recycle');

let antcrumbs = {};

module.exports.loop = function () {
    // Names for units
    const spawner = "Spawn1";

    support.erasedead();
    
    // Get lists
    const mystructures = Game.spawns[spawner].room.find(FIND_MY_STRUCTURES);
    const sources = Game.spawns[spawner].room.find(FIND_SOURCES);
    const extensions = Game.spawns[spawner].room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
    const containers = Game.spawns[spawner].room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
    const tombstones = Game.spawns[spawner].room.find(FIND_TOMBSTONES, {filter: { my: true }});
    if (tombstones.length > 0) {
        console.log("Tombstones:");
        support.print(tombstones);
    }
    
    // Creep census
    let roles = {
        'recycle': {amount:0, actions:roleRecycle},
        'roadbuilder': {amount:0, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleRoadBuilder},
        'distributor': {amount:1, parts:[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], cost:500, actions:roleDistributor},
        'miner': {amount:1, parts:[WORK,WORK,WORK,WORK,CARRY,MOVE], cost:500, actions:roleMiner},
        'harvester': {amount:2, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleHarvester},
    };
//    console.log("distributor", support.getCost(roles.distributor.parts));
//            console.log(Game.spawns[spawner].room.energyAvailable);
    for (let role of Object.keys(roles)) {
        var census =  _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(census.length < roles[role].amount) {
            var newName = role + Game.time;
            let memory = {role: role};
            switch (role) {
                case 'miner':
                    memory.containerid = containers[0].id;
                    memory.sourceid = sources[0].id;
                    break;
                case 'harvester':
                    memory.sourceid = sources[0].id;
                    break;
                case 'distributor':
                    memory.containerid = containers[0].id;
                    break;
            }
//            console.log("Spawning", role);
            Game.spawns[spawner].spawnCreep(roles[role].parts, newName, {memory: memory})
        }
    }

    // If spawning, make a notification
    if (Game.spawns[spawner].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns[spawner].spawning.name];
        Game.spawns[spawner].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[spawner].pos.x + 0, 
            Game.spawns[spawner].pos.y + 1, 
            {align: 'center', opacity: 0.2});
    }
    
    // Run creep roles
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        roles[creep.memory.role].actions.run(creep);
        antcrumbs[creep.pos] += 1;
    }
    for (tile of Object.keys(antcrumbs)) {
        Game.spawns[spawner].room.visual.text(antcrumbs[tile], tile.x, tile.y, {font: "10px"});
    }
}