import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from 'lil-gui'
import VertexShader from './shaders/test/vertex.glsl'
import FragmentShader from './shaders/test/fragment.glsl'
import waterVertexShader from './shaders/test/wvertex.glsl'
import waterFragmentShader from './shaders/test/wfragment.glsl'



/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}

debugObject.depthColor = '#00022e'
debugObject.surfaceColor = '#001f52'


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader= new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial){
            // console.log('child')
            child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

debugObject.envMapIntensity = 2.5
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(updateAllMaterials).name('EnvMap Intensity')


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const flagTexture = textureLoader.load('/textures/pacific.png')
const moonTexture1 = textureLoader.load('/textures/moon1.jpg')
const moonTexture2 = textureLoader.load('/textures/moon2.jpg')


/**
 * Models
 */
gltfLoader.load('/models/land.glb', (gltf) => {
    gltf.scene.scale.set(1, 1, 1)
    gltf.scene.position.set(0, 0, 0)
    // gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterials()
})

gltfLoader.load('/models/house.glb', (gltf) => {
    gltf.scene.scale.set(1, 1, 1)
    gltf.scene.position.set(0, 0, 0)
    // gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterials()
})

gltfLoader.load('/models/bench.glb', (gltf) => {
    gltf.scene.scale.set(0.3, 0.3, 0.25)
    gltf.scene.position.set(4.5, 0.5, 3)
    gltf.scene.rotation.y = Math.PI * 0.2
    scene.add(gltf.scene)

    updateAllMaterials()
})

gltfLoader.load('/models/tree.glb', (gltf) => {
    gltf.scene.scale.set(1, 1, 1)
    gltf.scene.position.set(-6.8, -0.5, 1.4)
    // gltf.scene.rotation.y = Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterials()
    gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('Tree rotation')
})

gltfLoader.load('/models/tree.glb', (gltf) => {
    gltf.scene.scale.set(0.8, 0.8, 0.8)
    gltf.scene.position.set(7.65, -0.5, 1.2)
    gltf.scene.rotation.y = -Math.PI * 0.7
    scene.add(gltf.scene)

    updateAllMaterials()
})

gltfLoader.load('/models/tree.glb', (gltf) => {
    gltf.scene.scale.set(1.2, 1.2, 1.2)
    gltf.scene.position.set(5.3, -0.5, -3.7)
    gltf.scene.rotation.y = -Math.PI * 0.3
    scene.add(gltf.scene)

    updateAllMaterials()
})

gltfLoader.load('/models/tree.glb', (gltf) => {
    gltf.scene.scale.set(1.1, 1.1, 1.1)
    gltf.scene.position.set(-3.7, -0.5, -5.5)
    gltf.scene.rotation.y = -Math.PI * 0.5
    scene.add(gltf.scene)

    updateAllMaterials()
})

/**
 * Environment map
 */
const environmentMap =  cubeTextureLoader.load([
    '/textures/environmentMaps/space.jpg',
    '/textures/environmentMaps/space.jpg',
    '/textures/environmentMaps/space.jpg',
    '/textures/environmentMaps/space.jpg',
    '/textures/environmentMaps/space.jpg',
    '/textures/environmentMaps/space.jpg'
])
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap


/**
 * Shadering (Flag, Moon, ...)
 */
// Flag
const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), new THREE.MeshStandardMaterial({ color: "gray" }))
stick.position.set(2.56, 11.6, 0.01)
const flagGeometry = new THREE.BoxGeometry(1, 0.55, 0.01, 32, 32)
const count = flagGeometry.attributes.position.count
const randoms = new Float32Array(count)
for (let i=0; i < count; i++){
    randoms[i] = Math.random()
}
flagGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
// Material
const flagMaterial = new THREE.ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    transparent: false,
    uniforms: {
        uFrequency: {value: new THREE.Vector2(10, 5)},
        uTime: {value: 0},
        uColor: {value: new THREE.Color('#630000')},
        uTexture: {value: flagTexture}
    }
})
// Mesh
const flag = new THREE.Mesh(flagGeometry, flagMaterial)
flag.position.set(3.1, 12, 0.01)
scene.add(flag, stick)

// Moon
const moonGeometry = new THREE.SphereGeometry(3, 32, 32)
// Material
const moonMaterial1 = new THREE.ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    transparent: false,
    uniforms: {
        uFrequency: {value: new THREE.Vector2(0, 0)},
        uTime: {value: 0},
        uColor: {value: new THREE.Color('#630000')},
        uTexture: {value: moonTexture1}
    }
})
const moonMaterial2 = new THREE.ShaderMaterial({
    vertexShader: VertexShader,
    fragmentShader: FragmentShader,
    transparent: false,
    uniforms: {
        uFrequency: {value: new THREE.Vector2(0, 0)},
        uTime: {value: 0},
        uColor: {value: new THREE.Color('#630000')},
        uTexture: {value: moonTexture2}
    }
})
// Mesh
const moon1 = new THREE.Mesh(moonGeometry, moonMaterial1)
const moon2 = new THREE.Mesh(moonGeometry, moonMaterial2)
moon1.position.set(-29.99, 10, -24.98)
moon2.position.set(-30, 10, -25)
scene.add(moon1, moon2)

