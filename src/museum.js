// Main
function bodyLoaded() {
    setupCanvas();
    configureWebgl();
    setupShaders();
    restart();

    requestAnimationFrame(render);
}

function setupCanvas() {
    // Set up canvas, context, etc.
    canvas = document.getElementById("gl-canvas");

    aspect = canvas.width / canvas.height;
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl)
        alert("WebGL isn't available");
}

function configureWebgl() {
    // Initial webgl configuration settings
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function setupShaders() {
    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Data locations
    gl.bindAttribLocation(program, 0, "vPosition");
    gl.bindAttribLocation(program, 1, "vNormal");
    gl.bindAttribLocation(program, 2, "vTexCoord");

    positionLocation = gl.getAttribLocation(program, "vPosition");
    normalLocation = gl.getAttribLocation(program, "vNormal");
    vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    matrixLocation = gl.getUniformLocation(program, "matrix");
    vTexCoord = gl.getAttribLocation(program, "vTexCoord");

    gl.uniform4fv(gl.getUniformLocation(program, "vColor"), vec4(1.0, 1.0, 0.0, 1.0));

    // Set up buffer for vertices
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer(positionLocation, itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    // Set up buffer for normals
    nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer(normalLocation, itemSize, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLocation);

    // Set up buffer for texture vertices
    tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);
}

function render(now) {
    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Keep timing consistent on all machines
    now *= .001;
    var deltaTime = now - then;
    then = now;

    renderRoom(deltaTime, light_ON);
    updateMovement(deltaTime);

    // Fade previous song out
    if (prevSong) {
        var newVol = prevSong.volume - deltaTime * 0.25;
        if (newVol <= 0) {
            prevSong.pause();
            prevSong = null;
        } else { prevSong.volume = newVol; }
    }

    // Fade current song in
    if (curRoom.song) {
        var newVol = curRoom.song.volume + deltaTime * 0.10;
        if (newVol > 1) { curRoom.song.volume = 1.0; } else { curRoom.song.volume = newVol; }
    }

    requestAnimationFrame(render);
}

function renderRoom(deltaTime, light_ON) {
    var room = rooms[curRoomIndex];
    var verts;

    setLighting(light_ON);

    // Draw walls
    if (!room.hasRendered)
        room.verts["walls"] = getRoomVertices(room, room.wallTexture.scale);
    vertices = room.verts["walls"][0];
    normals = room.verts["walls"][1];
    texVertices = room.verts["walls"][2];
    if (room.wallTexture.src != false) {
        configureTexture(room.wallTexture);
        renderCurrentVertices();
    }

    // Draw doors
    if (!room.hasRendered)
        room.verts["doors"] = getWallObjectVertices(room.doors, room, WALL_OBJECT.DOORS);
    vertices = room.verts["doors"][0];
    normals = room.verts["doors"][1];
    texVertices = room.verts["doors"][2];
    configureTexture(door);
    renderCurrentVertices();

    // Draw floor & ceiling
    if (!room.hasRendered)
        room.verts["floor"] = getFloorVertices(room, groundHeight, room.floorTexture.scale);
    vertices = room.verts["floor"][0];
    normals = room.verts["floor"][1];
    texVertices = room.verts["floor"][2];
    configureTexture(room.floorTexture);
    renderCurrentVertices();
    if (!room.hasRendered)
        room.verts["ceiling"] = getFloorVertices(room, wallHeight, room.ceilingTexture.scale);
    if (renderCeiling) {
        vertices = room.verts["ceiling"][0];
        normals = room.verts["ceiling"][1]
        texVertices = room.verts["ceiling"][2];
        configureTexture(room.ceilingTexture);
        renderCurrentVertices();
    }

    // Draw paintings
    paintings = room.paintings;
    for (var i = 0; i < paintings.length; i++) {
        verts = getWallObjectVertices([paintings[i]], room, WALL_OBJECT.PAINTINGS);
        vertices = verts[0];
        normals = verts[1];
        texVertices = verts[2];
        configureTexture(paintings[i][2]);
        renderCurrentVertices();

    }

    // Draw museum visitor, only in exhibit rooms
    if (curRoomIndex != ROOMS.LOBBY && curRoomIndex != ROOMS.HALLWAY &&
        curRoomIndex != ROOMS.ELEVATOR) {
        var womanCoords = getWomanPosition(deltaTime);
        womanX = womanCoords[0];
        womanZ = womanCoords[1];
        checkWomanCollision();
        // Body
        verts = getPersonVertices(0);
        vertices = verts[0];
        normals = verts[1];
        texVertices = verts[2];
        configureTexture(plaid);
        renderCurrentVertices();

        // Head
        verts = getPersonVertices(1);
        vertices = verts[0];
        normals = verts[1];
        texVertices = verts[2];
        configureTexture(wonderingwoman);
        renderCurrentVertices();
    }

    renderCurrentVertices();

    if (!room.hasRendered)
        room.hasRendered = true;
}

function renderCurrentVertices() {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(vertices)), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(texVertices)), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(normals)), gl.STATIC_DRAW);

    applyTransforms(noTranslation, noRotation, noScale);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);

}

