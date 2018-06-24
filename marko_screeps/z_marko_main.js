var Traveler = require('Traveler');
var roleHarvester = require('role.harvester');
var roleRecycle = require('role.recycle');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
let roleRoadBuilder = require('role.roadbuilder');
let support = require('support_marko');



module.exports.loop = function () {
    support.erasedead();


    const spawner = "Spawn1";


    //let AREA = support.getTilesInAreaWithPattern(Game.spawns[spawner], 1, "checkerboard", false);
    console.log(support.bar);




    // // Get tiles around a tile
    // thing = Game.spawns[spawner]; // can be spawner, creep, resource
    // var tile = thing.pos;
    // add_area = 1; // amount around your tile you will add.
    // console.log(tile);
    // let TOP = tile.y-add_area;
    // let LEFT = tile.x-add_area;
    // let BOTTOM = tile.y+add_area;
    // let RIGHT = tile.x+add_area;
    // let W = RIGHT-LEFT; // width
    // let H =  BOTTOM-TOP; // heigth
    // let AREA = thing.room.lookAtArea(TOP,LEFT,BOTTOM,RIGHT); // 37 and 11
    //
    // for (y = TOP; y <= BOTTOM; y++) {
    //         // console.log("y is :"+ y);
    //         for (x = LEFT; x <= RIGHT; x++){
    //             let tile = AREA[y][x];
    //             // console.log("x is :"+ x);
    //             // console.log(AREA[y][x]);
    //             // console.log(JSON.stringify(AREA[y][x]));
    //         }
    // }

    spawnroom = Game.spawns[spawner].room;
    knownrooms = Game.rooms;

    RCL_progress = Game.spawns[spawner].room.controller.progress;
    RCL_progress_total = Game.spawns[spawner].room.controller.progressTotal;
    RCL = (Game.spawns[spawner].room.controller.level);


    let resources_list = Game.spawns[spawner].room.find(FIND_SOURCES);

    resource1 = resources_list[0];


    // const construction_sites = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES)

    // });
    // console.log('Spawn has '+extensions.length+' extensions available');


    // console.log("Room lvl: " + RCL);

    var extensions = Game.spawns[spawner].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    //console.log(extensions.length);

    // Make list of important sites to network
    let importantsites = [
        Game.spawns[spawner],
    ];
    for (let room of Object.keys(Game.rooms)) {
        importantsites.push(Game.rooms[room].controller);
    }

    // Creep census
    let roles = {
        'builder': {amount:3, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleBuilder},
        'upgrader': {amount:4, parts:[WORK,MOVE,CARRY,MOVE], cost:300, actions:roleUpgrader},
        'harvester': {amount:4, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleHarvester},
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

    // Run creep roles
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        roles[creep.memory.role].actions.run(creep);
    }


}