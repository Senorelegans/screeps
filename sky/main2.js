// Game.spawns['Spawn1'].room.controller.activateSafeMode();
// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );
// Game.creeps['a'].move(TOP);
// https://github.com/bonzaiferroni/bonzAI/wiki/Traveler-API
// JSON.stringify(Game.spawns.Spawn1.room,null,1)

/*
    IDEAS:
    make Tasks.js to hold things like collectDrops(), harvestSource(src), repairTypes(types)
    expand on tech progress (automate building of extensions and different types of creeps)
    put parts lists into role files?
*/

let support = require('support');
let roles = require('roles');

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

    // console.log("cost:", support.getCost(roles.grunt.parts));

    if (MYROOM.energyCapacityAvailable < 550) {

        // Include looking for flag for alternate extension farm area

        // Set quotas
        // Tier 1
        roles.jack1.quota = 1;
        roles.builder1.quota = 2;
        roles.upgrader1.quota = 1;
        let extensionsNeeded = 5 - extensions.length;
        let extensionsBuilding = MYROOM.find(FIND_MY_CONSTRUCTION_SITES, {filter: { structureType: STRUCTURE_EXTENSION }}).length;
        let searchOffset = Math.ceil(Math.sqrt((extensionsNeeded - extensionsBuilding) - 1));
        const parity = (MYSPAWNER.pos.x + MYSPAWNER.pos.y) % 2;
        const maxloops = 20;
        let loops = 0;
        while (extensionsBuilding < extensionsNeeded && loops < maxloops) {
            let tiles = support.getTerrainInArea(MYSPAWNER, searchOffset, true);
            for (let tile of tiles) {
                if ((tile.x + tile.y) % 2 == parity) {
                    if (tile.terrain != "wall") {
                        if (MYROOM.lookForAt(LOOK_STRUCTURES, tile.x, tile.y).length == 0 && MYROOM.lookForAt(LOOK_CONSTRUCTION_SITES, tile.x, tile.y).length == 0) {
                            if (extensionsBuilding < extensionsNeeded) {
                                MYROOM.createConstructionSite(tile.x, tile.y, STRUCTURE_EXTENSION);
                                extensionsBuilding++;
                            }
                        }
                    }
                }
            }
            searchOffset++;
            loops++;
        }
    } else {
        // Set quotas
        // Tier 2;
        roles.hyperminer2.quota = 1;
        roles.jack2.quota = 2;
        roles.upgrader2.quota = 2;
    }    
    

    // Spawn
    for (let role of Object.keys(roles)) {
        if (roles[role].quota > 0) {
            if (MYROOM.energyAvailable >= roles[role].cost) {
                let census =  _.sum(Game.creeps, (creep) => creep.memory.role == role);
                if (census < roles[role].quota) {
                    let newName = role + Game.time;
                    let memory = {role: role};
                    switch (role) {
                        case 'hyperminer2':
                            memory.sourceid = sources[0].id;
                            break;
                    }
                    let result = MYSPAWNER.spawnCreep(roles[role].parts, newName, {memory: memory});
                }
            }
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
                if (count < 99) {
                    support.setRoomMemory(creep.room, creep.pos, 'antcrumbs', count + 1);
                }
            }
        }
    }

    // Draw antcrumb values on map, build roads at any tiles exceeding ROADLIMIT
    const ROADLIMIT = 99;
    for (tile of Object.keys(MYROOM.memory)) {
        const pos = tile.split(",");
        if (MYROOM.memory[tile].antcrumbs) {
            // MYROOM.visual.text(MYROOM.memory[tile].antcrumbs, Number(pos[0]), Number(pos[1]), {font: "12px"});
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
        // if (!(MYROOM.controller.safeMode)) {
        //     MYROOM.controller.activateSafeMode();
        // }

    }
}