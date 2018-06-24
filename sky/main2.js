// Game.spawns['Spawn1'].room.controller.activateSafeMode();
// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );
// Game.creeps['a'].move(TOP);
// https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API

let support = require('support');
let roleHarvester = require('role.harvester');
let roleMiner = require('role.miner');
let roleHyperMiner = require('role.hyperminer');
let roleDistributor = require('role.distributor');
let roleRoadBuilder = require('role.roadbuilder');
let roleRecycle = require('role.recycle');

module.exports.loop = function () {
    const spawnername = "Spawn1";
    const MYSPAWNER = Game.spawns[spawnername];
    const MYROOM = MYSPAWNER.room;

    support.erasedead();
    
    // Get lists
    const mystructures = MYROOM.find(FIND_MY_STRUCTURES);
    const sources = MYROOM.find(FIND_SOURCES);
    const extensions = MYROOM.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
    const containers = MYROOM.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
    const tombstones = MYROOM.find(FIND_TOMBSTONES);
    
    // Creep census
    let roles = {
        'recycle': {amount:0, actions:roleRecycle},
        'builder': {amount:0, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleRoadBuilder},
        'distributor': {amount:2, parts:[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], cost:500, actions:roleDistributor},
        'miner': {amount:0, parts:[WORK,WORK,WORK,WORK,CARRY,MOVE], cost:500, actions:roleMiner},
        'hyperminer': {amount:1, parts:[WORK,WORK,WORK,WORK,WORK,MOVE], cost:550, actions:roleHyperMiner},
    };
//    console.log("distributor", support.getCost(roles.distributor.parts));
//            console.log(MYROOM.energyAvailable);
    for (let role of Object.keys(roles)) {
        var census =  _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(census.length < roles[role].amount) {
            var newName = role + Game.time;
            let memory = {role: role};
            switch (role) {
                case 'hyperminer':
                    memory.sourceid = sources[0].id;
                    break;
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
            MYSPAWNER.spawnCreep(roles[role].parts, newName, {memory: memory})
        }
    }

    // If spawning, make a notification
    if (MYSPAWNER.spawning) { 
        var spawningCreep = Game.creeps[MYSPAWNER.spawning.name];
        MYROOM.visual.text(
            '🛠️' + spawningCreep.memory.role,
            MYSPAWNER.pos.x + 0, 
            MYSPAWNER.pos.y + 1, 
            {align: 'center', opacity: 0.2});
    }
    
    if (Memory.antcrumbs == undefined) {
        Memory.antcrumbs = {};
    }
    
    // Run creep roles
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        // Can pass extra variables to certain roles
        switch (creep.memory.role) {
            case 'distributor':
                roles[creep.memory.role].actions.run(creep, tombstones);
                break;
            default:
                roles[creep.memory.role].actions.run(creep);
        }
        // Update antcrumbs
        if (creep.memory.lastpos == undefined) {
            creep.memory.lastpos = {x:creep.pos.x, y:creep.pos.y};
        } else if (creep.memory.lastpos.x != creep.pos.x || creep.memory.lastpos.y != creep.pos.y) {
            creep.memory.lastpos = {x:creep.pos.x, y:creep.pos.y};
            if (Memory.antcrumbs[[creep.pos.x, creep.pos.y]] == undefined) {
                Memory.antcrumbs[[creep.pos.x, creep.pos.y]] = 1;
            } else {
                Memory.antcrumbs[[creep.pos.x, creep.pos.y]] += 1;
            }
        }
    }
    
    // Draw antcrumb values on map, build roads at any tiles exceeding ROADLIMIT
    const ROADLIMIT = 9;
    for (tile of Object.keys(Memory.antcrumbs)) {
        const pos = tile.split(",");
        MYROOM.visual.text(Memory.antcrumbs[tile], Number(pos[0]), Number(pos[1]), {font: "12px"});
        if (Memory.antcrumbs[tile] > ROADLIMIT) {
            MYROOM.createConstructionSite(Number(pos[0]), Number(pos[1]), STRUCTURE_ROAD);
        }
    }
}