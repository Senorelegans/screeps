skys name
slcy


Game.spawns[spawner].room.




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
const spawner = "Spawn1";
knownrooms = Game.rooms;
console.log(knownrooms)
console.log(Game.spawns[spawner].room);
console.log(Game.spawns['Spawn1']);


extension builder
const spawner = "Spawn1";
var extensions = Game.spawns[spawner].room(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION }
});
console.log(extensions.length);