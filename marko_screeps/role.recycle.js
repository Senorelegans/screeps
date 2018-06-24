module.exports = {
    run: function(creep) {
        let spawn = Game.spawns['Spawn1'];
        if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
            creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
        }
	}
};