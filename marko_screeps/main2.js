// Game.spawns['Spawn1'].room.controller.activateSafeMode();
// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );
// Game.creeps['a'].move(TOP);
// https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API

/*
    IDEAS:
    make Tasks.js to hold things like collectDrops(), harvestSource(src), repairTypes(types)
    expand on tech progress (automate building of extensions and different types of creeps)

*/

let support = require('support');
let roleHarvester = require('role.harvester');
let roleRecycle = require('role.recycle');
// let roleMiner = require('role.miner');
// let roleHyperMiner = require('role.hyperminer');
// let roleDistributor = require('role.distributor');
let roleUpgrader = require('role.upgrader');

module.exports.loop = function () {
    const spawnername = "Spawn1";
    const MYSPAWNER = Game.spawns[spawnername];
    const MYROOM = MYSPAWNER.room;

    support.erasedead();

    
    // Get lists
    const mystructures = MYROOM.find(FIND_MY_STRUCTURES);
    const myconstructions = MYROOM.find(FIND_MY_CONSTRUCTION_SITES);
    const sources = MYROOM.find(FIND_SOURCES);
    const extensions = MYROOM.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
    const containers = MYROOM.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
    const tombstones = MYROOM.find(FIND_TOMBSTONES);
    
    // Creep census
    let roles = {
        'recycle': {amount:0 , actions:roleRecycle},
        'upgrader': {amount:2, group:0, groupcap:1,  parts:[WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], cost:550, actions:roleUpgrader},
        'harvester': {amount:4, group:0, groupcap:2, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleHarvester},
    };

    for (let role of Object.keys(roles)) {
        let census =  _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if (census.length < roles[role].amount) {
            let newName = role + Game.time;
            let memory = {role: role};

            memory.group = Math.floor(census.length / roles[role].groupcap);
            switch (role) {
                case 'harvester':
                    memory.sourceid = sources[memory.group].id;
                    break;
                case 'upgrader':
            }
            MYSPAWNER.spawnCreep(roles[role].parts, newName, {memory: memory});
        }
    }

    // Run creep roles
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        // Can pass extra variables to certain roles
        switch (creep.memory.role) {
            case 'harvester':
                roles[creep.memory.role].actions.run(creep);
                break;
            default:
                roles[creep.memory.role].actions.run(creep);
        }
    }
    support.SpawnerInfo(MYSPAWNER);
};