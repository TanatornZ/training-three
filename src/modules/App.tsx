import { useEffect, useRef } from "react";
import * as THREE from "three";

function App() {
  const canvas = useRef<HTMLCanvasElement>(null!);
  const active = useRef(false);

  useEffect(() => {
    if (!canvas.current) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas.current,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: "#ffffff", // White color
      metalness: 0.2, // Make it less metallic for better lighting
      roughness: 0.7, // Adjust roughness to control reflections });
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Light sources
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft ambient light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 30); // point light
    pointLight.position.set(5, 5, 5); // set light position
    scene.add(pointLight);

    camera.position.z = 5;

    const onMouseMove = (event: { clientX: number; clientY: number }) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(cube);
      if (intersects.length > 0) {
        active.current = true;
        cube.material.color.set("#ff0000");
      } else {
        active.current = false;
        cube.material.color.set("#ffffff");
      }
    };

    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      // Animate scaling: scale up and down between 1 and 2
      if (active.current) {
        if (cube.scale.x <= 2) {
          cube.scale.x += 0.01;
          cube.scale.y += 0.01;
          cube.scale.z += 0.01;
        }
      } else {
        if (cube.scale.x > 1) {
          cube.scale.x -= 0.01;
          cube.scale.y -= 0.01;
          cube.scale.z -= 0.01;
        }
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    // Add event listener
    window.addEventListener("mousemove", onMouseMove);

    // Clean up on component unmount
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
    };
  }, [canvas.current]);

  return (
    <canvas ref={canvas} style={{ width: "100vw", height: "100vh" }}></canvas>
  );
}

export default App;
