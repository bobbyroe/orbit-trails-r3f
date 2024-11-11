import * as THREE from "three";
import React from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

function IcoSpherePoints({ index }) {

  const sprite = useLoader(THREE.TextureLoader, "./circle.png");

  const ref = React.useRef();
  const offset = index * 0.01;
  let elapsedTime = 0;
  useFrame((_, dTime) => {
    elapsedTime += dTime * 0.2;
    ref.current.rotation.x = elapsedTime + offset;
    ref.current.rotation.y = elapsedTime + offset;
  });

  const icoGeo = new THREE.IcosahedronGeometry(2, 4);
  const colors = [];
  let col;
  const icoVerts = icoGeo.attributes.position;
  const p = new THREE.Vector3();
  for (let i = 0; i < icoVerts.count; i += 1) {
    p.fromBufferAttribute(icoVerts, i);
    let hue = 0.3 + p.x * 0.15;
    let light = index * 0.015;
    col = new THREE.Color().setHSL(hue, 1.0, light);
    colors.push(col.r, col.g, col.b);
  }
  const colorsBuffer = new Float32Array(colors);
  const size = index * 0.0015;
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={icoVerts.count}
          array={icoVerts.array}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={icoVerts.count}
          array={colorsBuffer}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
      vertexColors 
      size={size} 
      map={sprite}
      alphaTest={0.5}
      transparent={true}
      />
    </points>
  );
}

function PointsGroup() {
  const children = [];
  for (let i = 0; i < 40; i += 1) {
    children.push(<IcoSpherePoints index={i} key={i}/>)
  }
  return (
    <group>
      {children}
    </group>
  );
}

function App() {
  return (
    <Canvas gl={{ toneMapping: THREE.NoToneMapping }}>
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
      <PointsGroup />
      <hemisphereLight args={[0xffffff, 0x000000, 1.0]} />
      {/* <primitive object={bgSprites} /> */}
      <OrbitControls />
    </Canvas>
  );
}

export default App;