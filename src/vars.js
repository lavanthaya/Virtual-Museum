// ---------------- CONSTANTS --------------- //
INITIAL_CANVAS_WIDTH = 960;
INITIAL_CANVAS_HEIGHT = 540;
MOVEMENT_SPEED = 12;
WOMAN_SPEED = 5;
WALL_GAP = 0.4;
INCHES_SCALE = 0.15;

// ---------------- GLOBALS ---------------- //
var gl;
var light_ON = 1;

var fullScreenEnabled = false;

var vertices = [];
var texVertices = [];

var muted = false;

var itemSize = 3;

// Map variables
var globalScale = 1.5;
var textureScale = .05;

var bottomFloor = true;

var groundHeight = 0;
var wallHeight = 10 * globalScale;
var lightHeight = wallHeight - 1;

var doorWidth = 4 * globalScale;
var doorHeight = 7 * globalScale;
var doorDepth = 0.5;
var visibleDoorDepth = 0.1;
var doorSound = new Audio("/img/door.wav");
var prevSong = null;

var torsoWidth = 3;
var headWidth = 4;
var shoveRadius = 5;
var torsoHeight = 6;
var personHeight = 9;
var standingDistance = 8;
var womanX = 0;
var womanZ = 0;
var womanTimer = 0;
var prevPaintingNum = 0;
var prevPaintingCoords = [0, 0];
var paintingNum = 0;
var paintingCoords = [0, 0];
var shoveDistance = headWidth - 1;
var shoveSound = new Audio("/img/shove.ogg");

var leftWall = 0 * globalScale;
var midLeftWall = 30 * globalScale;
var midRightWall = 50 * globalScale;
var rightWall = 75 * globalScale;

var bottomWall = -1 * globalScale;
var midBottomWall = -20 * globalScale;
var midTopWall = -45 * globalScale;
var topWall = -70 * globalScale;
var topStairWall = -85 * globalScale;

// Museum variables
var initCamX = -60;
var initCamY = 8;
var initCamZ = 10;
var initAzim = 0;
var initPitch = -10;
var initFOV = 30;

var camX = initCamX;
var camY = initCamY;
var camZ = initCamZ;
var azim = initAzim;
var pitch = initPitch;
var fov = initFOV;

var wHeld = false;
var aHeld = false;
var sHeld = false;
var dHeld = false;
var leftHeld = false;
var rightHeld = false;

var rotationSpeed = 360;
var rotVal = 0;
var then = 0;

var noTranslation = [0, 0, 0];
var noRotation = 0;
var noScale = [1, 1, 1];

var curRoomIndex = 0;
var renderCeiling = true;

var pathWidth = 10;
var pathLength = 40;
var pathStart = 50;


var norm1 = vec3(0, 0, 1);
var norm1small = vec3(0, 0, 0.5);
var norm2 = vec3(0, 0, -1);
var norm2small = vec3(0, 0, -0.5);
var norm3 = vec3(1, 0, 0);
var norm3small = vec3(0.5, 0, 0);
var norm4 = vec3(-1, 0, 0);
var norm4small = vec3(-0.5, 0, 0);
var norm4big = vec3(-1.5, 0, 0);

var ROOMS = {
    LOBBY: 0,
    HALLWAY: 1,
    ROOM1: 2,
    ROOM2: 3,
    ROOM3: 4,
    ELEVATOR: 5

};
var WALL_OBJECT = {
    DOORS: 0,
    PAINTINGS: 1
};