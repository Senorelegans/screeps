let support = require('support');

module.exports = {
    // Moves to a specified position
    // Returns true when position is reached, false otherwise
    goTo: function(creep, loc) {
        if (!creep.pos.isEqualTo(loc)) {
            creep.moveTo(loc);
            return false;
        } else {
            return true;
        }
    },

    // Moves to with a distance of a position
    // Returns true when position is reached, false otherwise
    goToWithin: function(creep, loc, distance) {
        if (!creep.pos.inRangeTo(loc, distance)) {
            creep.moveTo(loc);
            return false;
        } else {
            return true;
        }
    },

    // Transfers energy to spawns, extensions, and towers
    supplySpawns: function(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity;
            }
        });
        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        } else {
            return false;
        }
    },

    repairStructures: function(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: structure => structure.hits < structure.hitsMax});
        if (target) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        } else {
            return false;
        }
    },

    buildStructures: function(creep) {
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
            if(creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        } else {
            return false;
        }
    },
    
    upgradeController: function(creep) {
        let target = creep.room.controller;
        if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return true;
    },

    // Picks up resources laying around
    // Returns true if picking up
    // Returns false if no energy on ground
    pickupDropped: function(creep) {
        const junk = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (junk) {
            if (creep.pickup(junk) == ERR_NOT_IN_RANGE) {
                creep.moveTo(junk);
            }
            return true;
        } else {
            return false;
        }
    },

    // Picks up resources laying around
    // Returns true if picking up
    // Returns false if no energy on ground
    pickupDroppedFarthestFrom: function(creep, pos) {
        let junk = creep.room.find(FIND_DROPPED_RESOURCES);
        junk = support.sortBy(junk, pos.getRangeTo.bind(pos), "pos", false)
        if (junk) {
            junk = junk[0];
            if (creep.pickup(junk) == ERR_NOT_IN_RANGE) {
                creep.moveTo(junk);
            }
            return true;
        } else {
            return false;
        }
    },

    // Withdraws energy from the nearest container
    // Returns true if picking up
    // Returns false if no containers with energy found
    withdrawNearestEnergy: function(creep) {
        let container = undefined;
        if (creep.room.storage && creep.room.storage.store.energy > 0) {
            container = creep.room.storage;
        } else {
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(structure) {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > (creep.carry.energyCapacity - creep.carry.energy)
            }});
            if (!container) {
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(structure) {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0
                }});
            }
        }
        if (container) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            return true;
        } else {
            return false;
        }
    },

    // Deposits energy to the nearest container
    // Returns true if picking up
    // Returns false if no containers with energy found
    depositNearestEnergy: function(creep) {
        let container = undefined;
        if (creep.room.storage) {
            container = creep.room.storage;
        } else {
            container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure) {
                return (structure.structureType == STRUCTURE_CONTAINER && (structure.storeCapacity - structure.store[RESOURCE_ENERGY] > creep.carry.energy))
            }});
            if (!container) {
                container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER && (structure.storeCapacity - structure.store[RESOURCE_ENERGY] > 0))
                }});
            }
        }
        if (container) {
            if (module.exports.goTo(creep, container)) {
                creep.drop(RESOURCE_ENERGY);
            }
            return true;
        } else {
            return false;
        }
    },

    // Mines the nearest source
    // Returns true if mining
    // Returns false if no sources found
    mineNearestSource: function(creep) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            let result = module.exports.mineSource(creep, source);
            return true;
        } else {
            return false;
        }
    },

    // Mines a specified source
    // Returns result of mining
    mineSource: function(creep, source) {
        // Attempt to harvest source
        let result = creep.harvest(source);
        // See how that goes
        switch (result) {
            case OK:
                creep.memory.action = "mining";
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.action = "moving toward source";
                creep.moveTo(source);
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                creep.memory.action = "waiting for source to regenerate";
                break;
            case ERR_BUSY:
                creep.memory.action = "spawning";
                break;
            default:
                console.log("Unhandled case in tasks.mineSource:", result);
        }
        return result;
    },

}