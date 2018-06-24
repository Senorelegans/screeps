var Traveler = require('Traveler');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
let roleRoadBuilder = require('role.roadbuilder');
let support = require('support');



module.exports.loop = function () {
    support.erasedead();

    const spawner = "Spawn1";

    // Get tiles around a tile


    thing = Game.spawns[spawner]; // can be spawner, creep, resource
    var tile = thing.pos;
    add_area = 1; // amount around your tile you will add.
    console.log(tile);
    let TOP = tile.y+add_area;
    let LEFT = tile.x+add_area;
    let BOTTOM = tile.y-add_area;
    let RIGHT = tile.x-add_area;
    let W = LEFT - RIGHT; // width
    let H = TOP - BOTTOM; // heigth
    let AREA = thing.room.lookAtArea(TOP,LEFT,BOTTOM,RIGHT); // 37 and 11
    // let AREA = thing.room.lookAtArea(TOP,LEFT,BOTTOM,RIGHT); // 37 and 11

    console.log(JSON.stringify(AREA[TOP]));
    console.log(AREA[37]);
    console.log(JSON.stringify(AREA[TOP]));

    const look = thing.room.lookAtArea(10,5,11,7);
    // console.log(look);
    // console.log(look[10]);

    // // console.log(JSON.stringify(look[10]));
    // console.log(JSON.stringify(look[37][6]) );

    // console.log(AREA[37][j])
    //
    // //
    // for (i = BOTTOM; i <= BOTTOM+H; i++) {
    //         console.log("i is :"+ i);
    //         for (j = LEFT; j <= LEFT+W; j++){
    //             console.log("j is :"+ j);
    //             console.log(AREA[TOP][BOTTOM]);
    //
    //         }
    // }











    spawnroom = Game.spawns[spawner].room;

    knownrooms = Game.rooms;
    // console.log(knownrooms)
    // console.log(Game.spawns[spawner].room);
    // console.log(Game.spawns['Spawn1']);
    // Game.spawns['Spawn1'];

    RCL_progress = Game.spawns[spawner].room.controller.progress;
    RCL_progress_total = Game.spawns[spawner].room.controller.progressTotal;
    RCL = (Game.spawns[spawner].room.controller.level);


    let resources_list = Game.spawns[spawner].room.find(FIND_SOURCES);

    resource1 = resources_list[0];





    // for (let object in Area) {
    //     tiles = JSON.stringify(Area[object]);
    //     console.log(tiles);
    // }







    // var terrain = Game.spawns[spawner].room.lookForAtArea('terrain', 0, 0, 49, 49);
    // console.log(terrain)
    // terrain[5][10] == 'plain'; // tile at y=5 x=10 is plain land
    // terrain[25][40] == 'swamp'; // tile at y=25 x=40 is a swamp


    // console.log("Room lvl: " + RCL);

    var extensions = Game.spawns[spawner].room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    //console.log(extensions.length);
    //console.log(extensions);






    // Make list of important sites to network
    let importantsites = [
        Game.spawns[spawner],
    ];
    for (let room of Object.keys(Game.rooms)) {
        importantsites.push(Game.rooms[room].controller);
    }


    // Creep census
    let roles = {
        'roadbuilder': {amount:0, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleRoadBuilder},
        'builder': {amount:3, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleBuilder},
        'upgrader': {amount:20, parts:[WORK,MOVE,CARRY,MOVE], cost:300, actions:roleUpgrader},
        'harvester': {amount:6, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleHarvester},
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