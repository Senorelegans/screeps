let tasks = require('tasks');

module.exports = {
    run: function(creep) {
        if (creep.memory.dropid == undefined) {
            creep.memory.dropid = Game.spawns.Spawn1.id;
        }
        let target = Game.getObjectById(creep.memory.dropid);

        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
            creep.memory.mode = "filling";
        }
        
        switch (creep.memory.mode) {
            case "filling":
                if (tasks.pickupDroppedFarthestFrom(creep, target.pos)) {
                    creep.memory.action = "picking up gil";
                } else if (tasks.withdrawFromContainers(creep)) {
                    creep.memory.action = "withdraw container";
                } else {
                    if (creep.carry.energy > 0) {
                        creep.memory.mode = "emptying";
                    } else {
                        creep.memory.action = "idling";
                    }
                }
                break;
                
            case "emptying":
                if (tasks.depositStorage(creep)) {
                    creep.memory.action = "deposit storage";
                } else {
                    creep.memory.action = "dropping";
                    if (tasks.goToWithin(creep, target.pos, 2)) {
                        creep.drop(RESOURCE_ENERGY);
                    }
                }
                break;
        }
	}
};