function getWomanPosition(deltaTime) {
    womanTimer += deltaTime;
    var contemplationTime = Math.random() * 6 + 4;
    if (womanTimer > contemplationTime) {
        pickRandomPainting();
        if (prevPaintingNum != paintingNum) // need to move to next painting
            womanTimer = -100;
        else
            womanTimer = 2; // don't stay as long
    }
    if (womanTimer >= 0)
        return paintingCoords;
    else { // on the move
        var posX = womanX;
        var posZ = womanZ;
        if (Math.abs(paintingCoords[0] - posX) > 0.1) {
            if (posX < paintingCoords[0])
                posX += WOMAN_SPEED * deltaTime;
            else if (posX > paintingCoords[0])
                posX -= WOMAN_SPEED * deltaTime;
        }
        if (Math.abs(paintingCoords[1] - posZ) > 0.1) {
            if (posZ < paintingCoords[1])
                posZ += WOMAN_SPEED * deltaTime;
            else if (posZ > paintingCoords[1])
                posZ -= WOMAN_SPEED * deltaTime;
        }
        if (Math.abs(paintingCoords[0] - posX) <= 0.1 && Math.abs(paintingCoords[1] - posZ) <= 0.1)
            womanTimer = 0;
        return [posX, posZ];
    }
}

function getContemplationPosition() {
    var painting = curRoom.paintings[paintingNum];
    if (painting == null)
        return [0, 0];
    var walls = curRoom.walls;
    var leftBorder = walls[0][0];
    var rightBorder = walls[2][0];
    var bottomBorder = walls[0][1];
    var topBorder = walls[2][1];

    var posX = painting[0];
    var posZ = topBorder + standingDistance;
    if (painting[1] == leftBorder) {
        posX = leftBorder + standingDistance;
        posZ = painting[0];
    } else if (painting[1] == rightBorder) {
        posX = rightBorder - standingDistance;
        posZ = painting[0];
    } else if (painting[1] == bottomBorder) {
        posX = painting[0];
        posZ = bottomBorder - standingDistance;
    }
    return [posX, posZ];
}

function pickRandomPainting() {
    var len = curRoom.paintings.length;
    prevPaintingNum = paintingNum;
    prevPaintingCoords = getContemplationPosition();
    paintingNum = Math.floor(Math.random() * len);
    paintingCoords = getContemplationPosition();
}

function resetWoman() {
    paintingNum = 0;
    womanTimer = 0;
    pickRandomPainting();
}

function checkWomanCollision() {
    var leftBorder = womanX - shoveRadius / 2;
    var rightBorder = leftBorder + shoveRadius;
    var bottomBorder = womanZ + shoveRadius / 2;
    var topBorder = womanZ - shoveRadius;
    var posX = -camX;
    var posZ = -camZ;
    if (posX > leftBorder && posX < rightBorder && posZ < bottomBorder && posZ > topBorder) {
        // Collision, say hi to the user
        shoveSound.play();
        var left = Math.abs(leftBorder - posX);
        var right = Math.abs(rightBorder - posX);
        var top = Math.abs(topBorder - posZ);
        var bottom = Math.abs(bottomBorder - posZ);
        var min = Math.min(left, right, top, bottom);
        switch (min) {
            case left:
                camX += shoveDistance;
                break;
            case right:
                camX -= shoveDistance;
                break;
            case top:
                camZ += shoveDistance;
                break;
            case bottom:
                camZ -= shoveDistance;
                break;
            default:
                console.log("bad");
        }
    }
}

