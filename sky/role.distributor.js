module.exports = {
    run: function(creep, tombstones) {
        // toggle empty/full status
        
//        if (tombstones.length > 0) {
//            for (let tombstone of tombstones) {
//                if (tombstone.store.energy) {
//                    if (tombstone.store.energy > 0) {
//                        if(creep.pickup(tombstone) == ERR_NOT_IN_RANGE) {
//                            creep.moveTo(tombstone, {visualizePathStyle: {stroke: '#ffffff'}});
//                            return;
//                        }
//                    }
//                }
//            }
//        }
        
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
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
                
                // Check room controller
                target = creep.room.controller;
                if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                break;
        }
//        creep.say(creep.memory.action);
	}
};