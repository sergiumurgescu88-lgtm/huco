import { Canvas } from '@react-three/fiber';
import { Image, Environment, Float } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

function ProductImage({ url }) {
  const imageRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (imageRef.current) {
      // Efect de parallax bazat pe poziția mouse-ului
      const t = state.clock.getElapsedTime();
      imageRef.current.material.zoom = 1.2 + Math.sin(t / 2) / 10;
      imageRef.current.rotation.x = THREE.MathUtils.lerp(imageRef.current.rotation.x, hovered ? 0.2 : 0, 0.1);
      imageRef.current.rotation.y = THREE.MathUtils.lerp(imageRef.current.rotation.y, hovered ? 0.2 : 0, 0.1);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Image 
        ref={imageRef}
        url={url} 
        scale={[1.5, 1.5]} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[1, 1, 32, 32]} />
      </Image>
    </Float>
  );
}

export default function ProductHero3D({ imageUrl }) {
  return (
    <div className="w-full h-full bg-gray-900 relative overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <ProductImage url={imageUrl} />
        
        <Environment preset="city" />
      </Canvas>
      
      <div className="absolute bottom-10 left-10 z-10 text-white pointer-events-none">
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">HOCO PREMIUM</h2>
        <p className="text-lg opacity-80">Experiență Imersivă 3D</p>
      </div>
    </div>
  );
}
