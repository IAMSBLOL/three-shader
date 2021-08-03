import React, { useCallback, useEffect, useRef } from 'react'
import * as THREE from 'three';
// import aurora from '../../asset/images/aurora.jpg'
import DeviceOrientationManager from 'device-orientation-manager';
import './home.module.less'

const doManager: DeviceOrientationManager = new DeviceOrientationManager(
  {
    enableMouseOrTouch: true,

  }
);

const zee = new THREE.Vector3(0, 0, 1);
const screenTransform = new THREE.Quaternion();
const worldTransform = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
const euler = new THREE.Euler();
euler.order = doManager.current.order;

const start = () => doManager.start()
const stop = () => doManager.stop()

const Home = (): JSX.Element => {
  const container = useRef<HTMLCanvasElement>(null)
  const divC = useRef<any>(null)

  const renderer = useRef<any>(null)
  const camera = useRef<any>(null)
  const scene = useRef<any>(null)
  const mesh = useRef<any>(null)

  const run = useCallback(() => {
    renderer.current.render(scene.current, camera.current);
    requestAnimationFrame(run);
  }, [])

  const initMesh = useCallback(async (src: string) => {
    const loader = new THREE.TextureLoader();
    const skybox:any = await new Promise(function (resolve, reject) {
      loader.load(
        src,
        function (texture) {
          resolve(texture)
        },
        undefined,
        function (err) {
          reject(err)
        }
      );
    })
    console.log('initMesh', skybox)
    const geometry = new THREE.SphereGeometry(4, 64, 32);
    geometry.translate(0, 0, -150)
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.BackSide });
    const material = new THREE.MeshBasicMaterial({
      map: skybox,
      side: THREE.BackSide
    });
    mesh.current = new THREE.Mesh(geometry, material);
    scene.current.add(mesh.current);
    // renderer.current.render(scene.current, camera.current);
  }, [])

  const initDo = useCallback(() => {
    doManager.addEventListener('deviceorientation', (config: any) => {
      const { yaw, pitch, roll, order, orientation } = config
      console.log(config, 67)
      // setState({
      //   yaw: yaw / Math.PI * 180,
      //   pitch: pitch / Math.PI * 180,
      //   roll: roll / Math.PI * 180,
      //   orientation
      // });

      euler.set(pitch, yaw, roll, order);
      camera.current.quaternion.setFromEuler(euler);
      camera.current.quaternion.multiply(worldTransform);
      camera.current.quaternion.multiply(screenTransform.setFromAxisAngle(zee, -orientation));
    });

    // doManager.start();
  }, [])

  const handleResize = useCallback(() => {
    console.log('handleResize')
    const { innerWidth: width, innerHeight: height } = window;

    camera.current.aspect = width / height;
    camera.current.updateProjectionMatrix();
    renderer.current.setPixelRatio(window.devicePixelRatio);
    renderer.current.setSize(width, height);
    renderer.current.render(scene.current, camera.current);
  }, [])

  useEffect(() => {
    (
      async () => {
        if (container.current) {
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

          await initMesh('/1562945313343.jpg')

          // window.addEventListener('resize', handleResize);
          handleResize();

          initDo()
          run()

          window.addEventListener('mousedown', start)
          window.addEventListener('mouseup', stop)
        }
      }
    )()
  }, [run, initMesh, handleResize, initDo])

  useEffect(() => {
    return () => {
      console.log('移除')
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousedown', start)
      window.removeEventListener('mouseup', stop)
    }
  }, [handleResize])

  return (
    <div styleName='home' ref={divC}>
      <canvas ref={container} />

    </div>
  )
}

export default Home
