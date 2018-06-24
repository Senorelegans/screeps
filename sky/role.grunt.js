module.exports = {
    run: function(creep) {
        // creep.say("*grunt*");
        
        creep.moveTo(46, 20);

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