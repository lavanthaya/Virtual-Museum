var defaultLight = {
    ambient: vec4(0.4, 0.4, 0.4),
    diffuse: vec4(0.1, 0.1, 0.1),
    specular: vec4(0.1, 0.1, 0.1),
    lightColor: vec4(0.9, 0.9, 0.9),

    ambient_off: vec4(0.1, 0.1, 0.1),
    diffuse: vec4(0.1, 0.1, 0.1),
    specular: vec4(0.1, 0.1, 0.1),
    lightColor_off: vec4(0.1, 0.1, 0.1),

    ambient_red: vec4(0.5, 0.1, 0.1),
    diffuse: vec4(0.1, 0.0, 0.0),
    specular: vec4(0.1, 0.0, 0.0),
    lightColor_red: vec4(0.7, 0.1, 0.1),

    ambient_blue: vec4(0.1, 0.4, 0.1),
    diffuse: vec4(0.0, 0.1, 0.0),
    specular: vec4(0.0, 0.2, 0.0),
    lightColor_blue: vec4(0.1, 0.7, 0.1),

    ambient_green: vec4(0.1, 0.1, 0.5),
    diffuse: vec4(0.1, 0.0, 0.1),
    specular: vec4(0.1, 0.0, 0.1),
    lightColor_green: vec4(0.1, 0.1, 0.7)
};


var lobby = {
    numWalls: 4,
    walls: [
        [midLeftWall, bottomWall],
        [midLeftWall, midBottomWall],
        [midRightWall, midBottomWall],
        [midRightWall, bottomWall]
    ],
    wallHeight: 10,
    doors: [
        [(midRightWall + midLeftWall) / 2, midBottomWall, ROOMS.HALLWAY]
    ],


    wallTexture: diamondPaper,
    floorTexture: lobbyCarpet,
    ceilingTexture: diamondPaper,

    lighting: defaultLight,

    paintings: [
        [(midRightWall + midLeftWall) / 2 - 8, midBottomWall, welcome],
        [(midRightWall + midLeftWall) / 2 + 8, midBottomWall, instructions]
    ],

    hasRendered: false,
    verts: {}
};

var hallway = {
    numWalls: 4,
    walls: [
        [midLeftWall, midBottomWall],
        [midLeftWall, topWall],
        [midRightWall, topWall],
        [midRightWall, midBottomWall]
    ],
    wallHeight: 10,
    doors: [
        [(midRightWall + midLeftWall) / 2, midBottomWall, ROOMS.LOBBY],
        [(midBottomWall + topWall) / 2, midLeftWall, ROOMS.ROOM3],
        [(midBottomWall + midTopWall) / 2, midRightWall, ROOMS.ROOM1],
        [(midTopWall + topWall) / 2, midRightWall, ROOMS.ROOM2],
        [(midLeftWall + midRightWall) / 2 + doorWidth / 2, topWall, ROOMS.ELEVATOR]
    ],


    wallTexture: diamondPaper,
    floorTexture: lobbyCarpet,
    ceilingTexture: hallceiling,

    lighting: defaultLight,

    song: new Audio("/img/hallway.mp3"),
    paintings: [
        [(midLeftWall + midRightWall) / 2 + doorWidth / 2, topWall, elevatorSign],
        [(midLeftWall + midRightWall) / 2, midBottomWall, lobbySign]
    ],

    hasRendered: false,
    verts: {}
};

var room1 = {
    numWalls: 4,
    walls: [
        [midRightWall, midBottomWall],
        [midRightWall, midTopWall],
        [rightWall, midTopWall],
        [rightWall, midBottomWall]
    ],
    wallHeight: 15,
    doors: [
        [(midBottomWall + midTopWall) / 2, midRightWall, ROOMS.HALLWAY]
    ],

    wallTexture: marble,
    floorTexture: marbleTile,
    ceilingTexture: marble,

    lighting: defaultLight,

    song: new Audio("/img/room1.mp3"),
    paintings: [
        [(rightWall + midRightWall) / 2, midTopWall, room1_art1],
        [(midBottomWall + midTopWall) / 2, rightWall, room1_art2],
        [(rightWall + midRightWall) / 2, midBottomWall, room1_art3]
    ],

    hasRendered: false,
    verts: {}
};

var room2 = {
    numWalls: 4,
    walls: [
        [midRightWall, midTopWall],
        [midRightWall, topWall],
        [rightWall, topWall],
        [rightWall, midTopWall]
    ],
    wallHeight: 10,
    doors: [
        [(midTopWall + topWall) / 2, midRightWall, ROOMS.HALLWAY]
    ],

    wallTexture: wood,
    floorTexture: woodFloor,
    ceilingTexture: woodceiling,

    lighting: defaultLight,

    song: new Audio("/img/room2.mp3"),
    paintings: [
        [(rightWall + midRightWall) / 2, topWall, room2_art1],
        [(topWall + midTopWall) / 2, rightWall, room2_art2],
        [(rightWall + midRightWall) / 2, midTopWall, room2_art3]
    ],

    hasRendered: false,
    verts: {}
};

