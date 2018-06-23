module.exports = {
    run: function(creep) {
        // toggle empty/full status
        
        if (creep.carry.energy == creep.carryCapacity) {
//            console.log("I should be emptying");
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
//            console.log("I should be filling");
            creep.memory.mode = "filling";
        }
//        console.log("I am", creep.memory.mode);
        
        switch (creep.memory.mode) {
            case "filling":
                let container = Game.getObjectById(creep.memory.containerid);
                creep.memory.action = "withdrawing";
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
//                    console.log(creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}}));
                }
                break;
                
            case "emptying":
//                console.log("I am emptying");
                if (Game.spawns['Spawn1'].energy < 300) {
                    const spawn = Game.spawns['Spawn1'];
                    creep.memory.action = "supplying";
                    if(creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
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