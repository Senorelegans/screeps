let tasks = require('tasks');

module.exports = {
    run: function(creep) {
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
            creep.memory.mode = "filling";
        }
        
        switch (creep.memory.mode) {
            case "filling":
                if (tasks.mineNearestSource(creep)) {
                    creep.memory.action = "mining";
                } else {
                    creep.memory.action = "idling";
                }
                break;
                
            case "emptying":
                if (tasks.despoitNearestEnergy(creep)) {
                    creep.memory.action = "depositing";
                } else {
                    creep.memory.action = "dropping";
                    creep.drop(RESOURCE_ENERGY);
                }
                break;
        }
	}
};