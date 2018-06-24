module.exports = {
    run: function(creep) {
        // creep.say("*grunt*");
        
        // Rally to most recent flag
        const flags = creep.room.find(FIND_FLAGS);
        if (flags.length > 0) {
            // flags[flags.length-1].color == 1
            // flags[flags.length-1].secondarycolor == 1
            creep.moveTo(flags[flags.length-1]);
        }

        let chase = function(target) {
            let result = creep.attack(target);
            if (result = ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }

        let fight = function(targets) {
            let hittarget = targets[0];
            let movetarget = targets[0];
            for (let target of targets) {
                if (target.hits < movetarget.hits) {
                    movetarget = target;
                    if (creep.pos.getRangeTo(target) <= 1) {
                        if (target.hits < hittarget.hits) {
                            hittarget = target;
                        }
                    }
                }
            }
            creep.attack(hittarget);
            creep.moveTo(movetarget);
        }

        const a = Game.creeps["archer7323793"];
        // chase(a);

        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            fight(hostiles);
        }
	}
};