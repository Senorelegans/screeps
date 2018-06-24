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

    // Picks up energy laying around
    // Returns true if picking up
    // Returns false if no energy on ground
    pickupNearestEnergy: function(creep) {
        const gil = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (gil) {
            if (creep.pickup(gil) == ERR_NOT_IN_RANGE) {
                creep.moveTo(gil);
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
        // let containers = creep.room.find(FIND_STRUCTURES).filter(structure => structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0);
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(structure) {
            return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy > 0
        }});
        if (container) {
            // Get closest one
            // containers = support.sortBy(containers, creep.pos.getRangeTo.bind(creep.pos), "pos");
            // const container = containers[0];
            if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container);
            }
            return true;
        } else {
            return false;
        }
    },

    // Mines the nearest source
    // Returns result of mining
    // Returns false if no sources found
    mineNearestSource: function(creep) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source) {
            return exports.mineSource(creep, source);
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
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
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