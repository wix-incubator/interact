// WIX INTERACT RUNTIME
import { Interact } from 'https://esm.sh/@wix/interact@1.92.0';
// import { Interact } from './packages/interact/dist/es/web.js';

// --- 1. HERO GRID LOGIC ---
const gridContainer = document.getElementById('grid-container');
const lineCache = new Map();
let centerX, centerY, maxDist;
let windowWidth, windowHeight;

function updateGrid() {
    gridContainer.innerHTML = '';
    lineCache.clear();
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    const cellSize = 40;
    const containerWidth = gridContainer.offsetWidth || windowWidth;
    const containerHeight = gridContainer.offsetHeight || windowHeight;
    const cols = Math.ceil(containerWidth / cellSize);
    const rows = Math.ceil(containerHeight / cellSize);
    const neededCells = cols * rows;
    
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < neededCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        const line = document.createElement('div');
        line.className = 'grid-line';
        cell.appendChild(line);
        fragment.appendChild(cell);
    }
    gridContainer.appendChild(fragment);

    centerX = windowWidth / 2;
    centerY = windowHeight / 2;
    maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    const lines = document.getElementsByClassName('grid-line');
    for (let line of lines) {
        const rect = line.getBoundingClientRect();
        lineCache.set(line, {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        });
    }
}
updateGrid();
window.addEventListener('resize', updateGrid);

