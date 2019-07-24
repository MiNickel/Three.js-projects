import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

const gui = new dat.GUI();

var scene, camera, renderer, earthCamera, mercuryCamera, cameras, controls, cameraPos, earthOrbit, solarSystem, venusCamera;
var objects = [];

const earthDistance = 2645.683453;
const moonDistanceFromEarth = 6.8643;
const mercuryDistance = 1258.992806;
const venusDistance = 1946.043165;
const sunSize = 25;
const earthSize = sunSize / 109;
const moonSize = earthSize / 3.7;
const mercurySize = earthSize / 2.6235;
const venusSize = sunSize / 114.8417;

var textureLoader = new THREE.TextureLoader();

function init() {

    const canvas = document.getElementById("can");

    scene = new THREE.Scene();
    scene.background = textureLoader.load("../textures/star-field.png");

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 14000);
    camera.position.z = 1600;
    camera.lookAt(0, 0, 0);

    earthCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    earthCamera.position.set(0, 0.3, 0.5);

    mercuryCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    mercuryCamera.position.set(0, 0.2, 0.4);

    venusCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    venusCamera.position.set(0, 0.5, 0.7);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    scene.add(pointLight);

    cameras = [
        { cam: camera },
        { cam: earthCamera },
        { cam: mercuryCamera },
        { cam: venusCamera },
    ]

    solarSystem = new THREE.Object3D();
    earthOrbit = new THREE.Object3D();
    const mercuryOrbit = new THREE.Object3D();
    const marsOrbit = new THREE.Object3D();
    const venusOrbit = new THREE.Object3D();

    earthOrbit.position.x = sunSize + earthDistance;
    mercuryOrbit.position.x = sunSize + mercuryDistance;
    venusOrbit.position.x = sunSize + venusDistance;
    scene.add(solarSystem);
    solarSystem.add(earthOrbit);
    solarSystem.add(mercuryOrbit);
    solarSystem.add(marsOrbit);
    solarSystem.add(venusOrbit);
    objects.push(solarSystem);
    objects.push(earthOrbit);
    objects.push(mercuryOrbit);
    objects.push(marsOrbit);
    earthOrbit.add(earthCamera);
    mercuryOrbit.add(mercuryCamera);
    venusOrbit.add(venusCamera);
    earthCamera.lookAt(earthOrbit.position);
    mercuryCamera.lookAt(mercuryOrbit.position);
    venusCamera.lookAt(venusOrbit.position);

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
        size: mercurySize,
        textures: {
            map: "../textures/mercury_texture.jpg",
            bumpMap: "../textures/mercury_texture.jpg",
        },
        material: {
            bumpScale: 0.01,
        },
        position: {
            x: 0,
            y: 0,
        },
        addToScene: mercuryOrbit,
        name: "mercury",
    });

    const venus = addSphereObject({
        size: venusSize,
        textures: {
            map: "../textures/venus_surface.jpg",
            emissiveMap: "../textures/venus_surface.jpg",
        },
        material: {
            emissive: new THREE.Color(0xffffff),
            emissiveIntensity: 0.4,
        },
        position: {
            x: 0,
            y: 0,
        },
        addToScene: venusOrbit,
        name: "venus",
    })

    const earth = addSphereObject({
        size: earthSize,
        textures: {
            map: "../textures/earthmap1k.jpg",
            //emissiveMap: "../textures/earthmap1k.jpg",
            bumpMap: "../textures/earthbump1k.jpg",
        },
        material: {
            bumpScale: 0.1,
        },
        position: {
            x: 0,
            y: 0,
        },
        addToScene: earthOrbit,
        name: "earth",
    });

    const moon = addSphereObject({
        size: moonSize,
        textures: {
            map: "../textures/moon_texture.jpg",
            bumpMap: "../textures/moon_bump_map.jpg",
        },
        material: {
            bumpScale: 0.1,
        },
        position: {
            x: earthSize + moonDistanceFromEarth,
            y: 0,
        },
        addToScene: earthOrbit,
        name: "moon",
    });

    createOrbit(2670.683453, 2760.611511); // Erde
    createOrbit(1283.992806, 870.323741); // Merkur
    createOrbit(venusDistance + 25, 1935.251799 + 25); // Venus

    camera = cameras[0];
    controls = new OrbitControls(camera.cam, renderer.domElement);
    controls.update();

    cameraPos = {
        earth: () => {
            camera = cameras[1];

            controls.update();
        },
        start: () => {
            camera = cameras[0];

            controls.update();
        },
        mercury: () => {
            camera = cameras[2];

            controls.update();
        },
        venus: () => {
            camera = cameras[3];

            controls.update();
        },
    };

    gui.add(cameraPos, "start").name("Start");

    var f1 = gui.addFolder("Erde");
    f1.add(cameraPos, "earth").name("zeige die Erde");

    var f2 = gui.addFolder("Merkur");
    f2.add(cameraPos, "mercury").name("zeige den Merkur");

    var f3 = gui.addFolder("Venus");
    f3.add(cameraPos, "venus").name("zeige die Venus");

    console.log($("li.title").html());

    var test = document.createElement("li");
    test.innerHTML = "Alter: 4,6 Milliarden Jahre";
    var test2 = document.createElement("li");
    test2.innerHTML = "Durchmesser: 12.700 Kilometer";
    f1.domElement.getElementsByTagName("ul")[0].appendChild(test);
    f1.domElement.getElementsByTagName("ul")[0].appendChild(test2);

    window.addEventListener("resize", onResize, false);

}

function animate() {

    requestAnimationFrame(animate);

    objects.forEach((obj) => {
        if (obj.name == "earth") obj.rotation.y += 0.01;
    });

    renderer.render(scene, camera.cam);

}

function onResize() {

    cameras.forEach((camObject) => {
        const camera = camObject.cam;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    renderer.setSize(window.innerWidth, window.innerHeight);

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

function createOrbit(x, y) {

    const curve = new THREE.EllipseCurve(
        0, 0,
        x, y,//2670.683453, 2760.611511,
        0, 2 * Math.PI,
        false,
        0
    );

    const points = curve.getPoints(1000);
    const curveGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const curveMaterial = new THREE.LineBasicMaterial({ color: 0x5e5e5e });

    const ellipse = new THREE.Line(curveGeometry, curveMaterial);
    ellipse.rotateX(90);
    scene.add(ellipse);

}

init();
animate();