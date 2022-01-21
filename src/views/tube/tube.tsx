import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import './tube.module.less'

const Tube = () => {
  const container = useRef<HTMLCanvasElement>(null)

  const renderer = useRef<any>(null)
  const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1200
  ))
  const scene = useRef<any>(null)

  useEffect(() => {
    (
      async () => {
        if (!container.current) { return }

        renderer.current = new THREE.WebGLRenderer({
          antialias: true,
          canvas: container.current
        });
        renderer.current.setPixelRatio(window.devicePixelRatio);
        renderer.current.setSize(window.innerWidth, window.innerHeight);

        scene.current = new THREE.Scene();
        const helper = new THREE.CameraHelper(camera.current);
        scene.current.add(helper);
        // camera.current.position.setY(15)

        const spotLight = new THREE.SpotLight('#fff');
        spotLight.position.set(40, 60, 10);
        scene.current.add(spotLight);

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
          renderer.current.render(scene.current, camera.current);
          if (skybox) skybox.offset.x -= 0.001;

          requestAnimationFrame(animate)
        }
        animate()
        const points = [
        //   new THREE.Vector3(0, 0, -150),
        //   new THREE.Vector3(0, 10, -150),
        //   new THREE.Vector3(10, 10, -150),
        //   new THREE.Vector3(10, 0, -150)
        ]

        for (let i = 1; i <= 100; i++) {
          const PI = 2 * Math.PI
          const R = 20
          const x = Math.cos(PI * i / 100) * R
          const y = Math.sin(PI * i / 100) * R
          const pot = new THREE.Vector3(x, y, -150)
          points.push(pot)
        }
        console.log(points)
        const curve = new THREE.CatmullRomCurve3(points) // 曲线路径
        const tubeGeometry = new THREE.TubeGeometry(curve, 80, 1, 20, true)

        const _material = new THREE.MeshBasicMaterial({
          map: skybox,
          side: THREE.BackSide,

        });

        const _mesh = new THREE.Mesh(tubeGeometry, _material);

        scene.current.add(_mesh)
        const geometry = new THREE.SphereGeometry(5, 32, 32);
        const material = new THREE.MeshBasicMaterial({
          map: skybox,
          side: THREE.BackSide,

        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.z = -86

        scene.current.add(sphere);

        const axesHelper = new THREE.AxesHelper(5);
        scene.current.add(axesHelper);
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
