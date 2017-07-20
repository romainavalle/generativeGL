import {
	TweenMax
} from 'gsap'
import vsDisk from '../shaders/disk.vs'
import fsDisk from '../shaders/disk.fs'
import audio from "mnf/audio"
export default class {
	
	COLORS_ARRAY = [0xFDAE37, 0xFEBE33, 0xFED434, 0xF7F51D, 0xCAF42B, 0xB6EB22, 0xB1ED3A, 0xA3E739, 0x90CE31, 0x47AC54, 0x36A759, 0x329C77, 0x3476C7, 0x374296, 0x36388E, 0x453F90, 0x2E1673, 0x371978, 0x711878, 0x681C68, 0x710F64, 0x960B5F, 0xD10768, 0xCF0558, 0xE41364, 0xE91969, 0xD50440, 0xF31655, 0xEF1750, 0xF11649, 0xEF1114];
  //COLORS_ARRAY = [0xD92FD4,0xFAD3F8,0xE86DB6,0xA75E89,0xEC4392,0xBA396F,0xFCE9F0,0xF393B1,0xF6CA96,0xCEC4B2,0xF1EDD7,0xF1ECA4,0xE8DC23,0xA3E277,0x2871E2,0x13BBF8,0x17A3D2,0x5951D0,0x6D3EBD,0x8259FA,0xA427B6,0x29AEB2,0x3C94A6,0x859D65,0x7086C6,0x9CCDF1,0x9F93DA,0xBFFDFC,0xDCAFF0,0xBE9ED4,0xF8F9E7,0xFEFEFB]
	constructor() {
		this._init()
	}

	_init() {
    let speed = 1
    let innerRadius = 5 + Math.round(Math.random() * 5)
    let outerRadius = innerRadius + 5 + Math.round(Math.random() * 5)
    let tethaSegment = 1 + Math.round(Math.random() * 5)
		let stripeSpace = 1 + Math.round(Math.random() * 10)

		var geometry = new THREE.RingGeometry( innerRadius, outerRadius, tethaSegment );
    
    let material = new THREE.RawShaderMaterial( { 
			uniforms: {
				aColor: { type: "c", value: new THREE.Color(this.COLORS_ARRAY[Math.round(Math.random() * ( this.COLORS_ARRAY.length - 1 ))] ) },
				aSpace: { type: 'f' , value: stripeSpace},
				aType: { type: 'f' ,value: Math.ceil(Math.random() * 5.) }
			},
			transparent:true,
			vertexShader: vsDisk,
			fragmentShader: fsDisk
		} )
    this.mesh = new THREE.Mesh( geometry, material );
		this.mesh.scale.set(.1,.1,.1)
    this.mesh.position.z = -100
    this.mesh.rotation.z = Math.random() * Math.PI * 2
    
    
    TweenMax.to(this.mesh.rotation,speed,{z:'+=' + Math.PI * 2 * (Math.random() - .5) ,ease:Linear.easeOut})
    TweenMax.to(this.mesh.position,speed,{z:0,ease:Linear.easeOut,onComplete:() => this._kill()})
	}

  _kill(){
    this.scene.remove( this.mesh );
  }
	addStage(scene) {
    this.scene = scene
		scene.add(this.mesh);
		
	}

}
