let support = require('support');
let roleHarvester = require('role.harvester');
let roleRecycle = require('role.recycle');
let roleBuilder = require('role.builder');
let roleHyperMiner = require('role.hyperminer');
// let roleDistributor = require('role.distributor');
let roleUpgrader = require('role.upgrader1');
let roleUpgrader2 = require('role.upgrader2');


module.exports = {

    creeps2: function(MYSPAWNER, sources,extensions) {

        // Names for units
        support.erasedead();

        var hyperamount = 0


        // add hyperminers if over 5 extensions
        if (extensions.length >= 5) {
            hyperamount = sources.length;
        }


        // Creep census
        let roles = {
            'recycle': {amount: 0,              groupcap: 1, actions: roleRecycle},
            'hyperminer': {amount:hyperamount,  groupcap: 1, parts: [WORK,WORK,WORK,WORK,WORK,MOVE], cost:550, actions:roleHyperMiner},
            'builder': {amount: 2,              groupcap: 2, parts: [WORK, WORK, CARRY, MOVE], cost: 300, actions: roleBuilder},
            'upgrader': {amount: 4,             groupcap: 2, parts: [WORK, WORK, CARRY, MOVE], cost: 300, actions: roleUpgrader},
            'harvester': {amount: 2,            groupcap: 2, parts: [WORK, WORK, CARRY, MOVE], cost: 300, actions: roleHarvester},

        };

        // Spawn
        for (let role of Object.keys(roles)) {
            var census = _.filter(Game.creeps, (creep) => creep.memory.role == role);
            if (census.length < roles[role].amount) {
                var newName = role + Game.time;
                let memory = {role: role};

                memory.group = Math.floor(census.length / roles[role].groupcap);



                switch (role) {
                    case 'upgrader':
                    case 'harvester':
                    case 'builder':
                    case 'hyperminer':
                        memory.sourceid = sources[memory.group].id;
                        memory.spawnid = MYSPAWNER.id;
                        break;
                }
                MYSPAWNER.spawnCreep(roles[role].parts, newName, {memory: memory})
            }
        }

        // Run creep roles
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            switch (creep.memory.role) {
                case "upgrader":
                case 'harvester':
                case 'builder':
                case 'hyperminer':
                    roles[creep.memory.role].actions.run(creep);
                    break;
                default:
                    roles[creep.memory.role].actions.run(creep);
            }
        }
    }

}











    // creeps2: function(MYSPAWNER, sources) {
    //     const extensions = MYSPAWNER.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_EXTENSION }});
    //
    //
    //
    //
    //     //Creep census
    //     let roles = {
    //         'recycle': {amount: 0, actions: roleRecycle},
    //         // 'upgrader': {amount: 3, group: 3, groupcap: 1, parts: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE], cost: 550, actions: roleUpgrader1},
    //         'upgrader1': {amount: 3, group: 3, groupcap: 1, parts: [WORK, WORK, CARRY, MOVE], cost: 550, actions: roleUpgrader1},
    //         // 'builder': {amount: 5, group: 0,groupcap: 5, parts: [WORK, WORK, CARRY, MOVE], cost: 300, actions: roleBuilder},
    //         'harvester': {amount: 5, group: 0, groupcap: 5, parts: [WORK, WORK, CARRY, MOVE], cost: 300, actions: roleHarvester},
    //
    //     };
    //
    //     // if (extensions >= 5 ) {
    //     //     // roles.push({ key:'hyperminer', value: {amount:0, group:1, parts: [WORK,WORK,WORK,WORK,WORK,MOVE], cost:550, actions:roleHyperMiner} });
    //     //     roles.push({ key:'hyperminer', value: {amount:0, group:1, parts: [WORK,WORK,WORK,MOVE], cost:550, actions:roleHyperMiner} });
    //     // }
    //
    //
    //     for (let role of Object.keys(roles)) {
    //         let census = _.filter(Game.creeps, (creep) => creep.memory.role == role);
    //
    //         // if (roles[role] == "builder" && extensions > 5) {
    //         //     roles[role].amount = 0; // stop making builders if over 5 extensions
    //         // }
    //         //
    //         // if (roles[role] == "hyperminer" && extensions >= 4) {
    //         //     roles[role].amount = (sources.length); // Make as many miners as sources
    //         // }
    //
    //
    //         if (census.length < roles[role].amount) {
    //             let newName = role + Game.time;
    //             let memory = {role: role};
    //             memory.group = Math.floor(census.length / roles[role].groupcap);
    //             switch (role) {
    //                 case "upgrader1":
    //                 case 'harvester':
    //                     memory.sourceid = sources[memory.group].id;
    //                     memory.spawnid = MYSPAWNER.id;
    //                     break;
    //                 case 'builder':
    //                     memory.sourceid = sources[memory.group].id;
    //             }
    //             MYSPAWNER.spawnCreep(roles[role].parts, newName, {memory: memory});
    //         }
    //     }
    //
    //
    //     // Run creep roles
    //     for (let name in Game.creeps) {
    //         let creep = Game.creeps[name];
    //         // Can pass extra variables to certain roles
    //         switch (creep.memory.role) {
    //             case "upgrader1":
    //             case 'harvester':
    //                 roles[creep.memory.role].actions.run(creep);
    //                 break;
    //             case 'builder':
    //                 roles[creep.memory.role].actions.run(creep);
    //             default:
    //                 roles[creep.memory.role].actions.run(creep);
    //         }
    //     }
    // }