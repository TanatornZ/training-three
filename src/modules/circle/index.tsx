import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useEffect, useRef } from "react";

function CirclePage() {
  const canvas = useRef<HTMLCanvasElement>(null!);

  const params = {
    clipIntersection: true,
    planeConstant: 0,
    showHelpers: false,
    alphaToCoverage: true,
    rotate: false,
  };

  useEffect(() => {
    if (!canvas.current) return;

    let rotateAnimation;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas.current,
    });

    function render() {
      renderer.render(scene, camera);
    }

    // create helpers line
    const clipPlanes = [
      new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, -1, 0), 0),
      new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
    ];

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.localClippingEnabled = true;
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      200
    );

    camera.position.set(-1.5, 2.5, 3.0);

    // control orbit camera and zoom in zoom out
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener("change", () => renderer.render(scene, camera)); // use only if there is no animation loop
    controls.minDistance = 1;
    controls.maxDistance = 10;
    controls.enablePan = false;

    // lighting
    const light = new THREE.HemisphereLight(0xffffff, 0x080808, 4.5);
    light.position.set(-1.25, 1, 1.25);
    scene.add(light);

    // group circle
    const group = new THREE.Group();

    for (let i = 1; i <= 30; i += 2) {
      const geometry = new THREE.SphereGeometry(i / 30, 48, 24);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(
          Math.random(),
          0.5,
          0.5,
          THREE.SRGBColorSpace
        ),
        side: THREE.DoubleSide,
        clippingPlanes: clipPlanes,
        clipIntersection: params.clipIntersection,
        alphaToCoverage: params.alphaToCoverage,
      });

      group.add(new THREE.Mesh(geometry, material));
    }

    scene.add(group);

    // helpers
    const helpers = new THREE.Group();
    helpers.add(new THREE.PlaneHelper(clipPlanes[0], 2, 0xff0000));
    helpers.add(new THREE.PlaneHelper(clipPlanes[1], 2, 0x00ff00));
    helpers.add(new THREE.PlaneHelper(clipPlanes[2], 2, 0x0000ff));
    helpers.visible = false;
    scene.add(helpers);

    // gui
    // control 3D element
    const gui = new GUI();

    gui.add(params, "alphaToCoverage").onChange(function (value) {
      group.children.forEach((c: any) => {
        c.material.alphaToCoverage = Boolean(value);
        c.material.needsUpdate = true;
      });
      render();
    });

    gui.add(params, "clipIntersection").onChange(function (value) {
      group.children.forEach((child: any) => {
        child.material.clipIntersection = value;
        child.material.needsUpdate = true; // Force material update
      });
      render();
    });

    gui
      .add(params, "planeConstant", -1, 1)
      .step(0.01)
      .onChange(function (value) {
        for (let j = 0; j < clipPlanes.length; j++) {
          clipPlanes[j].constant = value;
        }

        render();
      });

    gui.add(params, "showHelpers").onChange(function (value) {
      helpers.visible = value;

      render();
    });

    gui.add(params, "rotate").onChange(function (value) {
      function animate() {
        console.log("value => ", value);
        controls.autoRotate = value;
        controls.update();
        render();
        rotateAnimation = requestAnimationFrame(animate);
      }

      if (value) {
        animate();
      } else {
        cancelAnimationFrame(rotateAnimation!);
      }
    });

    window.addEventListener("resize", onWindowResize);

    function onWindowResize() {
      // add new aspect and update element size
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }

    render();

    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
      gui.destroy();
    };
  }, [canvas.current]);

  return (
    <canvas ref={canvas} style={{ width: "100vw", height: "100vh" }}></canvas>
  );
}

export default CirclePage;
