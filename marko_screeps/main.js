var Traveler = require('Traveler');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    // Remove dead creeps from memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    // Spawning roles
    var roles_list = [
        {rolename:'harvester',amount:10, actions:[WORK,WORK,CARRY,MOVE] },
        {rolename:'builder',  amount:0, actions:[WORK,WORK,CARRY,MOVE] },
        {rolename:'upgrader', amount:30, actions:[WORK,CARRY,MOVE,MOVE] }];
    for (var Role in roles_list) {

        rolename = roles_list[Role].rolename;
        roleImport = require('role.'+rolename);

        var current_role =  _.filter(Game.creeps, (creep) => creep.memory.role == roles_list[Role].rolename);
        //console.log(roles_list[Role].rolename + ": " + current_role.length);
        if(current_role.length < roles_list[Role].amount) {
            var newName = roles_list[Role].rolename + Game.time;
            //console.log('Spawning new '+ roles_list[Role].rolename  + " " + newName);
            Game.spawns['Spawn1'].spawnCreep(roles_list[Role].actions, newName,// put in newname for undefined newname,
                {memory: {role: rolename, working:false}});
        }

        // Running the roles of each creep
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            //if creep == "upgrader7307625"
            if(creep.memory.role == rolename) {
                roleImport.run(creep);
            }
        }
    }



    //Spawning visual
    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }


    //console.log(Game.creeps["Harvester1"].room.find(FIND_SOURCES) );



}