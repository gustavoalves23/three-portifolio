import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import fragmentPicture from './Shaders/fragmentPicture.glsl';
import vertexPicture from './Shaders/vertexPicture.glsl';
import fragmentPaper from './Shaders/fragmentPaper.glsl';
import vertexPaper from './Shaders/vertexPaper.glsl';
import fragmentText from './Shaders/fragmentText.glsl';
import vertexText from './Shaders/vertexText.glsl';
import gsap from 'gsap';
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom';
import {  FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

let actualPhase = 0;
let readyToStart = false;


/**
 * Base
 */
// Debug


// Canvas
const canvas = document.querySelector('canvas.webgl')

//Textures


const loadManager = new THREE.LoadingManager(() => {
    gsap.to('.loading', {
        opacity: 0,
        duration: 4,
        ease: 'Power4 easeIn'
}).then(() => {
    document.querySelector('.loading').remove();
    readyToStart = true;
})

});

const cubeTextureLoader = new THREE.CubeTextureLoader(loadManager)

const envMap = cubeTextureLoader.load(
    ['/envmap/space/px.png',
    '/envmap/space/nx.png',
    '/envmap/space/py.png',
    '/envmap/space/ny.png',
    '/envmap/space/pz.png',
    '/envmap/space/nz.png'],
)


const textureLoader = new THREE.TextureLoader(loadManager)

const personTexture = textureLoader.load('/Textures/person.jpeg', () => {
    let stockPos = new THREE.Vector3()
    stockPos.copy(targetView.position)
    stockPos.z -= 0.07;
    test.position.copy(stockPos)
});
const paperTexture = textureLoader.load('/Textures/paperTexture.png');
paperTexture.repeat.y = 4;
paperTexture.wrapT = THREE.MirroredRepeatWrapping;


// Scene
const scene = new THREE.Scene()

const gltfLoader = new GLTFLoader(loadManager);

const mainGroup = new THREE.Group()

let table;

const tableMaterial = new THREE.MeshStandardMaterial({
    color: 'black',
    envMap,
    envMapIntensity: 20,
    metalness: 0.8,
    roughness: 0.2

})

const test = new THREE.Mesh(
    new THREE.BoxGeometry(.01, .01, .01),
    new THREE.ShaderMaterial({
        transparent: true,
        vertexShader: `
        void main () {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
        `,
        fragmentShader: `
            void main () {
                gl_FragColor = vec4(0.,0.,0.,0.);
            }
        `
    })
)


gltfLoader.load('/models/Desk.glb', (gltf) => {
    gltf.scene.scale.set(.001, .001, .001)
    table = gltf.scene;
    gltf.scene.traverse((item) => {
        if (item.isMesh) {
            item.geometry.center()
            item.material = tableMaterial
            item.castShadow = true
            item.receiveShadow = true
        }
    })
    gltf.scene.castShadow = true
    gltf.scene.receiveShadow = true
    mainGroup.add(table)
})

let frame;

const frameGroup = new THREE.Group()

gltfLoader.load('/models/frame/frame.gltf', (gltf) => {
    gltf.scene.scale.set(0.008, 0.008, 0.008)
    frame = gltf.scene;
    mainGroup.add(frame)
    gltf.scene.traverse((item) => {
        if (item.isMesh) {
            item.material = tableMaterial;
            item.castShadow = true;
        }
    })
    frame.position.set(-0.032, 0.103, 0.189);
    frame.rotation.y = 3.279;
    frameGroup.add(frame);

})

let cadeira;

gltfLoader.load('/models/Cad/cadeira.glb', (gltf) => {
    cadeira = gltf.scene;
    cadeira.scale.set(0.005, 0.005, 0.005);
    cadeira.position.set(-0.507, -0.262, 0);
    cadeira.rotation.set(0.427, -1.638, -0.114);
    cadeira.rotation.order = 'YXZ'
    cadeira.traverse((item) => {
        if (item.isMesh) {
            item.material = tableMaterial;
        }
    })
    mainGroup.add(cadeira);

})

let laptop;
let tela;

gltfLoader.load('/models/Laptop/scene.gltf', (gltf) => {
    laptop = gltf.scene.children[0] ;
    laptop.traverse((item) => {
        if (item.name === 'Screen') {
            tela = item;
            // tela.children.concat(screen)
            tela.rotation.x = Math.PI * 3/2.05;
        }

    })
    laptop.scale.set(0.005, 0.005, 0.005)
    laptop.position.y = 0.12;
    laptop.rotation.z = - Math.PI / 2;
    laptop.rotation.y = 0.3;
    frameGroup.add(laptop)
} )

const glassTexture = textureLoader.load('/models/Astro/textures/Glass_normal.png');
const bodyTexture = textureLoader.load('/models/Astro/textures/Mat_0_normal.png');

let astro;

gltfLoader.load('/models/Astro/scene.gltf', (gltf) => {
    gltf.scene.scale.set(0.002, 0.002, 0.002)
    gltf.scene.traverse((item) => {
        item.material = new THREE.MeshStandardMaterial({
            metalness: 0.8,
            roughness: 0.5,
            envMap,
            envMapIntensity: 100
        })
        if (item.name === 'Skull_Bone_0' || item.name === 'Skull') {
            // item.geometry.dispose();
            // item.material.material();
            item.material = new THREE.ShaderMaterial({
                transparent: true,
                vertexShader: `
                void main () {
                    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                }
                `,
                fragmentShader: `
                    void main () {
                        gl_FragColor = vec4(0.,0.,0.,0.);
                    }
                `
            })
        }
        
    })
    astro = gltf.scene;

    mainGroup.add(gltf.scene)
    gltf.scene.rotation.order = 'YXZ'
    gltf.scene.position.set(-0.254, -0.156, 0);
    gltf.scene.rotation.set(-0.762, 1.524, -0.024);
})


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

const bulbLight = new THREE.SpotLight(0xFFEE00, 4);
bulbLight.position.set(0.041, 0.213, 0.189);
bulbLight.target.position.set(0, 0.115, 0.189);
bulbLight.angle = 10;
bulbLight.penumbra = 0.167;
bulbLight.distance = 1;


bulbLight.castShadow = true;
bulbLight.shadow.mapSize.x = 1024;
bulbLight.shadow.mapSize.y = 1024;
bulbLight.shadow.camera.near = 0.001;
bulbLight.shadow.camera.far = 5;
bulbLight.shadow.camera.fov = 30;

mainGroup.add(bulbLight)

mainGroup.add(bulbLight.target)


const targetView = new THREE.Mesh(
    new THREE.PlaneGeometry(0.035, 0.035),
    new THREE.ShaderMaterial({
        vertexShader: vertexPicture,
        fragmentShader: fragmentPicture,
        side: THREE.DoubleSide,
        uniforms: {
            time: {value: 0},
            texture: {value: personTexture},
            resolution:{value: new THREE.Vector2(256, 256)}
        }
    })
)

targetView.castShadow = true;
// targetView.rotation.y =  - Math.PI / 2;
targetView.position.copy(bulbLight.target.position)
targetView.rotation.order = 'YXZ'
targetView.rotation.set(-0.323, 4.842, 0);
targetView.position.set(-0.03263828, 0.12267774, 0.18827237);

frameGroup.add(targetView)
frameGroup.add(test)

mainGroup.add(frameGroup)
//Particles

const starsGeometry = new THREE.BufferGeometry();

const starsQuantity = 7000;

const starsPositionArray = new Float32Array(starsQuantity * 3 * 3);

const fillStarsArray  = () => {
    for (let i = 0; i < starsQuantity * 3 * 3; i += 1) {
        const internalIndex = i * 3;
        const index = i / starsQuantity * 3 * 3;
        const centerlize = (Math.random() - 0.5) / 0.5;
        starsPositionArray[internalIndex] = ((Math.random() - 0.5) * 2)/centerlize;
        starsPositionArray[internalIndex + 1] = 2 * (Math.random() - 0.5)/centerlize;
        starsPositionArray[internalIndex + 2] =((Math.random() - 0.5) * 2)/centerlize ;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositionArray, 3))
}

