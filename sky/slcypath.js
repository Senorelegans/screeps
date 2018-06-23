module.exports = {
    oldpathto: function(creep, dst) {
        
        let getcost = function(x, y) {
            let highest = 0;
            let objs = Game.rooms.E24N53.lookAt(x, y);
            for (let obj of objs) {
                if (obj.type == "terrain") {
                    switch (obj.terrain) {
                        case "wall":
                            return 99;
                        case "plain":
                            highest = Math.max(highest, 1);
                            break;
                        case "swamp":
                            highest = Math.max(highest, 5);
                            break;
                    }
                } else if (obj.type == "creep") {
                    return 99;
                }
            }
            return highest;
        }
        
//        console.log('pathing', creep.pos, 'to', dst);
        
        creep.room.visual.poly([creep.pos, dst]);
        //console.log(JSON.stringify(Game.rooms.E24N53.lookAt(creep.pos)));
        if (creep.pos.x < dst.x && getcost(creep.pos.x + 1, creep.pos.y) <= 5) {
            creep.move(RIGHT);
        }
        if (creep.pos.x > dst.x && getcost(creep.pos.x - 1, creep.pos.y) <= 5) {
            creep.move(LEFT);
        }
        if (creep.pos.y > dst.y && getcost(creep.pos.x, creep.pos.y - 1) <= 5) {
            creep.move(TOP);
        }
        if (creep.pos.y < dst.y && getcost(creep.pos.x, creep.pos.y + 1) <= 5) {
            creep.move(BOTTOM);
        }
    },
    pathto: function(creep, target, showpath=false, showcosts=false) {
//        console.log(creep.name, `pathing ${JSON.stringify(creep.pos)} to ${JSON.stringify(dst)}`);
        
        let src = creep.pos;
        let dst = {x:target.x, y:target.y};
        
        let grid = {};
        let unchecked = [];
        
        const LEFTBOUND = 0;
        const RIGHTBOUND = 49;
        const TOPBOUND = 0;
        const BOTTOMBOUND = 49;
        
        let getcost = function(x, y) {
            let highest = 0;
            let objs = Game.rooms.E24N53.lookAt(x, y);
            for (let obj of objs) {
                if (obj.type == "terrain") {
                    switch (obj.terrain) {
                        case "wall":
                            return 99;
                        case "plain":
                            highest = Math.max(highest, 1);
                            break;
                        case "swamp":
                            highest = Math.max(highest, 5);
                            break;
                    }
                } else if (obj.type == "creep") {
                    return 99;
                }
            }
            return highest;
        }
        
        // Start grid with source tile
        grid[[src.x, src.y]] = {x:src.x, y:src.y, dist:0};
        unchecked.push(grid[[src.x, src.y]]);
        // Check tiles until destination is found
//        console.log('start calc');
        while (unchecked.length > 0) {
            // Get unchecked tile with lowest distance
            unchecked.sort(function(a,b) {return (a.dist > b.dist) ? -1 : ((b.dist > a.dist) ? 1 : 0);} );
            let u = unchecked.pop();
            // Update neighbors
            let updateNeighbor = function(grid, u, xmod, ymod) {
                const x = u.x + xmod;
                const y = u.y + ymod;
                if (x >= LEFTBOUND && x <= RIGHTBOUND && y >= TOPBOUND && y <= BOTTOMBOUND) {
                    if (grid[[x, y]] == undefined) {
                        let obj = {x:x, y:y, dist:99, cost:getcost(x, y)};
                        grid[[x, y]] = obj;
//                        console.log('adding', [x, y], 'to unchecked');
                        unchecked.push(obj);
                    }
                    let targettile = grid[[x, y]];
                    let alt = u.dist + targettile.cost;
                    if (targettile.dist == undefined || alt < targettile.dist) {
                        targettile.dist = alt;
                        targettile.prev = [u.x, u.y];
                        if (u.x == 41 || u.y == 13) {
//                            console.log('setting prev of', [x, y], 'to', [u.x, u.y]);
                        }
                    }
                }
            };
            updateNeighbor(grid, u, -1, 0);
            updateNeighbor(grid, u, 1, 0);
            updateNeighbor(grid, u, 0, -1);
            updateNeighbor(grid, u, 0, 1);
            updateNeighbor(grid, u, -1, -1);
            updateNeighbor(grid, u, 1, 1);
            updateNeighbor(grid, u, 1, -1);
            updateNeighbor(grid, u, -1, 1);
            
            // Stop when destination is found
            if (grid[[dst.x, dst.y]] != undefined) {
                break;
            }
        }
        
        // Draw numbers on tiles
        if (showcosts) {
            for (let tile of Object.keys(grid)) {
                //creep.room.visual.text(String(grid[tile].prev), grid[tile].x, grid[tile].y, {font: "10px"});
                //creep.room.visual.text(String([grid[tile].x, grid[tile].y]), grid[tile].x, grid[tile].y, {font: "10px"});
                creep.room.visual.text(grid[tile].dist, grid[tile].x, grid[tile].y, {font: "10px"});
            }
        }
        
//        console.log(creep.name, 'pathing toward', JSON.stringify(grid[dst.x, dst.y]));
        let cur = grid[[dst.x, dst.y]];
        let path = [];
        const maxloops = 500;
        let loops = 0;
        while (cur.x != src.x || cur.y != src.y) {
            path.push({x:cur.x, y:cur.y});
            cur = grid[grid[[cur.x, cur.y]].prev];
            loops++;
            if (loops > maxloops) {
                console.log('maxloops exceeded');
                break;
            }
        }
        path.reverse();
        
        // Draw path through tiles
        if (showpath) {
            creep.room.visual.poly([src, path[0]]);
            for (let i=0; i<path.length-1; i++) {
                creep.room.visual.poly([path[i], path[i+1]]);
            }
        }
        
        let nextmove = path[0];
        let move = undefined;
        if (nextmove.x > src.x && nextmove.y == src.y) {
            move = RIGHT;
        } else if (nextmove.x < src.x && nextmove.y == src.y) {
            move = LEFT;
        } else if (nextmove.x == src.x && nextmove.y < src.y) {
            move = TOP;
        } else if (nextmove.x == src.x && nextmove.y > src.y) {
            move = BOTTOM;
        } else if (nextmove.x > src.x && nextmove.y > src.y) {
            move = BOTTOM_RIGHT;
        } else if (nextmove.x < src.x && nextmove.y > src.y) {
            move = BOTTOM_LEFT;
        } else if (nextmove.x > src.x && nextmove.y < src.y) {
            move = TOP_RIGHT;
        } else if (nextmove.x < src.x && nextmove.y < src.y) {
            move = TOP_LEFT;
        }
//        console.log(creep.name, "moving:", {7:"LEFT", 3:"RIGHT", 1:"TOP", 5:"BOTTOM"}[move]);
        creep.move(move);
        
        
//        console.log(JSON.stringify(Game.rooms.E24N53.lookAt(35, 13)));
//        console.log(JSON.stringify(Game.rooms.E24N53.lookAt(37, 13)));
    },
};

