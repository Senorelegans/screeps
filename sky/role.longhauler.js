let tasks = require('tasks');

module.exports = {
    run: function(creep) {
        // toggle empty/full status
        if (creep.memory.mode == undefined) {
            creep.memory.mode = "filling";
        }
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.mode = "emptying";
        }

        const myRoom = Game.rooms["E24N53"];
        const remoteRoom = Game.rooms["E24N52"];
        const homePosition = new RoomPosition(40, 19, "E24N53"); // Left of home spawner
        const remoteRoomPos = new RoomPosition(13, 15, "E24N52"); // remote 
        
        switch (creep.memory.mode) {
            case "filling":
                if (remoteRoom == undefined) {
                    creep.memory.action = "heading out";
                    creep.moveTo(remoteRoomPos, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    let source = remoteRoom.find(FIND_SOURCES)[0];
                    if (tasks.mineSource(creep, source)) {
                        creep.memory.action = "mining";
                    }
                }
                break;
                
            case "emptying":
                const target = homePosition;
                // Drop resources next to spawner
                if (tasks.despoitNearestEnergy(creep)) {
                    creep.memory.action = "depositing";
                } else if (creep.pos.x == target.x && creep.pos.y == target.y) {
                    creep.memory.action = "dropping";
                    creep.drop(RESOURCE_ENERGY);
                    if (creep.ticksToLive < 1200) {
                        creep.memory.action = "renewing";
                        Game.spawns.Spawn1.renewCreep(creep);
                    } else {
                        creep.memory.mode = "filling";
                    }
                } else {
                    creep.moveTo(target);
                }
                break;
        }
	}
};