fillStarsArray();

const stars = new THREE.Points(
    starsGeometry,
    new THREE.PointsMaterial({
        size: 0.0005
    })
)
scene.add(stars)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    // camera2.left = -1 * sizes.width / sizes.height;
    // camera2.right = 1 * sizes.width / sizes.height;
    camera.updateProjectionMatrix()
    // camera2.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100)
camera.position.set(-0.1056,0.1452,0.1968)
mainGroup.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false;
controls.enableRotate = false;
// controls.enabled = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping  = THREE.CineonToneMapping;


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

scene.add(mainGroup)
scene.background = envMap

const mouse = {
    x:0,
    y:0,
    repetition: 0,
    previousX: 0,
    previousY: 0
}

canvas.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / sizes.width)  - 0.5,
    mouse.y = - (e.clientY / sizes.height) + 0.5
})


const gravity = (elapsedTime) => {
    mainGroup.rotation.x = Math.sin(elapsedTime / 5) / 10;
    mainGroup.rotation.y = 2 * Math.cos(elapsedTime  * 2 / 10) / 10;

    if (astro) {
        astro.rotation.y += Math.sin(elapsedTime / 10) / 2000;
    }
}


window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
            if (actualPhase == 0 && readyToStart ) {
        actualPhase = 1;
        readyToStart = false;
        actualScene();
    } else if (canEnterScreen) {
        enterScreen();
    }
    }

})

