// import logo from './logo.svg';
import { useState } from 'react'
import { useEffect } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
// import './App.css';
import * as component from "./component"

function App() {
  const [portfolios, setPortfolios ] = useState([]);
  useEffect(() => {
      const fetchData = async () => {
      const result = await component.readPortfolios();
      setPortfolios(result.data.data);
      console.log(result.data)
    };
    fetchData();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );

    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#bg"),
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    renderer.render(scene, camera);
    
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0xff6347});
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(5, 5, 5);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(pointLight, ambientLight);

    const lightHelper = new THREE.PointLightHelper(pointLight);
    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(lightHelper, gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);

    function addStar() {
      const geometry = new THREE.SphereGeometry(0.25);
      const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(geometry, material);
      const [x,y,z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(100));
      star.position.set(x, y, z);
      scene.add(star);
    }

    Array(250).fill().forEach(addStar);
    const spaceTexture = new THREE.TextureLoader().load("your image");
    scene.background = spaceTexture;

    const avatarTexture = new THREE.TextureLoader().load("your image");
    const avatar = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.MeshBasicMaterial({ map: avatarTexture })
    );
    scene.add(avatar);

    const planetTexture = new THREE.TextureLoader().load("your image");
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshStandardMaterial({ map: planetTexture })
    );
    scene.add(planet);
    planet.position.z = 30;
    planet.position.setX(-10);

    function moveCamera() {
      const t = document.body.getBoundingClientRect().top;
      planet.rotation.x += 0.05;
      planet.rotation.y += 0.075;
      planet.rotation.z += 0.05;
      avatar.rotation.y += 0.01;
      avatar.rotation.z += 0.01;
      camera.position.z = t * -0.01;
      camera.position.x = t * -0.0002;
      camera.rotation.y = t * -0.0002;
    };
    document.body.onscroll = moveCamera;

    function animate(){
      requestAnimationFrame(animate);
      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

  }, []);

  return (
    <div className='App'>
        {portfolios.length > 0 ? (
          portfolios.map((portfolio, i) => (
            <div className="title" key={i}>

              <div className="portfolio">
                <h1 className="title"> {portfolio.attributes.myname}</h1>
                <p className="text">
                    同志社大学 理工学部 情報システムデザイン学科 4年生 <br></br>
                    ネットワーク情報システム研究室(NISK) 所属
                  </p>
                </div>
                <div className="projects"></div>
                  <h1>Projects</h1>
                  <div className="projects-table">

                    <div className="projects-card">
                      <p className="title">Project1</p>
                      <p className="info">
                        {portfolio.attributes.projectdescription}
                        {portfolio.attributes.aboutdescriptiion}
                      </p>
                      <button className="btn">check it out here</button>
                    </div>

                    <div className="projects-card">
                      <p className="title">Project2</p>
                      <p className="info">
                        {portfolio.attributes.projectdescription2}
                      </p>
                      <button className="btn">check it out here</button>
                    </div>

                    <div className="projects-card">
                      <p className="title">Project3</p>
                      <p className="info">
                        {portfolio.attributes.projectdescription3}
                      </p>
                      <button className="btn">check it out here</button>
                    </div>

                  </div>
              </div>
          ))
        ): (
          <h2> hey</h2>
        )}
      <canvas id='bg'></canvas>
    </div>
  );
}

export default App;
