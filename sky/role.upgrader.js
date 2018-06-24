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
                if (tasks.pickupDropped(creep)) {
                    creep.memory.action = "picking up gil";
                } else if (tasks.withdrawNearestEnergy(creep)) {
                    creep.memory.action = "withdrawing";
                } else if (tasks.mineNearestSource(creep)) {
                    creep.memory.action = "mining";
                } else {
                    creep.memory.action = "idling";
                }
                break;

            case "emptying":
                if (tasks.upgradeController(creep)) {
                    creep.memory.action = "upgrading";
                } else {
                    creep.memory.action = "idling";
                }
                break;
        }
	}
};