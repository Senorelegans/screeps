let tasks = require('tasks');

module.exports = {
    run: function(creep, tombstones) {
        
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
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
                    if (creep.carry.energy > 0) {
                        creep.memory.mode = "emptying";
                    } else {
                        creep.memory.action = "idling";
                    }
                }
                break;

            case "emptying":
                if (tasks.upgradeController(creep)) {
                    creep.memory.action = "upgrading";
                } else {
                    if (creep.carry.energy < creep.carryCapacity) {
                        creep.memory.mode = "filling";
                    } else {
                        creep.memory.action = "idling";
                    }
                }
                break;
        }
	}
};