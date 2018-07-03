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

        const myRoom = Game.rooms["E27N53"];
        const remoteRoom = Game.rooms["E28N53"];
        const homePosition = new RoomPosition(27, 21, "E27N53"); // Top of home spawner
        const remoteRoomPos = new RoomPosition(45, 27, "E28N53"); // remote 
        
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
                if (false) {

                } else if (creep.carry.energy == 0) {
                    if (creep.ticksToLive < 1000) {
                        if (tasks.goTo(target)) {
                            creep.memory.action = "renewing";
                            Game.spawns.Spawn1.renewCreep(creep);
                        }
                    } else {
                        creep.memory.mode = "filling";
                    }
                } else if (tasks.depositStorage(creep)) {
                    creep.memory.action = "deposit storage";
                } else if (tasks.depositNearestEnergy(creep)) {
                    creep.memory.action = "deposit nearest";
                } else if (creep.pos.x == target.x && creep.pos.y == target.y) {
                    creep.drop(RESOURCE_ENERGY);
                    creep.memory.action = "dropping";
                } else {
                    creep.moveTo(target);
                }
                break;
        }
	}
};