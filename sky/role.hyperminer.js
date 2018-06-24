module.exports = {
    run: function(creep) {
        let source = Game.getObjectById(creep.memory.sourceid);
        let result = creep.harvest(source);
        switch (result) {
            case OK:
                return creep.pos;
                break;
            case ERR_NOT_IN_RANGE:
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
            case ERR_NOT_ENOUGH_RESOURCES:
                break;
            default:
                console.log("Unhandled case in HyperMiner:", result);
        }
	}
};