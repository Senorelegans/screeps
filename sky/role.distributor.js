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
                let container = "";     // FIND CONTAINER
                creep.memory.action = "withdrawing";
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                break;
                
            case "emptying":
                if (Game.spawns['Spawn1'].energy < 300) {
                    const spawn = Game.spawns['Spawn1'];
                    creep.memory.action = "supplying";
                    if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else if (creep.room.find(FIND_CONSTRUCTION_SITES).length) {
                    let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    let target = targets[0];
                    creep.memory.action = "building";
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    let controller = creep.room.controller;
                    creep.memory.action = "upgrading";
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                break;
        }
//        creep.say(creep.memory.action);
	}
};