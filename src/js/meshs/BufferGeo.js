
import vsBuffer from '../shaders/buffer.vs'
import fsBuffer from '../shaders/buffer.fs'
export default class extends THREE.Group { 
	
	COLORS_ARRAY = [0xFDAE37, 0xFEBE33, 0xFED434, 0xF7F51D, 0xCAF42B, 0xB6EB22, 0xB1ED3A, 0xA3E739, 0x90CE31, 0x47AC54, 0x36A759, 0x329C77, 0x3476C7, 0x374296, 0x36388E, 0x453F90, 0x2E1673, 0x371978, 0x711878, 0x681C68, 0x710F64, 0x960B5F, 0xD10768, 0xCF0558, 0xE41364, 0xE91969, 0xD50440, 0xF31655, 0xEF1750, 0xF11649, 0xEF1114];
  //COLORS_ARRAY = [0xD92FD4,0xFAD3F8,0xE86DB6,0xA75E89,0xEC4392,0xBA396F,0xFCE9F0,0xF393B1,0xF6CA96,0xCEC4B2,0xF1EDD7,0xF1ECA4,0xE8DC23,0xA3E277,0x2871E2,0x13BBF8,0x17A3D2,0x5951D0,0x6D3EBD,0x8259FA,0xA427B6,0x29AEB2,0x3C94A6,0x859D65,0x7086C6,0x9CCDF1,0x9F93DA,0xBFFDFC,0xDCAFF0,0xBE9ED4,0xF8F9E7,0xFEFEFB]
	constructor(count) {
		super()
		this.count = count

		this.geometry = new THREE.InstancedBufferGeometry()
		this.geometry.copy( new THREE.BoxBufferGeometry( .2, .2, .2 ) )

		this.positions = new Float32Array( this.count * 3 )
		this.scales = new Float32Array( this.count )
		this.colors = new Float32Array( this.count * 3 )
		this.uids = new Float32Array( this.count )
		this.volumeRatio = new Float32Array( this.count * 3 )
		this.angles = new Float32Array( this.count  )
		this.speeds = new Float32Array( this.count )

		let idx3 = 0
		for( let i = 0; i < this.count; i ++ ) {
			let a = Math.random()*360
			this.positions[ idx3 + 0 ] = 8 * Math.cos(a) 
			this.positions[ idx3 + 1 ] = 8 * Math.sin(a) 
			this.positions[ idx3 + 2 ] = Math.random() * 100

			this.angles[ i ] = Math.random() * Math.PI * 2 
			this.speeds[ i ] = 1 + Math.random() * 20
			let scale = Math.random() * .3  + 1
			this.scales[ i + 0 ] = scale

			//let color = new THREE.Color( 0xffffff * Math.random() )
			let color = new THREE.Color(this.COLORS_ARRAY[Math.round(Math.random()*(this.COLORS_ARRAY.length-1))])
			this.colors[ idx3 + 0 ] = color.r
			this.colors[ idx3 + 1 ] = color.g
			this.colors[ idx3 + 2 ] = color.b

			this.volumeRatio[ idx3 + 0 ] = Math.random() 
			this.volumeRatio[ idx3 + 1 ] = Math.random() 
			this.volumeRatio[ idx3 + 2 ] = Math.random() 
			this.uids[ i ] = Math.random() * 10000 >> 0

			idx3 += 3
		}

		// this.geometry.addAttribute( "position", new THREE.InstancedBufferAttribute( this.positions, 3, 1 ) )
		this.geometry.addAttribute( "aPositions", new THREE.InstancedBufferAttribute( this.positions, 3, 1 ) )
		this.geometry.addAttribute( "aScales", new THREE.InstancedBufferAttribute( this.scales, 1, 1 ) )
		this.geometry.addAttribute( "aColors", new THREE.InstancedBufferAttribute( this.colors, 3, 1 ) )
		this.geometry.addAttribute( "aUids", new THREE.InstancedBufferAttribute( this.uids, 1, 1 ) )
		this.geometry.addAttribute( "aAngle", new THREE.InstancedBufferAttribute( this.angles, 1, 1 ) )
		this.geometry.addAttribute( "aSpeed", new THREE.InstancedBufferAttribute( this.speeds, 1, 1 ) )
		this.geometry.addAttribute( "aVolumeRatio", new THREE.InstancedBufferAttribute( this.volumeRatio, 3, 1 ) )


		const uniforms = {
			uVolume: { type: "f", value: 0 },
			uTime: { type: "f", value: 0 },
		}
		this.material = new THREE.RawShaderMaterial( {
			uniforms: uniforms,
			vertexShader: vsBuffer,
			fragmentShader: fsBuffer,
			transparent: true,
			type: "CubesShader",
			blending:THREE.AdditiveBlending
		} )

		this.mesh = new THREE.Mesh( this.geometry, this.material )
		this.mesh.position.z = -100
		
	}

	render( time,volume ) {
		//this.mesh.rotation.z += .01
		this.material.uniforms.uVolume.value = volume
		this.material.uniforms.uTime.value = time
	}

	addStage(scene) {
		scene.add(this.mesh);
	}

}

