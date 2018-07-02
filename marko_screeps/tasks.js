let support = require("support");

module.exports = {

    moveOver: function(creep, pos){
        creep.memory.action = "moving";
    },


    mineClosestSource: function(creep) {
        let sources = creep.room.find(FIND_SOURCES);
        var closest = creep.pos.findClosestByPath(sources);
        creep.memory.action = "mining closest resource";
        if (creep.harvest(closest) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closest, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },


    mineSource: function(creep) {
        let source = Game.getObjectById(creep.memory.sourceid);
        creep.memory.action = "mining";
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    getGold: function(creep) {
        const gil = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (creep.pickup(gil) == ERR_NOT_IN_RANGE) {
            creep.moveTo(gil);
        }
    },


    checkSpawn: function(creep) {
        let MYSPAWN = Game.getObjectById(creep.memory.spawnid);
        if (MYSPAWN.energy < MYSPAWN.energyCapacity) {
            return true;
        } else return false;
    },

    fillSpawn: function(creep) {
        let MYSPAWN = Game.getObjectById(creep.memory.spawnid);
            if(creep.transfer(MYSPAWN, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.memory.action = "moving to spawn";
                creep.moveTo(MYSPAWN, {visualizePathStyle: {stroke: '#ffffff'}});
            }
    },


    buildSites: function(creep) {
        let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
        let site = sites[0];
        if(creep.build(site) == ERR_NOT_IN_RANGE) {
            creep.moveTo(site, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },


    upgradeController: function(creep) {
        creep.memory.action = "upgrading";
        let target = creep.room.controller;
        if(creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            creep.upgradeController(creep.room.controller);
        }
    }

}