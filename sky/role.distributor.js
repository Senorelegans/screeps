let tasks = require('tasks');

module.exports = {
    run: function(creep) {
        
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        } else if (creep.carry.energy == 0) {
            creep.memory.mode = "filling";
        }
        
        switch (creep.memory.mode) {
            case "filling":
                if (tasks.pickupDropped(creep)) {
                    creep.memory.action = "picking up gil";
                } else if (tasks.withdrawNearestEnergy(creep)) {
                    creep.memory.action = "withdrawing";
                } else if (tasks.mineNearestSource(creep)) {
                    creep.memory.action = "mining";
                } else {
                    creep.memory.action = "stalling";
                }
                break;
                
            case "emptying":
                creep.memory.action = "distributing";
                
                let target = undefined;
                
                // Check structures
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                if (targets.length > 0) {
                    target = targets[0];
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    return;
                }
                
                // Check for repairs
                const damaged = creep.room.find(FIND_STRUCTURES, {filter: object => object.hits < object.hitsMax});
                if (damaged.length > 0) {
                    damaged.sort((a,b) => a.hits - b.hits);
                    target = damaged[0];
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    return;
                }
                
                // Check building sites
                let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (sites.length > 0) {
                    target = sites[0];
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    return;
                }
                
                // Check room controller
                target = creep.room.controller;
                if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                break;
        }
//        creep.say(creep.memory.action);
	}
};