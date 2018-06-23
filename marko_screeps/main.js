var Traveler = require('Traveler');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
let support = require('support');



module.exports.loop = function () {

    const spawner = "Spawn1";

    support.erasedead();



    // Make list of important sites to network
    let importantsites = [
        Game.spawns[spawner],
    ];
    for (let room of Object.keys(Game.rooms)) {
        importantsites.push(Game.rooms[room].controller);
    }







    // Spawning roles
    var roles_list = [
        {rolename:'harvester',amount:10, actions:[WORK,WORK,CARRY,MOVE] },
        {rolename:'builder',  amount:5, actions:[WORK,WORK,CARRY,MOVE] },
        {rolename:'upgrader', amount:10, actions:[WORK,CARRY,MOVE,MOVE] }];
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

    //Game.rooms[roomName].createConstructionSite(10, 15, STRUCTURE_ROAD);

    //console.log(Game.creeps["Harvester1"].room.find(FIND_SOURCES) );



}