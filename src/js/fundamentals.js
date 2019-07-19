import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var scene, camera, renderer;
var objects = [];

function init() {
    const canvas = document.getElementById("can");

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", onResize, false);

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    addSolidGeometry(0, 0, geometry);
    addSolidGeometry(2, 0, geometry);
    addSolidGeometry(-2, 0, geometry);
    createText();
    addLineGeometry(4, 0, new THREE.EdgesGeometry(geometry));

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 2, 4);
    scene.add(light);

}

function animate() {

    requestAnimationFrame(animate);

    objects.forEach((object, index) => {

        const speed = 1 + index * .1;
        const rot = 0.01 * speed;
        object.rotation.x += rot;
        object.rotation.y += rot;

    });
    renderer.render(scene, camera);

}

function onResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function addObject(x, y, obj) {

    obj.position.x = x;
    obj.position.y = y;

    scene.add(obj);
    objects.push(obj);

    return obj;

}

function createMaterial() {

    const material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide });

    const hue = Math.random();
    const saturation = 1;
    const luminace = 0.5;
    material.color.setHSL(hue, saturation, luminace);

    return material;

}

function addSolidGeometry(x, y, geometry) {

    const mesh = new THREE.Mesh(geometry, createMaterial());
    addObject(x, y, mesh);

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