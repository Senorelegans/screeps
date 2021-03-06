let support = require('support');
let tasks = require('tasks');

module.exports = {
    run: function(creep) {


        // Get source from memory, and move toward it
        if (creep.memory.sourceid) {
            // Get source from memory
            let source = Game.getObjectById(creep.memory.sourceid);
            
            let movetarget = source;
            // If there is a container next to the source, move to it instead
            let tiles = creep.room.lookForAtArea(LOOK_STRUCTURES, ...support.getTLBR(source, 1), true);
            for (let tile of tiles) {
                if (tile.structure.structureType == "container" && tile.structure.energy < tile.structure.energyCapacity) {
                    movetarget = tile.structure.pos;
                }
            }
            // Attempt to harvest source
            let result = creep.harvest(source);
            // See how that goes
            switch (result) {
                case OK:
                    creep.memory.action = "mining";
                    return creep.pos;
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.memory.action = "moving";
                    creep.moveTo(movetarget, {reusePath: 50});
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.memory.action = "waiting for regen";
                    break;
                case ERR_BUSY:
                creep.memory.action = "spawning";
                    break;
                default:
                    console.log("Unhandled case in HyperMiner:", result);
            }
        } else {
            if (Memory.hyperminersource == undefined) {
                Memory.hyperminersource = 0;
            }
            let srcindex = Memory.hyperminersource;
            Memory.hyperminersource = (Memory.hyperminersource + 1) % creep.room.find(FIND_SOURCES).length;
            creep.memory.sourceid = creep.room.find(FIND_SOURCES)[srcindex].id;
        }
	}
};