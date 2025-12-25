import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Game state
const gameState = {
    players: [
        { score: 0, name: 'Player 1' },
        { score: 0, name: 'Player 2' }
    ],
    currentPlayer: 0,
    turnScore: 0,
    isRolling: false,
    targetScore: 100
};

// Scene setup - Farm scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue
scene.fog = new THREE.Fog(0x87CEEB, 15, 60);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 12);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 30;
controls.maxPolarAngle = Math.PI / 2.2;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
scene.add(directionalLight);

// Ground - Grassy field
const groundGeometry = new THREE.PlaneGeometry(40, 40);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x7cb342, // Green grass color
    roughness: 0.9,
    metalness: 0.1
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Add grass patches for texture
for (let i = 0; i < 200; i++) {
    const grassGeometry = new THREE.CylinderGeometry(0.03 + Math.random() * 0.02, 0.03 + Math.random() * 0.02, 0.08 + Math.random() * 0.12, 6);
    const grassMaterial = new THREE.MeshStandardMaterial({ 
        color: new THREE.Color().setHSL(0.25 + Math.random() * 0.1, 0.6 + Math.random() * 0.2, 0.3 + Math.random() * 0.2)
    });
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.position.set(
        (Math.random() - 0.5) * 38,
        0.04 + Math.random() * 0.04,
        (Math.random() - 0.5) * 38
    );
    grass.rotation.y = Math.random() * Math.PI * 2;
    grass.rotation.x = (Math.random() - 0.5) * 0.2;
    scene.add(grass);
}

// Create cow
function createCow() {
    const cowGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(1.2, 0.8, 1.5);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.8
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    cowGroup.add(body);
    
    // Spots
    const spotGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const spotMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    for (let i = 0; i < 8; i++) {
        const spot = new THREE.Mesh(spotGeometry, spotMaterial);
        spot.position.set(
            (Math.random() - 0.5) * 1,
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 1.2
        );
        body.add(spot);
    }
    
    // Head
    const headGeometry = new THREE.BoxGeometry(0.6, 0.5, 0.6);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0.8, 0.2, 0);
    head.castShadow = true;
    cowGroup.add(head);
    
    // Ears
    const earGeometry = new THREE.ConeGeometry(0.15, 0.2, 6);
    const ear1 = new THREE.Mesh(earGeometry, bodyMaterial);
    ear1.position.set(0.9, 0.3, 0.2);
    ear1.rotation.z = -Math.PI / 6;
    cowGroup.add(ear1);
    const ear2 = new THREE.Mesh(earGeometry, bodyMaterial);
    ear2.position.set(0.9, 0.3, -0.2);
    ear2.rotation.z = Math.PI / 6;
    cowGroup.add(ear2);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
    const legPositions = [
        [0.4, -0.6, 0.5],
        [-0.4, -0.6, 0.5],
        [0.4, -0.6, -0.5],
        [-0.4, -0.6, -0.5]
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, bodyMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        cowGroup.add(leg);
    });
    
    // Tail
    const tailGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 6);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.position.set(-0.7, 0, -0.3);
    tail.rotation.z = Math.PI / 4;
    cowGroup.add(tail);
    
    return cowGroup;
}

// Create chicken
function createChicken() {
    const chickenGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.SphereGeometry(0.3, 12, 12);
    bodyGeometry.scale(1, 1.2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    chickenGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.15, 12, 12);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0.35, 0.2, 0);
    head.castShadow = true;
    chickenGroup.add(head);
    
    // Beak
    const beakGeometry = new THREE.ConeGeometry(0.05, 0.1, 6);
    const beakMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const beak = new THREE.Mesh(beakGeometry, beakMaterial);
    beak.rotation.z = Math.PI / 2;
    beak.position.set(0.45, 0.2, 0);
    chickenGroup.add(beak);
    
    // Comb
    const combGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.05);
    const combMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const comb = new THREE.Mesh(combGeometry, combMaterial);
    comb.position.set(0.35, 0.35, 0);
    chickenGroup.add(comb);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 6);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0xffa500 });
    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(0.15, -0.4, 0.1);
    leg1.castShadow = true;
    chickenGroup.add(leg1);
    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(-0.15, -0.4, 0.1);
    leg2.castShadow = true;
    chickenGroup.add(leg2);
    
    // Wings
    const wingGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    wingGeometry.scale(0.5, 1, 1);
    const wing1 = new THREE.Mesh(wingGeometry, bodyMaterial);
    wing1.position.set(0, 0, 0.3);
    chickenGroup.add(wing1);
    const wing2 = new THREE.Mesh(wingGeometry, bodyMaterial);
    wing2.position.set(0, 0, -0.3);
    chickenGroup.add(wing2);
    
    return chickenGroup;
}