var room3 = {
    numWalls: 4,
    walls: [
        [leftWall, midBottomWall],
        [leftWall, topWall],
        [midLeftWall, topWall],
        [midLeftWall, midBottomWall]
    ],
    wallHeight: 10,
    doors: [
        [(midBottomWall + topWall) / 2, midLeftWall, ROOMS.HALLWAY]
    ],

    wallTexture: stainedWood,
    floorTexture: creepyFloor,
    ceilingTexture: woodceiling,

    lighting: defaultLight,

    song: new Audio("/img/room3.mp3"),
    paintings: [
        [(leftWall + midLeftWall) / 2, midBottomWall, room3_art1],
        [(midBottomWall + midTopWall) / 2, leftWall, room3_art2],
        [midTopWall, leftWall, room3_art5],
        [(midTopWall + topWall) / 2, leftWall, room3_art3],
        [(leftWall + midLeftWall) / 2, topWall, room3_art4]
    ],

    hasRendered: false,
    verts: {}
};

var elevator = {
    numWalls: 4,
    walls: [
        [midLeftWall + 5, topWall],
        [midLeftWall + 5, topStairWall],
        [midRightWall - 5, topStairWall],
        [midRightWall - 5, topWall]
    ],
    wallHeight: 10,
    doors: [
        [(midLeftWall + midRightWall) / 2 + doorWidth / 2, topWall, ROOMS.HALLWAY]
    ],

    wallTexture: circlePaper,
    floorTexture: creepyFloor,
    ceilingTexture: circlePaper,

    lighting: defaultLight,

    song: new Audio("/img/room1.mp3"),

    paintings: [
        [(midLeftWall + midRightWall) / 2, topStairWall, notice],
        [(midLeftWall + midRightWall) / 2, topStairWall, elevatorSign]
    ],

    hasRendered: false,
    verts: {}

};


var rooms = [lobby, hallway, room1, room2, room3, elevator];
var curRoom = lobby; //Defines where to start

function getRoomVertices(room, scaleDown) {
    var verts = [];
    var norms = [];
    var texVerts = [];
    var walls = room.walls;

    for (var i = 0; i < room.numWalls; i++) {

        //two triangles per wall
        var pointOne = walls[i];
        var pointTwo = walls[0];
        if (i < room.numWalls - 1) pointTwo = walls[i + 1];
        var wallWidth = Math.abs((pointTwo[0] - pointOne[0])) * textureScale / scaleDown;
        if (i == 0 || i == 2) //vertical walls
            wallWidth = Math.abs((pointTwo[1] - pointOne[1])) * textureScale / scaleDown;
        var heightFactor = wallHeight * textureScale / scaleDown;

        verts.push(vec3(pointOne[0], 0, pointOne[1]));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(pointOne[0], wallHeight, pointOne[1]));
        texVerts.push(vec2(0, 1 * heightFactor));
        verts.push(vec3(pointTwo[0], 0, pointTwo[1]));
        texVerts.push(vec2(1 * wallWidth, 0));

        verts.push(vec3(pointTwo[0], 0, pointTwo[1]));
        texVerts.push(vec2(1 * wallWidth, 0));
        verts.push(vec3(pointTwo[0], wallHeight, pointTwo[1]));
        texVerts.push(vec2(1 * wallWidth, 1 * heightFactor));
        verts.push(vec3(pointOne[0], wallHeight, pointOne[1]));
        texVerts.push(vec2(0, 1 * heightFactor));

        if (i == 0) //left wall
            norms.push(norm2small, norm2, norm1small, norm1small, norm1, norm2);
        else if (i == 1) //top wall
            norms.push(norm1small, norm1, norm1small, norm1small, norm1, norm1);
        else if (i == 2) //right wall
            norms.push(norm1small, norm1, norm2small, norm2small, norm2, norm1);
        else if (i == 3) //bottom wall
            norms.push(norm2small, norm2, norm2small, norm2small, norm2, norm2);

    }
    return [verts, norms, texVerts];
}

