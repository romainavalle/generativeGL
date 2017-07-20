import {
	TweenMax
} from 'gsap'
import {
	MeshLine,
	MeshLineMaterial
} from '../libs/THREE.MeshLine';
export default class {

	COLORS_ARRAY = [0xFDAE37, 0xFEBE33, 0xFED434, 0xF7F51D, 0xCAF42B, 0xB6EB22, 0xB1ED3A, 0xA3E739, 0x90CE31, 0x47AC54, 0x36A759, 0x329C77, 0x3476C7, 0x374296, 0x36388E, 0x453F90, 0x2E1673, 0x371978, 0x711878, 0x681C68, 0x710F64, 0x960B5F, 0xD10768, 0xCF0558, 0xE41364, 0xE91969, 0xD50440, 0xF31655, 0xEF1750, 0xF11649, 0xEF1114];
	//COLORS_ARRAY = [0xD92FD4,0xFAD3F8,0xE86DB6,0xA75E89,0xEC4392,0xBA396F,0xFCE9F0,0xF393B1,0xF6CA96,0xCEC4B2,0xF1EDD7,0xF1ECA4,0xE8DC23,0xA3E277,0x2871E2,0x13BBF8,0x17A3D2,0x5951D0,0x6D3EBD,0x8259FA,0xA427B6,0x29AEB2,0x3C94A6,0x859D65,0x7086C6,0x9CCDF1,0x9F93DA,0xBFFDFC,0xDCAFF0,0xBE9ED4,0xF8F9E7,0xFEFEFB]
	constructor(index) {
		this._init()
		this.index = index
	}

	_init() {
		var geometry = new THREE.Geometry();
		var points = []
		for (var i = 0; i < 5; i++) {
			var v = new THREE.Vector3(0, 0, i * -2);
			points.push(v)
		}
		let catmull = new THREE.CatmullRomCurve3(points)
		geometry.vertices = catmull.getPoints(100)
		//
		var line = new MeshLine();
		line.setGeometry(geometry);
		this.material = new MeshLineMaterial({
			color: new THREE.Color(this.COLORS_ARRAY[Math.round(Math.random() * (this.COLORS_ARRAY.length - 1))]),
			lineWidth: .05,
			transparent: true,
			depthWrite:false,
			sizeAttenuation: true
		});
		this.mesh = new THREE.Mesh(line.geometry, this.material);
		this.mesh.position.x = Math.cos((Math.random() - .5) * Math.PI) / 5.
		this.mesh.position.y = Math.sin((Math.random() - .5) * Math.PI) / 5.
		this.mesh.position.z =  -.6
		this.radius = Math.random() / 100

	}




	addStage(scene) {
		this.scene = scene;
		scene.add(this.mesh);

	}
	onBeat(){
		if(Math.round(Math.random()*10)===5){
			this.material.uniforms.color.value = new THREE.Color(this.COLORS_ARRAY[Math.round(Math.random() * (this.COLORS_ARRAY.length - 1))])
		}
	}

	render(time) {
		this.material.uniforms.aTime.value = time
		if(this.index === 0){
			this.mesh.position.x += Math.cos(time/100)*Math.cos(time/20)*Math.sin(time/20) * this.radius
			this.mesh.position.y += Math.cos(time/100)*Math.cos(time/20)*Math.sin(time/20) * this.radius
		}


		if(this.index === 1){
			this.mesh.position.x += Math.sin(time/100)*Math.cos(time/20)*Math.sin(time/20) * this.radius
			this.mesh.position.y += Math.cos(time/100)*Math.sin(time/20)*Math.sin(time/20) * this.radius
		}

		if(this.index === 2){
			this.mesh.position.x += Math.cos(time/70)*Math.cos(time/50)*Math.sin(time/20) * this.radius
			this.mesh.position.y += Math.sin(time/120)*Math.sin(time/30)*Math.sin(time/20) * this.radius
		}

		if(this.index === 3){
			this.mesh.position.x += Math.cos(time/100)*Math.cos(time/120)*Math.sin(time/20) * this.radius
			this.mesh.position.y += Math.cos(time/120)*Math.cos(time/40)*Math.sin(time/20) * this.radius
		}

		if(this.index === 4){
			this.mesh.position.x += Math.cos(time/100)*Math.cos(time/20)*Math.sin(time/120) * this.radius
			this.mesh.position.y += Math.cos(time/100)*Math.cos(time/20)*Math.sin(time/120) * this.radius
		}
	}

}