// Create sheep
function createSheep() {
    const sheepGroup = new THREE.Group();
    
    // Body (woolly)
    const bodyGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    bodyGeometry.scale(1.2, 1, 1.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf5f5f5,
        roughness: 0.9
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    sheepGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 12, 12);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0.7, 0.1, 0);
    head.castShadow = true;
    sheepGroup.add(head);
    
    // Ears
    const earGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    earGeometry.scale(0.5, 1, 0.3);
    const ear1 = new THREE.Mesh(earGeometry, bodyMaterial);
    ear1.position.set(0.8, 0.2, 0.2);
    sheepGroup.add(ear1);
    const ear2 = new THREE.Mesh(earGeometry, bodyMaterial);
    ear2.position.set(0.8, 0.2, -0.2);
    sheepGroup.add(ear2);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const legPositions = [
        [0.3, -0.5, 0.4],
        [-0.3, -0.5, 0.4],
        [0.3, -0.5, -0.4],
        [-0.3, -0.5, -0.4]
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        sheepGroup.add(leg);
    });
    
    return sheepGroup;
}

// Create hay bale
function createHayBale() {
    const hayGroup = new THREE.Group();
    const hayGeometry = new THREE.BoxGeometry(1, 0.8, 1.2);
    const hayMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd4a574,
        roughness: 0.9
    });
    const hay = new THREE.Mesh(hayGeometry, hayMaterial);
    hay.castShadow = true;
    hay.receiveShadow = true;
    hayGroup.add(hay);
    return hayGroup;
}

// Create fence post - simple cylindrical post with rounded top
function createFencePost() {
    const postGroup = new THREE.Group();
    
    // Main post - uniform cylindrical post
    const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.0, 12);
    const postMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4a3728, // Dark brown
        roughness: 0.9
    });
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.y = 0.5; // Center the post so base is at y=0
    post.castShadow = true;
    post.receiveShadow = true;
    postGroup.add(post);
    
    // Rounded top cap
    const capGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    capGeometry.scale(1, 0.4, 1);
    const cap = new THREE.Mesh(capGeometry, postMaterial);
    cap.position.y = 1.0;
    cap.castShadow = true;
    postGroup.add(cap);
    
    return postGroup;
}

// Add farm animals watching the game - OUTSIDE the boxing ring
const animals = [];
const animalDistance = 8.5; // Outside the ring (ring is at ~3 radius)

// Helper function to make animals look at center
function lookAtCenter(obj, centerY = 0) {
    const center = new THREE.Vector3(0, centerY, 0);
    const direction = center.clone().sub(obj.position).normalize();
    const angle = Math.atan2(direction.x, direction.z);
    obj.rotation.y = angle;
}

// Cows watching - outside fence
for (let i = 0; i < 3; i++) {
    const cow = createCow();
    const angle = (i / 3) * Math.PI * 2;
    cow.position.set(
        Math.cos(angle) * animalDistance,
        0.4,
        Math.sin(angle) * animalDistance
    );
    lookAtCenter(cow, 0.4);
    cow.castShadow = true;
    scene.add(cow);
    animals.push(cow);
}

// Chickens watching - outside fence
for (let i = 0; i < 4; i++) {
    const chicken = createChicken();
    const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
    chicken.position.set(
        Math.cos(angle) * animalDistance,
        0.15,
        Math.sin(angle) * animalDistance
    );
    lookAtCenter(chicken, 0.15);
    chicken.castShadow = true;
    scene.add(chicken);
    animals.push(chicken);
}

// Sheep watching - outside fence
for (let i = 0; i < 2; i++) {
    const sheep = createSheep();
    const angle = (i / 2) * Math.PI + Math.PI / 2;
    sheep.position.set(
        Math.cos(angle) * animalDistance,
        0.5,
        Math.sin(angle) * animalDistance
    );
    lookAtCenter(sheep, 0.5);
    sheep.castShadow = true;
    scene.add(sheep);
    animals.push(sheep);
}

