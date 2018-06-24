let support = require('support');

module.exports = {
    run: function(creep) {
        // Get source from memory, and move toward it
        let source = Game.getObjectById(creep.memory.sourceid);
        let movetarget = source;
        // If there is a container next to the source, move to it instead
        let tiles = creep.room.lookForAtArea(LOOK_STRUCTURES, ...support.getTLBR(source, 1), true);
        for (let tile of tiles) {
            if (tile.structure.structureType == "container") {
                movetarget = tile.structure.pos;
            }
        }
        // Attempt to harvest source
        let result = creep.harvest(source);
        // See how that goes
        switch (result) {
            case OK:
                creep.memory.state = "mining";
                return creep.pos;
                break;
            case ERR_NOT_IN_RANGE:
                creep.memory.state = "moving";
                creep.moveTo(movetarget, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                creep.memory.state = "waiting for regen";
                break;
            case ERR_BUSY:
            creep.memory.state = "spawning";
                break;
            default:
                console.log("Unhandled case in HyperMiner:", result);
        }
	}
};