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

module.exports = {
    'recycle': {amount:0, actions:roleRecycle},
    'longhauler': {amount:2, parts:[WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], cost:550, actions:roleLonghauler},
    'messenger': {amount:0, parts:[MOVE], cost:50, actions:roleMessenger},
    'medic': {amount:0, parts:[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL], cost:550, actions:roleMedic},
    'archer': {amount:0, parts:[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK], cost:550, actions:roleArcher},
    'grunt': {amount:0, parts:[TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK], cost:550, actions:roleGrunt},
    'builder': {amount:0, parts:[WORK,WORK,CARRY,MOVE], cost:300, actions:roleBuilder},
    'supplier': {amount:0, parts:[CARRY,CARRY,MOVE,MOVE], cost:200, actions:roleSupplier},
    'upgrader': {amount:2, parts:[WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], cost:550, actions:roleUpgrader},
    'hyperminer': {amount:1, parts:[WORK,WORK,WORK,WORK,WORK,MOVE], cost:550, actions:roleHyperMiner},
    'distributor': {amount:2, parts:[WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], cost:500, actions:roleJack},
}