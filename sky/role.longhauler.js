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
        const remoteRoomPos = new RoomPosition(13, 15, "E24N52");
        
        switch (creep.memory.mode) {
            case "filling":
                if (remoteRoom == undefined) {
                    creep.moveTo(remoteRoomPos, {visualizePathStyle: {stroke: '#ffffff'}});
                } else {
                    let source = remoteRoom.find(FIND_SOURCES)[0];
                    creep.memory.action = "mining";
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                break;
                
            case "emptying":
                creep.memory.action = "dropping and renewing";
                const target = new RoomPosition(40, 18, "E24N53"); // Home spawner
                if (creep.pos.x == target.x && creep.pos.y == target.y) {
                    creep.drop(RESOURCE_ENERGY);
                    if (creep.ticksToLive < 1200) { // Renew creep
                        Game.spawns.Spawn1.renewCreep(creep);
                    } else {
                        creep.memory.mode = "filling";
                    }
                } else {
                    creep.moveTo(target);
                }
                // let target = myRoom.controller;
                // if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
                //     creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                // }
                break;
        }
//        creep.say(creep.memory.action);
	}
};