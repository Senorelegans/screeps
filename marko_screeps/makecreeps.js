let support = require('support');
let roleHarvester = require('role.harvester');
let roleRecycle = require('role.recycle');
let roleBuilder = require('role.builder');
// let roleHyperMiner = require('role.hyperminer');
// let roleDistributor = require('role.distributor');
let roleUpgrader = require('role.upgrader');


module.exports = {

    creeps2: function(MYSPAWNER, sources) {
        //Creep census
        let roles = {
            'recycle': {amount: 0, actions: roleRecycle},
            'upgrader': {
                amount: 2,
                group: 0,
                groupcap: 1,
                parts: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
                cost: 550,
                actions: roleUpgrader
            },
            'harvester': {
                amount: 8,
                group: 0,
                groupcap: 4,
                parts: [WORK, WORK, CARRY, MOVE],
                cost: 300,
                actions: roleHarvester
            },
            'builder': {
                amount: 1,
                group: 0,
                groupcap: 4,
                parts: [WORK, WORK, CARRY, MOVE],
                cost: 300,
                actions: roleBuilder
            },
        };

        for (let role of Object.keys(roles)) {
            let census = _.filter(Game.creeps, (creep) => creep.memory.role == role);
            if (census.length < roles[role].amount) {
                let newName = role + Game.time;
                let memory = {role: role};

                memory.group = Math.floor(census.length / roles[role].groupcap);
                switch (role) {
                    case 'harvester':
                        memory.sourceid = sources[memory.group].id;
                        break;
                    case 'upgrader':
                }
                MYSPAWNER.spawnCreep(roles[role].parts, newName, {memory: memory});
            }
        }

        // Run creep roles
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            // Can pass extra variables to certain roles
            switch (creep.memory.role) {
                case 'harvester':
                    roles[creep.memory.role].actions.run(creep);
                    break;
                default:
                    roles[creep.memory.role].actions.run(creep);
            }
        }
    }


}