const openScreen = () => {
    if (tela) {
        if (tela.rotation.x > Math.PI * 0.8) {
            const distance = tela.rotation.x - Math.PI * 0.8;
            tela.rotation.x -= distance * 0.005;
        }
}
}

const actualAnimation = (elapsedTime) => {
    switch (actualPhase){
        case 0:

        test.getWorldPosition(controls.target)
        break

        case 1:
        test.getWorldPosition(controls.target)
            openScreen()
            break
        default:
            break
    }
}

// SCENE 2

const scene2 = new THREE.Scene();

const aspectRatio = sizes.width / sizes.height
const camera2 = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1)
// const camera2 = new THREE.PerspectiveCamera(100, aspectRatio, 0.1, 100)

camera2.position.z = 3;

const colorPallet = [new THREE.Color(Math.max(Math.random() - 0.5, 0.1), Math.max(Math.random() - 0.5, 0.1), Math.max(Math.random() - 0.5, 0.1)), new THREE.Color(Math.min(Math.random() + 0.5, 0.9), Math.min(Math.random() + 0.5, 0.9), Math.min(Math.random() + 0.5, 0.9))];

for (let i = 2; i < 50; i+= 1) {
    colorPallet[i] = new THREE.Color(Math.random(), Math.random(), Math.random());
    
}
let actualColor = colorPallet[0];
let actualBg = colorPallet[1];

const background = new THREE.Mesh(
    new THREE.PlaneGeometry(aspectRatio * 2, 2),
    new THREE.ShaderMaterial({
        vertexShader: vertexPaper,
        fragmentShader: fragmentPaper,
        uniforms:{
            u_time: {value: 0},
            u_resolution: {value: new THREE.Vector2(sizes.width, sizes.height)},
            intensity: {value: 1},
            backgroundColor: {value: actualBg },
            mainColor: {value: actualColor},
            quantity: {value: 700}
        }
    })
)

const changeColor = () => {
    if (actualBg === colorPallet[colorPallet.length - 1]) {
        actualColor = colorPallet[0];
        actualBg = colorPallet[1];
    } else {
        let actualIndex;
        colorPallet.forEach((color, index) => {if (actualColor === color) actualIndex = index;})
        actualColor = colorPallet[actualIndex + 1];
        actualBg = colorPallet[actualIndex + 2];
    }
    background.material.uniforms.backgroundColor.value = actualBg;
    background.material.uniforms.mainColor.value = actualColor;
}

scene2.add(background);

let rendering = true;



canvas.addEventListener('click', () => {

    if (actualPhase === 2) {
        changeColor();
    }
})

let canEnterScreen = false;

