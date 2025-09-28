import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface SpaceBackdropProps {
  className?: string;
  starDensity?: number;
  lowPower?: boolean;
}

interface CombatShip {
  group: THREE.Group;
  nose: THREE.Object3D;
  thruster: THREE.Mesh;
  pathRadius: number;
  verticalRadius: number;
  height: number;
  speed: number;
  offset: number;
  rollIntensity: number;
  weaponCooldown: number;
  weaponTimer: number;
  color: THREE.Color;
}

interface LaserBolt {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

const createSpriteTexture = (
  size: number,
  colorStops: Array<{ offset: number; color: string }>
) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.Texture();
  }

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  colorStops.forEach(({ offset, color }) => gradient.addColorStop(offset, color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
};

const createShip = (
  color: THREE.Color,
  geometries: THREE.BufferGeometry[],
  materials: THREE.Material[]
): CombatShip => {
  const ship = new THREE.Group();

  const hullGeometry = new THREE.ConeGeometry(0.45, 3.4, 14, 1, true);
  hullGeometry.rotateX(Math.PI / 2);
  geometries.push(hullGeometry);

  const hullMaterial = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.32,
    metalness: 0.6,
    emissive: color.clone().multiplyScalar(0.2),
    emissiveIntensity: 0.8,
  });
  materials.push(hullMaterial);

  const hull = new THREE.Mesh(hullGeometry, hullMaterial);
  hull.castShadow = false;
  hull.receiveShadow = false;
  ship.add(hull);

  const wingGeometry = new THREE.BoxGeometry(2.8, 0.08, 0.9);
  wingGeometry.translate(0, 0.12, -0.6);
  wingGeometry.rotateX(Math.PI / 2.4);
  geometries.push(wingGeometry);

  const wingMaterial = new THREE.MeshStandardMaterial({
    color: color.clone().multiplyScalar(0.6),
    roughness: 0.4,
    metalness: 0.65,
    emissive: color.clone().multiplyScalar(0.12),
  });
  materials.push(wingMaterial);

  const wings = new THREE.Mesh(wingGeometry, wingMaterial);
  wings.castShadow = false;
  ship.add(wings);

  const stabilizerGeometry = new THREE.BoxGeometry(0.26, 1.4, 0.08);
  stabilizerGeometry.translate(0, 0.65, -1.2);
  geometries.push(stabilizerGeometry);

  const stabilizer = new THREE.Mesh(stabilizerGeometry, wingMaterial);
  stabilizer.castShadow = false;
  ship.add(stabilizer);

  const thrusterGeometry = new THREE.CylinderGeometry(0.24, 0.36, 0.64, 16, 1, true);
  thrusterGeometry.rotateZ(Math.PI / 2);
  thrusterGeometry.translate(0, 0, 1.5);
  geometries.push(thrusterGeometry);

  const thrusterMaterial = new THREE.MeshBasicMaterial({
    color: color.clone().offsetHSL(0, -0.1, 0.18),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  materials.push(thrusterMaterial);

  const thruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial);
  thruster.castShadow = false;
  ship.add(thruster);

  const engineGlowGeometry = new THREE.PlaneGeometry(0.9, 0.9);
  geometries.push(engineGlowGeometry);

  const engineGlowMaterial = new THREE.MeshBasicMaterial({
    color: color.clone().offsetHSL(0.08, 0.15, 0.3),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  materials.push(engineGlowMaterial);

  const engineGlow = new THREE.Mesh(engineGlowGeometry, engineGlowMaterial);
  engineGlow.rotation.x = Math.PI / 2;
  engineGlow.position.set(0, -0.04, 1.55);
  ship.add(engineGlow);

  const nose = new THREE.Object3D();
  nose.position.set(0, 0, -1.7);
  ship.add(nose);

  ship.scale.setScalar(0.92 + Math.random() * 0.12);

  return {
    group: ship,
    nose,
    thruster,
    pathRadius: 8 + Math.random() * 6,
    verticalRadius: 2.2 + Math.random() * 1.4,
    height: -1.5 + Math.random() * 3,
    speed: 0.18 + Math.random() * 0.12,
    offset: Math.random() * Math.PI * 2,
    rollIntensity: 0.25 + Math.random() * 0.3,
    weaponCooldown: 1.6 + Math.random() * 1.4,
    weaponTimer: Math.random() * 1.5,
    color,
  };
};

export const SpaceBackdrop: React.FC<SpaceBackdropProps> = ({
  className = '',
  starDensity = 1,
  lowPower = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (lowPower) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010007);
    scene.fog = new THREE.FogExp2('#050c1d', 0.022);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 1.8));
    renderer.setSize(container.clientWidth, container.clientHeight, false);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      160
    );
    camera.position.set(0, 3.6, 17);
    camera.lookAt(0, 0, 0);

    const clock = new THREE.Clock();
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const ambientLight = new THREE.AmbientLight(0x16213f, 0.65);
    const hemi = new THREE.HemisphereLight(0x4261ff, 0x050509, 0.75);
    const keyLight = new THREE.DirectionalLight(0x7fa3ff, 0.8);
    keyLight.position.set(-8, 12, 18);
    const rimLight = new THREE.DirectionalLight(0x3bf0ff, 0.5);
    rimLight.position.set(10, -6, -16);

    scene.add(ambientLight, hemi, keyLight, rimLight);

    const pointer = pointerRef.current;

    const starTexture = createSpriteTexture(256, [
      { offset: 0, color: 'rgba(255,255,255,1)' },
      { offset: 0.35, color: 'rgba(179,207,255,0.9)' },
      { offset: 1, color: 'rgba(5,12,29,0)' },
    ]);
    starTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.push(starTexture);

    const starLayers: THREE.Points[] = [];
    const baseStars = Math.round(2200 * starDensity);
    for (let layer = 0; layer < 3; layer += 1) {
      const starCount = Math.round(baseStars * (0.45 + layer * 0.35));
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i += 1) {
        const radius = 80 + Math.random() * 120;
        const angle = Math.random() * Math.PI * 2;
        const y = (Math.random() - 0.5) * 80;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(angle) * radius;

        const tint = 0.75 + Math.random() * 0.25;
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = tint;
        colors[i * 3 + 2] = 1;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometries.push(geometry);

      const material = new THREE.PointsMaterial({
        size: 0.8 + layer * 0.6,
        map: starTexture,
        depthWrite: false,
        transparent: true,
        alphaTest: 0.01,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        opacity: 0.65 + layer * 0.18,
      });
      materials.push(material);

      const stars = new THREE.Points(geometry, material);
      stars.rotation.z = Math.random() * Math.PI;
      scene.add(stars);
      starLayers.push(stars);
    }

    const ships: CombatShip[] = [];
    const shipColors = [0x7dd3fc, 0xc084fc, 0x60a5fa, 0xf97316, 0x38bdf8].map(
      (hex) => new THREE.Color(hex)
    );
    const shipCount = 6;

    for (let i = 0; i < shipCount; i += 1) {
      const color = shipColors[i % shipColors.length]
        .clone()
        .offsetHSL((Math.random() - 0.5) * 0.12, (Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.08);
      const ship = createShip(color, geometries, materials);
      ship.group.position.set(0, 0, -10);
      scene.add(ship.group);
      ships.push(ship);
    }

    const laserGeometry = new THREE.CapsuleGeometry(0.08, 1.8, 6, 10);
    geometries.push(laserGeometry);
    const lasers: LaserBolt[] = [];

    const addLaser = (
      origin: THREE.Vector3,
      direction: THREE.Vector3,
      color: THREE.Color
    ) => {
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      materials.push(material);
      const mesh = new THREE.Mesh(laserGeometry, material);
      mesh.position.copy(origin);
      mesh.lookAt(origin.clone().add(direction));
      scene.add(mesh);
      lasers.push({
        mesh,
        velocity: direction.clone().multiplyScalar(24),
        life: 0,
        maxLife: 2.1,
      });
    };

    const tempVector = new THREE.Vector3();
    const targetVector = new THREE.Vector3();
    const originVector = new THREE.Vector3();

    const handlePointerMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      pointer.x = (event.clientX / innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('resize', handleResize);

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      camera.position.x += (pointer.x * 2.4 - camera.position.x * 0.12) * 0.08;
      camera.position.y += (pointer.y * -1.6 + 3.6 - camera.position.y) * 0.08;
      camera.lookAt(0, -0.12, 0);

      starLayers.forEach((layer, index) => {
        layer.rotation.y += 0.0006 + index * 0.0004;
        layer.rotation.x += 0.0002 * (index + 1);
      });

      ships.forEach((ship, idx) => {
        const angle = elapsed * ship.speed + ship.offset;
        const x = Math.cos(angle) * ship.pathRadius;
        const z = Math.sin(angle) * ship.pathRadius;
        const y = Math.sin(angle * 1.6) * ship.verticalRadius + ship.height;
        ship.group.position.set(x, y, z);

        const forward = tempVector.set(
          -Math.sin(angle),
          Math.cos(angle * 1.6) * ship.verticalRadius * 0.05,
          Math.cos(angle)
        );
        forward.normalize();
        originVector.copy(ship.group.position);
        ship.group.lookAt(originVector.clone().add(forward));
        ship.group.rotateZ(
          Math.sin(elapsed * (0.8 + ship.rollIntensity) + ship.offset) * ship.rollIntensity
        );

        const thrusterMaterial = ship.thruster.material as THREE.MeshBasicMaterial;
        thrusterMaterial.opacity = 0.6 + Math.sin(elapsed * 12 + ship.offset) * 0.25;

        ship.weaponTimer -= delta;
        if (ship.weaponTimer <= 0 && ships.length > 1) {
          let targetIndex = (idx + 1 + Math.floor(Math.random() * (ships.length - 1))) % ships.length;
          if (targetIndex === idx) {
            targetIndex = (targetIndex + 1) % ships.length;
          }
          const targetShip = ships[targetIndex];
          ship.nose.getWorldPosition(originVector);
          targetVector
            .subVectors(targetShip.group.position, originVector)
            .normalize();
          const spread = 0.04 + Math.random() * 0.08;
          targetVector.x += (Math.random() - 0.5) * spread;
          targetVector.y += (Math.random() - 0.5) * spread;
          targetVector.z += (Math.random() - 0.5) * spread;
          targetVector.normalize();
          addLaser(originVector.clone(), targetVector, ship.color.clone().offsetHSL(0.05, 0.1, 0.1));
          ship.weaponTimer = ship.weaponCooldown * (0.7 + Math.random() * 0.6);
        }
      });

      for (let i = lasers.length - 1; i >= 0; i -= 1) {
        const laser = lasers[i];
        laser.life += delta;
        laser.mesh.position.addScaledVector(laser.velocity, delta);
        const material = laser.mesh.material as THREE.MeshBasicMaterial;
        material.opacity = Math.max(0, 0.95 - laser.life / laser.maxLife);
        if (laser.life >= laser.maxLife) {
          scene.remove(laser.mesh);
          material.dispose();
          lasers.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    handleResize();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      starLayers.forEach((layer) => {
        scene.remove(layer);
      });
      ships.forEach((ship) => {
        scene.remove(ship.group);
      });
      lasers.forEach((laser) => {
        scene.remove(laser.mesh);
        (laser.mesh.material as THREE.Material).dispose();
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => {
        if ('dispose' in material && typeof material.dispose === 'function') {
          material.dispose();
        }
      });
      textures.forEach((texture) => texture.dispose());
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [starDensity, lowPower]);

  return (
    <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {lowPower ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-bl from-slate-950 via-slate-900 to-indigo-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,0.35),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_25%,rgba(147,51,234,0.28),transparent_60%)]" />
          <div className="absolute inset-y-0 left-1/3 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent opacity-60" />
          <div className="absolute inset-y-0 left-2/3 w-px bg-gradient-to-b from-transparent via-sky-200/40 to-transparent opacity-40" />
        </>
      ) : (
        <div ref={containerRef} className="absolute inset-0" />
      )}
      <div className="absolute -top-[30vh] left-[-15vw] h-[70vh] w-[70vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.35)_0%,rgba(30,64,175,0.12)_45%,rgba(2,6,23,0)_70%)] blur-3xl mix-blend-screen" />
      <div className="absolute top-[18vh] right-[-20vw] h-[80vh] w-[65vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.35)_0%,rgba(124,58,237,0.15)_40%,rgba(2,6,23,0)_70%)] blur-3xl mix-blend-screen" />
      <div className="absolute bottom-[-25vh] left-[10vw] h-[55vh] w-[55vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.3)_0%,rgba(6,182,212,0.12)_45%,rgba(2,6,23,0)_70%)] blur-[160px] mix-blend-screen" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(2,6,23,0.65)_65%,rgba(2,6,23,0.92)_100%)]" />
    </div>
  );
};
