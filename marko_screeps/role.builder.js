module.exports = {
    run: function(creep) {
        // toggle empty/full status


        const extensions = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
        // console.log(RCL);

        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
            creep.memory.mode = "filling";
        } else if (extensions.length > 5) {
            creep.memory.mode = "recycle";
        }



        switch (creep.memory.mode) {
            case "filling":
                const gil = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
                if (gil) {
                    if (creep.pickup(gil) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(gil);
                        return;
                    }
                } else {
                    let source = Game.getObjectById(creep.memory.sourceid);
                    creep.memory.action = "mining";
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
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
                    creep.upgradeController(creep.room.controller);
                }
                break;

            case "recycle":
                creep.memory.role = "recycle";
                if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }
        }
//        creep.say(creep.memory.action);
    }
};