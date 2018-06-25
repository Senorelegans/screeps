module.exports = {
    // Print JSON objects nicely
    print: function(obj, pretty = true) {
        if (pretty) {
            console.log(JSON.stringify(obj, null, 1));
        } else {
            console.log(JSON.stringify(obj));
        }
    },

    // Sorts a list by applying a function to a property of each object
    // Ex. support.sortBy(mylist, creep.pos.getRangeTo.bind(creep.pos), "pos")
    sortBy: function(list, func, property, ascending = true) {
        let mul = ascending ? 1 : -1;
        return list.sort(function(a,b) {
            return (func(a[property]) > func(b[property])) ? 1 * mul : ((func(b[property]) > func(a[property])) ? -1 * mul : 0);
        });
    },

    // Converts a position from other types into an object
    posToObj: function(pos) {
        switch (typeof pos) {
            case "string":
                pos = pos.split(",");
            case "array":
                return {x:pos[0], y:pos[1]}
            case "object":
                return pos;
        }
    },

    setRoomMemory: function (room, pos, key, value) {
        pos = module.exports.posToObj(pos);
        if (room.memory[[pos.x, pos.y]] == undefined) {
            room.memory[[pos.x, pos.y]] = {};
        }
        room.memory[[pos.x, pos.y]][key] = value;
    },

    getRoomMemory: function (room, pos, key) {
        pos = module.exports.posToObj(pos);
        if (room.memory[[pos.x, pos.y]] == undefined) {
            return undefined;
        } else {
            return room.memory[[pos.x, pos.y]][key];
        }
    },

    clearRoomMemory: function (room, pos, key) {
        pos = module.exports.posToObj(pos);
        if (key) {
            module.exports.setRoomMemory(room, pos, key, undefined);
        } else {
            room.memory[[pos.x, pos.y]] = undefined;
        }
    },
    
    getTLBR: function(target, radius) {
        var pos = target.pos;
        let TOP = pos.y - radius;
        let LEFT = pos.x - radius;
        let BOTTOM = pos.y + radius;
        let RIGHT = pos.x + radius;
        return [TOP, LEFT, BOTTOM, RIGHT];
    },
    
    getTerrainInArea: function(target, radius, asArray) {
        var pos = target.pos;
        let TOP = pos.y - radius;
        let LEFT = pos.x - radius;
        let BOTTOM = pos.y + radius;
        let RIGHT = pos.x + radius;
        let W = RIGHT - LEFT;
        let H =  BOTTOM - TOP;
        let AREA = target.room.lookForAtArea(LOOK_TERRAIN, TOP, LEFT, BOTTOM, RIGHT, asArray);
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

    // Generates a list of parts for building
    // Example input: support.genParts( [ [WORK,1], [CARRY,1], [MOVE,2] ] );
    genParts: function(partsObj) {
        longList = [];
        for (let i in partsObj) {
            for (let j = 0; j < partsObj[i][1]; j++) {
                longList.push(partsObj[i][0]);
            }
        }
        return longList;
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
