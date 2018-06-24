module.exports = {
    run: function(creep) {
        // toggle empty/full status
        const extensions = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
        RCL = creep.room.controller.level;

        // console.log(RCL);


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
                let target = undefined;
                
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
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    return;
                }
                break;
        }
	}
};