const rotateGridEffect = (containerElement, progress) => {
    const mouseX = progress.x * windowWidth;
    const mouseY = progress.y * windowHeight;
    
    const screenDiagonal = Math.sqrt(windowWidth ** 2 + windowHeight ** 2);

    for (const [line, cache] of lineCache) {
        const deltaX = mouseX - cache.x;
        const deltaY = mouseY - cache.y;
        const distFromMouse = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI) + 90;
        const distFromCenter = Math.sqrt(Math.pow(cache.x - centerX, 2) + Math.pow(cache.y - centerY, 2));
        const lengthScale = 1 + (distFromCenter / maxDist) * 1.5;

        let moveX = 0;
        let moveY = 0;
        if (distFromMouse > 0) {
            const influence = Math.max(0, 1 - (distFromMouse / (screenDiagonal * 1.2))); 
            const pullFactor = influence; 
            const maxMove = 60;
            moveX = (deltaX / distFromMouse) * (maxMove * pullFactor);
            moveY = (deltaY / distFromMouse) * (maxMove * pullFactor);
        }
        line.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${angle}deg) scaleY(${lengthScale})`;
    }
};

// --- 2. TUNNEL EFFECT LOGIC (Manual RAF Loop for Physics) ---
const NUM_CIRCLES = 45; 
const tunnelRings = []; 

let cx = 0; 
let cy = 0; 
let tunnelSceneRect = { top: 0, left: 0, width: 0, height: 0 };
const tunnelSceneContainer = document.getElementById('tunnel-scene-container'); 
let animationStarted = false; // Flag to ensure initialization runs once

function updateTunnelBounds() {
    if (tunnelSceneContainer) {
        const rect = tunnelSceneContainer.getBoundingClientRect();
        tunnelSceneRect = rect;
        // Local center relative to the container's coordinates (for the physics)
        cx = rect.width / 2; 
        cy = rect.height / 2;
    }
}

// Initial DOM generation for rings
const generateTunnel = () => {
    const container = document.getElementById('tunnel-container');
    if (!container) return; // safety check
    container.innerHTML = '';
    tunnelRings.length = 0; // Clear the physics array
    
    for (let i = 0; i < NUM_CIRCLES; i++) {
        const circle = document.createElement('div');
        circle.classList.add('tunnel-circle'); 
        
        // Force absolute centering for the physics calculations
        circle.style.position = 'absolute';
        circle.style.top = '50%';
        circle.style.left = '50%';
        
        // Calculate border color based on depth (i)
        const normalizedDepth = i / NUM_CIRCLES; 
        const alpha = 0.05 + (1 - normalizedDepth) * 0.95; 
        circle.style.borderColor = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;

        // Initial transform
        circle.style.transform = 'translate(-50%, -50%)'; 

        // MODIFIED: Use percentages relative to the container instead of vmin
        // The first circle (i=0) uses CSS rules. Subsequent rings scale down from 100%
        const scale = 100 * Math.pow(0.91, i); 
        circle.style.width = `${scale}%`;
        circle.style.height = `${scale}%`;

        // Z-index ordering
        circle.style.zIndex = NUM_CIRCLES - i; 
        
        container.appendChild(circle);

        // Physics Parameters
        const easeVariance = 0.85 + Math.random() * 0.3;
        
        tunnelRings.push({
            element: circle,
            x: 0, 
            y: 0,
            // Outer rings move more, inner rings move less (parallax).
            factor: ((NUM_CIRCLES - i) / NUM_CIRCLES) * 0.03,
            easeVariance: easeVariance
        });
    }
};

// Call DOM generation early
generateTunnel();

// 4. ANIMATION LOOP (Runs constantly for physics)
// Global movement reduction factor
const MOVEMENT_FACTOR = 0.5; // Changed from 1.0 to 0.5 to reduce movement by half

const animate = (progress) => {
    // 1. Localized mouse position relative to container
    const localMouseX = progress.x * windowWidth;
    const localMouseY = progress.y * windowHeight;

    // 2. Calculate distance of mouse from container center (cx, cy are now container center)
    const targetX = localMouseX - cx;
    const targetY = localMouseY - cy;
    
    const dist = Math.sqrt(targetX * targetX + targetY * targetY);
    // Use local container dimensions for maxDist
    const maxDistLocal = Math.max(cx, cy) || 1;
    
    const normalizedDist = dist / maxDistLocal;
    // "Stretch" logic: Pulls the tunnel apart more when mouse is at edges
    // FIX: Reduced max stretch factor by half (from 4.0 to 2.0)
    const stretch = 1 + Math.pow(normalizedDist, 1.2) * 2.0; 

    tunnelRings.forEach((ring, index) => {
        const targetMoveX = targetX * ring.factor * stretch;
        const targetMoveY = targetY * ring.factor * stretch; // Corrected to use factor for Y movement too

        // Base easing gets slightly stiffer for smaller rings
        let baseEase = 0.08 + (0.02 * (1 - index / NUM_CIRCLES));
        // Apply organic variance (uses the unique easeVariance calculated in generateTunnel)
        const finalEase = baseEase * ring.easeVariance;

        // Linear Interpolation (Lerp) for smooth lag
        ring.x += (targetMoveX - ring.x) * finalEase;
        ring.y += (targetMoveY - ring.y) * finalEase;

        // Apply transform: Center (-50%) + Physics Offset (x, y)
        ring.element.style.transform = `translate(-50%, -50%) translate3d(${ring.x}px, ${ring.y}px, 0)`;
    });
};

// Recalculate bounds in case of scroll or position change (more robust)
updateTunnelBounds();
window.addEventListener('resize', updateTunnelBounds);

const animateTunnel = (rootElement, progress) => {
    // Animate the tunnel
    animate(progress);
};

// Start the process: calculate bounds first, which then calls animate()
requestAnimationFrame(() => animateTunnel(null, { x: 0.5, y: 0.5 }));

// --- 2.1 MOUSE TRACK PRIMITIVE GENERATION ---
const generateMouseTunnel = () => {
    const mount = document.getElementById('mt-tunnel-mount');
    if (!mount) return;
    const DEPTH = 12;
    let currentParent = mount;

    for (let i = 0; i < DEPTH; i++) {
        const circle = document.createElement('div');
        
        if (i === 0) {
            circle.classList.add('ring-base', 'tunnel-static');
            mount.appendChild(circle);
            
            const moverRoot = document.createElement('div');
            moverRoot.classList.add('ring-base');
            moverRoot.style.border = 'none';
            moverRoot.style.width = '100%';
            moverRoot.style.height = '100%';
            
            mount.appendChild(moverRoot);
            currentParent = moverRoot;
        } else {
            circle.classList.add('tunnel-moving', 'ring-base');
            circle.style.position = 'relative'; 
            currentParent.appendChild(circle);
            currentParent = circle;
        }
    }
};
generateMouseTunnel();

// --- 3. REUSABLE ANIMATION CONFIGS ---
const FADE_UP_OPTS = { type: 'FadeIn', direction: 'bottom', distance: '60px', power: 'soft' };

// Custom elastic easing for a "pop" feel
const CLICK_EASING = 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'; 

// Entrance Configs
const ENTRANCE_DURATION = 1000;
const ENTRANCE_EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const ENTRANCE_OFFSET = '50px'; 
const ENTRANCE_SLIDE_DIST = '120px';

const HOVER_SCALE = {
    name: 'hoverScale',
    keyframes: [
        { transform: 'scale(1)', offset: 0 },
        { transform: 'scale(1.02)', offset: 1 }
    ]
};

const TILT_UP_OPTS = {
    name: 'tiltUp',
    keyframes: [
        { opacity: 0, transform: 'translateY(80px) rotateX(60deg) scale(0.9)', transformOrigin: 'center top' },
        { opacity: 1, transform: 'translateY(0) rotateX(0deg) scale(1)', transformOrigin: 'center top' }
    ]
};

// --- PRIMITIVE INTERACTIONS ---
// Only Hover is auto-generated now. Click and Entrance are manual.
const primitivePrefixes = ['hover'];
const generateCircleInteractions = (prefix) => {
    return [
        {
            key: `${prefix}-circle-1`, trigger: 'hover',
            effects: [
                { transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'scale(1.1)' }] } },
                { selector: '.fill-circle', transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'scale(1)' }] } },
                { key: `${prefix}-circle-2`, transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'translate(20px, -20px)' }] } },
                { key: `${prefix}-circle-3`, transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'translate(20px, -20px)' }] } }
            ]
        },
        {
            key: `${prefix}-circle-2`, trigger: 'hover',
            effects: [
                { transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'scale(1.1)' }] } },
                { selector: '.fill-circle', transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'scale(1)' }] } },
                { key: `${prefix}-circle-1`, transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'translate(-20px, 20px)' }] } },
                { key: `${prefix}-circle-3`, transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'translate(20px, -20px)' }] } }
            ]
        },
        {
            key: `${prefix}-circle-3`, trigger: 'hover',
            effects: [
                { transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'scale(1.1)' }] } },
                { selector: '.fill-circle', transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'scale(1)' }] } },
                { key: `${prefix}-circle-1`, transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'translate(-20px, 20px)' }] } },
                { key: `${prefix}-circle-2`, transition: { duration: 400, easing: 'ease-out', styleProperties: [{ name: 'transform', value: 'translate(-20px, 20px)' }] } }
            ]
        }
    ];
};
const primitiveInteractions = primitivePrefixes.flatMap(prefix => generateCircleInteractions(prefix));

// Register CSS Variable to ensure smooth interpolation by the engine
if (window.CSS && CSS.registerProperty) {
    try {
        CSS.registerProperty({
            name: '--spacing',
            syntax: '<length>',
            inherits: true,
            initialValue: '0px',
        });
    } catch (err) {}
}

// --- Geometry Generation (Optimized) ---
const spongeContainer = document.getElementById('sponge');
const HS = 30; // Half size

const fragment = document.createDocumentFragment();

function shouldExist(x, y, z) {
    return [x, y, z].filter((c) => c === 0).length < 2;
}

const transformTemplates = [
    `rotateY(0deg) translateZ(${HS}px)`,
    `rotateY(180deg) translateZ(${HS}px)`,
    `rotateY(90deg) translateZ(${HS}px)`,
    `rotateY(-90deg) translateZ(${HS}px)`,
    `rotateX(90deg) translateZ(${HS}px)`,
    `rotateX(-90deg) translateZ(${HS}px)`,
];

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            if (shouldExist(x, y, z)) {
                const voxel = document.createElement('div');
                voxel.className = 'voxel';
                voxel.style.setProperty('--x', x);
                voxel.style.setProperty('--y', y);
                voxel.style.setProperty('--z', z);

                for (let i = 0; i < transformTemplates.length; i++) {
                    const face = document.createElement('div');
                    face.className = 'cube-face';
                    face.style.transform = transformTemplates[i];
                    voxel.appendChild(face);
                }
               
                fragment.appendChild(voxel);
            }
        }
    }
}

if (spongeContainer) {
    spongeContainer.appendChild(fragment);
}



// --- INTERACT CONFIG ---
const config = {
effects: {
        spongeTumble: {
            key: 'sponge',
            duration: 20000,
            iterations: Infinity,
            easing: 'linear',
            fill: 'both',
            composite: 'replace',
            keyframeEffect: {
                keyframes: [
                    { transform: 'rotate3d(1, 1, 1, 0deg)' },
                    { transform: 'rotate3d(1, 1, 1, 360deg)' }
                ],
            },
        },

        spongeExplode: {
            key: 'sponge',
            duration: 1400,
            easing: 'cubic-bezier(0.19, 1, 0.22, 1)',
            fill: 'both',
            composite: 'replace',
            keyframeEffect: {
                keyframes: [
                    { '--spacing': '0px' },
                    { '--spacing': '100px' }
                ],
            },
        },
    },

    interactions: [
     // Text Entrance
        {
            key: 'perf-text',
            trigger: 'viewEnter',
            effects: [{ keyframeEffect: { ...TILT_UP_OPTS }, duration: 1000, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' }]
        },
          {
            key: 'perf-text-2',
            trigger: 'viewEnter',
            effects: [{ keyframeEffect: { ...TILT_UP_OPTS }, duration: 1000, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' }]
        },
        // Sponge Tumble (Continuous)
        {
            key: 'sponge',
            trigger: 'pageVisible',
            effects: [
                { effectId: 'spongeTumble' },
            ],
        },
        // Sponge Explode (Hover)
        {
            key: 'hitbox',
            trigger: 'hover',
            params: {
                type: 'alternate',
            },
            effects: [
                { effectId: 'spongeExplode' },
            ],
        },
        // --- NEW HERO GRID INTERACTION ---
        {
            key: 'hero-grid',
            trigger: 'pointerMove',
            params: { hitArea: 'root' },
            effects: [{ customEffect: rotateGridEffect, centeredToTarget: true }]
        },
        // Hero Text
        {
            key: 'hero-line-1',
            trigger: 'viewEnter',
            effects: [{ keyframeEffect: { ...TILT_UP_OPTS }, duration: 900, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', delay: 100, fill: 'both' }]
        },
        {
            key: 'hero-line-2',
            trigger: 'viewEnter',
            effects: [{ keyframeEffect: { ...TILT_UP_OPTS }, duration: 900, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', delay: 250, fill: 'both' }]
        },
        {
            key: 'hero-subtitle',
            trigger: 'viewEnter',
            effects: [{ namedEffect: { ...FADE_UP_OPTS, distance: '30px' }, duration: 1200, easing: 'ease-out', delay: 600, fill: 'both' }]
        },
        {
            key: 'nav-logo',
            trigger: 'viewEnter',
            effects: [{ namedEffect: { type: 'FadeIn' }, duration: 1000, fill: 'both' }]
        },
        {
            key: 'nav-cta',
            trigger: 'viewEnter',
            effects: [{ namedEffect: { type: 'FadeIn' }, duration: 1000, delay: 200, fill: 'both' }]
        },

        // --- REST OF THE PAGE INTERACTIONS ---
        ...primitiveInteractions,
        
        // NEW ENTRANCE INTERACTION (Swirling Plus)
        // 1. Top Circle: Slides in from Left
        {
            key: 'circle-top',
            trigger: 'viewEnter',
            effects: [{
                fill: 'both', 
                keyframeEffect: {
                    name: 'slideFromLeftToTop',
                    keyframes: [
                        { opacity: 0, transform: `translate(-${ENTRANCE_SLIDE_DIST}, -${ENTRANCE_OFFSET})` }, // Start: Left of target
                        { opacity: 1, transform: `translate(0, -${ENTRANCE_OFFSET})` }        // End: Top position
                    ]
                },
                duration: ENTRANCE_DURATION,
                easing: ENTRANCE_EASING,
                delay: 0
            }]
        },
        // 2. Right Circle: Slides in from Top
        {
            key: 'circle-right',
            trigger: 'viewEnter',
            effects: [{
                fill: 'both',
                keyframeEffect: {
                    name: 'slideFromTopToRight',
                    keyframes: [
                        { opacity: 0, transform: `translate(${ENTRANCE_OFFSET}, -${ENTRANCE_SLIDE_DIST})` }, // Start: Top of target
                        { opacity: 1, transform: `translate(${ENTRANCE_OFFSET}, 0)` }        // End: Right position
                    ]
                },
                duration: ENTRANCE_DURATION,
                easing: ENTRANCE_EASING,
                delay: 100
            }]
        },
        // 3. Bottom Circle: Slides in from Right
        {
            key: 'circle-bottom',
            trigger: 'viewEnter',
            effects: [{
                fill: 'both',
                keyframeEffect: {
                    name: 'slideFromRightToBottom',
                    keyframes: [
                        { opacity: 0, transform: `translate(${ENTRANCE_SLIDE_DIST}, ${ENTRANCE_OFFSET})` }, // Start: Right of target
                        { opacity: 1, transform: `translate(0, ${ENTRANCE_OFFSET})` }        // End: Bottom position
                    ]
                },
                duration: ENTRANCE_DURATION,
                easing: ENTRANCE_EASING,
                delay: 200
            }]
        },
        // 4. Left Circle: Slides in from Bottom
        {
            key: 'circle-left',
            trigger: 'viewEnter',
            effects: [{
                fill: 'both',
                keyframeEffect: {
                    name: 'slideFromBottomToLeft',
                    keyframes: [
                        { opacity: 0, transform: `translate(-${ENTRANCE_OFFSET}, ${ENTRANCE_SLIDE_DIST})` }, // Start: Bottom of target
                        { opacity: 1, transform: `translate(-${ENTRANCE_OFFSET}, 0)` }        // End: Left position
                    ]
                },
                duration: ENTRANCE_DURATION,
                easing: ENTRANCE_EASING,
                delay: 300
            }]
        },

        // NEW CLICK INTERACTION (Ripple Effect)
        {
            key: 'click-center',
            trigger: 'click',
            // 'toggle' is default for state interactions
            effects: [
                // 1. Fill the center circle
                { 
                    selector: '.fill-circle', 
                    transition: { 
                        duration: 500,
                        easing: 'ease-out', 
                        styleProperties: [{ name: 'transform', value: 'scale(1)' }] 
                    } 
                },
                // 2. Expand Ripple 1
                { 
                    key: 'click-ripple-1',
                    transition: { 
                        duration: 800, 
                        easing: CLICK_EASING, 
                        styleProperties: [
                            { name: 'opacity', value: '1' },
                            { name: 'transform', value: 'scale(1.7)' }
                        ] 
                    } 
                },
                // 3. Expand Ripple 2 (Larger, Delayed)
                { 
                    key: 'click-ripple-2',
                    transition: { 
                        duration: 800, 
                        easing: CLICK_EASING, 
                        delay: 50, 
                        styleProperties: [
                            { name: 'opacity', value: '0.5' }, 
                            { name: 'transform', value: 'scale(2.6)' }
                        ] 
                    } 
                }
            ]
        },


        // NEW MOUSE TRACK INTERACTION (3D Tilt Tunnel)
        {
            key: 'mt-scene-root',
            trigger: 'pointerMove',
            params: { hitArea: 'self'}, // 'self' keeps the effect contained to the card
            effects: [
                // Effect 1: Tilt the Card Frame
                {
                    key: 'mt-card-target',
                    namedEffect: {
                        type: 'Tilt3DMouse',
                        maxAngle: 25, // Subtle tilt for the container
                        perspective: 200
                    },
                    fill: 'both',
                    composite: 'replace'
                },
                // Effect 2: Tilt the Inner Circles (Intense)
                {
                    key: 'mt-content-target',
                    namedEffect: {
                        type: 'Tilt3DMouse',
                        maxAngle: 60, // Deep tilt for the tunnel
                        perspective: 100
                    },
                    fill: 'both',
                    composite: 'replace'
                }
            ]
        },

        // NEW SCROLLYTELLING INTERACTION (Atom Spin)
        {
            key: 'scrolly-atom-card',
            trigger: 'viewProgress', 
            effects: [
                // 1. Vertical Spin
                {
                    key: 'orbit-y',
                    fill: 'both',
                    // Updated range to cover full entry to exit
                    rangeStart: { name: 'entry', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'exit', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'rotateY',
                        keyframes: [
                            { transform: 'rotateY(0deg)' },
                            { transform: 'rotateY(360deg)' }
                        ]
                    },
                    composite: 'replace'
                },
                // 2. Horizontal Spin
                {
                    key: 'orbit-x',
                    fill: 'both',
                    rangeStart: { name: 'entry', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'exit', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'rotateX',
                        keyframes: [
                            // Added slight wobble to make rotation visible on flat plane
                            { transform: 'rotateX(90deg) rotateZ(0deg)' },
                            { transform: 'rotateX(90deg) rotateZ(360deg)' }
                        ]
                    },
                    composite: 'replace'
                },
                // 3. Diagonal 1 (+45)
                {
                    key: 'orbit-diag-1',
                    fill: 'both',
                    rangeStart: { name: 'entry', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'exit', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'rotateDiag1',
                        keyframes: [
                            { transform: 'rotateZ(45deg) rotateY(0deg)' },
                            { transform: 'rotateZ(45deg) rotateY(360deg)' }
                        ]
                    },
                    composite: 'replace'
                },
                // 4. Diagonal 2 (-45)
                {
                    key: 'orbit-diag-2',
                    fill: 'both',
                    rangeStart: { name: 'entry', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'exit', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'rotateDiag2',
                        keyframes: [
                            { transform: 'rotateZ(-45deg) rotateY(0deg)' },
                            { transform: 'rotateZ(-45deg) rotateY(-360deg)' }
                        ]
                    },
                    composite: 'replace'
                }
            ]
        },

        // Mission Text
        {
            key: 'mission-text',
            trigger: 'viewEnter',
            effects: [{
                namedEffect: {
                    type: 'SlideIn',
                    direction: 'bottom',
                    distance: '100px',
                    power: 'soft'
                },
                duration: 1000,
                easing: 'ease-out',
                fill: 'both'
            }]
        },

        // Visual Break / Parallax
        {
            key: 'visual-break',
            trigger: 'viewEnter',
            threshold: 0.2,
            effects: [{
                namedEffect: { type: 'ScaleIn', power: 'soft' },
                duration: 1200,
                fill: 'both'
            }]
        },
        {
            key: 'visual-break',
            trigger: 'viewProgress',
            effects: [{
                namedEffect: { type: 'ParallaxScroll', range: 'continuous', speed: -0.05 },
                rangeStart: { name: 'entry', offset: { value: 0, type: 'percentage' } },
                rangeEnd: { name: 'exit', offset: { value: 0, type: 'percentage' } },
                fill: 'both',
                composite: 'add'
            }]
        },

        // --- CHANGED: NEW BEAUTIFUL SECTION SCROLL EFFECTS ---
        {
            key: 'beautiful-section',
            trigger: 'viewProgress',
            effects: [
                // 1. Pyramid Rotation
                {
                    key: 'pyramid-target',
                    fill: 'both',
                    rangeStart: { name: 'cover', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'cover', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'pyramid-tumble',
                        keyframes: [
                            { transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg)' },
                            { transform: 'rotateX(720deg) rotateY(540deg) rotateZ(120deg)' } 
                        ]
                    }
                },
                
                // 2. SCROLL DRIVEN TEXT ANIMATIONS
                // Step 1: "Beautiful" (0% - 15%)
                {
                    key: 'word-1',
                    keyframeEffect: {
                        keyframes: [
                            { opacity: 0, transform: 'translateY(150px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ]
                    },
                    rangeStart: { name: 'cover', offset: { value: 5, type: 'percentage' } },
                    rangeEnd: { name: 'cover', offset: { value: 15, type: 'percentage' } },
                    fill: 'both'
                },
                
                // Step 2: "Effects," (5% - 20%)
                {
                    key: 'word-2',
                    keyframeEffect: {
                        keyframes: [
                            { opacity: 0, transform: 'translateY(150px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ]
                    },
                    rangeStart: { name: 'cover', offset: { value: 5, type: 'percentage' } },
                    rangeEnd: { name: 'cover', offset: { value: 20, type: 'percentage' } },
                    fill: 'both'
                },
                
                // Step 3: "Ready to Use." (Grouped: 15% - 30%)
                {
                    key: 'word-3',
                    keyframeEffect: {
                        keyframes: [
                            { opacity: 0, transform: 'translateY(150px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ]
                    },
                    rangeStart: { name: 'cover', offset: { value: 15, type: 'percentage' } },
                    rangeEnd: { name: 'cover', offset: { value: 30, type: 'percentage' } },
                    fill: 'both'
                },
                
                {
                    key: 'word-4',
                    keyframeEffect: {
                        keyframes: [
                            { opacity: 0, transform: 'translateY(150px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ]
                    },
                    rangeStart: { name: 'cover', offset: { value: 15, type: 'percentage' } },
                    rangeEnd: { name: 'cover', offset: { value: 30, type: 'percentage' } },
                    fill: 'both'
                },
                {
                    key: 'word-5',
                    keyframeEffect: {
                        keyframes: [
                            { opacity: 0, transform: 'translateY(150px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ]
                    },
                    rangeStart: { name: 'cover', offset: { value: 15, type: 'percentage' } },
                    rangeEnd: { name: 'cover', offset: { value: 30, type: 'percentage' } },
                    fill: 'both'
                },
                
                // Step 4: Description (30% - 45%)
                {
                    key: 'desc-text',
                    keyframeEffect: {
                        keyframes: [
                            { opacity: 0, transform: 'translateY(50px)' },
                            { opacity: 1, transform: 'translateY(0)' }
                        ]
                    },
                    rangeStart: { name: 'cover', offset: { value: 30, type: 'percentage' } },
                    rangeEnd: { name: 'cover', offset: { value: 45, type: 'percentage' } },
                    fill: 'both'
                }
            ]
        },

        // --- CHANGED: NEW TUNNEL INTERACTION ---
        {
            key: 'tunnel-root',
            trigger: 'pointerMove',
            params: { hitArea: 'root' },
            effects: [
                {
                    customEffect: animateTunnel,
                    centeredToTarget: true,
                    fill: 'both'
                }
            ]
        },

        // Cards Hover (using the generated primitive)
        {
            key: 'hover-target',
            trigger: 'hover',
            params: { type: 'alternate' },
            effects: [{
                keyframeEffect: { ...HOVER_SCALE },
                duration: 400,
                easing: 'ease-out',
                fill: 'both',
                composite: 'add'
            }]
        },

        // NEW TAILORED SECTION ANIMATIONS
        {
            key: 'tailored-header',
            trigger: 'viewEnter',
            effects: [{ namedEffect: { type: 'FadeIn', distance: '40px', direction: 'bottom' }, duration: 800, fill: 'both' }]
        },
        {
            key: 'tailored-col-1',
            trigger: 'viewEnter',
            effects: [{ namedEffect: { type: 'FadeIn', distance: '40px', direction: 'bottom' }, duration: 800, delay: 100, fill: 'both' }]
        },
        {
            key: 'tailored-col-2',
            trigger: 'viewEnter',
            effects: [{ namedEffect: { type: 'FadeIn', distance: '40px', direction: 'bottom' }, duration: 800, delay: 200, fill: 'both' }]
        },
        {
            key: 'tailored-col-3',
            trigger: 'viewEnter',
            effects: [{ namedEffect: { type: 'FadeIn', distance: '40px', direction: 'bottom' }, duration: 800, delay: 300, fill: 'both' }]
        },
        
        // Spread Section
        {
            key: 'spread-section',
            trigger: 'viewProgress',
            effects: [
                {
                    key: 'spread-card-0',
                    fill: 'both',
                    rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'stayCenter',
                        keyframes: [
                            { transform: 'translate(-50%, -50%) scale(1)' },
                            { transform: 'translate(-50%, -50%) scale(1.3)' }
                        ]
                    }
                },
                // ... other cards kept implicitly by leaving config structure similar ...
                {
                    key: 'spread-card-1',
                    fill: 'both',
                    rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'spreadLeftInner',
                        keyframes: [
                            { transform: 'translate(-50%, -50%) scale(1)' },
                            { transform: 'translate(calc(-50% - 16vw), -50%) scale(1.15)' }
                        ]
                    }
                },
                {
                    key: 'spread-card-2',
                    fill: 'both',
                    rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'spreadRightInner',
                        keyframes: [
                            { transform: 'translate(-50%, -50%) scale(1)' },
                            { transform: 'translate(calc(-50% + 16vw), -50%) scale(1.15)' }
                        ]
                    }
                },
                {
                    key: 'spread-card-3',
                    fill: 'both',
                    rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'spreadLeftOuter',
                        keyframes: [
                            { transform: 'translate(-50%, -50%) scale(1)' },
                            { transform: 'translate(calc(-50% - 32vw), -50%) scale(0.9)' }
                        ]
                    }
                },
                {
                    key: 'spread-card-4',
                    fill: 'both',
                    rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
                    rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
                    keyframeEffect: {
                        name: 'spreadRightOuter',
                        keyframes: [
                            { transform: 'translate(-50%, -50%) scale(1)' },
                            { transform: 'translate(calc(-50% + 32vw), -50%) scale(0.9)' }
                        ]
                    }
                }
            ]
        },

        // Horizontal Scroll
        {
            key: 'h-section',
            trigger: 'viewProgress',
            effects: [{
                key: 'h-track',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
                keyframeEffect: {
                    name: 'moveLeft',
                    keyframes: [
                        { transform: 'translateX(0)' },
                        { transform: 'translateX(-5824px)' } 
                    ]
                }
            },
            {
                key: 'h-card-1',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 12.5, type: 'percentage' } },
                keyframeEffect: {
                    name: 'scaleCenter1',
                    keyframes: [{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }]
                }
            },
            {
                key: 'h-card-2',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 25, type: 'percentage' } },
                keyframeEffect: { name: 'scaleCenter2', keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: 0.5 }, { transform: 'scale(1)' }] }
            },
            {
                key: 'h-card-3',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 12.5, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 37.5, type: 'percentage' } },
                keyframeEffect: { name: 'scaleCenter3', keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: 0.5 }, { transform: 'scale(1)' }] }
            },
            {
                key: 'h-card-4',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 25, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 50, type: 'percentage' } },
                keyframeEffect: { name: 'scaleCenter4', keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: 0.5 }, { transform: 'scale(1)' }] }
            },
            {
                key: 'h-card-5',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 37.5, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 62.5, type: 'percentage' } },
                keyframeEffect: { name: 'scaleCenter5', keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: 0.5 }, { transform: 'scale(1)' }] }
            },
            {
                key: 'h-card-6',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 50, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 75, type: 'percentage' } },
                keyframeEffect: { name: 'scaleCenter6', keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: 0.5 }, { transform: 'scale(1)' }] }
            },
            {
                key: 'h-card-7',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 62.5, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 87.5, type: 'percentage' } },
                keyframeEffect: { name: 'scaleCenter7', keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: 0.5 }, { transform: 'scale(1)' }] }
            },
            {
                key: 'h-card-8',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 75, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
                keyframeEffect: { name: 'scaleCenter8', keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.3)', offset: 0.5 }, { transform: 'scale(1)' }] }
            },
            {
                key: 'h-card-9',
                fill: 'both',
                rangeStart: { name: 'contain', offset: { value: 87.5, type: 'percentage' } },
                rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
                keyframeEffect: { name: 'scaleCenter9', keyframes: [{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }] }
            }]
        },

        // Footer
        {
            key: 'footer-brand',
            trigger: 'viewEnter',
            effects: [{ namedEffect: { type: 'FadeIn' }, duration: 600, fill: 'both' }]
        },
        {
            key: 'footer-link',
            trigger: 'viewEnter',
            effects: [{ namedEffect: { type: 'FadeIn' }, duration: 600, delay: 100, fill: 'both' }]
        }
    ]
};
// Respect reduced motion settings (disable all animations)
Interact.forceReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Initialize Interact
Interact.create(config);