// Create boxing ring
const ringSize = 12; // Size of the square ring (increased for bigger pigs)
const ringHeight = 0.3; // Height of the platform
const cornerPostHeight = 1.5;

// Boxing ring platform
const platformGeometry = new THREE.BoxGeometry(ringSize, ringHeight, ringSize);
const platformMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, // White canvas
    roughness: 0.7
});
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.position.y = ringHeight / 2;
platform.castShadow = true;
platform.receiveShadow = true;
scene.add(platform);

// Ring padding around the edges
const paddingGeometry = new THREE.BoxGeometry(ringSize + 0.4, 0.2, ringSize + 0.4);
const paddingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a, // Dark padding
    roughness: 0.8
});
const padding = new THREE.Mesh(paddingGeometry, paddingMaterial);
padding.position.y = ringHeight + 0.1;
padding.receiveShadow = true;
scene.add(padding);

// Inner padding (red)
const innerPaddingGeometry = new THREE.BoxGeometry(ringSize - 0.2, 0.15, ringSize - 0.2);
const innerPaddingMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xcc0000, // Red
    roughness: 0.8
});
const innerPadding = new THREE.Mesh(innerPaddingGeometry, innerPaddingMaterial);
innerPadding.position.y = ringHeight + 0.175;
innerPadding.receiveShadow = true;
scene.add(innerPadding);

// Corner posts
const cornerPostGeometry = new THREE.CylinderGeometry(0.12, 0.12, cornerPostHeight, 12);
const cornerPostMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2a2a2a, // Dark posts
    roughness: 0.9
});
const cornerPositions = [
    { x: ringSize / 2, z: ringSize / 2 },
    { x: -ringSize / 2, z: ringSize / 2 },
    { x: ringSize / 2, z: -ringSize / 2 },
    { x: -ringSize / 2, z: -ringSize / 2 }
];

cornerPositions.forEach(pos => {
    const post = new THREE.Mesh(cornerPostGeometry, cornerPostMaterial);
    post.position.set(pos.x, ringHeight + cornerPostHeight / 2, pos.z);
    post.castShadow = true;
    post.receiveShadow = true;
    scene.add(post);
});

// Boxing ring ropes (4 ropes at different heights) - SQUARE ropes
const ropeMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff, // White ropes
    roughness: 0.6
});
const ropeHeights = [0.5, 0.7, 0.9, 1.1]; // Four ropes at different heights
const ropeThickness = 0.03;
const ropeOffset = ringSize / 2; // Distance from center to rope

ropeHeights.forEach((height, ropeIndex) => {
    const yPos = ringHeight + height;
    
    // Create square ropes - four sides
    // Top side (positive Z)
    const topRope = new THREE.Mesh(
        new THREE.BoxGeometry(ringSize, ropeThickness, ropeThickness),
        ropeMaterial
    );
    topRope.position.set(0, yPos, ropeOffset);
    topRope.castShadow = true;
    scene.add(topRope);
    
    // Bottom side (negative Z)
    const bottomRope = new THREE.Mesh(
        new THREE.BoxGeometry(ringSize, ropeThickness, ropeThickness),
        ropeMaterial
    );
    bottomRope.position.set(0, yPos, -ropeOffset);
    bottomRope.castShadow = true;
    scene.add(bottomRope);
    
    // Right side (positive X)
    const rightRope = new THREE.Mesh(
        new THREE.BoxGeometry(ropeThickness, ropeThickness, ringSize),
        ropeMaterial
    );
    rightRope.position.set(ropeOffset, yPos, 0);
    rightRope.castShadow = true;
    scene.add(rightRope);
    
    // Left side (negative X)
    const leftRope = new THREE.Mesh(
        new THREE.BoxGeometry(ropeThickness, ropeThickness, ringSize),
        ropeMaterial
    );
    leftRope.position.set(-ropeOffset, yPos, 0);
    leftRope.castShadow = true;
    scene.add(leftRope);
    
    // Connect ropes to corner posts with turnbuckles
    cornerPositions.forEach(pos => {
        const turnbuckleGeometry = new THREE.BoxGeometry(0.08, 0.08, 0.15);
        const turnbuckleMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x444444,
            roughness: 0.8
        });
        const turnbuckle = new THREE.Mesh(turnbuckleGeometry, turnbuckleMaterial);
        turnbuckle.position.set(pos.x, yPos, pos.z);
        turnbuckle.position.x += pos.x > 0 ? -0.1 : 0.1;
        turnbuckle.position.z += pos.z > 0 ? -0.1 : 0.1;
        scene.add(turnbuckle);
    });
});

