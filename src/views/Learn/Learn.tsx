import React, { useEffect, useRef } from 'react'
import * as THREE from 'three';
import './Learn.module.less'

const Learn = () => {
  const container = useRef<HTMLCanvasElement>(null)

  const glRender = useRef<THREE.WebGLRenderer|null>(null)
  const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    1200
  ))
  const scene = useRef<THREE.Scene>(new THREE.Scene())

  useEffect(() => {
    if (container.current) {
      glRender.current = new THREE.WebGL1Renderer({
        antialias: true,
        canvas: container.current
      });
      // const helper = new THREE.CameraHelper(camera.current);
      // scene.current.add(helper);

      camera.current.position.z = 400;
      // camera.current.position.x = 40;
      camera.current.position.y = 400;
      camera.current.lookAt(0, 0, 0)

      glRender.current.setPixelRatio(window.devicePixelRatio);
      glRender.current.setSize(window.innerWidth, window.innerHeight);
      // glRender.current.setClearColor(0xd3df56, 1)
      const spaceTextture = new THREE.TextureLoader().load('/space.jpg',
        function () {
          glRender.current?.render(scene.current, camera.current);
        }
      );
      const texture = new THREE.TextureLoader().load('/earth.jpg',
        function () {
          console.log(111)
          glRender.current?.render(scene.current, camera.current);
        }
      );
      const suntexture = new THREE.TextureLoader().load('/sun.jpg',
        function () {
          console.log(111)
          glRender.current?.render(scene.current, camera.current);
        }
      );

      const planeGeometry = new THREE.SphereGeometry(50, 32, 32)

      const planeMeterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        emissiveMap: suntexture,

        shininess: 50,
        emissive: new THREE.Color('#fff'),
        emissiveIntensity: 1.6
      })

      const plane = new THREE.Mesh(planeGeometry, planeMeterial)

      scene.current.receiveShadow = true
      // scene.current.fog = new THREE.Fog('#fff', 1, 1200)

      const pointLight = new THREE.PointLight('#fff', 1, 0);
      // light.position.set(50, 50, 50);
      // pointLight.translateY(100)
      // pointLight.translateZ(100)

      scene.current.add(pointLight);

      const sphereSize = 10;
      const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
      scene.current.add(pointLightHelper);

      const ambientLine = new THREE.AmbientLight(0x404040)

      scene.current.add(plane)
      scene.current.add(ambientLine)

      const planeGeometry1 = new THREE.SphereGeometry(20, 32, 32)

      const planeMeterial1 = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,

        map: texture,

        color: '#fff',
        // emissive: new THREE.Color('#fff'),
        // emissive: '#57223F'
      })

      const plane1 = new THREE.Mesh(planeGeometry1, planeMeterial1)
      plane1.translateX(200)
      scene.current.add(plane1)

      const axesHelper = new THREE.AxesHelper(50000);

      scene.current.add(axesHelper);

      // const object = new THREE.Mesh(planeGeometry, new THREE.MeshMatcapMaterial({ color: 'red', side: THREE.DoubleSide }));
      // const box = new THREE.BoxHelper(object, 0xffff00);
      // scene.current.add(box);

      // const size = 100;
      // const divisions = 100;

      // const gridHelper = new THREE.GridHelper(size, divisions);
      // scene.current.add(gridHelper)

      console.log(texture)
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);

      scene.current.background = spaceTextture

      glRender.current.render(scene.current, camera.current)
      console.log('render', scene.current)

      const quaternion = new THREE.Quaternion();
      // const axias = new THREE.Vector3(0, 1, 0)
      const a = new THREE.Euler(0, -0.01, 0, 'XYZ');
      quaternion.setFromEuler(a);
      const bquaternion = new THREE.Quaternion();
      const b = new THREE.Euler(0.001, -0.001, 0.001, 'XYZ');
      bquaternion.setFromEuler(b);
      const fn = () => {
        plane1.position.applyQuaternion(quaternion)
        plane.applyQuaternion(bquaternion)
        // camera.current.position.applyQuaternion(quaternion)
        // camera.current.lookAt(new THREE.Vector3(0, 0, 0))
        glRender.current?.render(scene.current, camera.current)
        requestAnimationFrame(fn)
      }
      fn()
    }
  }, [])
  return (
    <div styleName='Learn'>
      <canvas ref={container} />
    </div>
  )
}

export default Learn
