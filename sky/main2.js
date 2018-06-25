// Game.spawns['Spawn1'].room.controller.activateSafeMode();
// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );
// Game.creeps['a'].move(TOP);
// https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API

/*
    IDEAS:
    make Tasks.js to hold things like collectDrops(), harvestSource(src), repairTypes(types)
    expand on tech progress (automate building of extensions and different types of creeps)
    put parts lists into role files?
*/

let support = require('support');
let roleMiner = require('role.miner');
let roleHyperMiner = require('role.hyperminer');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleSupplier = require('role.supplier');
let roleRecycle = require('role.recycle');
let roleGrunt = require('role.grunt');
let roleArcher = require('role.archer');
let roleMedic = require('role.medic');
let roleMessenger = require('role.messenger');
let roleLonghauler = require('role.longhauler');
let roleJack = require('role.jack');

module.exports.loop = function () {
    const spawnername = "Spawn1";
    const MYSPAWNER = Game.spawns[spawnername];
    const MYROOM = MYSPAWNER.room;

    // Initialize room memory
    if (MYROOM.memory == undefined) {
        MYROOM.memory = {};
    }

    // Erase memory of dead screeps
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
        'recycle': {amount:0, actions:roleRecycle},
        'longhauler': {amount:2, parts:[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], cost:550, actions:roleLonghauler},
        'messenger': {amount:0, parts:[MOVE], cost:50, actions:roleMessenger},
        'medic': {amount:0, parts:[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL], cost:550, actions:roleMedic},
        'archer': {amount:0, parts:[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK], cost:550, actions:roleArcher},
        'grunt': {amount:0, parts:[TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK], cost:550, actions:roleGrunt},
        'builder': {amount:0, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleBuilder},
        'supplier': {amount:0, parts:[CARRY,CARRY,MOVE,MOVE], cost:200, actions:roleSupplier},
        'upgrader': {amount:2, parts:[WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], cost:550, actions:roleUpgrader},
        'hyperminer': {amount:1, parts:[WORK,WORK,WORK,WORK,WORK,MOVE], cost:550, actions:roleHyperMiner},
        'distributor': {amount:2, parts:[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], cost:500, actions:roleJack},
        'miner': {amount:0, parts:[WORK,WORK,WORK,WORK,CARRY,MOVE], cost:500, actions:roleMiner},
        'harvester': {amount:0, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleJack},
    };
    // console.log("cost:", support.getCost(roles.grunt.parts));

    // Run towers
    let towers = MYROOM.find(FIND_MY_STRUCTURES).filter(structure => structure.structureType == "tower");
    if (towers.length > 0) {
        for (let tower of towers) {
            // Heal units
            let closestHurtCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (creep) => creep.hits < creep.hitsMax
            });
            if(closestHurtCreep) {
                tower.heal(closestHurtCreep);
            }
            // Repair buildings
            let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            // Attack hostiles
            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
    
    // let tiles = support.getTilesInArea(MYSPAWNER, 2, true);
    // for (let tile of tiles) {
    //     if (tile.structure == undefined) {
    //         // console.log(tile.x, tile.y);
    //     }
    // }
    
    // if (MYROOM.energyCapacityAvailable < 550) {
    //     let extensionsNeeded = 5 - extensions.length;
    //     for (let construction of myconstructions) {
    //         if (construction.structureType == STRUCTURE_EXTENSION) {
    //             extensionsNeeded--;
    //         }
    //     }
    //     // const parity = (MYSPAWNER.pos.x + MYSPAWNER.pos.y) % 2;
    //     // while (extensionsNeeded > 0) {
    //     //     let tiles = support.getTilesInArea(MYSPAWNER, 2, true);
    //     //     for (let tile of tiles) {
    //     //         if (tile.structure == undefined && (tile.x + tile.y) % 2 == parity) {
    //     //             MYROOM.createConstructionSite(tile.x, tile.y, STRUCTURE_EXTENSION);
    //     //             extensionsNeeded--;
    //     //         }
    //     //     }
    //     // }
    // }    
    
    // Spawn
    for (let role of Object.keys(roles)) {
        let census =  _.sum(Game.creeps, (creep) => creep.memory.role == role);
        if (census < roles[role].amount) {
            let newName = role + Game.time;
            let memory = {role: role};
            switch (role) {
                case 'hyperminer':
                    memory.sourceid = sources[0].id;
            }
        //    console.log("Spawning", role);
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
    
    // Run creep roles
    for(let name in Game.creeps) {
        // Get creep by name
        let creep = Game.creeps[name];
        // Keep track of action changes
        let oldaction = undefined;
        if (creep.memory.action) {
            oldaction = Object.assign(creep.memory.action);
        }
        // Can pass extra variables to certain roles
        switch (creep.memory.role) {
            default:
                roles[creep.memory.role].actions.run(creep);
        }
        // If changing actions, announce new action
        if (creep.memory.action) {
            if (creep.memory.action != oldaction) {
                creep.say(creep.memory.action);
            }
        }
        // Update antcrumbs in this room
        if (creep.room == MYROOM) {
            if (creep.memory.lastpos == undefined) {
                creep.memory.lastpos = {x:creep.pos.x, y:creep.pos.y};
            } else if (creep.memory.lastpos.x != creep.pos.x || creep.memory.lastpos.y != creep.pos.y) {
                creep.memory.lastpos = {x:creep.pos.x, y:creep.pos.y};
                let count = support.getRoomMemory(creep.room, creep.pos, 'antcrumbs');
                count = count ? count : 0;
                support.setRoomMemory(creep.room, creep.pos, 'antcrumbs', count + 1);
            }
        }
    }

    // Draw antcrumb values on map, build roads at any tiles exceeding ROADLIMIT
    const ROADLIMIT = 99;
    for (tile of Object.keys(MYROOM.memory)) {
        const pos = tile.split(",");
        if (MYROOM.memory[tile].antcrumbs) {
            MYROOM.visual.text(MYROOM.memory[tile].antcrumbs, Number(pos[0]), Number(pos[1]), {font: "12px"});
        }
        if (MYROOM.memory[tile].antcrumbs > ROADLIMIT) {
            MYROOM.createConstructionSite(Number(pos[0]), Number(pos[1]), STRUCTURE_ROAD);
        }
    }
    
    // Do some logic less often than every tick
    if (Game.time % 50 == 0) {
        for (tile of Object.keys(MYROOM.memory)) {
            const value = support.getRoomMemory(MYROOM, tile, "antcrumbs");
            if (value > 1) {
                support.setRoomMemory(MYROOM, tile, "antcrumbs", value - 1);
            } else {
                support.clearRoomMemory(MYROOM, tile, "antcrumbs");
            }
        }
    
        // Always be safe.
        if (!(MYROOM.controller.safeMode)) {
            MYROOM.controller.activateSafeMode();
        }

    }
}