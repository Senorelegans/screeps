var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {


        // if creep is bringing energy to the room controller but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }

        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the builder
        if (creep.memory.working == true) {
            // try to transfer energy, if the spawn is not in range
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }

        else {
            // find closest source
            //var source = creep.pos.findClosestByPath(FIND_SOURCES);

            // using 2nd source of room
            var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);


            // // try to harvest energy, if the source is not in range
            // if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //     // move towards the source
            //     creep.travelTo(source);
            }

        }
    }
};

module.exports = roleUpgrader;