// Ring steps/stairs for access
const stepMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2a2a2a,
    roughness: 0.9
});
for (let i = 0; i < 3; i++) {
    const stepGeometry = new THREE.BoxGeometry(1.2, 0.1, 0.4 + i * 0.2);
    const step = new THREE.Mesh(stepGeometry, stepMaterial);
    step.position.set(ringSize / 2 + 0.6, i * 0.1, 0);
    step.castShadow = true;
    step.receiveShadow = true;
    scene.add(step);
}

// Add a simple barn in the background
const barnGroup = new THREE.Group();
const barnBaseGeometry = new THREE.BoxGeometry(3, 2, 4);
const barnMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.8
});
const barnBase = new THREE.Mesh(barnBaseGeometry, barnMaterial);
barnBase.position.y = 1;
barnBase.castShadow = true;
barnBase.receiveShadow = true;
barnGroup.add(barnBase);

// Barn roof
const roofGeometry = new THREE.ConeGeometry(2.5, 1.5, 4);
const roofMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B0000,
    roughness: 0.7
});
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.rotation.y = Math.PI / 4;
roof.position.y = 2.5;
roof.castShadow = true;
roof.receiveShadow = true;
barnGroup.add(roof);

barnGroup.position.set(-12, 0, -8);
barnGroup.rotation.y = Math.PI / 4;
scene.add(barnGroup);

// Create pig model
function createPig() {
    const pigGroup = new THREE.Group();
    
    // Body (ellipsoid)
    const bodyGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    bodyGeometry.scale(1, 0.7, 1.3);
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffb6c1,
        roughness: 0.7
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.receiveShadow = true;
    pigGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    headGeometry.scale(1.2, 0.9, 1);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(0.5, 0.1, 0);
    head.castShadow = true;
    head.receiveShadow = true;
    pigGroup.add(head);
    
    // Snout
    const snoutGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.2, 8);
    const snout = new THREE.Mesh(snoutGeometry, bodyMaterial);
    snout.rotation.z = Math.PI / 2;
    snout.position.set(0.75, 0.1, 0);
    snout.castShadow = true;
    pigGroup.add(snout);
    
    // Nostrils
    const nostrilGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const nostrilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const nostril1 = new THREE.Mesh(nostrilGeometry, nostrilMaterial);
    nostril1.position.set(0.85, 0.08, 0.05);
    pigGroup.add(nostril1);
    const nostril2 = new THREE.Mesh(nostrilGeometry, nostrilMaterial);
    nostril2.position.set(0.85, 0.12, 0.05);
    pigGroup.add(nostril2);
    
    // Ears
    const earGeometry = new THREE.ConeGeometry(0.15, 0.2, 8);
    const ear1 = new THREE.Mesh(earGeometry, bodyMaterial);
    ear1.rotation.z = -Math.PI / 4;
    ear1.position.set(0.4, 0.3, 0.2);
    ear1.castShadow = true;
    pigGroup.add(ear1);
    const ear2 = new THREE.Mesh(earGeometry, bodyMaterial);
    ear2.rotation.z = Math.PI / 4;
    ear2.position.set(0.4, 0.3, -0.2);
    ear2.castShadow = true;
    pigGroup.add(ear2);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 8);
    const legs = [];
    const legPositions = [
        [0.15, -0.25, 0.25],
        [-0.15, -0.25, 0.25],
        [0.15, -0.25, -0.25],
        [-0.15, -0.25, -0.25]
    ];
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, bodyMaterial);
        leg.position.set(pos[0], pos[1], pos[2]);
        leg.castShadow = true;
        leg.receiveShadow = true;
        pigGroup.add(leg);
        legs.push(leg);
    });
    
    // Tail
    const tailGeometry = new THREE.CylinderGeometry(0.03, 0.05, 0.3, 8);
    const tail = new THREE.Mesh(tailGeometry, bodyMaterial);
    tail.rotation.z = Math.PI / 3;
    tail.position.set(-0.5, 0, -0.2);
    tail.castShadow = true;
    pigGroup.add(tail);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const eye1 = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye1.position.set(0.6, 0.15, 0.15);
    pigGroup.add(eye1);
    const eye2 = new THREE.Mesh(eyeGeometry, eyeMaterial);
    eye2.position.set(0.6, 0.15, -0.15);
    pigGroup.add(eye2);
    
    pigGroup.userData = {
        originalRotation: new THREE.Euler(),
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Vector3(),
        isResting: false,
        restTime: 0
    };
    
    return pigGroup;
}

