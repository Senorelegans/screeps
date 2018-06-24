module.exports = {
    run: function(creep) {
        // toggle empty/full status
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
            creep.memory.mode = "filling";
        }
        
        switch (creep.memory.mode) {
            case "filling":
                let source = Game.getObjectById(creep.memory.sourceid);
                creep.memory.action = "mining";
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                break;
                
            case "emptying":
                let container = Game.getObjectById(creep.memory.containerid);
                creep.memory.action = "depositing";
                let result = creep.transfer(container, RESOURCE_ENERGY);
                switch (result) {
                    case OK:
                        break;
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                        break;
                    case ERR_FULL:
                        creep.drop(RESOURCE_ENERGY);
                        break;
                    default:
                        console.log("Unhandled case in Miner:", result);
                }
                break;
        }
//        creep.say(creep.memory.action);
	}
};