function applyTransforms(translation, rotation, scaleFactor) {
    // Compute matrices
    var perspectiveMatrix = perspective(fov, aspect, 1, 100);
    var translationMatrix = translate(translation[0], translation[1], translation[2]);
    var rotationMatrix = rotate(rotation, [1, 1, 1]);
    var scaleMatrix = scale(scaleFactor, scaleFactor, scaleFactor);

    // Extra camera matrices
    var azimMatrix = rotate(azim, [0, 1, 0]);
    var pitchMatrix = rotate(pitch, [1, 0, 0]);

    var camTransMatrix = translate(camX, -camY, camZ);

    // Multiply matrices
    matrix = mult(scaleMatrix, rotationMatrix);
    matrix = mult(matrix, translationMatrix);
    matrix = mult(matrix, camTransMatrix);
    matrix = mult(matrix, azimMatrix);
    matrix = mult(matrix, pitchMatrix);
    matrix = mult(matrix, perspectiveMatrix);

    // Send to shader
    gl.uniformMatrix4fv(matrixLocation, false, flatify(matrix));
}

// Setup lighting and position
function setLighting(useLighting) {

    var room = rooms[curRoomIndex];
    var lightPosition = vec3(-10.0, 10.0, 10.0, 1.0);

    if (useLighting == 1) {
        ambientProduct = room.lighting.ambient;
        diffuseProduct = room.lighting.diffuse;
        specularProduct = room.lighting.specular;
        lightColor = room.lighting.lightColor;

    }
    if (useLighting == 0) {
        ambientProduct = room.lighting.ambient_off;
        diffuseProduct = room.lighting.diffuse;
        specularProduct = room.lighting.specular;
        lightColor = room.lighting.lightColor_off;
    }
    if (useLighting == 2) {
        ambientProduct = room.lighting.ambient_red;
        diffuseProduct = room.lighting.diffuse;
        specularProduct = room.lighting.specular;
        lightColor = room.lighting.lightColor_red;
    }
    if (useLighting == 3) {
        ambientProduct = room.lighting.ambient_blue;
        diffuseProduct = room.lighting.diffuse;
        specularProduct = room.lighting.specular;
        lightColor = room.lighting.lightColor_blue;
    }
    if (useLighting == 4) {
        ambientProduct = room.lighting.ambient_green;
        diffuseProduct = room.lighting.diffuse;
        specularProduct = room.lighting.specular;
        lightColor = room.lighting.lightColor_green;
    }
    if (useLighting == 5) {
        ambientProduct = room.lighting.ambient;
        diffuseProduct = room.lighting.diffuse;
        specularProduct = room.lighting.specular;
        lightColor = room.lighting.lightColor;
        lightPosition = vec3(-10.0, 10.0, -10.0, 1.0);
    }
    if (useLighting == 6) {
        ambientProduct = room.lighting.ambient;
        diffuseProduct = room.lighting.diffuse;
        specularProduct = room.lighting.specular;
        lightColor = room.lighting.lightColor;
        lightPosition = vec3(10.0, 10.0, -10.0, 1.0);
    }
    if (useLighting == 7) {
        ambientProduct = room.lighting.ambient;
        diffuseProduct = room.lighting.diffuse;
        specularProduct = room.lighting.specular;
        lightColor = room.lighting.lightColor;
        lightPosition = vec3(10.0, -10.0, 10.0, 1.0);
    }

    gl.uniform4fv(gl.getUniformLocation(program, "vAmbientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "vDiffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "vSpecularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "vLightColor"), flatten(lightColor));
    gl.uniform3fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));
}

