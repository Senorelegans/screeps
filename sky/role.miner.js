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
                if (tasks.mineNearestSource(creep)) {
                    creep.memory.action = "mining";
                } else {
                    if (_.sum(creep.carry) > 0) {
                        creep.memory.mode = "emptying";
                    } else {
                        creep.memory.action = "idling";
                    }
                }
                break;
                
            case "emptying":
                if (tasks.depositNearestEnergy(creep)) {
                    creep.memory.action = "depositing";
                } else {
                    creep.memory.action = "dropping";
                    creep.drop(RESOURCE_ENERGY);
                }
                break;
        }
	}
};