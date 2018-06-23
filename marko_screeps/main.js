var Traveler = require('Traveler');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
let roleRoadBuilder = require('role.roadbuilder');
let support = require('support');



module.exports.loop = function () {
    support.erasedead();



    const spawner = "Spawn1";
    spawnroom = Game.spawns[spawner].room;

    knownrooms = Game.rooms;
    // console.log(knownrooms)
    console.log(Game.spawns[spawner].room);
    // console.log(Game.spawns['Spawn1']);
    // Game.spawns['Spawn1'];

    RCL_progress = Game.spawns[spawner].room.controller.progress;
    RCL_progress_total = Game.spawns[spawner].room.controller.progressTotal;
    RCL = (Game.spawns[spawner].room.controller.level);
    console.log("Room lvl: " + RCL);

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
        'upgrader': {amount:6, parts:[WORK,MOVE,CARRY,MOVE], cost:300, actions:roleUpgrader},
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