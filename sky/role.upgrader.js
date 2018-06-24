module.exports = {
    run: function(creep, tombstones) {
        
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
            creep.memory.mode = "filling";
        }
        
        switch (creep.memory.mode) {
            case "filling":
                const gil = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (gil) {
                    creep.memory.action = "picking up gold";
                    if (creep.pickup(gil) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(gil);
                        return;
                    }
                } else {
                    for (let c of creep.memory.containerids) {
                        let container = Game.getObjectById(c);
                        if (c.energy > 0) {
                            creep.memory.action = "withdrawing";
                            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                            break;
                        }
                    }
                }
                break;

            case "emptying":
                creep.memory.action = "upgrading";
                let target = creep.room.controller;
                if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                break;
        }
	}
};