// Create two pigs - positioned on the boxing ring
const pig1 = createPig();
pig1.scale.set(2, 2, 2); // Make pigs 2x bigger
pig1.position.set(-1, ringHeight + 2, 0);
scene.add(pig1);

const pig2 = createPig();
pig2.scale.set(2, 2, 2); // Make pigs 2x bigger
pig2.position.set(1, ringHeight + 2, 0);
scene.add(pig2);

const pigs = [pig1, pig2];

// Physics simulation
function applyPhysics(pig, deltaTime) {
    const userData = pig.userData;
    
    // Gravity
    userData.velocity.y -= 9.8 * deltaTime;
    
    // Update position
    pig.position.add(userData.velocity.clone().multiplyScalar(deltaTime));
    
    // Update rotation
    pig.rotation.x += userData.angularVelocity.x * deltaTime;
    pig.rotation.y += userData.angularVelocity.y * deltaTime;
    pig.rotation.z += userData.angularVelocity.z * deltaTime;
    
    // Ground collision - pigs land on the boxing ring platform
    if (pig.position.y < ringHeight + 0.3) {
        pig.position.y = ringHeight + 0.3;
        userData.velocity.y *= -0.3; // Bounce with damping
        userData.velocity.x *= 0.8; // Friction
        userData.velocity.z *= 0.8;
        userData.angularVelocity.multiplyScalar(0.9); // Angular damping
    }
    
    // Check if resting
    const speed = userData.velocity.length();
    const angularSpeed = userData.angularVelocity.length();
    
    // More lenient resting detection - on the ring platform
    if (speed < 0.05 && angularSpeed < 0.05 && pig.position.y <= ringHeight + 0.35) {
        userData.restTime += deltaTime;
        if (userData.restTime > 0.3) { // Reduced from 0.5 to 0.3 seconds
            userData.isResting = true;
            userData.velocity.set(0, 0, 0);
            userData.angularVelocity.set(0, 0, 0);
        }
    } else {
        userData.restTime = 0;
        userData.isResting = false;
    }
}

// Determine pig position for scoring
function getPigPosition(pig) {
    // Normalize angles to -π to π range
    const normalizeAngle = (angle) => {
        angle = angle % (Math.PI * 2);
        if (angle > Math.PI) angle -= Math.PI * 2;
        if (angle < -Math.PI) angle += Math.PI * 2;
        return angle;
    };
    
    const normX = normalizeAngle(pig.rotation.x);
    const normZ = normalizeAngle(pig.rotation.z);
    
    // Calculate how "tilted" the pig is
    const tiltX = Math.abs(normX);
    const tiltZ = Math.abs(normZ);
    
    // Razorback: pig is on its back (rotated ~180° on X axis, close to π or -π)
    // Check if X rotation is close to π (180 degrees)
    if (tiltX > 1.3) {
        return 'razorback';
    }
    
    // Snouter: pig is on snout and two feet (rotated ~90° on X, minimal Z tilt)
    // X rotation around π/2 (90 degrees), Z rotation minimal
    if (tiltX > 0.7 && tiltX < 1.3 && tiltZ < 0.8) {
        return 'snouter';
    }
    
    // Leaning Jowler: pig is leaning (significant tilt on both X and Z)
    // Both X and Z have significant rotation
    if (tiltX > 0.5 && tiltX < 1.2 && tiltZ > 0.3 && tiltZ < 1.1) {
        return 'leaning_jowler';
    }
    
    // Trotter: default position (mostly upright, on all four legs)
    // Low tilt on both axes
    return 'trotter';
}

