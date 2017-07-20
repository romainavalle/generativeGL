import {
	TweenMax
} from 'gsap'
import Canvas from '../canvas/Canvas'
import vsTunnel from '../shaders/tunnel.vs'
import fsTunnel from '../shaders/tunnel.fs'

export default class {
	LENGTH = 100
	constructor(id) {
		this.id = id
		this._init()
	}

	_init() {
		var geometry = new THREE.CylinderBufferGeometry(22 - this.id * 10,2 , this.LENGTH, 32, 1	, true);
		this.canvas = new Canvas(this.id)
		this.texture = new THREE.Texture(this.canvas.canvas);
	/*	this.texture.wrapT = THREE.RepeatWrapping;
		this.texture.wrapS = THREE.RepeatWrapping;
		this.texture.minFilter = THREE.NearestFilter;
		var material = new THREE.MeshBasicMaterial({
			color: 0xFFFFFF,
			map: this.texture,
			side: THREE.DoubleSide,
			transparent: true,
			depthWrite: false
		});*/
		
		this.texture.wrapT = THREE.RepeatWrapping;
		this.texture.wrapS = THREE.RepeatWrapping;
		this.texture.minFilter = THREE.NearestFilter;
		this.material = new THREE.RawShaderMaterial( { 
			uniforms: {
				aTexture: { type: "t", value: this.texture},
				aTime: { type: "f", value: .1},
				aOpacity: { type: "f", value: 1 - this.id * .25},
			},
			transparent:true,
			side: THREE.BackSide,
			vertexShader: vsTunnel,
			fragmentShader: fsTunnel,
			blending:THREE.AdditiveBlending,
	
		} )


		this.mesh = new THREE.Mesh(geometry, this.material);
		this.mesh.rotation.x = Math.PI / 2;
		this.mesh.position.z = -50;
	}

	onBeat(beat) {
		if (beat % 10 === 0) {
			let random = Math.ceil(Math.random()*3) - 2
			if(random){
				TweenMax.to(this.mesh.rotation,1, {
					y: '+=' + random * Math.PI / 2,
					ease: Quad.easeOut
				})
			}
		}
	}



	render(time) {
		this.material.uniforms.aTime.value = time
		this.canvas.render()
		this.texture.needsUpdate = true;
	}


	addStage(scene) {
		scene.add(this.mesh);
	}
}