function getFloorVertices(room, height, scaleDown) {
    var verts = [];
    var norms = [];
    var texVerts = [];
    var walls = room.walls;
    var roomWidth = (walls[2][0] - walls[0][0]) * textureScale / scaleDown;
    var roomLength = (walls[2][1] - walls[0][1]) * textureScale / scaleDown;
    if (walls.length != 4) return;

    // two triangles per floor
    verts.push(vec3(walls[0][0], height, walls[0][1]));
    texVerts.push(vec2(0, 0));
    verts.push(vec3(walls[1][0], height, walls[1][1]));
    texVerts.push(vec2(0, 1 * roomLength));
    verts.push(vec3(walls[3][0], height, walls[3][1]));
    texVerts.push(vec2(1 * roomWidth, 0));

    verts.push(vec3(walls[1][0], height, walls[1][1]));
    texVerts.push(vec2(0, 1 * roomLength));
    verts.push(vec3(walls[2][0], height, walls[2][1]));
    texVerts.push(vec2(1 * roomWidth, 1 * roomLength));
    verts.push(vec3(walls[3][0], height, walls[3][1]));
    texVerts.push(vec2(1 * roomWidth, 0));

    // Vertical normals for all floors
    if (height != groundHeight) //ceiling
        norms.push(norm2, norm1, norm2, norm1, norm1, norm2);
    else
        norms.push(norm2small, norm1small, norm2small, norm1small, norm1small, norm2small);

    return [verts, norms, texVerts];
}

