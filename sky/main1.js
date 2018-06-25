let support = require('support');
let roles = require('roles');

module.exports.loop = function () {
    // Names for units
    const spawnername = "Spawn1";
    const MYSPAWNER = Game.spawns[spawnername];
    const MYROOM = MYSPAWNER.room;

    support.erasedead();
    
    // Set quotas
    roles.jack1.quota = 3;
    roles.miner1.quota = 0;
    roles.supplier1.quota = 0;
    roles.builder1.quota = 0;
    roles.upgrader1.quota = 0;

    // Spawn
    for (let role of Object.keys(roles)) {
        var census =  _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(census.length < roles[role].quota) {
            var newName = role + Game.time;
            let memory = {role: role};
            // Pass extra memory flags to certain roles
            switch (role) {
                default:
            }
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
        let creep = Game.creeps[name];
        // Can pass extra variables to certain roles
        switch (creep.memory.role) {
            default:
                roles[creep.memory.role].actions.run(creep);
        }
    } 
}