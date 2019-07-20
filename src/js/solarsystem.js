import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var scene, camera, renderer;
var objects = [];

const earthDistance = 14.96;
const moonDistanceFromEarth = 0.03844;
const mercuryDistance = 5.791;
const sunSize = 25;
const earthSize = sunSize / 109;
const moonSize = earthSize / 3.7;
const mercurySize = earthSize / 2.6235;

function init() {
    const canvas = document.getElementById("can");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 80;
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

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



    const sun = addSolidGeometry(0, 0, sphereGeometry, 0xffff00, solarSystem);
    sun.scale.set(25, 25, 25);
    sun.material.emissive = new THREE.Color(0xffff00);

    const mercury = addSolidGeometry(sunSize + mercuryDistance, 0, sphereGeometry, 0xD3D3D3, solarSystem);
    mercury.scale.set(mercurySize, mercurySize, mercurySize);

    const earth = addSolidGeometry(0, 0, sphereGeometry, 0x2233ff, earthOrbit);
    earth.scale.set(earthSize, earthSize, earthSize);

    const moon = addSolidGeometry(earthSize + moonDistanceFromEarth, 0, sphereGeometry, 0x888888, earthOrbit);
    moon.scale.set(moonSize, moonSize, moonSize);

    const light = new THREE.PointLight(0xffffff, 1);
    scene.add(light);

}

function animate() {

    requestAnimationFrame(animate);

    objects.forEach((object, index) => {
        object.rotation.y += 0.003;
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

function createMaterial(matColor) {

    const material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });

    if (typeof matColor === "undefined") {
        const hue = Math.random();
        const saturation = 1;
        const luminace = 0.5;
        material.color.setHSL(hue, saturation, luminace);
    } else {
        material.color.setHex(matColor);
    }

    return material;

}

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