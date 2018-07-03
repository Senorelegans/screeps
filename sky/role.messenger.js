let tasks = require('tasks');

module.exports = {
    run: function(creep) {

        // Nav to room
        // const home = new RoomPosition(36, 22, "E24N53"); // Home base
        // const luke = new RoomPosition(5, 2, "E23N54"); // Luke's base

        // Go somewhere and dance
        // let target = luke;
        // if (tasks.goTo(creep, target)) {
        //     creep.move(Math.random() * 8); // Dance
        // } else {
        //     creep.memory.action = "travelling";
        // }

        // Write room message
        // let result = tasks.signRoomController(creep, Game.rooms.E27N53, "This is my room. There are many like it, but this one is mine.");
        // let result = tasks.signRoomController(creep, "E29N54", "AYYYYYYYYYYYY");
        let result = tasks.signRoomController(creep, "E28N53", "Mining outpost");
        switch (result) {
            case OK:
                creep.say("signed");
                break;
        }
    }
};