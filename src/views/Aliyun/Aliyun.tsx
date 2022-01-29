
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import shaders from './glsl';
import './Aliyun.module.less'

const Aliyun = (): JSX.Element => {
  const container = useRef<HTMLCanvasElement>(null)

  const glRender = useRef<THREE.WebGLRenderer | null>(null)
  const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1200
  ))
  const scene = useRef<THREE.Scene>(new THREE.Scene())

  const mesh = useRef<any>(null)

  useEffect(() => {
    const fn = async () => {
      if (container.current) {
        glRender.current = new THREE.WebGL1Renderer({
          antialias: true,
          canvas: container.current
        });

        camera.current.position.z = 600;

        // camera.current.position.y = 400;
        camera.current.lookAt(0, 0, 0)

        glRender.current.setPixelRatio(window.devicePixelRatio);
        glRender.current.setSize(window.innerWidth, window.innerHeight);

        const light = new THREE.AmbientLight('#fff');
        scene.current.add(light);
        // scene.current.background = new THREE.Color()
        const spaceTextture:any = await new Promise(function (resolve, reject) {
          new THREE.TextureLoader().load(
            '/1.jpg',
            function (texture: any) {
              console.log(texture, 'texture')
              resolve(texture)
            },
            undefined,
            function (err: any) {
              reject(err)
            }
          );
        })

        const uniforms = {
          image: { type: 't', value: spaceTextture },
        };

        const material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader: shaders.vertex.default,
          fragmentShader: shaders.fragment.default
          // map: spaceTextture
        });

        material.needsUpdate = true;
        const plane = new THREE.PlaneGeometry(1600, 600);
        mesh.current = new THREE.Mesh(plane, material);

        scene.current.add(mesh.current);

        glRender.current.render(scene.current, camera.current);
      }
    }
    fn()
  }, [])

  return (
    <div styleName='Aliyun'>

      <canvas ref={container} />
    </div>
  )
}

export default Aliyun
