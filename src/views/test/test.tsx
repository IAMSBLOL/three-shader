import React, { useRef, useEffect, useCallback } from 'react'
import shaders from './glsl';
import * as THREE from 'three';
import './test.module.less'

const Test = ():JSX.Element => {
  const container = useRef<HTMLCanvasElement>(null)

  const renderer = useRef<any>(null)
  const camera = useRef<any>(null)
  const scene = useRef<any>(null)
  const textureLoader = useRef<any>(null)
  const time = useRef(0)

  const mesh = useRef<any>(null)

  const handleMousemove = (event: MouseEvent) => {
    if (container.current) {
      const uniforms = (mesh.current.material as THREE.ShaderMaterial).uniforms;
      const { clientX, clientY } = event;

      uniforms.mouse_xy.value = new THREE.Vector2(
        clientX / container.current.clientWidth,
        1 - clientY / container.current.clientHeight
      )
    }
  }

  const handleClick = (event: MouseEvent) => {
    if (container.current) {
      const uniforms = (mesh.current.material as THREE.ShaderMaterial).uniforms;
      const { clientX, clientY } = event;

      for (let index = 0; index < 4; index += 1) {
        if (uniforms.progress.value[index] === -1) {
          uniforms.progress.value[index] = 0;
          uniforms.centres.value[index] = new THREE.Vector2(
            clientX / container.current.clientWidth,
            1 - clientY / container.current.clientHeight
          );
          break;
        }
      }
    }
  }

  const loop = useCallback(
    () => {
      const { uniforms } = (mesh.current.material as THREE.ShaderMaterial);

      const diff = performance.now() - time.current;
      time.current = performance.now();
      uniforms.u_time.value = Math.abs(time.current);

      for (let index = 0; index < 4; index += 1) {
        const progress = uniforms.progress.value[index];
        if (progress >= 1) {
          uniforms.progress.value[index] = -1;
        } else if (progress >= 0) {
          uniforms.progress.value[index] += diff / (2 * 1000);
        }
      }

      renderer.current.render(scene.current, camera.current);

      requestAnimationFrame(loop);
    },
    []
  )

  useEffect(() => {
    (
      async () => {
        if (container.current) {
          renderer.current = new THREE.WebGLRenderer({
            canvas: container.current as any,
            antialias: true
          });

          renderer.current.setSize(window.innerWidth, window.innerHeight);

          scene.current = new THREE.Scene();

          camera.current = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, 0.1, 100);

          camera.current.position.set(0, 0, 1);
          camera.current.lookAt(new THREE.Vector3(0, 0, 0));
          scene.current.add(camera.current);

          const light = new THREE.AmbientLight('red');
          scene.current.add(light);

          textureLoader.current = new THREE.TextureLoader();

          const plane = new THREE.PlaneGeometry(16, 9);

          // const text = await textureLoader.current.load('/mount.jpg')

          const text: any = await new Promise(function (resolve, reject) {
            textureLoader.current.load(
              '/mount.jpg',
              function (texture:any) {
                resolve(texture)
              },
              undefined,
              function (err: any) {
                reject(err)
              }
            );
          })

          const text1: any = await new Promise(function (resolve, reject) {
            textureLoader.current.load(
              '/mount-map.jpg',
              function (texture: any) {
                resolve(texture)
              },
              undefined,
              function (err: any) {
                reject(err)
              }
            );
          })
          console.log(text, 'text')
          // const { image: { width, height } } = text
          // const depthLoader = new THREE.DepthTexture(width, height);

          // const text1 = depthLoader
          const uniforms = {
            image: { type: 't', value: text },
            image_beifen: { type: 't', value: text1 },
            aspect: { type: 'f', value: 16 / 9 },
            radius: { type: 'f', value: 0.2 },
            amp: { type: 'f', value: 0.9 },
            band: { type: 'f', value: 0.3 },
            waves: { type: 'f', value: 5 },
            speed: { type: 'f', value: 7 },
            u_time: { type: 'f', value: time.current },
            mouse_xy: { type: 'v2v', value: new THREE.Vector2(0.0, 0.0) },
            progress: {
              type: 'fv',
              value: [
                -1, -1, -1, -1
              ]
            },
            centres: {
              type: 'v2v',
              value: [
                new THREE.Vector2(0.0, 0.0),
                new THREE.Vector2(0.0, 0.0),
                new THREE.Vector2(0.0, 0.0),
                new THREE.Vector2(0.0, 0.0)
              ]
            }
          };

          const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: shaders.vertex.default,
            fragmentShader: shaders.fragment.default
          });
          material.needsUpdate = true;

          mesh.current = new THREE.Mesh(plane, material);

          scene.current.add(mesh.current);

          // const loader = new THREE.FontLoader();

          // loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
          //   const geometry = new THREE.TextGeometry('Hello three.js!', {
          //     font: font,
          //     size: 80,
          //     height: 5,
          //     curveSegments: 12,
          //     bevelEnabled: true,
          //     bevelThickness: 10,
          //     bevelSize: 8,
          //     bevelOffset: 0,
          //     bevelSegments: 5
          //   });
          //   scene.current.add(geometry);
          // });

          container.current.addEventListener('click', handleClick);
          container.current.addEventListener('mousemove', handleMousemove);
          loop()
        }
      }
    )()
  }, [loop])
  return (
    <div styleName='test'>
      <canvas ref={container} />
    </div>
  )
}

export default Test
