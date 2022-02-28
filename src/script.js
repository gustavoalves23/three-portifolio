import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import fragmentPicture from './Shaders/fragmentPicture.glsl';
import vertexPicture from './Shaders/vertexPicture.glsl';
import fragmentPaper from './Shaders/fragmentPaper.glsl';
import vertexPaper from './Shaders/vertexPaper.glsl';
import gsap from 'gsap';
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom';

ReactDOM.render(<App />, document.getElementById('root'));

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

//Textures

const cubeTextureLoader = new THREE.CubeTextureLoader()

const envMap = cubeTextureLoader.load(
    ['/envmap/space/px.png',
    '/envmap/space/nx.png',
    '/envmap/space/py.png',
    '/envmap/space/ny.png',
    '/envmap/space/pz.png',
    '/envmap/space/nz.png'],
)


console.log(envMap);

const textureLoader = new THREE.TextureLoader()

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

const gltfLoader = new GLTFLoader();

const mainGroup = new THREE.Group()

let table;

const tableMaterial = new THREE.MeshStandardMaterial({
    color: 'black',
    envMap,
    envMapIntensity: 10,
    metalness: 0.8,
    roughness: 0.2

})

const test = new THREE.Mesh(
    new THREE.BoxGeometry(.01, .01, .01),
    new THREE.MeshBasicMaterial({transparent: true})
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
    // gui.add(frame.position, 'x', -1, 1).step(0.001);
    // gui.add(frame.position, 'y', 0, 1).step(0.001);
    // gui.add(frame.position, 'z', 0, 1).step(0.001);
    // gui.add(frame.rotation, 'y', 0, 5).step(0.001);

})

let laptop;
let tela;

const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.1, 0.1,),
    new THREE.MeshBasicMaterial({color: 'red'})
)

gltfLoader.load('/models/Laptop/scene.gltf', (gltf) => {
    laptop = gltf.scene.children[0] ;
    console.log(laptop);
    laptop.traverse((item) => {
        if (item.name === 'Screen') {
            tela = item;
            // tela.children.concat(screen)
            console.log(tela.children);
        gui.add(tela.rotation, 'x', -10, 10)
            tela.rotation.x = Math.PI * 3/2.05;
        }

    })
    laptop.scale.set(0.005, 0.005, 0.005)
    // laptop.scale.set(0.01, 0.01, 0.001)
    laptop.position.y = 0.12;
    laptop.rotation.z = - Math.PI / 2;
    laptop.rotation.y = 0.3;
    frameGroup.add(laptop)
} )



const paperSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(0.08, 0.13),
    new THREE.MeshStandardMaterial({ map: paperTexture, side: THREE.DoubleSide }),
    // new THREE.ShaderMaterial({
    //     vertexShader: vertexPaper,
    //     fragmentShader:  fragmentPaper,
    //     uniforms: {
    //         time: {value: 0},
    //     }

    // })
)


paperSheet.receiveShadow = true

paperSheet.rotation.order = 'YXZ'

paperSheet.rotation.x = -Math.PI / 2;
paperSheet.rotation.z = 0.9;
paperSheet.position.y = 0.103;
paperSheet.position.z = 0.2;
paperSheet.position.x = -0.03;
mainGroup.add(paperSheet)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
// directionalLight.castShadow = true
// directionalLight.shadow.mapSize.set(1024, 1024)
// directionalLight.shadow.camera.far = 15
// directionalLight.shadow.camera.left = - 7
// directionalLight.shadow.camera.top = 7
// directionalLight.shadow.camera.right = 7
// directionalLight.shadow.camera.bottom = - 7
// directionalLight.position.set(-10, 4.8, -4.6)
// scene.add(directionalLight)


const bulbLight = new THREE.SpotLight(0xFFFFFF, 20);
bulbLight.position.set(0.041, 0.213, 0.189);
bulbLight.target.position.set(0, 0.115, 0.189);
bulbLight.angle = 0.413;
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


// gui.add(targetView.rotation, 'x', -2, 5).step(0.001);
// gui.add(targetView.rotation, 'y', 0, 5).step(0.001);
// gui.add(targetView.rotation, 'z', 0, 5).step(0.001);

// gui.add(targetView.position, 'x', -0.3, 0.3).step(0.00000001);
// gui.add(targetView.position, 'y', -0.3, 0.3).step(0.00000001);
// gui.add(targetView.position, 'z', -0.3, 0.3).step(0.00000001);


gui.add(mainGroup.rotation, 'y', 0, 10);


//Particles

const starsGeometry = new THREE.BufferGeometry();

const starsQuantity = 7000;
const randomOffset = 0.2;

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
    camera.updateProjectionMatrix()

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



gui.add(camera.position, 'x', -.3, 0.3);
gui.add(camera.position, 'y', -.3, 0.3);
gui.add(camera.position, 'z', -.3, 0.3);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.enableZoom = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGL1Renderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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
}

canvas.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / sizes.width)  - 0.5,
    mouse.y = - (e.clientY / sizes.height) + 0.5
})

let actualPhase = 0;

let canOpenScreen = false;


const gravity = (elapsedTime) => {
    mainGroup.rotation.x = Math.sin(elapsedTime / 5) / 10;
    mainGroup.rotation.y = 2 * Math.cos(elapsedTime  * 2 / 10) / 10;
}

window.addEventListener('wheel', (e) => {
    actualPhase = 1;
    console.log(e);
    actualScene();
})

const actualScene = () => {
    switch (actualPhase) {
        case 1:
            camera.position.order = 'YXZ'
            gsap.to(test.position, {
                x: 0.11,
                y:0.11,
                z:0
            });
            gsap.to(camera.position, {
                duration: 7,
                y: 0.6,
                z: - 0.5,
                x: -1,
                ease: 'SlowMo.easeIn'
            }).then(() => {
                gsap.to(camera.position, {
                    duration: 3,
                    y: 0.25,
                    z: 0,
                    x: 0,
                    ease: 'Power4.easeIn'
                }).then(() => {
                    gsap.to(camera, {
                        fov: 10,
                        duration:0.5
                    })
                })
            })
            break
        default: 
        break
    }
}

gui.add(camera.position, 'x', -2, 2).step(0.001);
gui.add(camera.position, 'y', -2, 2).step(0.001);
gui.add(camera.position, 'z', -2, 2).step(0.001);

const openScreen = () => {
    if (tela) {
        if (tela.rotation.x > Math.PI * 0.8) {
            const distance = tela.rotation.x - Math.PI * 0.8;
            tela.rotation.x -= distance * 0.012;
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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update controls
    controls.update()

    gravity(elapsedTime);

    targetView.material.uniforms.time.value = elapsedTime / 2;
    // paperSheet.material.uniforms.time.value = elapsedTime / 2;

    mainGroup.rotation.y = Math.PI * 0.5;


    actualAnimation(elapsedTime);

    // Render

        frameGroup.position.y = (Math.sin(elapsedTime / 5) + 2) / 200;
        frameGroup.rotation.z = (Math.sin(elapsedTime / 200) ) / 20;

        //Parallax

        const ParallaxX = mouse.x * 0.5;
        const ParallaxY = mouse.y * 0.5;

// controls.target = targetView.position;


    
    if (actualPhase === 0) {
        mainGroup.position.x += (ParallaxX - mainGroup.position.x) * 0.5 * deltaTime;
        mainGroup.position.y += (ParallaxY - mainGroup.position.y) * 0.5 * deltaTime;
    }
    
    // Call tick again on the next frame
    camera.updateProjectionMatrix()

    renderer.render(scene, camera)


    window.requestAnimationFrame(tick)
}

tick()