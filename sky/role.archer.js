let support = require('support');

module.exports = {
    run: function(creep) {
        // creep.say("pew pew");

        // Rally to most recent flag
        const flags = creep.room.find(FIND_FLAGS);
        if (flags.length > 0) {
            // flags[flags.length-1].color == 1
            // flags[flags.length-1].secondarycolor == 1
            creep.moveTo(flags[flags.length-1]);
        }
        
        // console.log(JSON.stringify(creep.room.lookForAt(LOOK_STRUCTURES, 35, 20)));

        let kite = function(target) {
            let result = creep.rangedAttack(target);
            switch (result) {
                case OK:
                    let range = creep.pos.getRangeTo(target);
                    if (range < 30) {
                        let hostiledir = creep.pos.getDirectionTo(target);
                        let escapedir = undefined;
                        const maxloops = 8;
                        let loops = 0;
                        let shift = 0;
                        while (escapedir == undefined && loops < maxloops) {
                            let potentialdir = ((hostiledir + 3 + shift) % 8) + 1;
                            const x = creep.pos.x + support.dir[potentialdir].dx;
                            const y = creep.pos.y + support.dir[potentialdir].dy;
                            if (creep.room.lookForAt(LOOK_TERRAIN, x, y) != "wall") {
                                if (creep.room.lookForAt(LOOK_CREEPS, x, y).length == 0) {
                                    if (creep.room.lookForAt(LOOK_STRUCTURES, x, y).filter(structure => structure.structureType != "road").length == 0) {
                                        escapedir = potentialdir;
                                    }
                                }
                            }
                            shift *= -1;
                            if (shift >= 0) {
                                shift++;
                            }
                            loops++;
                        }
                        creep.say(support.dir[escapedir].name);
                        creep.move(escapedir);
                    }
                    break;
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
            }
        }

        let g = Game.creeps["grunt7323834"];
        // kite(g);

        let hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            hostiles.sort(function(a,b) {
                return (creep.pos.getRangeTo(a) > creep.pos.getRangeTo(b)) ? 1 : ((creep.pos.getRangeTo(b) > creep.pos.getRangeTo(a)) ? -1 : 0);
            });
            kite(hostiles[0]);
        }
    }
};