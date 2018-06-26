let support = require('support');
let roles = require('roles');

module.exports.loop = function () {
    // Names for units
    const spawnername = "Spawn1";
    const MYSPAWNER = Game.spawns[spawnername];
    const MYROOM = MYSPAWNER.room;

    support.erasedead();
    
    // Set quotas
    roles.jack1.quota = 2;
    roles.miner1.quota = 0;
    roles.supplier1.quota = 0;
    roles.builder1.quota = 0;
    roles.upgrader1.quota = 1;

    // Spawn
    for (let role of Object.keys(roles)) {
        if (roles[role].quota > 0) {
            if (MYROOM.energyAvailable >= roles[role].cost) {
                let census =  _.sum(Game.creeps, (creep) => creep.memory.role == role);
                if (census < roles[role].quota) {
                    let newName = role + Game.time;
                    let memory = {role: role};
                    switch (role) {
                        default:
                    }
                    let result = MYSPAWNER.spawnCreep(roles[role].parts, newName, {memory: memory});
                    if (result != OK) {
                        console.log("Spawner error", result);
                    }
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
        let creep = Game.creeps[name];
        // Can pass extra variables to certain roles
        switch (creep.memory.role) {
            default:
                roles[creep.memory.role].actions.run(creep);
        }
    } 
}