// Calculate score for a roll
function calculateScore(pig1Pos, pig2Pos) {
    const scores = {
        'trotter': 5,
        'razorback': 5,
        'snouter': 10,
        'leaning_jowler': 15
    };
    
    // Check for special combinations
    if (pig1Pos === 'razorback' && pig2Pos === 'razorback') {
        return { points: 20, type: 'double_razorback', message: 'Double Razorback! +20 points' };
    }
    if (pig1Pos === 'trotter' && pig2Pos === 'trotter') {
        return { points: 20, type: 'double_trotter', message: 'Double Trotter! +20 points' };
    }
    if (pig1Pos === 'snouter' && pig2Pos === 'snouter') {
        return { points: 40, type: 'double_snouter', message: 'Double Snouter! +40 points' };
    }
    if (pig1Pos === 'leaning_jowler' && pig2Pos === 'leaning_jowler') {
        return { points: 60, type: 'double_jowler', message: 'Double Leaning Jowler! +60 points' };
    }
    
    // Check for Pig Out (opposite sides)
    if ((pig1Pos === 'razorback' && pig2Pos === 'trotter') || 
        (pig1Pos === 'trotter' && pig2Pos === 'razorback')) {
        return { points: 0, type: 'pig_out', message: 'Pig Out! Turn ends, no points' };
    }
    
    // Check for Cider (pigs on opposite sides - different interpretation)
    // Only check if not already a special combination
    const y1 = pig1.rotation.y % (Math.PI * 2);
    const y2 = pig2.rotation.y % (Math.PI * 2);
    const yDiff = Math.abs(y1 - y2);
    if (yDiff > Math.PI - 0.5 && yDiff < Math.PI + 0.5) {
        return { points: 1, type: 'cider', message: 'Cider! +1 point' };
    }
    
    // Regular scoring - always return points
    const totalPoints = scores[pig1Pos] + scores[pig2Pos];
    const messages = {
        'trotter': 'Trotter',
        'razorback': 'Razorback',
        'snouter': 'Snouter',
        'leaning_jowler': 'Leaning Jowler'
    };
    return { 
        points: totalPoints, 
        type: 'normal',
        message: `${messages[pig1Pos]} + ${messages[pig2Pos]} = +${totalPoints} points`
    };
}

// Roll the pigs
function rollPigs() {
    if (gameState.isRolling) return;
    
    gameState.isRolling = true;
    document.getElementById('roll-btn').disabled = true;
    document.getElementById('stop-btn').disabled = true;
    
    // Reset pigs - on the boxing ring platform
    pigs.forEach((pig, index) => {
        pig.position.set(index === 0 ? -1 : 1, ringHeight + 2 + Math.random() * 0.5, Math.random() * 0.5);
        
        // Random initial rotation
        pig.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );
        
        // Random velocity
        const userData = pig.userData;
        userData.velocity.set(
            (Math.random() - 0.5) * 3,
            Math.random() * 2 + 1,
            (Math.random() - 0.5) * 3
        );
        userData.angularVelocity.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
        userData.isResting = false;
        userData.restTime = 0;
    });
}

// Check if both pigs are resting
function checkPigsResting() {
    return pigs.every(pig => pig.userData.isResting);
}

// Process roll result
function processRollResult() {
    // Prevent multiple calls
    if (!gameState.isRolling) return;
    
    // Mark as not rolling immediately to prevent double processing
    gameState.isRolling = false;
    
    const pig1Pos = getPigPosition(pig1);
    const pig2Pos = getPigPosition(pig2);
    
    console.log('Pig 1 position:', pig1Pos, 'Rotation:', {
        x: pig1.rotation.x.toFixed(2),
        y: pig1.rotation.y.toFixed(2),
        z: pig1.rotation.z.toFixed(2)
    });
    console.log('Pig 2 position:', pig2Pos, 'Rotation:', {
        x: pig2.rotation.x.toFixed(2),
        y: pig2.rotation.y.toFixed(2),
        z: pig2.rotation.z.toFixed(2)
    });
    
    const result = calculateScore(pig1Pos, pig2Pos);
    
    console.log('Score result:', result);
    console.log('Turn score before:', gameState.turnScore);
    
    const resultDiv = document.getElementById('roll-result');
    resultDiv.textContent = result.message;
    resultDiv.className = 'show';
    
    if (result.type === 'pig_out') {
        resultDiv.classList.add('pig-out');
        gameState.turnScore = 0;
        updateUI();
        setTimeout(() => {
            endTurn();
        }, 2000);
    } else if (result.type.includes('double')) {
        resultDiv.classList.add('bonus');
        gameState.turnScore += result.points;
        updateUI();
        console.log('Turn score after:', gameState.turnScore);
        setTimeout(() => {
            resultDiv.className = '';
            document.getElementById('roll-btn').disabled = false;
            document.getElementById('stop-btn').disabled = false;
        }, 2000);
    } else {
        gameState.turnScore += result.points;
        updateUI();
        console.log('Turn score after:', gameState.turnScore);
        setTimeout(() => {
            resultDiv.className = '';
            document.getElementById('roll-btn').disabled = false;
            document.getElementById('stop-btn').disabled = false;
        }, 2000);
    }
}

