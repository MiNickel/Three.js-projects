import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const gui = new dat.GUI();

var scene, camera, renderer, earthCamera;
var objects = [];

const earthDistance = 2690.6475;
const moonDistanceFromEarth = 6.8643;
const mercuryDistance = 1041.5468;
const sunSize = 25;
const earthSize = sunSize / 109;
const moonSize = earthSize / 3.7;
const mercurySize = earthSize / 2.6235;

var textureLoader = new THREE.TextureLoader();

function init() {
    const canvas = document.getElementById("can");

    scene = new THREE.Scene();
    scene.background = textureLoader.load("../textures/star-field.png");
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    earthCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    earthCamera.position.set(0, 35, 35);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);

    camera.position.z = 1300;
    //camera.position.y = 1000;
    controls.update();
    camera.lookAt(0, 0, 0);
    controls.update();

    var cameraPos = {
        start: false,
    };

    window.addEventListener("resize", onResize, false);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const sphereGeometry = new THREE.SphereBufferGeometry(1, 24, 24);

    const solarSystem = new THREE.Object3D();
    const earthOrbit = new THREE.Object3D();
    const marsOrbit = new THREE.Object3D();
    earthOrbit.position.x = sunSize + earthDistance;
    scene.add(solarSystem);
    solarSystem.add(earthOrbit);
    solarSystem.add(marsOrbit);
    objects.push(solarSystem);
    objects.push(earthOrbit);
    objects.push(marsOrbit);
    earthOrbit.add(earthCamera);



    const sun = addSphereObject({
        size: sunSize,
        textures: {
            map: "../textures/Map_of_the_full_sun.jpg",
            emissiveMap: "../textures/Map_of_the_full_sun.jpg",
            bumpMap: "../textures/Map_of_the_full_sun.jpg",
        },
        material: {
            bumpScale: 0.5,
            emissive: new THREE.Color(0xFF8C00),
        },
        position: {
            x: 0,
            y: 0,
        },
        addToScene: solarSystem,
        name: "sun",
    });

    const mercury = addSphereObject({
        size: mercurySize + 20,
        textures: {
            map: "../textures/mercury_texture.jpg",
            bumpMap: "../textures/mercury_texture.jpg",
        },
        material: {
            bumpScale: 0.5,
        },
        position: {
            x: sunSize + mercuryDistance,
            y: 0,
        },
        addToScene: solarSystem,
        name: "mercury",
    });

    const earth = addSphereObject({
        size: earthSize + 20,
        textures: {
            map: "../textures/earthmap1k.jpg",
            //emissiveMap: "../textures/earthmap1k.jpg",
            bumpMap: "../textures/earthbump1k.jpg",
        },
        material: {
            bumpScale: 0.5,
        },
        position: {
            x: 0,
            y: 0,
        },
        addToScene: earthOrbit,
        name: "earth",
    });

    const moon = addSphereObject({
        size: moonSize + 4,
        textures: {
            map: "../textures/moon_texture.jpg",
            bumpMap: "../textures/moon_bump_map.jpg",
        },
        material: {
            bumpScale: 0.5,
        },
        position: {
            x: earthSize + 20 + moonDistanceFromEarth,
            y: 0,
        },
        addToScene: earthOrbit,
        name: "moon",
    });

    gui.add(cameraPos, "start").name("Erde").onChange(() => {
        if (cameraPos.start) {
            camera.position.set(2705, 0, 66);
            //camera.lookAt(earth.position);
        } else {
            camera.position.set(0, 0, 1300);
        }
    });


    /*const earth = addSolidGeometry(0, 0, sphereGeometry, 0x2233ff, earthOrbit);
    earth.scale.set(earthSize, earthSize, earthSize);

    const moon = addSolidGeometry(earthSize + moonDistanceFromEarth, 0, sphereGeometry, 0x888888, earthOrbit);
    moon.scale.set(moonSize, moonSize, moonSize);*/

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    scene.add(pointLight);

}

function addSphereObject(options) {

    let object = new THREE.Mesh(createSphereGeometry(options.size), createSphereMaterial(options));
    object.position.x = options.position.x;
    object.position.y = options.position.y;
    object.name = options.name;
    options.addToScene.add(object);
    objects.push(object);

    return object;

}

function createSphereGeometry(size) {

    let sphereGeometry = new THREE.SphereBufferGeometry(size, 24, 24);

    return sphereGeometry;

}

function createSphereMaterial(options) {

    let material = new THREE.MeshPhongMaterial();

    for (let property in options.textures) {
        textureLoader.load(options.textures[property], (texture) => {
            material[property] = texture;
            material.needsUpdate = true;
        });
    }

    if (options.material) {
        for (var property in options.material) {
            material[property] = options.material[property];
        }
    }

    return material;

}

function animate() {

    requestAnimationFrame(animate);

    objects.forEach((obj) => {
        //obj.rotation.y += 0.006;
    });

    renderer.render(scene, camera);

}

function onResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function addObject(x, y, obj, addToScene) {

    obj.position.x = x;
    obj.position.y = y;

    addToScene.add(obj);
    objects.push(obj);

    return obj;

}

/*function createMaterial(matColor) {

    const material = new THREE.MeshBasicMaterial({ map: sunTexture });

    if (typeof matColor === "undefined") {
        const hue = Math.random();
        const saturation = 1;
        const luminace = 0.5;
        material.color.setHSL(hue, saturation, luminace);
    } else {
        //material.color.setHex(matColor);
    }

    return material;

}*/

function addSolidGeometry(x, y, geometry, color, addToScene) {

    const mesh = new THREE.Mesh(geometry, createMaterial(color));

    return addObject(x, y, mesh, addToScene);

}

function createText() {

    const loader = new THREE.FontLoader();
    loader.load("../TrueLiesRegular.json", (font) => {

        const geometry = new THREE.TextBufferGeometry('Oof', {

            font: font,
            size: 2,
            height: .2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: .3,
            bevelOffset: 0,
            bevelSegments: 5

        });

        const mesh = new THREE.Mesh(geometry, createMaterial());
        geometry.computeBoundingBox();
        geometry.boundingBox.getCenter(mesh.position).multiplyScalar(-1);

        const parent = new THREE.Object3D();
        parent.add(mesh);

        addObject(0, 4, parent);

    });

}

function addLineGeometry(x, y, geometry) {

    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const mesh = new THREE.LineSegments(geometry, material);
    addObject(x, y, mesh);

}

init();
animate();