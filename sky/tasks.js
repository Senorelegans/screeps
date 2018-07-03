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
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure =>
            structure.structureType != STRUCTURE_WALL &&
            structure.structureType != STRUCTURE_RAMPART &&
            structure.hits < structure.hitsMax
        });
        if (target) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        } else {
            return false;
        }
    },

    repairClosestWalls: function(creep, maxHits = 300000) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure =>
            (structure.structureType == STRUCTURE_WALL ||
            structure.structureType == STRUCTURE_RAMPART) &&
            structure.hits < maxHits
        });
        if (target) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        } else {
            return false;
        }
    },

    repairWeakestWalls: function(creep, maxHits = 300000) {
        let targets = creep.room.find(FIND_STRUCTURES, {
            filter: structure =>
            (structure.structureType == STRUCTURE_WALL ||
            structure.structureType == STRUCTURE_RAMPART) &&
            structure.hits < maxHits
        });
        if (targets) {
            targets.sort(function(a,b) {
                return (a.hits > b.hits) ? 1 : ((b.hits > a.hits) ? -1 : 0);
            });
            let target = targets[0];
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

    
    robTombstones: function(creep) {
        if (creep.carry < creep.carryCapacity) {
            let container = creep.pos.findClosestByPath(FIND_TOMBSTONES);
            if (container) {
                for (let thing of Object.keys(container.store)) {
                    if (creep.withdraw(container, thing) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(container);
                    }
                }
                return true;
            } else {
                return false;
            }
        }
        return false;
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

    // Withdraws energy from the storage or nearest container
    // Returns true if picking up
    // Returns false if no containers with energy found
    withdrawNearestEnergy: function(creep) {
        let container = undefined;
        if (creep.room.storage && creep.room.storage.store.energy > 0) {
            container = creep.room.storage;
        } else {
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(structure) {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > (creep.carryCapacity - _.sum(creep.carry))
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

    // Withdraws energy from the nearest containers
    // Returns true if picking up
    // Returns false if no containers with energy found
    withdrawFromContainers: function(creep) {
        // First look for containers with enough to fill
        let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(structure) {
            return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > (creep.carryCapacity - _.sum(creep.carry))
        }});
        if (!container) {
            // Otherwise find any containers with energy
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: function(structure) {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0
            }});
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

    // Withdraws energy from the storage
    // Returns true if picking up
    // Returns false if no containers with energy found
    withdrawFromStorage: function(creep) {
        let container = creep.room.storage;
        if (container && container.store.energy > 0) {
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            return true;
        } else {
            return false;
        }
    },

    // Deposits energy to the storage or nearest container
    // Returns true if picking up
    // Returns false if no containers with energy found
    depositNearestEnergy: function(creep) {
        let container = undefined;
        if (creep.room.storage) {
            container = creep.room.storage;
        } else {
            container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure) {
                return (structure.structureType == STRUCTURE_CONTAINER && (structure.storeCapacity - structure.store[RESOURCE_ENERGY] > _.sum(creep.carry)))
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

    // Deposits energy to the storage or nearest container
    // Returns true if picking up
    // Returns false if no containers with energy found
    depositStorage: function(creep) {
        let container = creep.room.storage;
        if (container && _.sum(container.store) < container.storeCapacity) {
            for (let thing of Object.keys(creep.carry)) {
                if (creep.transfer(container, thing) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
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

    // Signs a room controller with a message
    // Returns result of signing
    signRoomController: function(creep, room, message) {
        let roomObject = Game.rooms[room];
        if (creep.room.name == room) {
            let result = creep.signController(roomObject.controller, message);
            switch (result) {
                case OK:
                    creep.memory.action = "signing controller";
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(roomObject.controller)
                    creep.memory.action = "moving toward controller";
                    break;
            }
            return result;
        } else {
            const route = Game.map.findRoute(creep.room, room);
            if(route.length > 0) {
                const exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
            }
            // creep.moveTo(new RoomPosition(25, 25, room));
            creep.memory.action = "moving to room";
            return ERR_NOT_IN_RANGE;
        }
    },
}