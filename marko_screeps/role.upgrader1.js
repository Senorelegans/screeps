tasks = require("tasks");

module.exports = {
    run: function(creep, tombstones) {
        
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
            creep.memory.mode = "filling";
        }
        
        switch (creep.memory.mode) {
            case "filling":
                tasks.mineClosestSource(creep);
                break;

            case "emptying":
                tasks.upgradeController(creep);
                break;
        }
	}
};