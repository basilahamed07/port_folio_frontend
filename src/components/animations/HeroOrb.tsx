import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface HeroOrbProps {
  className?: string;
}

interface OrbiterConfig {
  mesh: THREE.Mesh;
  radius: number;
  speed: number;
  inclination: number;
  phase: number;
}

interface CometConfig {
  group: THREE.Group;
  radius: number;
  speed: number;
  inclination: number;
  phase: number;
  tailMaterial: THREE.LineBasicMaterial;
  headMaterial: THREE.MeshBasicMaterial;
  tailGeometry: THREE.BufferGeometry;
  headGeometry: THREE.SphereGeometry;
}

export const HeroOrb: React.FC<HeroOrbProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const pointerTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#12224d', 0.08);
    scene.background = null;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.shadowMap.enabled = false;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      120
    );
    camera.position.set(0, 0, 7.2);
    camera.updateProjectionMatrix();

    const clock = new THREE.Clock();
    const rootGroup = new THREE.Group();
    rootGroup.scale.set(0.72, 0.72, 0.72);
    scene.add(rootGroup);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const textures: THREE.Texture[] = [];
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const targetAnisotropy = Math.min(4, maxAnisotropy);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    let galaxyMesh: THREE.Mesh | null = null;

    const createCanvasTexture = (draw: (ctx: CanvasRenderingContext2D, size: number) => void, size = 1024) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = targetAnisotropy;
      textures.push(texture);

      if (!ctx) {
        return texture;
      }

      draw(ctx, size);
      texture.needsUpdate = true;
      return texture;
    };

    const createStylizedEarthTexture = () =>
      createCanvasTexture((ctx, size) => {
        const center = size * 0.5;

        const oceanGradient = ctx.createRadialGradient(center, center, size * 0.06, center, center, size * 0.5);
        oceanGradient.addColorStop(0, 'rgba(125, 210, 255, 0.98)');
        oceanGradient.addColorStop(0.45, 'rgba(73, 196, 255, 0.9)');
        oceanGradient.addColorStop(1, 'rgba(18, 56, 118, 1)');
        ctx.fillStyle = oceanGradient;
        ctx.fillRect(0, 0, size, size);

        const landmasses = [
          { x: 0.28, y: 0.45, rx: 0.2, ry: 0.14, rotation: -0.4 },
          { x: 0.58, y: 0.48, rx: 0.24, ry: 0.16, rotation: 0.35 },
          { x: 0.42, y: 0.68, rx: 0.18, ry: 0.12, rotation: 0.15 },
          { x: 0.72, y: 0.33, rx: 0.16, ry: 0.11, rotation: -0.25 },
        ];

        ctx.fillStyle = '#22c55e';
        landmasses.forEach(({ x, y, rx, ry, rotation }) => {
          ctx.save();
          ctx.translate(x * size, y * size);
          ctx.rotate(rotation);
          ctx.scale(rx * size, ry * size);
          ctx.beginPath();
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        });

        ctx.strokeStyle = 'rgba(248, 250, 252, 0.35)';
        ctx.lineWidth = size * 0.002;
        landmasses.forEach(({ x, y, rx, ry, rotation }) => {
          ctx.save();
          ctx.translate(x * size, y * size);
          ctx.rotate(rotation);
          ctx.scale(rx * size, ry * size);
          ctx.beginPath();
          ctx.arc(0, 0, 1, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        });

        const islandCount = 120;
        for (let i = 0; i < islandCount; i += 1) {
          const angle = Math.random() * Math.PI * 2;
          const radius = size * 0.32 + Math.random() * size * 0.06;
          const px = center + Math.cos(angle) * radius;
          const py = center + Math.sin(angle) * radius * 0.65;
          const pr = Math.random() * size * 0.015 + size * 0.004;
          ctx.fillStyle = Math.random() > 0.4 ? '#22c55e' : '#4ade80';
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();
        }

        const jetStream = ctx.createLinearGradient(0, center, size, center);
        jetStream.addColorStop(0, 'rgba(59, 130, 246, 0.08)');
        jetStream.addColorStop(0.5, 'rgba(96, 165, 250, 0.22)');
        jetStream.addColorStop(1, 'rgba(14, 165, 233, 0.08)');
        ctx.fillStyle = jetStream;
        ctx.fillRect(0, center - size * 0.08, size, size * 0.16);
      });

    const createNightLightsTexture = () =>
      createCanvasTexture((ctx, size) => {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, size, size);

        for (let i = 0; i < 680; i += 1) {
          const intensity = Math.random() * 0.6 + 0.25;
          ctx.fillStyle = `rgba(255, ${170 + Math.floor(Math.random() * 60)}, ${90 + Math.floor(Math.random() * 60)}, ${intensity})`;
          const px = Math.random() * size;
          const py = Math.random() * size;
          const pr = Math.random() * size * 0.007 + size * 0.002;
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();
        }
      }, 1024);

    const createCloudTexture = () =>
      createCanvasTexture((ctx, size) => {
        ctx.clearRect(0, 0, size, size);

        for (let i = 0; i < 160; i += 1) {
          const px = Math.random() * size;
          const py = Math.random() * size;
          const prx = Math.random() * size * 0.16 + size * 0.04;
          const pry = prx * (0.35 + Math.random() * 0.5);
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(Math.random() * Math.PI * 2);
          const gradient = ctx.createRadialGradient(0, 0, pry * 0.2, 0, 0, prx);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
          gradient.addColorStop(1, 'rgba(148, 197, 255, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(0, 0, prx, pry, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }, 1024);

    const createGalaxyTexture = () =>
      createCanvasTexture((ctx, size) => {
        ctx.fillStyle = '#02030c';
        ctx.fillRect(0, 0, size, size);

        const gradient = ctx.createRadialGradient(size * 0.5, size * 0.5, size * 0.05, size * 0.5, size * 0.5, size * 0.6);
        gradient.addColorStop(0, 'rgba(148, 163, 255, 0.72)');
        gradient.addColorStop(0.35, 'rgba(59, 130, 246, 0.52)');
        gradient.addColorStop(0.72, 'rgba(56, 189, 248, 0.35)');
        gradient.addColorStop(1, 'rgba(8, 25, 68, 0.18)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        for (let i = 0; i < 6; i += 1) {
          const angle = (i / 6) * Math.PI * 2;
          const armGradient = ctx.createRadialGradient(
            size * 0.5 + Math.cos(angle) * size * 0.22,
            size * 0.5 + Math.sin(angle) * size * 0.22,
            size * 0.02,
            size * 0.5,
            size * 0.5,
            size * 0.5
          );
          armGradient.addColorStop(0, 'rgba(165, 243, 252, 0.18)');
          armGradient.addColorStop(1, 'rgba(2, 6, 23, 0)');
          ctx.fillStyle = armGradient;
          ctx.fillRect(0, 0, size, size);
        }

        for (let i = 0; i < 1200; i += 1) {
          const tint = 200 + Math.floor(Math.random() * 45);
          ctx.fillStyle = `rgba(${tint}, ${tint + 30}, 255, ${Math.random() * 0.85})`;
          const px = Math.random() * size;
          const py = Math.random() * size;
          const pr = Math.random() * 1.4 + 0.3;
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();
        }
      }, 1024);

    const earthDayFallback = createStylizedEarthTexture();
    const earthLightsFallback = createNightLightsTexture();
    const earthCloudsFallback = createCloudTexture();
    const galaxyTexture = createGalaxyTexture();
    const galaxyGeometry = new THREE.SphereGeometry(8.0, 30, 30);
    geometries.push(galaxyGeometry);
    const galaxyMaterial = new THREE.MeshBasicMaterial({
      map: galaxyTexture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    materials.push(galaxyMaterial);
    galaxyMesh = new THREE.Mesh(galaxyGeometry, galaxyMaterial);
    scene.add(galaxyMesh);

    const earthGeometry = new THREE.SphereGeometry(1.55, 64, 64);
    geometries.push(earthGeometry);

    const earthMaterial = new THREE.MeshPhysicalMaterial({
      map: earthDayFallback,
      color: new THREE.Color('#e5f4ff'),
      roughness: 0.32,
      metalness: 0.1,
      emissive: new THREE.Color('#5cc8ff'),
      emissiveIntensity: 0.22,
      clearcoat: 0.65,
      clearcoatRoughness: 0.28,
      ior: 1.25,
      specularIntensity: 0.55,
      specularColor: new THREE.Color('#96d8ff'),
      sheen: 0.25,
      sheenColor: new THREE.Color('#b3ecff'),
      sheenRoughness: 0.85,
      envMapIntensity: 1.1,
    });
    earthMaterial.normalScale = new THREE.Vector2(0.4, 0.4);
    materials.push(earthMaterial);

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.rotation.y = Math.PI / 6;

    const nightMaterial = new THREE.MeshBasicMaterial({
      map: earthLightsFallback,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });
    materials.push(nightMaterial);
    const nightMesh = new THREE.Mesh(earthGeometry.clone(), nightMaterial);
    nightMesh.scale.setScalar(1.002);
    earthMesh.add(nightMesh);

    rootGroup.add(earthMesh);
    const cloudGeometry = new THREE.SphereGeometry(1.58, 58, 58);
    geometries.push(cloudGeometry);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: earthCloudsFallback,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: new THREE.Color('#f0faff'),
      emissive: new THREE.Color('#cdebff'),
      emissiveIntensity: 0.28,
    });
    materials.push(cloudMaterial);
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.rotation.z = Math.PI / 7;
    cloudMesh.material.combine = THREE.MixOperation;
    cloudMesh.renderOrder = 2;
    earthMesh.add(cloudMesh);

    const atmosphereGeometry = new THREE.SphereGeometry(1.72, 58, 58);
    geometries.push(atmosphereGeometry);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#d7f2ff'),
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    materials.push(atmosphereMaterial);
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphereMesh.renderOrder = 3;
    earthMesh.add(atmosphereMesh);

    const loadLocalTexture = (path: string, onLoaded: (texture: THREE.Texture) => void) => {
      textureLoader.load(
        path,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = targetAnisotropy;
          texture.needsUpdate = true;
          textures.push(texture);
          onLoaded(texture);
        },
        undefined,
        () => {
          // keep fallback texture
        }
      );
    };

    loadLocalTexture('/textures/earth-day.jpg', (texture) => {
      earthMaterial.map = texture;
      earthMaterial.needsUpdate = true;
    });

    loadLocalTexture('/textures/earth-lights.png', (texture) => {
      nightMaterial.map = texture;
      nightMaterial.needsUpdate = true;
    });

    loadLocalTexture('/textures/earth-clouds.png', (texture) => {
      cloudMaterial.map = texture;
      cloudMaterial.needsUpdate = true;
    });

    loadLocalTexture('/textures/earth-normal.jpg', (texture) => {
      texture.colorSpace = THREE.NoColorSpace;
      earthMaterial.normalMap = texture;
      earthMaterial.normalScale = new THREE.Vector2(0.4, 0.4);
      earthMaterial.needsUpdate = true;
    });

    const ringGeometry = new THREE.TorusGeometry(2.35, 0.024, 14, 120);
    geometries.push(ringGeometry);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#38bdf8'),
      transparent: true,
      opacity: 0.22,
    });
    materials.push(ringMaterial);
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2.4;
    rootGroup.add(ringMesh);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 140;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 3.2 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
      starSizes[i] = Math.random() * 0.045 + 0.02;

      const tint = 0.65 + Math.random() * 0.35;
      starColors[i3] = 0.5 + Math.random() * 0.2;
      starColors[i3 + 1] = tint;
      starColors[i3 + 2] = 0.8 + Math.random() * 0.15;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    geometries.push(starGeometry);

    const starMaterial = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    materials.push(starMaterial);
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    const satelliteGroup = new THREE.Group();
    rootGroup.add(satelliteGroup);

    const orbiters: OrbiterConfig[] = [
      {
        mesh: new THREE.Mesh(
          new THREE.SphereGeometry(0.32, 32, 32),
          new THREE.MeshStandardMaterial({ color: '#facc15', emissive: '#fbbf24', emissiveIntensity: 0.6 })
        ),
        radius: 2.45,
        speed: 0.35,
        inclination: 0.35,
        phase: Math.random() * Math.PI * 2,
      },
      {
        mesh: new THREE.Mesh(
          new THREE.SphereGeometry(0.26, 24, 24),
          new THREE.MeshStandardMaterial({ color: '#f472b6', emissive: '#f87171', emissiveIntensity: 0.4 })
        ),
        radius: 3.1,
        speed: -0.28,
        inclination: -0.28,
        phase: Math.random() * Math.PI * 2,
      },
    ];

    orbiters.forEach((orbiter) => {
      geometries.push(orbiter.mesh.geometry as THREE.BufferGeometry);
      materials.push(orbiter.mesh.material as THREE.Material);
      satelliteGroup.add(orbiter.mesh);
    });

    const comets: CometConfig[] = Array.from({ length: 1 }).map((_, index) => {
      const cometGroup = new THREE.Group();
      const headGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const headMaterial = new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? '#e0f2fe' : '#fef3c7',
        transparent: true,
        opacity: 0.95,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);

      const tailGeometry = new THREE.BufferGeometry();
      const tailVertices = new Float32Array([0, 0, 0, 0, 0, -0.9]);
      tailGeometry.setAttribute('position', new THREE.BufferAttribute(tailVertices, 3));
      const tailMaterial = new THREE.LineBasicMaterial({
        color: index % 2 === 0 ? '#38bdf8' : '#f472b6',
        transparent: true,
        opacity: 0.45,
        linewidth: 1,
      });
      const tail = new THREE.Line(tailGeometry, tailMaterial);
      tail.position.z = -0.05;

      cometGroup.add(head);
      cometGroup.add(tail);
      scene.add(cometGroup);

      geometries.push(headGeometry);
      geometries.push(tailGeometry);
      materials.push(headMaterial);
      materials.push(tailMaterial);

      return {
        group: cometGroup,
        radius: 3.6 + Math.random() * 1.2,
        speed: 0.12 + Math.random() * 0.05,
        inclination: 0.25 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        tailGeometry,
        tailMaterial,
        headGeometry,
        headMaterial,
      };
    });

    const ambientLight = new THREE.AmbientLight('#f8fbff', 1.1);
    const hemiLight = new THREE.HemisphereLight('#ecf4ff', '#0b163a', 0.9);

    const keyLight = new THREE.PointLight('#d3ecff', 3.2, 0, 1.6);
    keyLight.position.set(4.2, 4.4, 6);

    const rimLight = new THREE.PointLight('#7ad8ff', 1.8, 0, 1.6);
    rimLight.position.set(-4.6, -2.4, -3.2);
    rimLight.castShadow = false;

    const fillLight = new THREE.DirectionalLight('#f5f9ff', 1.4);
    fillLight.position.set(-2.6, 3.2, 4.6);

    const frontLight = new THREE.DirectionalLight('#e0ebff', 0.9);
    frontLight.position.set(0.4, 1.6, 5.4);

    const surfaceLight = new THREE.SpotLight('#d6e6ff', 1.1, 18, Math.PI / 6, 0.45, 1.05);
    surfaceLight.position.set(2.4, 2.8, 4.7);
    surfaceLight.target = earthMesh;
    const auroraLight = new THREE.PointLight('#f5c8ff', 1.2, 12, 1.8);
    auroraLight.position.set(0.2, 3.4, -1);

    scene.add(ambientLight, hemiLight, keyLight, rimLight, fillLight, frontLight, surfaceLight, surfaceLight.target, auroraLight);

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      pointerTarget.current.x = (x - 0.5) * Math.PI * 0.24;
      pointerTarget.current.y = (y - 0.5) * Math.PI * 0.18;
    };

    const floatTween = gsap.to(rootGroup.scale, {
      x: 1.03,
      y: 1.03,
      z: 1.03,
      duration: 1.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      paused: true,
    });

    const ringTween = gsap.to(ringMesh.rotation, {
      z: `+=${Math.PI * 2}`,
      duration: 14,
      ease: 'none',
      repeat: -1,
    });

    const introTween = gsap.to(rootGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.25,
      ease: 'elastic.out(1, 0.6)',
      delay: 0.2,
      onComplete: () => floatTween.play(),
    });

    const cameraTween = gsap.fromTo(
      camera.position,
      { z: 8.4 },
      { z: 7.2, duration: 1.4, ease: 'power3.out' }
    );

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      rootGroup.rotation.y += (pointerTarget.current.x - rootGroup.rotation.y) * 0.045;
      rootGroup.rotation.x += (pointerTarget.current.y - rootGroup.rotation.x) * 0.045;

      earthMesh.rotation.y += 0.0008;
      cloudMesh.rotation.y += 0.001;
      atmosphereMesh.rotation.y -= 0.0006;

      orbiters.forEach((orbiter, index) => {
        const angle = elapsed * orbiter.speed + orbiter.phase;
        const x = Math.cos(angle) * orbiter.radius;
        const z = Math.sin(angle) * orbiter.radius;
        const y = Math.sin(angle * 1.7) * orbiter.inclination;
        orbiter.mesh.position.set(x, y, z);
        orbiter.mesh.rotation.y = -angle * 2;
      });

      comets.forEach((comet, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const angle = elapsed * comet.speed * direction + comet.phase;
        const radius = comet.radius;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 1.4) * comet.inclination;
        comet.group.position.set(x, y, z);
        comet.group.lookAt(0, 0, 0);
      });

      starField.rotation.y += 0.00035;
      starField.rotation.x += 0.00018;
      if (galaxyMesh) {
        galaxyMesh.rotation.y += 0.00012;
        galaxyMesh.rotation.x += 0.00005;
      }

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      floatTween.kill();
      ringTween.kill();
      introTween.kill();
      cameraTween.kill();

      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());

      renderer.dispose();
      if (galaxyMesh) {
        scene.remove(galaxyMesh);
        galaxyMesh = null;
      }
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={`relative h-full w-full ${className}`} data-cursor="pointer" />;
};
