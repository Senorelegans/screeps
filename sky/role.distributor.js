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
                                creep.moveTo(container);
                            }
                            break;
                        }
                    }
                }
                break;
                
            case "emptying":
                creep.memory.action = "distributing";
                
                let target = undefined;
                
                // Check structures
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                if (targets.length > 0) {
                    target = targets[0];
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    return;
                }
                
                // Check for repairs
                const damaged = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                if (damaged.length > 0) {
                    damaged.sort((a,b) => a.hits - b.hits);
                    target = damaged[0];
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    return;
                }
                
                // Check building sites
                let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (sites.length > 0) {
                    target = sites[0];
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    return;
                }
                
                // Check room controller
                target = creep.room.controller;
                if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                break;
        }
//        creep.say(creep.memory.action);
	}
};