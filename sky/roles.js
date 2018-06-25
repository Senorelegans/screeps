let roleMiner = require('role.miner');
let roleHyperMiner = require('role.hyperminer');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleSupplier = require('role.supplier');
let roleRecycle = require('role.recycle');
let roleGrunt = require('role.grunt');
let roleArcher = require('role.archer');
let roleMedic = require('role.medic');
let roleMessenger = require('role.messenger');
let roleLonghauler = require('role.longhauler');
let roleJack = require('role.jack');

module.exports = {
    // Tier 3
    'jack3': {parts:[WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], cost:800, actions:roleJack},
    'miner3': {parts:[WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], cost:800, actions:roleMiner},
    'upgrader3': {parts:[WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], cost:800, actions:roleUpgrader},
    'builder3': {parts:[WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], cost:800, actions:roleBuilder},
    'supplier3': {parts:[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], cost:800, actions:roleSupplier},
    'longhauler3': {parts:[WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], cost:800, actions:roleLonghauler},
    // Tier 2
    'jack2': {parts:[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], cost:500, actions:roleJack},
    'miner2': {parts:[WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE], cost:550, actions:roleMiner},
    'upgrader2': {parts:[WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], cost:550, actions:roleUpgrader},
    'builder2': {parts:[WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], cost:500, actions:roleBuilder},
    'supplier2': {parts:[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], cost:550, actions:roleSupplier},
    'longhauler2': {parts:[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], cost:550, actions:roleLonghauler},
    'hyperminer2': {parts:[WORK,WORK,WORK,WORK,WORK,MOVE], cost:550, actions:roleHyperMiner},
    'medic2': {parts:[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL], cost:550, actions:roleMedic},
    'archer2': {parts:[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK], cost:550, actions:roleArcher},
    'grunt2': {parts:[TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK], cost:550, actions:roleGrunt},
    // Tier 1
    'jack1': {parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleJack},
    'miner1': {parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleMiner},
    'builder1': {parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleBuilder},
    'upgrader1': {parts:[WORK,WORK,CARRY,MOVE], cost:550, actions:roleUpgrader},
    'supplier1': {parts:[CARRY,CARRY,MOVE,MOVE], cost:200, actions:roleSupplier},
    // Other
    'recycle': {actions:roleRecycle},
    'messenger': {parts:[MOVE], cost:50, actions:roleMessenger},
}

/*
// Set quotas
// Tier 3
roles.jack3.quota = 0;
roles.miner3.quota = 0;
roles.upgrader3.quota = 0;
roles.supplier3.quota = 0;
roles.builder3.quota = 0;
// Tier 2
roles.grunt2.quota = 0;
roles.archer2.quota = 0;
roles.medic2.quota = 0;
roles.hyperminer2.quota = 0;
roles.longhauler2.quota = 0;
roles.jack2.quota = 0;
roles.miner2.quota = 0;
roles.upgrader2.quota = 0;
roles.supplier2.quota = 0;
roles.builder2.quota = 0;
// Tier 1
roles.jack1.quota = 0;
roles.supplier1.quota = 0;
roles.miner1.quota = 0;
roles.builder1.quota = 0;
roles.upgrader1.quota = 0;
roles.messenger.quota = 0;
*/