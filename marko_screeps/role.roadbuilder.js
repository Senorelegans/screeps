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
                let sources = creep.room.find(FIND_SOURCES);
                let source = sources[0];
                creep.memory.action = "mining";
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                break;
                
            case "emptying":
                // Make list of important sites to network
                let importantsites = [
                    Game.spawns['Spawn1'].pos,
                    creep.room.controller.pos,
                    creep.room.find(FIND_SOURCES)[0].pos,
                ];
                
                // Map out roads between all important sites
                for (let i = 0; i < importantsites.length; i++) {
                    for (let j = i+1; j < importantsites.length; j++) {
                        let path = creep.room.findPath(importantsites[i], importantsites[j]);
                        for (let pos of path) {
                            const tile = creep.room.getPositionAt(pos.x, pos.y);
                            if (tile.lookFor(LOOK_STRUCTURES).length == 0 && tile.lookFor(LOOK_CONSTRUCTION_SITES).length == 0) {
//                                console.log('placing construction site at', pos.x, ',', pos.y);
                                creep.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
                            }
                        }
                    }
                }
                
                // Build construction sites
                let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                let target = targets[0];
                creep.memory.action = "building";
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                
                break;
        }
	}
};