// End turn
function endTurn() {
    gameState.players[gameState.currentPlayer].score += gameState.turnScore;
    gameState.turnScore = 0;
    
    // Check for winner
    if (gameState.players[gameState.currentPlayer].score >= gameState.targetScore) {
        alert(`${gameState.players[gameState.currentPlayer].name} wins with ${gameState.players[gameState.currentPlayer].score} points!`);
        resetGame();
        return;
    }
    
    // Switch player
    gameState.currentPlayer = (gameState.currentPlayer + 1) % 2;
    gameState.isRolling = false;
    updateUI();
    document.getElementById('roll-btn').disabled = false;
    document.getElementById('stop-btn').disabled = false;
    
    const resultDiv = document.getElementById('roll-result');
    resultDiv.className = '';
}

// Update UI
function updateUI() {
    document.getElementById('player1-score').textContent = gameState.players[0].score;
    document.getElementById('player2-score').textContent = gameState.players[1].score;
    document.getElementById('current-player').textContent = `${gameState.players[gameState.currentPlayer].name}'s Turn`;
    document.getElementById('turn-score').textContent = `Turn Score: ${gameState.turnScore}`;
    
    // Highlight active player
    document.querySelectorAll('.player-score').forEach((el, index) => {
        el.classList.toggle('active', index === gameState.currentPlayer);
    });
}

// Reset game
function resetGame() {
    gameState.players[0].score = 0;
    gameState.players[1].score = 0;
    gameState.currentPlayer = 0;
    gameState.turnScore = 0;
    gameState.isRolling = false;
    updateUI();
    
    // Reset pig positions - on the boxing ring
    pig1.position.set(-1, ringHeight + 2, 0);
    pig2.position.set(1, ringHeight + 2, 0);
    pig1.rotation.set(0, 0, 0);
    pig2.rotation.set(0, 0, 0);
    pig1.userData.velocity.set(0, 0, 0);
    pig2.userData.velocity.set(0, 0, 0);
    pig1.userData.angularVelocity.set(0, 0, 0);
    pig2.userData.angularVelocity.set(0, 0, 0);
}

// Event listeners
document.getElementById('roll-btn').addEventListener('click', rollPigs);
document.getElementById('stop-btn').addEventListener('click', () => {
    if (!gameState.isRolling) {
        endTurn();
    }
});
document.getElementById('reset-btn').addEventListener('click', resetGame);

// Animation loop
let lastTime = 0;
let checkRestingInterval = 0;
let animationTime = 0;

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.1);
    lastTime = currentTime;
    animationTime += deltaTime;
    
    // Update physics
    if (gameState.isRolling) {
        pigs.forEach(pig => applyPhysics(pig, deltaTime));
        
        checkRestingInterval += deltaTime;
        if (checkRestingInterval > 0.1) {
            if (checkPigsResting() && gameState.isRolling) {
                checkRestingInterval = 0;
                // Small delay to ensure pigs are fully settled
                setTimeout(() => {
                    if (gameState.isRolling) {
                        processRollResult();
                    }
                }, 100);
            }
        }
    }
    
    // Animate animals - make them look alive
    animals.forEach((animal, index) => {
        // Slight head bobbing
        const bobAmount = Math.sin(animationTime * 0.5 + index) * 0.02;
        animal.position.y += bobAmount;
        
        // Slight rotation to look more natural
        const baseRotation = Math.atan2(-animal.position.x, -animal.position.z);
        animal.rotation.y = baseRotation + Math.sin(animationTime * 0.3 + index) * 0.05;
        
        // Keep animals looking at the center
        lookAtCenter(animal, animal.position.y);
    });
    
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize
updateUI();
animate(0);

