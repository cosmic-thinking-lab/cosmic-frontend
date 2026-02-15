import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import clsx from "clsx";

type ThreeHeroProps = {
  className?: string;
};

export default function ThreeHero({ className }: ThreeHeroProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 2000);
    camera.position.set(0, 0.8, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: false });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const onResize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(320, Math.floor(rect.width));
      const h = Math.max(260, Math.floor(rect.height));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    onResize();
    window.addEventListener("resize", onResize, { passive: true });

    // Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(4, 6, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8ab4ff, 0.6);
    fillLight.position.set(-6, -2, -4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x91a7ff, 1.2, 30);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    // Planet
    const planetGeo = new THREE.SphereGeometry(2.2, 64, 64);
    const planetMat = new THREE.MeshPhysicalMaterial({
      color: 0x1b1f2a,
      roughness: 0.5,
      metalness: 0.1,
      sheen: 0.6,
      sheenColor: new THREE.Color(0xb8c1ff),
      clearcoat: 0.6,
      clearcoatRoughness: 0.4,
      emissive: new THREE.Color(0x11131a),
      emissiveIntensity: 0.2,
    });
    const planet = new THREE.Mesh(planetGeo, planetMat);
    planet.position.set(0.8, 0, 0);
    scene.add(planet);

    // Subtle bands
    const bands: THREE.Line[] = [];
    for (let i = 0; i < 5; i++) {
      const bandGeo = new THREE.RingGeometry(1.6, 1.62, 128);
      const bandMat = new THREE.LineBasicMaterial({
        color: 0xcad3ff,
        transparent: true,
        opacity: 0.12,
      });
      const band = new THREE.Line(bandGeo, bandMat);
      band.rotation.x = Math.PI / 2;
      band.position.copy(planet.position);
      band.scale.set(1 + i * 0.08, 1, 1);
      bands.push(band);
      scene.add(band);
    }

    // Ring (tilted)
    const ringGeo = new THREE.TorusGeometry(3.2, 0.06, 24, 180);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x7aa2ff,
      transparent: true,
      opacity: 0.45,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(planet.position);
    ring.rotation.x = 0.7;
    ring.rotation.z = -0.3;
    scene.add(ring);

    // Starfield particles
    const starCount = 1800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = THREE.MathUtils.randFloat(18, 55);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = THREE.MathUtils.randFloatSpread(26);
      const z = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 0] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xcfd8ff,
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Pointer interaction (attach to container to reduce global listeners)
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e: PointerEvent | MouseEvent | TouchEvent) => {
      let clientX: number;
      let clientY: number;
      if (e instanceof TouchEvent) {
        const t = e.touches[0];
        if (!t) return;
        clientX = t.clientX;
        clientY = t.clientY;
      } else {
        const m = e as MouseEvent;
        clientX = m.clientX;
        clientY = m.clientY;
      }
      const rect = container.getBoundingClientRect();
      pointer.tx = ((clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.ty = ((clientY - rect.top) / rect.height - 0.5) * -2;
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };
    container.addEventListener("pointermove", onPointerMove as EventListener, { passive: true });
    container.addEventListener("mouseleave", onLeave as EventListener, { passive: true });
    container.addEventListener("touchmove", onPointerMove as EventListener, { passive: true });

    // Animation
    let last = performance.now();
    const animate = (now: number) => {
      const dt = Math.min(33, now - last);
      last = now;

      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;

      camera.position.x = 1.5 + pointer.x * 0.7;
      camera.position.y = 0.8 + pointer.y * 0.4;
      camera.lookAt(planet.position);

      planet.rotation.y += 0.003 + Math.abs(pointer.x) * 0.001;
      planet.rotation.x += 0.001;
      ring.rotation.y += 0.0015;

      for (let i = 0; i < bands.length; i++) {
        bands[i].rotation.y += 0.0008 + i * 0.0002;
        (bands[i].material as THREE.Material).opacity =
          0.1 + Math.sin(now * 0.0008 + i) * 0.05;
      }

      (stars.material as THREE.PointsMaterial).opacity = 0.8 + Math.sin(now * 0.0006) * 0.08;
      stars.rotation.y += 0.0006;
      stars.rotation.x += 0.0002;

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize as EventListener);
      container.removeEventListener("pointermove", onPointerMove as EventListener);
      container.removeEventListener("mouseleave", onLeave as EventListener);
      container.removeEventListener("touchmove", onPointerMove as EventListener);

      // Dispose objects
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const mat = mesh.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });

      // Force GL context loss to avoid lingering GPU resources on Hot Reload
      try {
        renderer.forceContextLoss();
      } catch {
        // noop
      }
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative block w-full h-[420px] md:h-[620px] rounded-2xl border border-white/10 bg-[#0b0b12]/60 backdrop-blur-sm overflow-hidden",
        className
      )}
      aria-label="Interactive 3D visualization"
      role="img"
    />
  );
}