function attemptMove(axis, dist) {
    var walls = curRoom.walls;
    var doors = curRoom.doors;

    // square room, walls defined in clockwise order from bottom-right corner
    var leftBorder = walls[0][0];
    var rightBorder = walls[2][0];
    var bottomBorder = walls[0][1];
    var topBorder = walls[2][1];

    var newCamX = -camX;
    var newCamZ = -camZ;
    if (axis == 0) {
        newCamX -= Math.sin(radians(azim + 90)) * dist;
        newCamZ -= Math.cos(radians(azim + 90)) * dist;
    } else {
        newCamX -= Math.sin(radians(azim)) * dist;
        newCamZ -= Math.cos(radians(azim)) * dist;
    }

    var movingRight = false;
    var movingUp = false;
    var movingDown = false;
    if (newCamX > -camX)
        movingRight = true;
    if (newCamZ < -camZ)
        movingUp = true;
    if (newCamX < -camX)
        movingLeft = true;
    if (newCamZ > -camZ)
        movingDown = true;

    // First check if you've entered a door
    for (var i = 0; i < doors.length; i++) {
        var curDoor = doors[i];
        if (doors[i][1] == leftWall || doors[i][1] == midLeftWall || doors[i][1] == midRightWall || doors[i][1] == rightWall) { // Door goes north-south
            if (newCamZ > curDoor[0] - doorWidth / 2 && newCamZ < curDoor[0] + doorWidth / 2 && Math.abs(curDoor[1] - newCamX) < doorDepth) {

                // Check movement direction so you don't switch back and forth between rooms
                if (curDoor[1] == rightBorder && movingRight || curDoor[1] == leftBorder && !movingRight) {
                    if (curRoom.song) {
                        if (prevSong) { prevSong.pause(); }
                        prevSong = curRoom.song;
                    }
                    curRoomIndex = curDoor[2];
                    curRoom = rooms[curRoomIndex];
                    resetWoman();
                    wallHeight = curRoom.wallHeight * globalScale;
                    lightHeight = wallHeight - 1;
                    movingRight ? camX -= 1 : camX += 1;
                    if (!muted) {
                        doorSound.play();
                        if (curRoom.song) {
                            curRoom.song.load();
                            curRoom.song.volume = 0.0;
                            curRoom.song.play();
                            curRoom.song.loop = true;
                        }
                    }
                }
            }
        } else { // Door goes east-west
            if (newCamX > curDoor[0] - doorWidth / 2 && newCamX < curDoor[0] + doorWidth / 2 &&
                Math.abs(curDoor[1] - newCamZ) < doorDepth) {
                // Check movement direction so you don't switch back and forth between rooms
                if (curDoor[1] == topBorder && movingUp || curDoor[1] == bottomBorder && movingDown) {
                    if (curRoom.song) {
                        if (prevSong) { prevSong.pause(); }
                        prevSong = curRoom.song;
                    }
                    curRoomIndex = curDoor[2];
                    curRoom = rooms[curRoomIndex];
                    resetWoman();
                    wallHeight = curRoom.wallHeight * globalScale;
                    lightHeight = wallHeight - 1;
                    movingUp ? camZ += 1 : camZ -= 1;
                    if (!muted) {
                        doorSound.play();
                        if (curRoom.song) {
                            curRoom.song.load();
                            curRoom.song.volume = 0.0;
                            curRoom.song.play();
                            curRoom.song.loop = true;
                        }
                    }
                }
            }
        }
    }

    if (newCamX > leftBorder + WALL_GAP && newCamX < rightBorder - WALL_GAP &&
        newCamZ < bottomBorder - WALL_GAP && newCamZ > topBorder + WALL_GAP) // Move freely
        transCam(axis, dist);
    else { // Move against the wall at an angle

        var azimOffset = 0;
        if (aHeld || dHeld)
            azimOffset = 90;

        if (newCamX < leftBorder + WALL_GAP ||
            newCamX > rightBorder - WALL_GAP) { // left and right walls

            newCamZ = -camZ - Math.cos(radians(azim + azimOffset)) * dist;
            if (newCamZ < bottomBorder - WALL_GAP &&
                newCamZ > topBorder + WALL_GAP) {
                camZ = -newCamZ;
            }
        } else if (newCamZ < topBorder + WALL_GAP ||
            newCamZ > bottomBorder - WALL_GAP) { // top and bottom walls
            newCamX = -camX + Math.cos(radians(azim + 90 + azimOffset)) * dist;
            if (newCamX < rightBorder - WALL_GAP &&
                newCamX > leftBorder + WALL_GAP) {
                camX = -newCamX;
            }
        }
    }
    checkWomanCollision();
}

// Convert the given distance to changes in global X and Z coordinates based on the azimuth
function transCam(axis, dist) {
    if (axis == 0) { //X axis
        camX += Math.sin(radians(azim + 90)) * dist;
        camZ += Math.cos(radians(azim + 90)) * dist;
    } else if (axis == 1) { //Z axis
        camX += Math.sin(radians(azim)) * dist;
        camZ += Math.cos(radians(azim)) * dist;
    }
}

