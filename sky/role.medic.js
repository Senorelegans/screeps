module.exports = {
    run: function(creep) {
        // creep.say("healy");

        creep.moveTo(38, 21);
        
        let triage = function(targets) {
            let healtarget = targets[0];
            let movetarget = targets[0];
            for (let target of targets) {
                if (target.hits / target.hitsMax < movetarget.hits / movetarget.hitsMax) {
                    movetarget = target;
                    if (creep.pos.getRangeTo(target) <= 1) {
                        if (target.hits / target.hitsMax < healtarget.hits / healtarget.hitsMax) {
                            healtarget = target;
                        }
                    }
                }
            }
            creep.heal(healtarget);
            if (movetarget.hits != movetarget.hitsMax) {
                creep.moveTo(movetarget);
            }
        }

        const friendlies = creep.room.find(FIND_MY_CREEPS);
        triage(friendlies);
	}
};