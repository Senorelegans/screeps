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
                creep.memory.action = "distributing";
                
                let target = undefined;
                
                // Check spawn
                const spawn = Game.spawns['Spawn1']
                if (spawn.energy < spawn.energyCapacity) {
                    target = spawn;
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
                
                // Check extensions
                for (let structure of creep.room.find(FIND_MY_STRUCTURES)) {
                    if (structure.structureType == STRUCTURE_EXTENSION) {
                        if (structure.energy < structure.energyCapacity) {
                            target = structure;
                            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                            return;
                        }
                    }
                }
        }
//        creep.say(creep.memory.action);
	}
};