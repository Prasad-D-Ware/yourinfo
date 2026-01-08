import React, { useRef, useMemo, useCallback } from 'react';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer, loadTextureAsync } from 'expo-three';
import {
  AmbientLight,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
} from 'three';
import { PanResponder, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface GlobeViewProps {
  latitude?: number;
  longitude?: number;
}

export default function GlobeView({ latitude, longitude }: GlobeViewProps) {
  const globe = useRef<Mesh | null>(null);
  const isDragging = useRef(false);
  const velocity = useRef({ x: 0, y: 0 });
  const lastDrag = useRef({ x: 0, y: 0 });
  const autoRotationSpeed = useRef(0.003);

  const handleContextCreate = useCallback(async (gl: ExpoWebGLRenderingContext) => {
    const scene = new Scene();
    
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const camera = new PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 4.5;

    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Ambient light for base illumination
    const ambientLight = new AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    // Cyan point light for glow effect
    const pointLight1 = new PointLight(0x22d3ee, 2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    // Purple accent light
    const pointLight2 = new PointLight(0xa855f7, 1, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Load earth texture
    const texture = await loadTextureAsync({
      asset: require('../assets/earth.jpg'),
    });

    const geometry = new SphereGeometry(2, 64, 64);
    const material = new MeshBasicMaterial({ 
      map: texture,
    });
    globe.current = new Mesh(geometry, material);
    scene.add(globe.current);

    // Add glowing atmosphere effect
    const atmosphereGeometry = new SphereGeometry(2.1, 64, 64);
    const atmosphereMaterial = new MeshBasicMaterial({ 
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.08,
    });
    const atmosphere = new Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Add location marker with glow
    if (latitude !== undefined && longitude !== undefined) {
      // Outer glow
      const glowGeometry = new SphereGeometry(0.15, 16, 16);
      const glowMaterial = new MeshBasicMaterial({ 
        color: 0xff3366, 
        transparent: true,
        opacity: 0.4,
      });
      const glow = new Mesh(glowGeometry, glowMaterial);

      // Inner marker
      const markerGeometry = new SphereGeometry(0.08, 16, 16);
      const markerMaterial = new MeshBasicMaterial({ color: 0xff3366 });
      const marker = new Mesh(markerGeometry, markerMaterial);

      // Convert lat/long to 3D position on sphere
      // Negate longitude to match texture orientation (texture appears to be flipped)
      const latRad = latitude * (Math.PI / 180);
      const lonRad = -longitude * (Math.PI / 180);  // Negate for correct mapping
      
      const radius = 2.05;
      // Geographic to 3D conversion with negated longitude
      const x = radius * Math.cos(latRad) * Math.cos(lonRad);
      const y = radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.sin(lonRad);
      
      marker.position.set(x, y, z);
      glow.position.set(x, y, z);
      
      globe.current.add(marker);
      globe.current.add(glow);

      // Rotate globe to show marker facing the camera (+Z direction)
      // Since lonRad is negated, we need to adjust rotation accordingly
      globe.current.rotation.y = Math.PI / 2 - lonRad;
      
      // Tilt slightly based on latitude to show the marker better
      const tiltAmount = Math.max(-0.4, Math.min(0.4, -(latitude / 90) * 0.35));
      globe.current.rotation.x = tiltAmount;
    }

    // Pulsing glow animation
    let glowPulse = 0;

    // Animation loop with smooth momentum
    const animate = () => {
      requestAnimationFrame(animate);
      
      glowPulse += 0.02;
      atmosphereMaterial.opacity = 0.06 + Math.sin(glowPulse) * 0.02;
      
      if (globe.current) {
        if (!isDragging.current) {
          // Apply velocity with smooth friction
          globe.current.rotation.y += velocity.current.y;
          globe.current.rotation.x += velocity.current.x;
          
          // Smooth exponential friction
          velocity.current.y *= 0.95;
          velocity.current.x *= 0.95;
          
          // Smoothly blend to auto-rotation when momentum is low
          const speed = Math.sqrt(velocity.current.y ** 2 + velocity.current.x ** 2);
          if (speed < 0.001) {
            // Smoothly interpolate velocity towards auto-rotation
            velocity.current.y += (autoRotationSpeed.current - velocity.current.y) * 0.02;
            velocity.current.x *= 0.9; // Gradually reduce x rotation
          }
        }
      }
      
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  }, [latitude, longitude]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (_evt, gesture) => {
          isDragging.current = true;
          // Store initial position
          lastDrag.current = { x: gesture.x0, y: gesture.y0 };
          // Don't reset velocity immediately for smoother feel
        },
        onPanResponderMove: (_evt, gesture) => {
          if (globe.current) {
            // Calculate delta from accumulated movement (dx, dy are total displacement)
            const sensitivity = 0.008;
            
            // Use dx/dy for direct 1:1 mapping of drag to rotation
            const deltaX = gesture.dx * sensitivity;
            const deltaY = gesture.dy * sensitivity;
            
            // Apply rotation directly based on cumulative drag
            // Store base rotation on drag start and add delta
            if (lastDrag.current.x === gesture.x0 && lastDrag.current.y === gesture.y0) {
              // First move - store initial rotation
              lastDrag.current = { 
                x: globe.current.rotation.y - deltaX, 
                y: globe.current.rotation.x - deltaY 
              };
            }
            
            globe.current.rotation.y = lastDrag.current.x + deltaX;
            globe.current.rotation.x = lastDrag.current.y + deltaY;
            
            // Clamp x rotation to prevent flipping
            globe.current.rotation.x = Math.max(-1.2, Math.min(1.2, globe.current.rotation.x));
            
            // Store velocity for momentum (use velocity, not displacement)
            velocity.current.y = gesture.vx * 0.015;
            velocity.current.x = gesture.vy * 0.015;
          }
        },
        onPanResponderRelease: () => {
          isDragging.current = false;
          // Reset last drag for next interaction
          lastDrag.current = { x: 0, y: 0 };
        },
        onPanResponderTerminate: () => {
          isDragging.current = false;
          lastDrag.current = { x: 0, y: 0 };
        },
      }),
    []
  );

  return (
    <View className="relative">
      {/* Outer glow effect */}
      <View 
        className="absolute inset-0 rounded-3xl"
        style={{
          shadowColor: '#22d3ee',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 30,
          elevation: 20,
        }}
      />
      
      <View className=" overflow-hidden border border-cyan-500/20">
        <LinearGradient
          colors={['#0f172a', '#000000', '#0f172a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-1"
        >
          <View className=" overflow-hidden bg-black">
            <GLView
              style={{ width: '100%', height: 280 }}
              onContextCreate={handleContextCreate}
              {...panResponder.panHandlers}
            />
            
            <View className="absolute top-3 left-3 flex-row items-center bg-black/60 px-3 py-1.5 rounded-full">
              <View className="w-2 h-2 rounded-full bg-cyan-400 mr-2" />
              <Text className="text-cyan-400 text-xs font-bold tracking-wider">YOUR LOCATION</Text>
            </View>
            
            <View className="absolute bottom-3 right-3 flex-row items-center bg-black/60 px-3 py-1.5 rounded-full">
              <Ionicons name="hand-left" size={12} color="#6b7280" />
              <Text className="text-gray-500 text-xs ml-1">Drag to rotate</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}
