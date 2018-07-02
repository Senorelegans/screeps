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

    getTilesInArea: function(target, radius, pattern, asArray, OFFSET_X, OFFSET_Y) {

        var pos = target.pos;
        x = pos.x + OFFSET_X;
        y = pos.y + OFFSET_Y;

        let TOP = y - radius;
        let LEFT = x - radius;
        let BOTTOM = y + radius;
        let RIGHT = x + radius;
        let W = RIGHT - LEFT;
        let H =  BOTTOM - TOP;
        let AREA = target.room.lookAtArea(TOP, LEFT, BOTTOM, RIGHT, asArray);

        target.room.visual.text("M", x, y, {align: 'center', opacity: 0.5} );
        switch (pattern) {
            case "none":
                // console.log(pattern);
                return AREA;

            case "checkerboard":
                A = [];
                for (y = TOP; y <= BOTTOM; y++) {
                    for (x = LEFT; x <= RIGHT; x++) {
                        let tile = AREA[y][x];
                        num = (x + y) % 2;
                        if (num == 0) {
                            target.room.visual.text("C", x, y, {align: 'center', opacity: 0.2} );
                            tile.x = x;
                            tile.y = y;
                            A.push(tile);
                        }
                    }
                }
                return A;
        }
    },


    
    SpawnerInfo: function(MYSPAWNER) {
        // If spawning, make a notification
        if (MYSPAWNER.spawning) {
            var spawningCreep = Game.creeps[MYSPAWNER.spawning.name];
            MYSPAWNER.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                MYSPAWNER.pos.x + 0,
                MYSPAWNER.pos.y + 1,
                {align: 'center', opacity: 0.2});
        }
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
