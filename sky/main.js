// Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,CARRY,MOVE],'a',{ memory: { role: 'harvester' } } );

// Game.creeps['a'].move(TOP);

let roleHarvester = require('role.harvester');

module.exports.loop = function () {
    // Names for units
    const spawner = "Spawn1";

    // Delete memory of nonexistant creeps
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    // Creep census
    let roles = {
        'harvester': {amount:4, parts:[WORK,WORK,CARRY,MOVE], actions:roleHarvester},
    };
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
    
    // Make list of important sites to network
    let importantsites = [
        Game.spawns[spawner],
    ];
    for (let room of Object.keys(Game.rooms)) {
        importantsites.push(Game.rooms[room].controller);
    }
//    console.log(JSON.stringify(importantsites));
    //Game.rooms.sim.createConstructionSite(10, 15, STRUCTURE_ROAD);
    
    // Run creep roles
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        roles[creep.memory.role].actions.run(creep);
    }
}