let support = require('support');
let tasks = require('tasks');

module.exports = {
    run: function(creep) {

        // let getTilesInArea = function(target, radius, pattern, asArray, OFFSET_X, OFFSET_Y) {

        //     var pos = target.pos;
        //     x = pos.x + OFFSET_X;
        //     y = pos.y + OFFSET_Y;
    
        //     let TOP = y - radius;
        //     let LEFT = x - radius;
        //     let BOTTOM = y + radius;
        //     let RIGHT = x + radius;
        //     let W = RIGHT - LEFT;
        //     let H =  BOTTOM - TOP;
        //     let AREA = target.room.lookAtArea(TOP, LEFT, BOTTOM, RIGHT, asArray);
    
        //     target.room.visual.text("M", x, y, {align: 'center', opacity: 0.5} );
        //     switch (pattern) {
        //         case "none":
        //             console.log(pattern);
        //             return AREA;
    
        //         case "checkerboard":
        //             A = [];
        //             for (y = TOP; y <= BOTTOM; y++) {
        //                 for (x = LEFT; x <= RIGHT; x++) {
        //                     let tile = AREA[y][x];
        //                     num = (x + y) % 2;
        //                     if (num == 0) {
        //                         target.room.visual.text("C", x, y, {align: 'center', opacity: 0.2} );
        //                         tile.x = x;
        //                         tile.y = y;
        //                         A.push(tile);
        //                     }
        //                 }
        //             }
        //             return A;
        //     }
        // };
        // let AREA = getTilesInArea(Game.spawns.Spawn1, 2, 'checkerboard', false, -3,2);
        // for (tile in AREA) {
        //     x = AREA[tile].x;
        //     y = AREA[tile].y;
        //     creep.room.visual.text("X", x, y, {align: 'center', opacity: 0.2} );
        // }


        // Get source from memory, and move toward it
        if (creep.memory.sourceid) {
            let source = Game.getObjectById(creep.memory.sourceid);
            if (creep.memory.worktarget) {

            }
            let movetarget = source;
            // If there is a container next to the source, move to it instead
            let tiles = creep.room.lookForAtArea(LOOK_STRUCTURES, ...support.getTLBR(source, 1), true);
            for (let tile of tiles) {
                if (tile.structure.structureType == "container") {
                    movetarget = tile.structure.pos;
                }
            }
            // Attempt to harvest source
            let result = creep.harvest(source);
            // See how that goes
            switch (result) {
                case OK:
                    creep.memory.action = "mining";
                    return creep.pos;
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.memory.action = "moving";
                    creep.moveTo(movetarget, {visualizePathStyle: {stroke: '#ffffff'}});
                    break;
                case ERR_NOT_ENOUGH_RESOURCES:
                    creep.memory.action = "waiting for regen";
                    break;
                case ERR_BUSY:
                creep.memory.action = "spawning";
                    break;
                default:
                    console.log("Unhandled case in HyperMiner:", result);
            }
        }
	}
};