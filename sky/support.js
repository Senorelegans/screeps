module.exports = {
    // Print JSON objects
    print: function(obj) {
        console.log(JSON.stringify(obj));
    },
    
    // Calculate cost of a set of parts
    getCost: function(parts) {
        var bodyCost = {
            "move": 50,
            "work": 100,
            "carry": 50,
            "attack": 80,
            "ranged_attack": 150,
            "heal": 250,
            "claim": 600,
            "tough": 10,
        };
        let cost = 0;
        for (let part of parts) {
            cost += bodyCost[part];
        }
        return cost;
    },
    
    // Delete memory of nonexistant creeps
    erasedead: function() {
        for(let name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },
    
    removeroads: function(room) {
        for (let site of room.find(FIND_CONSTRUCTION_SITES)) {
            if (site.structureType == STRUCTURE_ROAD) {
                site.remove();
            }
        }
    }
};