/* tile lookAt
[
    {
        "type":"creep",
        "creep":{
            "room":{
                "name":"E24N53",
                "energyAvailable":300,
                "energyCapacityAvailable":300,
                "visual":{
                    "roomName":"E24N53"
                }
            },
            "pos":{
                "x":37,
                "y":15,
                "roomName":"E24N53"},
            "id":"5b2d607e9b1e2a7e3049a860",
            "name":"a",
            "body":[
                {"type":"work","hits":100},
                {"type":"work","hits":100},
                {"type":"carry","hits":100},
                {"type":"move","hits":100}],
            "my":true,
            "owner":{"username":"slcy"},
            "spawning":false,
            "ticksToLive":621,
            "carryCapacity":50,
            "carry":{"energy":0},
            "fatigue":2,
            "hits":400,
            "hitsMax":400,
            "saying":"collecting"}},
    {"type":"terrain","terrain":"plain"}
]
*/

/*
grid {"30,11":{"x":30,"y":11,"dist":99,"cost":1},"30,12":{"x":30,"y":12,"dist":99,"cost":1},"30,13":{"x":30,"y":13,"dist":99,"cost":1},"30,14":{"x":30,"y":14,"dist":99,"cost":1},"30,15":{"x":30,"y":15,"dist":99,"cost":99},"30,16":{"x":30,"y":16,"dist":99,"cost":99},"30,17":{"x":30,"y":17,"dist":99,"cost":99},"30,18":{"x":30,"y":18,"dist":99,"cost":1},"30,19":{"x":30,"y":19,"dist":99,"cost":1},"30,20":{"x":30,"y":20,"dist":99,"cost":1},"31,11":{"x":31,"y":11,"dist":99,"cost":1},"31,12":{"x":31,"y":12,"dist":99,"cost":1},"31,13":{"x":31,"y":13,"dist":99,"cost":1},"31,14":{"x":31,"y":14,"dist":99,"cost":99},"31,15":{"x":31,"y":15,"dist":99,"cost":99},"31,16":{"x":31,"y":16,"dist":99,"cost":99},"31,17":{"x":31,"y":17,"dist":99,"cost":99},"31,18":{"x":31,"y":18,"dist":99,"cost":1},"31,19":{"x":31,"y":19,"dist":99,"cost":1},"31,20":{"x":31,"y":20,"dist":99,"cost":1},"32,11":{"x":32,"y":11,"dist":99,"cost":1},"32,12":{"x":32,"y":12,"dist":99,"cost":1},"32,13":{"x":32,"y":13,"dist":99,"cost":99},"32,14":{"x":32,"y":14,"dist":99,"cost":99},"32,15":{"x":32,"y":15,"dist":99,"cost":99},"32,16":{"x":32,"y":16,"prev":[33,16],"dist":6,"cost":99},"32,17":{"x":32,"y":17,"dist":99,"cost":99},"32,18":{"x":32,"y":18,"dist":99,"cost":1},"32,19":{"x":32,"y":19,"dist":99,"cost":1},"32,20":{"x":32,"y":20,"dist":99,"cost":1},"33,11":{"x":33,"y":11,"dist":99,"cost":1},"33,12":{"x":33,"y":12,"dist":99,"cost":99},"33,13":{"x":33,"y":13,"dist":99,"cost":99},"33,14":{"x":33,"y":14,"dist":99,"cost":99},"33,15":{"x":33,"y":15,"prev":[33,16],"dist":6,"cost":99},"33,16":{"x":33,"y":16,"prev":[34,16],"dist":5,"cost":99},"33,17":{"x":33,"y":17,"prev":[34,17],"dist":6,"cost":99},"33,18":{"x":33,"y":18,"dist":99,"cost":1},"33,19":{"x":33,"y":19,"dist":99,"cost":1},"33,20":{"x":33,"y":20,"dist":99,"cost":1},"34,11":{"x":34,"y":11,"dist":99,"cost":1},"34,12":{"x":34,"y":12,"dist":99,"cost":99},"34,13":{"x":34,"y":13,"dist":99,"cost":99},"34,14":{"x":34,"y":14,"prev":[35,14],"dist":6,"cost":99},"34,15":{"x":34,"y":15,"prev":[34,16],"dist":5,"cost":99},"34,16":{"x":34,"y":16,"prev":[35,16],"dist":4,"cost":99},"34,17":{"x":34,"y":17,"prev":[34,16],"dist":5,"cost":99},"34,18":{"x":34,"y":18,"prev":[34,17],"dist":6,"cost":1},"34,19":{"x":34,"y":19,"dist":99,"cost":1},"34,20":{"x":34,"y":20,"dist":99,"cost":1},"35,11":{"x":35,"y":11,"dist":99,"cost":1},"35,12":{"x":35,"y":12,"dist":99,"cost":1},"35,13":{"x":35,"y":13,"prev":[36,13],"dist":6,"cost":99},"35,14":{"x":35,"y":14,"prev":[36,14],"dist":5,"cost":99},"35,15":{"x":35,"y":15,"prev":[35,16],"dist":4,"cost":99},"35,16":{"x":35,"y":16,"prev":[36,16],"dist":3,"cost":99},"35,17":{"x":35,"y":17,"prev":[35,16],"dist":4,"cost":99},"35,18":{"x":35,"y":18,"prev":[35,17],"dist":5,"cost":1},"35,19":{"x":35,"y":19,"prev":[36,19],"dist":6,"cost":1},"35,20":{"x":35,"y":20,"dist":99,"cost":1},"36,11":{"x":36,"y":11,"dist":99,"cost":1},"36,12":{"x":36,"y":12,"prev":[36,13],"dist":6,"cost":1},"36,13":{"x":36,"y":13,"prev":[37,13],"dist":5,"cost":1},"36,14":{"x":36,"y":14,"prev":[37,14],"dist":4,"cost":99},"36,15":{"x":36,"y":15,"prev":[36,16],"dist":3,"cost":99},"36,16":{"x":36,"y":16,"prev":[37,16],"dist":2,"cost":99},"36,17":{"x":36,"y":17,"prev":[36,16],"dist":3,"cost":1},"36,18":{"x":36,"y":18,"prev":[36,17],"dist":4,"cost":1},"36,19":{"x":36,"y":19,"prev":[37,19],"dist":5,"cost":1},"36,20":{"x":36,"y":20,"prev":[37,20],"dist":6,"cost":1},"37,11":{"x":37,"y":11,"prev":[37,12],"dist":6,"cost":1},"37,12":{"x":37,"y":12,"prev":[37,13],"dist":5,"cost":1},"37,13":{"x":37,"y":13,"prev":[37,14],"dist":4,"cost":1},"37,14":{"x":37,"y":14,"prev":[37,15],"dist":3,"cost":1},"37,15":{"x":37,"y":15,"prev":[37,16],"dist":2,"cost":1},"37,16":{"x":37,"y":16,"prev":[38,16],"dist":1,"cost":1},"37,17":{"x":37,"y":17,"prev":[37,16],"dist":2,"cost":1},"37,18":{"x":37,"y":18,"prev":[37,17],"dist":3,"cost":1},"37,19":{"x":37,"y":19,"prev":[37,18],"dist":4,"cost":1},"37,20":{"x":37,"y":20,"prev":[37,19],"dist":5,"cost":1},"38,11":{"x":38,"y":11,"prev":[38,12],"dist":5,"cost":1},"38,12":{"x":38,"y":12,"prev":[38,13],"dist":4,"cost":1},"38,13":{"x":38,"y":13,"prev":[38,14],"dist":3,"cost":1},"38,14":{"x":38,"y":14,"prev":[38,15],"dist":2,"cost":1},"38,15":{"x":38,"y":15,"prev":[38,16],"dist":1,"cost":99},"38,16":{"x":38,"y":16,"dist":0},"38,17":{"x":38,"y":17,"prev":[38,16],"dist":1,"cost":1},"38,18":{"x":38,"y":18,"prev":[38,17],"dist":2,"cost":1},"38,19":{"x":38,"y":19,"prev":[38,18],"dist":3,"cost":1},"38,20":{"x":38,"y":20,"prev":[38,19],"dist":4,"cost":1},"39,11":{"x":39,"y":11,"prev":[38,11],"dist":6,"cost":5},"39,12":{"x":39,"y":12,"prev":[39,13],"dist":5,"cost":1},"39,13":{"x":39,"y":13,"prev":[38,13],"dist":4,"cost":1},"39,14":{"x":39,"y":14,"prev":[38,14],"dist":3,"cost":1},"39,15":{"x":39,"y":15,"prev":[38,15],"dist":2,"cost":99},"39,16":{"x":39,"y":16,"prev":[38,16],"dist":1,"cost":99},"39,17":{"x":39,"y":17,"prev":[38,17],"dist":2,"cost":1},"39,18":{"x":39,"y":18,"prev":[38,18],"dist":3,"cost":1},"39,19":{"x":39,"y":19,"prev":[39,18],"dist":4,"cost":1},"39,20":{"x":39,"y":20,"prev":[38,20],"dist":5,"cost":1},"40,11":{"x":40,"y":11,"prev":[40,12],"dist":7,"cost":99},"40,12":{"x":40,"y":12,"prev":[40,13],"dist":6,"cost":1},"40,13":{"x":40,"y":13,"prev":[39,13],"dist":5,"cost":1},"40,14":{"x":40,"y":14,"prev":[40,15],"dist":4,"cost":1},"40,15":{"x":40,"y":15,"prev":[39,15],"dist":3,"cost":99},"40,16":{"x":40,"y":16,"prev":[39,16],"dist":2,"cost":99},"40,17":{"x":40,"y":17,"prev":[39,17],"dist":3,"cost":1},"40,18":{"x":40,"y":18,"prev":[39,18],"dist":4,"cost":1},"40,19":{"x":40,"y":19,"prev":[40,18],"dist":5,"cost":1},"40,20":{"x":40,"y":20,"prev":[39,20],"dist":6,"cost":1},"41,11":{"x":41,"y":11,"dist":99,"cost":99},"41,12":{"x":41,"y":12,"prev":[40,12],"dist":7,"cost":99},"41,13":{"x":41,"y":13,"prev":[40,13],"dist":6,"cost":1},"41,14":{"x":41,"y":14,"prev":[41,15],"dist":5,"cost":1},"41,15":{"x":41,"y":15,"prev":[41,16],"dist":4,"cost":1},"41,16":{"x":41,"y":16,"prev":[40,16],"dist":3,"cost":1},"41,17":{"x":41,"y":17,"prev":[41,16],"dist":4,"cost":1},"41,18":{"x":41,"y":18,"prev":[41,17],"dist":5,"cost":1},"41,19":{"x":41,"y":19,"prev":[41,18],"dist":6,"cost":1},"41,20":{"x":41,"y":20,"dist":99,"cost":1},"42,11":{"x":42,"y":11,"dist":99,"cost":99},"42,12":{"x":42,"y":12,"dist":99,"cost":99},"42,13":{"x":42,"y":13,"dist":99,"cost":99},"42,14":{"x":42,"y":14,"prev":[42,15],"dist":6,"cost":1},"42,15":{"x":42,"y":15,"prev":[41,15],"dist":5,"cost":1},"42,16":{"x":42,"y":16,"prev":[41,16],"dist":4,"cost":1},"42,17":{"x":42,"y":17,"prev":[42,16],"dist":5,"cost":1},"42,18":{"x":42,"y":18,"prev":[42,17],"dist":6,"cost":1},"42,19":{"x":42,"y":19,"dist":99,"cost":1},"42,20":{"x":42,"y":20,"dist":99,"cost":1}}
[5:
*/