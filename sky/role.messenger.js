let tasks = require('tasks');

module.exports = {
    run: function(creep) {
        const home = new RoomPosition(36, 22, "E24N53"); // Home base
        const luke = new RoomPosition(5, 2, "E23N54"); // Luke's base
        let target = luke;
        if (creep.pos.x != target.x || creep.pos.y != target.y) {
            creep.moveTo(luke, {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            creep.move(Math.random() * 8);
        }
    }
};