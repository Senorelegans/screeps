let tasks = require('tasks');

module.exports = {
    run: function(creep) {
        if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (_.sum(creep.carry) == 0) {
            creep.memory.mode = "filling";
        }
        
        switch (creep.memory.mode) {
            case "filling":
                if (false) {

                // } else if (tasks.pickupDropped(creep)) {
                //     creep.memory.action = "picking up gil";
                } else if (tasks.withdrawFromStorage(creep)) {
                    creep.memory.action = "withdraw storage"
                } else if (tasks.withdrawFromContainers(creep)) {
                    creep.memory.action = "withdraw container";
                // } else if (tasks.mineNearestSource(creep)) {
                //     creep.memory.action = "mining";
                } else {
                    if (_.sum(creep.carry) > 0) {
                        creep.memory.mode = "emptying";
                    } else {
                        creep.memory.action = "idling";
                    }
                }
                break;
                
            case "emptying":
                if (false) {

                } else if (tasks.buildStructures(creep)) {
                    creep.memory.action = "building";
                } else if (tasks.repairWeakestWalls(creep)) {
                    creep.memory.action = "walling weakest";
                } else if (tasks.repairStructures(creep)) {
                    creep.memory.action = "repairing";
                } else {
                    if (_.sum(creep.carry) < creep.carryCapacity) {
                        creep.memory.mode = "filling";
                    } else {
                        creep.memory.action = "idling";
                    }
                }
                break;
        }
	}
};