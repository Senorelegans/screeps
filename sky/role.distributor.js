module.exports = {
    run: function(creep, tombstones) {
        // toggle empty/full status
        
        if (tombstones.length > 0) {
//            console.log("Tombstones:");
//            console.log(JSON.stringify(tombstones));
        }
        
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
                creep.memory.action = "distributing";
                let targets = [];
                // Check spawn
                const spawn = Game.spawns['Spawn1']
                if (spawn.energy < spawn.energyCapacity) {
                    targets.push(spawn);
                }
                // Check extensions
                for (let structure of creep.room.find(FIND_MY_STRUCTURES)) {
                    if (structure.structureType == STRUCTURE_EXTENSION) {
                        if (structure.energy < structure.energyCapacity) {
                            targets.push(structure);
                        }
                    }
                }
                // Check building sites
                let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
                for (let site of sites) {
                    targets.push(site);
                }
                // Check room controller
                targets.push(creep.room.controller);
                // Do first target
                let target = targets[0];
//                console.log(creep.build(target));
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                break;
        }
//        creep.say(creep.memory.action);
	}
};