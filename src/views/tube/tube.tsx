import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import './tube.module.less'

const Tube = () => {
  const container = useRef<HTMLCanvasElement>(null)

  const renderer = useRef<any>(null)
  const camera = useRef<any>(null)
  const scene = useRef<any>(null)

  useEffect(() => {
    (
      async () => {
        if (!container.current) { return }

        renderer.current = new THREE.WebGLRenderer({
          antialias: true,
          canvas: container.current
        });

        camera.current = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );

        scene.current = new THREE.Scene();
        const loader = new THREE.TextureLoader();
        const skybox: any = await new Promise(function (resolve, reject) {
          loader.load(
            '/place.jpg',
            function (texture) {
              resolve(texture)
            },
            undefined,
            function (err) {
              reject(err)
            }
          );
        })

        skybox.wrapS = skybox.wrapT = THREE.RepeatWrapping; // 每个都重复
        skybox.repeat.set(1, 1)
        skybox.needsUpdate = true

        function animate () {
          // 一定要在此函数中调用
          renderer.current.render(scene.current, camera.current);
          if (skybox) skybox.offset.x -= 0.001;
          requestAnimationFrame(animate)
        }
        animate()
        const points = [
          new THREE.Vector3(-10, 0, 0),
          new THREE.Vector3(-10, 0, 0),
          new THREE.Vector3(-10, 0, -10),
          new THREE.Vector3(0, 0, -10)
        ]
        const curve = new THREE.CatmullRomCurve3(points) // 曲线路径
        const tubeGeometry = new THREE.TubeGeometry(curve, 80, 0.1, 20)
        const _material = new THREE.MeshBasicMaterial({
          map: skybox,
          side: THREE.BackSide,
          transparent: true
        });
        const _mesh = new THREE.Mesh(tubeGeometry, _material);
        scene.current.add(_mesh)
      }

    )()
  }, [])
  return (
    <div styleName='tube' >
      <canvas ref={container} />

    </div>
  )
}

export default Tube