// water
const waterGeometry = new THREE.BoxGeometry(30, 25, 2, 1600, 1600)
const count1 = waterGeometry.attributes.position.count
const randoms1 = new Float32Array(count1)
for (let i=0; i < count1; i++){
    randoms1[i] = Math.random()
}
waterGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms1, 1))
// Material
const waterMaterial = new THREE.ShaderMaterial({
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    uniforms: {
        uBigWavesElevation: {value: 0.2},
        uBigWavesFrequency: {value: new THREE.Vector2(1, 0.4)},
        uTime: {value: 0},
        uBigWavesSpeed: {value: 0.75},
        uDepthColor: {value: new THREE.Color(debugObject.depthColor)},
        uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},
        uColorOffset: {value: 0.08},
        uColorMultiplier: {value: 5},
        // uTexture: {value: flagTexture}
    }
})
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.position.set(0, -2, 0)
water.rotation.set(-Math.PI/2, 0, 0)
scene.add(water)
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.01).name('uBigWavesElevation')
gui.addColor(debugObject, 'depthColor').onChange(() => {
    waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
})
gui.addColor(debugObject, 'surfaceColor').onChange(() => {
    waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
})
/**
 * Lighting
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
// регулировка яркости глобального освещения
gui.add(ambientLight, 'intensity').min(0).max(5).step(0.1).name('AmbientLight intensity')

// flame
const pointLight1 = new THREE.PointLight(0xe0b700, 10, 20)
pointLight1.position.set(-2.55, 3.66, 1.65)
const flame1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 8), new THREE.MeshStandardMaterial({ color: 0xe0b700 }))
flame1.position.set(-2.55, 3.62, 1.65)
const flame2 = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 8), new THREE.MeshStandardMaterial({ color: 0xe0b700 }))
flame2.position.set(-2.55, 3.66, 1.65)
const flame3 = new THREE.Mesh(new THREE.SphereGeometry(0.02, 16, 8), new THREE.MeshStandardMaterial({ color: 0xe0b700 }))
flame3.position.set(-2.55, 3.7, 1.65)

// windows light
const pointLight2 = new THREE.PointLight(0xe0b700, 1, 2)
pointLight2.position.set(-2.54, 8.5, 1.39)
const pointLight3 = new THREE.PointLight(0xe0b700, 3, 10)
pointLight3.position.set(2.57, 3.2, 0.6)
const pointLight4 = new THREE.PointLight(0xe0b700, 1, 2)
pointLight4.position.set(2.57, 4.82, 0.6)

const sceneSpotlight = new THREE.SpotLight(0x85d2ff, 3.5, 100, Math.PI*0.2, 0, 0)
sceneSpotlight.castShadow = true
sceneSpotlight.position.set(-25, 10, -20)
sceneSpotlight.shadow.mapSize.width = 3000
sceneSpotlight.shadow.mapSize.height = 3000
sceneSpotlight.shadow.camera.fov = 30
sceneSpotlight.shadow.camera.near = 1
sceneSpotlight.shadow.camera.far = 6
sceneSpotlight.target.position.set(0, 5, 0)

// const aim = new THREE.Mesh(new THREE.SphereGeometry(2, 16, 8), new THREE.MeshStandardMaterial({ color: 0xe0b700 }))
// aim.position.set(-30, 10, -25)



// const moonSpotlight = new THREE.SpotLight(0x85d2ff, 3.5, 100, 0.25, 0, 0)
// moonSpotlight.castShadow = true
// moonSpotlight.position.set(-30, 10, 10)
// moonSpotlight.shadow.mapSize.width = 1024
// moonSpotlight.shadow.mapSize.height = 1024
// moonSpotlight.shadow.camera.fov = 30
// moonSpotlight.shadow.camera.near = 1
// moonSpotlight.shadow.camera.far = 6
// moonSpotlight.target.position.set(-30, 10, -25)

scene.add(sceneSpotlight,  sceneSpotlight.target, water, pointLight1, flame1, flame2, flame3, pointLight2, pointLight3, pointLight4)

gui.add(sceneSpotlight, 'intensity').min(0).max(10).step(0.001).name('Moonlight Intensity')


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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.set(6, 12, 16)
camera.lookAt(scene.position)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    flagMaterial.uniforms.uTime.value = elapsedTime;
    waterMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()