"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const PRIMARY = 0x3dd0ff;

export default function MascotCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
    camera.position.set(0, 0.15, 5.6);

    scene.add(new THREE.HemisphereLight(0x9fe0ff, 0x05070d, 1.4));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(3, 4, 4);
    scene.add(key);
    const rim = new THREE.PointLight(PRIMARY, 24, 12);
    rim.position.set(-3, -1.5, 2.5);
    scene.add(rim);

    const smith = new THREE.Group();
    scene.add(smith);

    const bodyGeo = new THREE.DodecahedronGeometry(1, 0);
    const body = new THREE.Mesh(
      bodyGeo,
      new THREE.MeshPhysicalMaterial({
        color: 0x0c1730,
        roughness: 0.3,
        metalness: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
        flatShading: true,
      }),
    );
    smith.add(body);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(bodyGeo),
      new THREE.LineBasicMaterial({ color: PRIMARY, transparent: true, opacity: 0.85 }),
    );
    smith.add(edges);

    const eyeGeo = new THREE.CapsuleGeometry(0.085, 0.13, 4, 12);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xd9f7ff });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.28, 0.1, 0.9);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.28;
    const eyes = new THREE.Group();
    eyes.add(eyeL, eyeR);
    smith.add(eyes);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.03, 12, 96),
      new THREE.MeshStandardMaterial({ color: PRIMARY, emissive: PRIMARY, emissiveIntensity: 1.8, roughness: 0.3 }),
    );
    ring.rotation.x = 1.25;
    scene.add(ring);

    const sparkGeo = new THREE.IcosahedronGeometry(0.07, 0);
    const sparkMat = new THREE.MeshBasicMaterial({ color: 0xbff3ff });
    const sparks = [0, 1, 2].map((i) => {
      const s = new THREE.Mesh(sparkGeo, sparkMat);
      s.userData.phase = (i / 3) * Math.PI * 2;
      ring.add(s);
      return s;
    });

    const target = new THREE.Vector2();
    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      target.set(
        THREE.MathUtils.clamp((e.clientX - cx) / innerWidth, -0.5, 0.5),
        THREE.MathUtils.clamp((e.clientY - cy) / innerHeight, -0.5, 0.5),
      );
    };

    const resize = () => {
      const w = el.clientWidth || 200;
      renderer.setSize(w, w, false);
      renderer.domElement.style.width = renderer.domElement.style.height = "100%";
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0;
    let visible = true;
    let nextBlink = 2.5;
    const t0 = performance.now();

    const frame = () => {
      raf = 0;
      const t = (performance.now() - t0) / 1000;
      smith.position.y = Math.sin(t * 1.1) * 0.08;
      smith.rotation.y = THREE.MathUtils.lerp(smith.rotation.y, target.x * 1.1 + Math.sin(t * 0.6) * 0.08, 0.06);
      smith.rotation.x = THREE.MathUtils.lerp(smith.rotation.x, target.y * 0.8, 0.06);
      ring.rotation.z = t * 0.35;
      sparks.forEach((s) => {
        const a = t * 0.9 + (s.userData.phase as number);
        s.position.set(Math.cos(a) * 1.6, Math.sin(a) * 1.6, 0);
      });
      if (t > nextBlink) {
        eyes.scale.y = 0.12;
        nextBlink = t + 2.5 + Math.random() * 3;
        setTimeout(() => (eyes.scale.y = 1), 110);
      }
      renderer.render(scene, camera);
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && !reduced) raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      ring.rotation.z = 0.6;
      sparks.forEach((s, i) => s.position.set(Math.cos(i * 2.1) * 1.6, Math.sin(i * 2.1) * 1.6, 0));
      renderer.render(scene, camera);
    } else {
      addEventListener("pointermove", onPointer, { passive: true });
      start();
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(el);
    const onVis = () => !document.hidden && start();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      ro.disconnect();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh || o instanceof THREE.LineSegments) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="aspect-square w-full" />;
}