const enterScreen =  () => {
    const timeline2 = gsap.timeline();
    const distance = camera.position.distanceTo(new THREE.Vector3(-1, 0.6, -0.5));
    if (distance > 0.8) {
        timeline2.to(camera.position, {
            duration: distance,
            y: 0.6,
            z: - 0.5,
            x: -1,
            ease: 'power4.easeIn'
        })
    }
timeline2.to(camera.position, {
    duration: 3,
    y: 0.25,
    z: 0,
    x: 0,
    ease: 'Power4.easeIn'
})
timeline2.to(camera, {
    fov: 10,
    duration:0.5
}).then(() => {
    actualPhase = 2;
    const timelime3 = gsap.timeline()
    timelime3.to(background.material.uniforms.intensity, {
        delay: 2,
        value: 0,
        duration: 5,
    })
    timelime3.to(background.material.uniforms.quantity, {
        value: 2,
        duration: 6,
        ease: 'Power0 easeOut'
    })
    timelime3.to(background.material.uniforms.quantity, {
        delay: 10,
        value: 0,
        duration: 6,
        ease: 'Power2 easeOut'
    }).then(() => {
        rendering = false;
        canvas.remove();
    })
})
}

const actualScene = () => {
    switch (actualPhase) {
        case 1:
            camera.position.order = 'YXZ'
            gsap.to(test.position, {
                x: 0.11,
                y:0.11,
                z:0,
                duration: 10
            });
            gsap.to(camera.position, {
                duration: 10,
                y: 0.6,
                z: - 0.5,
                x: -1,
                ease: 'slowMo.easeIn'
            }).then(() => {
                canEnterScreen = true;
                controls.enableRotate = true;
                // ReactDOM.render(<App />, document.getElementById('root'));
            });
        default: 
        break
    }
}

ReactDOM.render(<App />, document.getElementById('root'));


const fontLoader = new FontLoader(loadManager);

let fonte;

// const textMaterial = new THREE.MeshNormalMaterial({
// })

const textMaterial = new THREE.ShaderMaterial({
    vertexShader: vertexText,
    fragmentShader: fragmentText,
    uniforms: {
        opacity: {value: 1},
    }
})

fontLoader.load('/Fonts/Alfa Slab One_Regular.json', (font) => {
    const textGeometry = new TextGeometry('GUSTAVO MIYAZAKI',{
        font,
        size: 0.045,
        height: 0.01
    })

    const mesh = new THREE.Mesh(textGeometry, textMaterial);
    fonte = mesh;

    fonte.position.set(-0.131, 0.213, -0.155);
    fonte.rotation.set(0.23, -0.409, 0.181);

    mainGroup.add(mesh)
})

const paperSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(0.08, 0.13),
    new THREE.MeshStandardMaterial({ map: paperTexture, side: THREE.DoubleSide }),
)


paperSheet.receiveShadow = true

paperSheet.rotation.order = 'YXZ'

paperSheet.rotation.x = -Math.PI / 2;
paperSheet.rotation.z = 0.9;
paperSheet.position.y = 0.103;
paperSheet.position.z = 0.2;
paperSheet.position.x = -0.03;
mainGroup.add(paperSheet)
mainGroup.rotation.y = Math.PI * 0.5;



const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    if (laptop) {
        laptop.rotation.x = 4.8 + ( Math.sin((elapsedTime * 2) / 5)) / 12;
    }

    // Update controls
    controls.update()

    gravity(elapsedTime);



    targetView.material.uniforms.time.value = elapsedTime / 2;
    background.material.uniforms.u_time.value = elapsedTime / 2;




    actualAnimation(elapsedTime);

    // Render

        frameGroup.position.y = (Math.sin(elapsedTime / 5) + 2) / 200;
        frameGroup.rotation.z = (Math.sin(elapsedTime / 200) ) / 20;


        //Parallax

        const ParallaxX = mouse.x * 0.3;
        const ParallaxY = mouse.y * 0.3;


    
    if (actualPhase === 0 || canEnterScreen) {
        if (mouse.y === mouse.previousY && mouse.x === mouse.previousX) {
            mouse.repetition += deltaTime;
        } else {
            mouse.repetition = 0;
        }
        if (mouse.repetition < 2) {
            mainGroup.position.x += (ParallaxX - mainGroup.position.x) * 0.5 * deltaTime;
            mainGroup.position.y += (ParallaxY - mainGroup.position.y) * 0.5 * deltaTime;
        }
        mouse.previousX = mouse.x;
        mouse.previousY = mouse.y;
    }

    renderer.render(actualPhase === 2 ? scene2 : scene, actualPhase === 2 ? camera2 : camera)
    
    // Call tick again on the next frame
    camera.updateProjectionMatrix()

    if (rendering) {
        window.requestAnimationFrame(tick)
    }
}

tick()

