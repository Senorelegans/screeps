let support = require('support');
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
let roleJanitor = require('role.janitor');

module.exports = {
    // Tier 3
    'grunt3': {parts:support.genParts([[TOUGH,4],[MOVE,8],[ATTACK,4]]), cost:760, actions:roleGrunt},
    'archer3': {parts:support.genParts([[MOVE,4],[RANGED_ATTACK,4]]), cost:800, actions:roleArcher},
    'medic3': {parts:support.genParts([[TOUGH,3],[MOVE,5],[HEAL,2]]), cost:780, actions:roleMedic},
    'upgrader3': {parts:support.genParts([[WORK,4],[CARRY,4],[MOVE,4]]), cost:800, actions:roleUpgrader},
    'builder3': {parts:support.genParts([[WORK,4],[CARRY,2],[MOVE,6]]), cost:800, actions:roleBuilder},
    'supplier3': {parts:support.genParts([[CARRY,8],[MOVE,8]]), cost:800, actions:roleSupplier},
    'janitor3': {parts:support.genParts([[CARRY,8],[MOVE,8]]), cost:800, actions:roleJanitor},
    'longhauler3': {parts:support.genParts([[WORK,2],[CARRY,5],[MOVE,7]]), cost:800, actions:roleLonghauler},
    'miner3': {parts:support.genParts([[WORK,6],[CARRY,2],[MOVE,2]]), cost:800, actions:roleMiner},
    'jack3': {parts:support.genParts([[WORK,4],[CARRY,4],[MOVE,4]]), cost:800, actions:roleJack},
    // Tier 2
    'grunt2': {parts:support.genParts([[TOUGH,4],[MOVE,7],[ATTACK,2]]), cost:550, actions:roleGrunt},
    'archer2': {parts:support.genParts([[TOUGH,2],[MOVE,4],[RANGED_ATTACK,2]]), cost:400, actions:roleArcher},
    'medic2': {parts:support.genParts([[MOVE,1],[HEAL,1]]), cost:300, actions:roleMedic},
    'janitor2': {parts:support.genParts([[CARRY,5],[MOVE,5]]), cost:500, actions:roleJanitor},
    'upgrader2': {parts:support.genParts([[WORK,4],[CARRY,1],[MOVE,2]]), cost:550, actions:roleUpgrader},
    'builder2': {parts:support.genParts([[WORK,3],[CARRY,2],[MOVE,2]]), cost:500, actions:roleBuilder},
    'supplier2': {parts:support.genParts([[CARRY,7],[MOVE,4]]), cost:550, actions:roleSupplier},
    'longhauler2': {parts:support.genParts([[WORK,3],[CARRY,4], [MOVE,3]]), cost:550, actions:roleLonghauler},
    'hyperminer2': {parts:support.genParts([[WORK, 5],[MOVE, 1]]), cost:550, actions:roleHyperMiner},
    'miner2': {parts:support.genParts([[WORK,4],[CARRY,2],[MOVE,1]]), cost:550, actions:roleMiner},
    'jack2': {parts:support.genParts([[WORK,2],[CARRY,2],[MOVE,4]]), cost:500, actions:roleJack},
    // Tier 1
    'grunt1': {parts:support.genParts([[TOUGH,2],[MOVE,3],[ATTACK,1]]), cost:250, actions:roleGrunt},
    'archer1': {parts:support.genParts([[MOVE,1],[RANGED_ATTACK,1]]), cost:200, actions:roleArcher},
    'medic1': {parts:support.genParts([[MOVE,1],[HEAL,1]]), cost:300, actions:roleMedic},
    'janitor1': {parts:support.genParts([[CARRY,3],[MOVE,3]]), cost:300, actions:roleJanitor},
    'builder1': {parts:support.genParts([[WORK,2],[CARRY,1],[MOVE,1]]), cost:300, actions:roleBuilder},
    'upgrader1': {parts:support.genParts([[WORK,2],[CARRY,1],[MOVE,1]]), cost:300, actions:roleUpgrader},
    'supplier1': {parts:support.genParts([[CARRY,2],[MOVE,2]]), cost:200, actions:roleSupplier},
    'miner1': {parts:support.genParts([[WORK,2],[CARRY,1],[MOVE,1]]), cost:300, actions:roleMiner},
    'jack1': {parts:support.genParts([[WORK,1],[CARRY,1],[MOVE,1]]), cost:200, actions:roleJack},
    // Other
    'recycle': {actions:roleRecycle},
    'messenger': {parts:support.genParts([[MOVE, 1]]), cost:50, actions:roleMessenger},
}

/*
// Set quotas
// Tier 3
roles.jack3.quota = 0;
roles.miner3.quota = 0;
roles.upgrader3.quota = 0;
roles.supplier3.quota = 0;
roles.builder3.quota = 0;
roles.grunt3.quota = 0;
roles.archer3.quota = 0;
roles.medic3.quota = 0;
// Tier 2
roles.jack2.quota = 0;
roles.miner2.quota = 0;
roles.upgrader2.quota = 0;
roles.supplier2.quota = 0;
roles.builder2.quota = 0;
roles.hyperminer2.quota = 0;
roles.longhauler2.quota = 0;
roles.grunt2.quota = 0;
roles.archer2.quota = 0;
roles.medic2.quota = 0;
// Tier 1
roles.jack1.quota = 0;
roles.supplier1.quota = 0;
roles.miner1.quota = 0;
roles.builder1.quota = 0;
roles.upgrader1.quota = 0;
roles.grunt1.quota = 0;
roles.archer1.quota = 0;
roles.medic1.quota = 0;
roles.messenger.quota = 0;
*/