// From notes/slides
function configureTexture(tex) {
    var image = document.getElementById(tex.src);
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function moveCallback(e) {
    var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    azim -= 0.2 * movementX;
    if (azim < -360 || azim > 360) {
        azim = 0;
    }
    pitch -= 0.3 * movementY;
    if (pitch > 75)
        pitch = 75;
    if (pitch < -75)
        pitch = -75;
}

function updateMovement(delta) {
    if (wHeld)
        attemptMove(1, MOVEMENT_SPEED * delta);
    if (aHeld)
        attemptMove(0, MOVEMENT_SPEED * delta);
    if (sHeld)
        attemptMove(1, -MOVEMENT_SPEED * delta);
    if (dHeld)
        attemptMove(0, -MOVEMENT_SPEED * delta);
    if (rightHeld)
        azim -= 2;
    if (leftHeld)
        azim += 2;
}

document.onkeydown = keyPressed;
document.onkeyup = keyUpHandler;

function keyPressed(e) {

    switch (e.keyCode) {
        case 27: // esc
            toggleFullscreen();
            break;
        case 37: //left
            leftHeld = true;
            break;
        case 38: //up
            pitch += 2;
            break;
        case 39: //right
            rightHeld = true;
            break;
        case 40: //down
            pitch -= 2;
            break;
        case 49: //1
            light_ON = 5;
            break;
        case 50: //2
            light_ON = 6;
            break;
        case 51: //3
            light_ON = 7;
            break;
        case 65: //a
            aHeld = true;
            break;
        case 66: //key B for blue light
            light_ON = 4;
            break;
        case 68: //d
            dHeld = true;
            break;
        case 70: //f
            toggleFullscreen();
            break;
        case 71: //key G for green light
            light_ON = 3;
            break;
        case 76: //Key L to toggel light (On/Off)
            if (light_ON == 1)
                light_ON = 0;
            else
                light_ON = 1;
            break;
        case 77: //m
            muted = !muted;
            if (curRoom.song.paused)
                curRoom.song.play();
            else
                curRoom.song.pause();
            break;
        case 80: //p
            restart();
            break;
        case 82: //key R for red light
            light_ON = 2;
            break;
        case 83: //s
            sHeld = true;
            break;
        case 87: //w
            wHeld = true;
            break;
    }
}

function keyUpHandler(e) {
    switch (e.keyCode) {
        case 37: //left
            leftHeld = false;
            break;
        case 39: //right
            rightHeld = false;
            break;
        case 65: //a
            aHeld = false;
            break;
        case 68: //d
            dHeld = false;
            break;
        case 83: //s
            sHeld = false;
            break;
        case 87: //w
            wHeld = false;
            break;
    }
}

function restart() {
    if (prevSong) { prevSong.pause(); }
    if (curRoom.song) { curRoom.song.pause(); }

    fov = initFOV;
    camX = initCamX;
    camY = initCamY;
    camZ = initCamZ;
    azim = initAzim;
    pitch = initPitch;
    curRoomIndex = 0;
    curRoom = rooms[0];

    wallHeight = curRoom.wallHeight * globalScale;
    lightHeight = wallHeight - 1;
    hallway.doors[0][2] = ROOMS.LOBBY;

    elevator.paintings[0][2] = notice;
    hallway.doors[0][2] = ROOMS.LOBBY;
    hallway.doors[1][2] = ROOMS.ROOM3;
    hallway.doors[2][2] = ROOMS.ROOM1;
    hallway.doors[3][2] = ROOMS.ROOM2;
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
    fullScreenEnabled = false;
    canvas.width = INITIAL_CANVAS_WIDTH;
    canvas.height = INITIAL_CANVAS_HEIGHT;
    aspect = canvas.width / canvas.height;
    console.log("exit")
}

function toggleFullscreen() {
    var canvas = document.getElementById("gl-canvas");

    if (fullScreenEnabled == true) {
        exitFullscreen();
        document.removeEventListener("mousemove", this.moveCallback, false);
    } else {
        canvas.requestPointerLock();
        document.addEventListener("mousemove", this.moveCallback, false);
        canvas.requestFullscreen();

        fullScreenEnabled = true;
        canvas.width = screen.width;
        canvas.height = screen.height;
        aspect = canvas.width / canvas.height;
        console.log("enter fullscreen")
    }
    gl.viewport(0, 0, canvas.width, canvas.height);

}