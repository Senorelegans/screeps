skys name
slcy







change the roles of screeps
Game.creeps['builder7309476'].memory.role = 'harvester';
Game.creeps['Harvester2'].memory.role = 'builder';
Game.creeps['builder7309476'].memory.role = 'upgrader';

builder7309476

Game.creeps['poop'].memory.role = 'upgrader';



spawn harvester
Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], "Harvester1",
    {memory: {role: 'harvester',working:false}});


move screeps
Game.creeps['Harvester1'].move(RIGHT);


console log
console.log(creep.memory.role);


get spawn location
console.log(Game.spawns['Spawn1']);