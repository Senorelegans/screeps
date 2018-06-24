module.exports = {
    // Print JSON objects
    print: function(obj) {
        console.log(JSON.stringify(obj));
    },
    
    getTLBR: function(target, radius) {
        var pos = target.pos;
        let TOP = pos.y - radius;
        let LEFT = pos.x - radius;
        let BOTTOM = pos.y + radius;
        let RIGHT = pos.x + radius;
        return [TOP, LEFT, BOTTOM, RIGHT];
    },
    
    getTilesInArea: function(target, radius, asArray) {
        var pos = target.pos;
        let TOP = pos.y - radius;
        let LEFT = pos.x - radius;
        let BOTTOM = pos.y + radius;
        let RIGHT = pos.x + radius;
        let W = RIGHT - LEFT;
        let H =  BOTTOM - TOP;
        let AREA = target.room.lookAtArea(TOP, LEFT, BOTTOM, RIGHT, asArray);
        return AREA;
    },

    dir: {
        1 : {name:"TOP", dx:0, dy:-1},
        2 : {name:"TOP_RIGHT", dx:1, dy:-1},
        3 : {name:"RIGHT", dx:1, dy:0},
        4 : {name:"BOTTOM_RIGHT", dx:1, dy:1},
        5 : {name:"BOTTOM", dx:0, dy:1},
        6 : {name:"BOTTOM_LEFT", dx:-1, dy:1},
        7 : {name:"LEFT", dx:-1, dy:0},
        8 : {name:"TOP_LEFT", dx:-1, dy:-1},
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
