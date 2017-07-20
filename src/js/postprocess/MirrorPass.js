import fs from "shaders/mirror.fs"

export default class ColorPass extends WAGNER.Pass {

	constructor() {
		super()

		this.shader = WAGNER.processShader( WAGNER.basicVs, fs )
		
		this.mapUniforms( this.shader.uniforms )
	
		this.params.divide3 = 0;
		this.params.divide4 = 0;
		this.params.mirrorX = 0;
		this.params.mirrorY = 0;
	}

	createGui(gui){
		const f = gui.addFolder('mirror')
	
		f.add(this.params,'divide3',0,1).step(1)
		f.add(this.params,'divide4',0,1).step(1)
		f.add(this.params,'mirrorX',0,1).step(1)
		f.add(this.params,'mirrorY',0,1).step(1)
		f.open()
	}

	run( c ) {
		if(!this.shader){
			return
		}
		this.shader.uniforms.divide3.value = this.params.divide3
		this.shader.uniforms.divide4.value = this.params.divide4
		this.shader.uniforms.mirrorX.value = this.params.mirrorX
		this.shader.uniforms.mirrorY.value = this.params.mirrorY
		c.pass( this.shader )
	}

}
