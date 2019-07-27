import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { AudioLoader } from 'three';

const gui = new dat.GUI();

var scene, camera, renderer, controls, guiMethods, earthOrbit, solarSystem;
var earthCamera, mercuryCamera, venusCamera, marsCamera, jupiterCamera, saturnCamera, uranusCamera, neptunCamera, aldebaranCamera;
var earthSphere, mercurySphere, venusSphere, marsSphere, jupiterSphere, saturnSphere, uranusSphere, neptunSphere;
var cameras, sound, audioLoader;
var objects = [];
var planetInfos;
var folders;

const earthDistance = 2690.647482;
const moonDistanceFromEarth = 6.8643;
const mercuryDistance = 1041.52877;
const venusDistance = 1945.323741;
const marsDistance = 4100.539568;
const jupiterDistance = 13999.28058;
const saturnDistance = 25962.23022;
const uranusDistance = 51661.8705;
const neptunDistance = 80906.47482;
const sunSize = 25;
const earthSize = sunSize / 109;
const moonSize = earthSize / 3.7;
const mercurySize = earthSize / 2.6235;
const venusSize = sunSize / 114.8417;
const marsSize = earthSize / 1.877435602;

var textureLoader = new THREE.TextureLoader();

function init() {

    const canvas = document.getElementById("can");

    scene = new THREE.Scene();
    scene.background = textureLoader.load("../textures/star-field.png");

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200000);
    camera.position.z = 1600;
    camera.lookAt(0, 0, 0);

    earthCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    earthCamera.position.set(0, 0.5, 0.7);

    mercuryCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    mercuryCamera.position.set(0, 0.5, 0.7);

    venusCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    venusCamera.position.set(0, 0.5, 0.7);

    marsCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    marsCamera.position.set(0, 0.5, 0.7);

    aldebaranCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 4000);
    aldebaranCamera.position.set(0, 0.5, 0.7);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var listener = new THREE.AudioListener();
    camera.add(listener);
    sound = new THREE.Audio(listener);
    audioLoader = new THREE.AudioLoader();

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    scene.add(pointLight);

    cameras = [
        { cam: camera },
        { cam: earthCamera },
        { cam: mercuryCamera },
        { cam: venusCamera },
        { cam: marsCamera },
        { cam: aldebaranCamera },
    ]

    solarSystem = new THREE.Object3D();
    earthOrbit = new THREE.Object3D();
    const mercuryOrbit = new THREE.Object3D();
    const marsOrbit = new THREE.Object3D();
    const venusOrbit = new THREE.Object3D();
    //const aldebaranOrbit = new THREE.Object3D();

    earthOrbit.position.x = sunSize + earthDistance;
    mercuryOrbit.position.x = sunSize + mercuryDistance;
    venusOrbit.position.x = sunSize + venusDistance;
    marsOrbit.position.x = sunSize + marsDistance;
    //aldebaranOrbit.position.x = 200000;
    scene.add(solarSystem);
    solarSystem.add(earthOrbit);
    solarSystem.add(mercuryOrbit);
    solarSystem.add(marsOrbit);
    solarSystem.add(venusOrbit);
    //solarSystem.add(aldebaranOrbit);
    objects.push(solarSystem);
    objects.push(earthOrbit);
    objects.push(mercuryOrbit);
    objects.push(marsOrbit);
    earthOrbit.add(earthCamera);
    mercuryOrbit.add(mercuryCamera);
    venusOrbit.add(venusCamera);
    marsOrbit.add(marsCamera);
    //aldebaranOrbit.add(aldebaranCamera);
    earthCamera.lookAt(earthOrbit.position);
    mercuryCamera.lookAt(mercuryOrbit.position);
    venusCamera.lookAt(venusOrbit.position);
    marsCamera.lookAt(marsOrbit.position);
    //marsCamera.lookAt(aldebaranOrbit.position);

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
            bumpMap: "../textures/mercury_bump_map.jpg",
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
        atmosphere: {
            size: 0.002,
            material: {
                opacity: 0.8
            },
            textures: {
                map: "../textures/venus_atmosphere.jpg",
                alphaMap: "../textures/venus_atmosphere_alphamap.jpg"
            }
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
        atmosphere: {
            size: 0.003,
            material: {
                opacity: 0.8
            },
            textures: {
                map: "../textures/earthcloudmap.jpg",
                alphaMap: "../textures/earthcloudmaptrans.jpg"
            }

        },
        material: {
            bumpScale: 0.05,
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

    const mars = addSphereObject({
        size: marsSize,
        textures: {
            map: "../textures/2k_mars.jpg",
            bumpMap: "../textures/2k_mars.jpg",
        },
        material: {
            bumpScale: 0.01,
        },
        position: {
            x: 0,
            y: 0,
        },
        addToScene: marsOrbit,
        name: "mars",
    });

    const aldebaran = addSphereObject({
        size: earthSize,
        textures: {
            emissiveMap: "../textures/aldebaran.jpg"
        },
        material: {
            emissive: new THREE.Color(0xffffff)
        },
        position: {
            x: 200000,
            y: 0
        },
        addToScene: scene,
        name: "aldebaran",
    });

    aldebaran.add(aldebaranCamera);
    aldebaranCamera.lookAt(aldebaran.position);

    {
        earthSphere = createOrbit(earthDistance + 25);
        mercurySphere = createOrbit(mercuryDistance + 25);
        venusSphere = createOrbit(venusDistance + 25);
        marsSphere = createOrbit(marsDistance + 25);
        jupiterSphere = createOrbit(jupiterDistance + 25);
        saturnSphere = createOrbit(saturnDistance + 25);
        uranusSphere = createOrbit(uranusDistance + 25);
        neptunSphere = createOrbit(neptunDistance + 25);
    }


    camera = cameras[0];
    controls = new OrbitControls(camera.cam, renderer.domElement);
    controls.update();

    guiMethods = {
        earth: () => {
            camera = cameras[1];
            sound.pause();
        },
        start: () => {
            camera = cameras[0];
            sound.pause();
        },
        mercury: () => {
            camera = cameras[2];
            sound.pause();
        },
        venus: () => {
            camera = cameras[3];
            sound.pause();
        },
        mars: () => {
            camera = cameras[4];
            sound.pause();
        },
        aldebaran: () => {
            camera = cameras[5];
            audioLoader.load("../Aldebaran.mp3", (buffer) => {
                sound.setBuffer(buffer);
                sound.setVolume(0.5);
                sound.play();
            })
        },
        showEarthOrbit: false,
        showMercuryOrbit: false,
        showVenusOrbit: false,
        showMarsOrbit: false,
        showJupiterOrbit: false,
        showSaturnOrbit: false,
        showUranusOrbit: false,
        showNeptunOrbit: false,
    };

    gui.add(guiMethods, "start").name("Start");

    var f1 = gui.addFolder("Merkur");
    f1.add(guiMethods, "mercury").name("zeige den Merkur");
    f1.add(guiMethods, "showMercuryOrbit").name("zeige Umlaufbahn").onChange(() => {
        if (guiMethods.showMercuryOrbit) {
            mercurySphere.material.color = new THREE.Color(0xffffff);
        } else {
            mercurySphere.material.color = new THREE.Color(0x5e5e5e);
        }
    });

    let mercuryInfo = ["<strong>Alter</strong>: 4,503 Milliarden Jahre",
        "<strong>Durchmesser</strong>: 4.879,4 Kilometer",
        "<strong>Entfernung zur Sonne</strong>: 57,909 Mio. km",
        "<strong>Mittlere Temperatur</strong>: 167 Grad Celsius"];

    var f2 = gui.addFolder("Venus");
    f2.add(guiMethods, "venus").name("zeige die Venus");
    f2.add(guiMethods, "showVenusOrbit").name("zeige Umlaufbahn").onChange(() => {
        if (guiMethods.showVenusOrbit) {
            venusSphere.material.color = new THREE.Color(0xffffff);
        } else {
            venusSphere.material.color = new THREE.Color(0x5e5e5e);
        }
    });

    let venusInfo = ["<strong>Alter</strong>: 4,503 Milliarden Jahre",
        "<strong>Durchmesser</strong>: 12.103,6 Kilometer",
        "<strong>Entfernung zur Sonne</strong>: 108,16 Mio. km",
        "<strong>Mittlere Temperatur</strong>: 464 Grad Celsius"];

    var f3 = gui.addFolder("Erde");
    f3.add(guiMethods, "earth").name("zeige die Erde");
    f3.add(guiMethods, "showEarthOrbit").name("zeige Umlaufbahn").onChange(() => {
        if (guiMethods.showEarthOrbit) {
            earthSphere.material.color = new THREE.Color(0xffffff);
        } else {
            earthSphere.material.color = new THREE.Color(0x5e5e5e);
        }
    });

    let earthInfo = ["<strong>Alter</strong>: 4,6 Milliarden Jahre",
        "<strong>Durchmesser</strong>: 12.700 Kilometer",
        "<strong>Entfernung zur Sonne</strong>: 149,6 Mio. km",
        "<strong>Mittlere Temperatur</strong>: 15 Grad Celsius"];

    var f4 = gui.addFolder("Mars");
    f4.add(guiMethods, "mars").name("zeige den Mars");
    f4.add(guiMethods, "showMarsOrbit").name("zeige Umlaufbahn").onChange(() => {
        if (guiMethods.showMarsOrbit) {
            marsSphere.material.color = new THREE.Color(0xffffff);
        } else {
            marsSphere.material.color = new THREE.Color(0x5e5e5e);
        }
    });

    let marsInfo = ["<strong>Alter</strong>: 4,6 Milliarden Jahre",
        "<strong>Durchmesser</strong>: 6.792,4 Kilometer",
        "<strong>Entfernung zur Sonne</strong>: 227,99 Mio. km",
        "<strong>Mittlere Temperatur</strong>: -55 Grad Celsius"];

    var f5 = gui.addFolder("Aldebaran");
    f5.add(guiMethods, "aldebaran");

    planetInfos = [mercuryInfo, venusInfo, earthInfo, marsInfo];
    folders = [f1, f2, f3, f4];

    addInfoToAllPlanets(folders, planetInfos);

    window.addEventListener("resize", onResize, false);

}

function animate() {

    requestAnimationFrame(animate);

    objects.forEach((obj) => {
        if (obj.name == "earth" || obj.name == "aldebaran") obj.rotation.y += 0.01;
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

    let surface = new THREE.Mesh(createSphereGeometry(options.size), createSphereMaterial(options));
    let planet = new THREE.Object3D();
    planet.add(surface);
    planet.position.x = options.position.x;
    planet.position.y = options.position.y;
    planet.name = options.name;

    if (options.atmosphere) {
        let atmosphere = new THREE.Mesh(createSphereGeometry(options.size + options.atmosphere.size), createAtmosphereMaterial(options));
        planet.add(atmosphere);
    }

    options.addToScene.add(planet);
    objects.push(planet);

    return planet;

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

function createAtmosphereMaterial(options) {

    let material = new THREE.MeshPhongMaterial();

    let atmosphereMaterialDefaults = {
        side: THREE.DoubleSide,
        transparent: true
    }

    let atmosphereMaterialOptions = Object.assign(atmosphereMaterialDefaults, options.atmosphere.material);

    for (let property in options.atmosphere.textures) {
        textureLoader.load(options.atmosphere.textures[property], (texture) => {
            material[property] = texture;
            material.needsUpdate = true;
        });
    }

    for (let property in atmosphereMaterialOptions) {
        material[property] = atmosphereMaterialOptions[property];
    }


    return material;

}

function createOrbit(radius) {

    const geometry = new THREE.CircleGeometry(radius, 128);
    const material = new THREE.LineBasicMaterial({ color: 0x5e5e5e });

    geometry.vertices.shift();

    const circle = new THREE.LineLoop(geometry, material);
    circle.rotateX(90);
    scene.add(circle);

    return circle;

}

function addPlanetInfo(folder, info) {

    info.forEach((information) => {
        let listElem = document.createElement("li");
        listElem.innerHTML = information;
        folder.domElement.getElementsByTagName("ul")[0].appendChild(listElem);
    })

}

function addInfoToAllPlanets(folders, infos) {

    for (var i = 0; i < folders.length; i++) {
        addPlanetInfo(folders[i], infos[i]);
    }

}

init();
animate();