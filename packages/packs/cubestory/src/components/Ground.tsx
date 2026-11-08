import React from "react";

export const Ground: React.FC<{ tokens: { color: Record<string, string> } }> = ({ tokens }) => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color={tokens.color.bg} roughness={1} />
    </mesh>
    <gridHelper args={[40, 40, tokens.color.secondary, "#1a1f2b"]} position={[0, 0.001, 0]} />
  </>
);
