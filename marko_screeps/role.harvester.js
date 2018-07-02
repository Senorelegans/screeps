let tasks = require("tasks");

module.exports = {
    run: function (creep, MYSPAWN) {
        // toggle empty/full status
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
            creep.memory.mode = "filling";
        }

        switch (creep.memory.mode) {
            case "filling":
                tasks.mineSource(creep);
                break;

            case "emptying":
                if (tasks.checkSpawn(creep) == true) {
                    tasks.fillSpawn(creep, MYSPAWN);
                }
                else {
                    tasks.buildSites(creep)
                }


        }
    }
}


                // // Check extensions
                // for (let structure of creep.room.find(FIND_MY_STRUCTURES)) {
                //     if (structure.structureType == STRUCTURE_EXTENSION) {
                //         if (structure.energy < structure.energyCapacity) {
                //             targets.push(structure);
                //         }
                //     }
                // }
                // // Check building sites
                // let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
                // for (let site of sites) {
                //     targets.push(site);
                // }
                // Check room controller
                // targets.push(creep.room.controller);
                // Do first target
//                 let target = targets[0];
// //                console.log(creep.build(target));
//                 if(creep.build(target) == ERR_NOT_IN_RANGE) {
//                     creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
//                 }
//                 if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//                     creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
//                 }
//                 if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
//                     creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
//                     creep.upgradeController(creep.room.controller);
//                 }
//                 break;
//         }
//        creep.say(creep.memory.action);
// 	}
// };