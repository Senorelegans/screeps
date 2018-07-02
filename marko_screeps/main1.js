// Game.spawns['Spawn1'].room.controller.activateSafeMode();
// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );
// Game.creeps['a'].move(TOP);
// https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API

let support = require('support');
let roleHarvester = require('role.harvester');
let roleRecycle = require('role.recycle');
let roleUpgrader = require('role.upgrader1');

module.exports.loop = function () {
    // Names for units
    const spawnername = "Spawn1";
    const MYSPAWNER = Game.spawns[spawnername];
    const MYROOM = MYSPAWNER.room;

    support.erasedead();
    
    // Get lists
    const sources = MYSPAWNER.room.find(FIND_SOURCES);
    
    // Creep census
    let roles = {
        'recycle': {amount:0, actions:roleRecycle},
        'upgrader': {amount:4, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleUpgrader},
        'harvester': {amount:4, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleHarvester},
    };

    // Spawn
    for (let role of Object.keys(roles)) {
        var census =  _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(census.length < roles[role].amount) {
            var newName = role + Game.time;
            let memory = {role: role};
            switch (role) {
                case 'upgrader':
                case 'harvester':
                    memory.sourceid = sources[0].id;
                    memory.spawnid = MYSPAWNER.id;
                    break;
            }
            MYSPAWNER.spawnCreep(roles[role].parts, newName, {memory: memory})
        }
    }


    
    // Run creep roles
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        // Can pass extra variables to certain roles
        switch (creep.memory.role) {
            default:
                roles[creep.memory.role].actions.run(creep);
        }
    }
}