function getWallObjectVertices(objects, room, type) {
    var verts = [];
    var norms = [];
    var texVerts = [];
    var objectHeight = doorHeight;
    var objectWidth = doorWidth;
    var hangingHeight = 0;

    var walls = room.walls;
    for (var i = 0; i < objects.length; i++) {
        var curObject = objects[i];

        var rightNorm = norm4big;
        var rightNormsmall = norm4;
        if (type == WALL_OBJECT.PAINTINGS) {
            objectWidth = curObject[2].width * INCHES_SCALE;
            objectHeight = curObject[2].height * INCHES_SCALE;
            hangingHeight = curObject[2].hangingHeight;
            rightNorm = norm4;
            rightNormsmall = norm4small;
        }

        var pointOne = curObject[0] - objectWidth / 2;
        var pointTwo = curObject[0] + objectWidth / 2;

        //two triangles per door
        if (curObject[1] == leftWall || curObject[1] == midLeftWall || curObject[1] == midRightWall || curObject[1] == rightWall) {
            if (curObject[1] == walls[0][0]) { //on left wall
                var curDepth = curObject[1] + visibleDoorDepth;

                verts.push(vec3(curDepth, hangingHeight, pointOne));
                texVerts.push(vec2(0, 0));
                verts.push(vec3(curDepth, hangingHeight, pointTwo));
                texVerts.push(vec2(-1, 0));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointOne));
                texVerts.push(vec2(0, 1));

                verts.push(vec3(curDepth, hangingHeight, pointTwo));
                texVerts.push(vec2(-1, 0));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointOne));
                texVerts.push(vec2(0, 1));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointTwo));
                texVerts.push(vec2(-1, 1));

                norms.push(norm3small, norm3small, norm3, norm3small, norm3, norm3);
            } else { //on right wall
                var curDepth = curObject[1] - visibleDoorDepth;

                verts.push(vec3(curDepth, hangingHeight, pointOne));
                texVerts.push(vec2(0, 0));
                verts.push(vec3(curDepth, hangingHeight, pointTwo));
                texVerts.push(vec2(1, 0));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointOne));
                texVerts.push(vec2(0, 1));

                verts.push(vec3(curDepth, hangingHeight, pointTwo));
                texVerts.push(vec2(1, 0));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointOne));
                texVerts.push(vec2(0, 1));
                verts.push(vec3(curDepth, hangingHeight + objectHeight, pointTwo));
                texVerts.push(vec2(1, 1));

                norms.push(rightNormsmall, rightNormsmall, rightNorm, rightNormsmall, rightNorm, rightNorm);
            }
        } else { //door goes east-west
            if (curObject[1] != walls[0][1]) { //on top wall
                var curDepth = curObject[1] + visibleDoorDepth;

                verts.push(vec3(pointOne, hangingHeight, curDepth));
                texVerts.push(vec2(0, 0));
                verts.push(vec3(pointTwo, hangingHeight, curDepth));
                texVerts.push(vec2(1, 0));
                verts.push(vec3(pointOne, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(0, 1));

                verts.push(vec3(pointTwo, hangingHeight, curDepth));
                texVerts.push(vec2(1, 0));
                verts.push(vec3(pointOne, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(0, 1));
                verts.push(vec3(pointTwo, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(1, 1));

                norms.push(norm1small, norm1small, norm1, norm1small, norm1, norm1);
            } else { //on bottom wall
                var curDepth = curObject[1] - visibleDoorDepth;

                verts.push(vec3(pointOne, hangingHeight, curDepth));
                texVerts.push(vec2(0, 0));
                verts.push(vec3(pointTwo, hangingHeight, curDepth));
                texVerts.push(vec2(-1, 0));
                verts.push(vec3(pointOne, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(0, 1));

                verts.push(vec3(pointTwo, hangingHeight, curDepth));
                texVerts.push(vec2(-1, 0));
                verts.push(vec3(pointOne, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(0, 1));
                verts.push(vec3(pointTwo, hangingHeight + objectHeight, curDepth));
                texVerts.push(vec2(-1, 1));

                norms.push(norm2small, norm2small, norm2, norm2small, norm2, norm2);
            }
        }
    }
    return [verts, norms, texVerts];
}

// Vertices for moving object/person
function getPersonVertices(type) {
    var verts = [];
    var norms = [];
    var texVerts = [];

    var personX = womanX - torsoWidth / 2;
    var personZ = womanZ - torsoWidth / 2;
    var headX = womanX - headWidth / 2;
    var headZ = womanZ - headWidth / 2;

    if (type == 0) {
        // skinny box for body
        verts.push(vec3(personX, torsoHeight, personZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(personX, 0, personZ));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(personX + torsoWidth, torsoHeight, personZ));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(personX + torsoWidth, 0, personZ));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(personX, 0, personZ));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(personX + torsoWidth, torsoHeight, personZ));
        texVerts.push(vec2(1, 1));

        verts.push(vec3(personX, torsoHeight, personZ + torsoWidth));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(personX, 0, personZ + torsoWidth));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(personX + torsoWidth, torsoHeight, personZ + torsoWidth));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(personX + torsoWidth, 0, personZ + torsoWidth));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(personX, 0, personZ + torsoWidth));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(personX + torsoWidth, torsoHeight, personZ + torsoWidth));
        texVerts.push(vec2(1, 1));

        verts.push(vec3(personX, torsoHeight, personZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(personX, torsoHeight, personZ + torsoWidth));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(personX, 0, personZ + torsoWidth));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(personX, torsoHeight, personZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(personX, 0, personZ));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(personX, 0, personZ + torsoWidth));
        texVerts.push(vec2(1, 0));

        verts.push(vec3(personX + torsoWidth, torsoHeight, personZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(personX + torsoWidth, torsoHeight, personZ + torsoWidth));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(personX + torsoWidth, 0, personZ + torsoWidth));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(personX + torsoWidth, torsoHeight, personZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(personX + torsoWidth, 0, personZ));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(personX + torsoWidth, 0, personZ + torsoWidth));
        texVerts.push(vec2(1, 0));

        for (var i = 0; i < 24; i++)
            norms.push(vec3(1.0, 1.0, 1.0));
    } else {
        // bigger box for head
        verts.push(vec3(headX, personHeight, headZ));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(headX, personHeight, headZ + headWidth));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(headX + headWidth, personHeight, headZ));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(headX, personHeight, headZ + headWidth));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(headX + headWidth, personHeight, headZ));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(headX + headWidth, personHeight, headZ + headWidth));
        texVerts.push(vec2(1, 1));

        verts.push(vec3(headX, personHeight, headZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(headX, torsoHeight, headZ));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(headX + headWidth, personHeight, headZ));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(headX + headWidth, torsoHeight, headZ));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(headX, torsoHeight, headZ));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(headX + headWidth, personHeight, headZ));
        texVerts.push(vec2(1, 1));

        verts.push(vec3(headX, personHeight, headZ + headWidth));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(headX, torsoHeight, headZ + headWidth));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(headX + headWidth, personHeight, headZ + headWidth));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(headX + headWidth, torsoHeight, headZ + headWidth));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(headX, torsoHeight, headZ + headWidth));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(headX + headWidth, personHeight, headZ + headWidth));
        texVerts.push(vec2(1, 1));

        verts.push(vec3(headX, personHeight, headZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(headX, personHeight, headZ + headWidth));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(headX, torsoHeight, headZ + headWidth));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(headX, personHeight, headZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(headX, torsoHeight, headZ));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(headX, torsoHeight, headZ + headWidth));
        texVerts.push(vec2(1, 0));

        verts.push(vec3(headX + headWidth, personHeight, headZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(headX + headWidth, personHeight, headZ + headWidth));
        texVerts.push(vec2(1, 1));
        verts.push(vec3(headX + headWidth, torsoHeight, headZ + headWidth));
        texVerts.push(vec2(1, 0));
        verts.push(vec3(headX + headWidth, personHeight, headZ));
        texVerts.push(vec2(0, 1));
        verts.push(vec3(headX + headWidth, torsoHeight, headZ));
        texVerts.push(vec2(0, 0));
        verts.push(vec3(headX + headWidth, torsoHeight, headZ + headWidth));
        texVerts.push(vec2(1, 0));

        for (var i = 0; i < 30; i++)
            norms.push(vec3(1.0, 1.0, 1.0));
    }

    return [verts, norms, texVerts];
}