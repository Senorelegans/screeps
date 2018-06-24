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
let makecreeps = require('makecreeps');
let roleHarvester = require('role.harvester');
let roleRecycle = require('role.recycle');
let roleBuilder = require('role.builder');
// let roleHyperMiner = require('role.hyperminer');
// let roleDistributor = require('role.distributor');
let roleUpgrader = require('role.upgrader');

module.exports.loop = function () {
    support.erasedead();





    const spawnername = "Spawn1";
    const MYSPAWNER = Game.spawns[spawnername];
    const MYROOM = MYSPAWNER.room;
    const MYRCL = MYROOM.controller;

    // Progress info
    const RCL_progress = MYRCL.progress;
    const RCL_progress_total = MYRCL.progressTotal;
    const RCL = MYRCL.level;

    // Get lists
    const mystructures = MYROOM.find(FIND_MY_STRUCTURES);
    const myconstructions = MYROOM.find(FIND_MY_CONSTRUCTION_SITES);
    const sources = MYROOM.find(FIND_SOURCES);
    const extensions = MYROOM.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
    const containers = MYROOM.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }});
    const tombstones = MYROOM.find(FIND_TOMBSTONES);


    makecreeps.creeps2(MYSPAWNER,sources);
    support.SpawnerInfo(MYSPAWNER);



    if (extensions < 5) {
        AREA = support.getTilesInArea(MYSPAWNER, 2, 'checkerboard', false, -3,-2);
        for (tile in AREA) {
            x = AREA[tile].x;
            y = AREA[tile].y;
            MYROOM.createConstructionSite(x, y, STRUCTURE_EXTENSION);
        }
    }

};