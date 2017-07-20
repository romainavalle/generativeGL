import vsBasic from "shaders/basic.vs"
import fsBasic from "shaders/basic.fs"
import audio from "mnf/audio"
import ColorPass from "postprocess/ColorPass"
import MirrorPass from "postprocess/MirrorPass"
import gui from 'mnf/gui'
import Tunnel from 'meshs/Tunnel'
import MeshLine from 'meshs/MeshLine'

const OrbitControls = require('three-orbit-controls')(THREE)
import Disk from 'meshs/Disk'
import BufferGeo from 'meshs/BufferGeo'

class Main {

	constructor() {

		// -------------------------------------------------------------------------------------------------- SCENE

		this.scene = new THREE.Scene()
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setClearColor(0x222222, 1);
		document.body.appendChild(this.renderer.domElement)

		// -------------------------------------------------------------------------------------------------- CAMERA

		this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000)
		//this.camera.rotation.x =Math.PI
		//this.camera.position.z = -5
		//
		//this.controls = new OrbitControls(this.camera)
		// -------------------------------------------------------------------------------------------------- POSTPROCESS

		this.composer = new WAGNER.Composer(this.renderer, {
			useRGBA: false
		})
		this.composer.setSize(window.innerWidth, window.innerHeight)
		this.passes = []
		this.tunnel_array = []
		this.meshLine_array = []
		for (var index = 0; index < 3; index++) {
			let tunnel = new Tunnel(index)
			tunnel.addStage(this.scene)
			this.tunnel_array.push(tunnel)
		}
		for (var index = 0; index < 5; index++) {
			let meshLine = new MeshLine(index)
			meshLine.addStage(this.scene)
			this.meshLine_array.push(meshLine)
		}

	

		this.bufferGeo = new BufferGeo(500)
		this.bufferGeo.addStage(this.scene)

		const o = gui.addFolder('object')
		this.updateTunnel = true
		this.updateDisk = true
		this.updateCamera = true
		this.updateMeshLine = true
		this.updateBufferGeo = true
		o.add(this, 'updateTunnel')
		o.add(this, 'updateDisk')
		o.add(this, 'updateCamera')
		o.add(this, 'updateMeshLine')
		o.add(this, 'updateBufferGeo')
		const f = gui.addFolder('postprocess')
	
		
		//create a bloom pass
		this.bloomPass = new WAGNER.MultiPassBloomPass(128, 128)
		this.bloomPass.activate = true
		// this.bloomPass.params.applyZoomBlur 
		this.bloomPass.params.zoomBlurStrength = 0
		this.bloomPass.params.blurAmount = 0.4
		this.bloomPass.params.applyZoomBlur = 1
		let g = f.addFolder('bloom1')
		g.add(this.bloomPass, 'activate')
		g.add(this.bloomPass.params, 'zoomBlurStrength', 0, 1)
		g.add(this.bloomPass.params, 'blurAmount', 0, 1)
		g.add(this.bloomPass.params, 'applyZoomBlur')
		//custom colorPass
		this.colorPass = new ColorPass()
		this.colorPass.createGui(f)
		this.mirrorPass = new MirrorPass()
		this.mirrorPass.createGui(f)
		this.passes.push( this.bloomPass )
		this.passes.push( this.colorPass )
		this.passes.push( this.mirrorPass )

		
		// -------------------------------------------------------------------------------------------------- YOUR SCENE


		// if you don't want to hear the music, but keep analysing it, set 'shutup' to 'true'!
		audio.start({
			live: false,
			shutup: false,
			showPreview: false
		})
		audio.onBeat.add(this.onBeat)

		window.addEventListener('resize', this.onResize, false)
		this.beat = 0
		this.time = 0
		this.animate()
	}


	// -------------------------------------------------------------------------------------------------- ON BEAT

	onBeat = () => {

		this.beat++
		this.bloomPass.params.blurAmount = Math.random() * .5 + .5
		this.bloomPass.params.zoomBlurStrength = Math.random()
		//
		if(this.updateMeshLine){
			if (this.beat % 20 === 0) {
				for (var index = 0; index < this.meshLine_array.length; index++) {
					this.meshLine_array[index].onBeat(this.beat)
				}
			}
		}
		if(Math.round(audio.values[7]*100)>2){
			this.colorPass.shader.uniforms.bw.value = 1
			this.colorPass.shader.uniforms.contrast.value = 2
			setTimeout(()=>{
				this.colorPass.shader.uniforms.bw.value = 0
				this.colorPass.shader.uniforms.contrast.value = 1
			},300)
		}
		if(this.beat % 5 === 0){
			this.mirrorPass.shader.uniforms.mirrorX.value = Math.round(Math.random())
			this.mirrorPass.shader.uniforms.mirrorY.value = Math.round(Math.random())
			if(Math.round(Math.random()*10) === 5){
				this.mirrorPass.shader.uniforms.divide4.value = 1
				setTimeout(()=>{
					this.mirrorPass.shader.uniforms.divide4.value = 0
				},2000)
			}
		}
		
		if(this.updateCamera){
			if (this.beat % 20 === 0) {
				TweenMax.fromTo(this.camera.position,.5,{z:-50},{z:0})
			}
		}
		if(this.updateDisk){
			let disk = new Disk()
			disk.addStage(this.scene)
		}
		if(this.updateTunnel){
			for (var index = 0; index < this.tunnel_array.length; index++) {
				this.tunnel_array[index].onBeat(this.beat)
			}
		}
	}


	// -------------------------------------------------------------------------------------------------- EACH FRAME

	animate = () => {
		requestAnimationFrame(this.animate)

		this.render()
	}


	// -------------------------------------------------------------------------------------------------- RENDER

	render = () => {
		this.time++
		const passes = []
		for (let i = 0, n = this.passes.length; i < n; i++) {
			let pass = this.passes[i]
			if (pass.activate && (pass.shader || pass.isLoaded())) {
				passes.push(pass)
			}
		}
		this.bufferGeo.render(this.time,audio.volume)

		if(this.updateTunnel){
			for (var index = 0; index < this.tunnel_array.length; index++) {
				this.tunnel_array[index].render(this.time)
			}
		}
		if(this.updateMeshLine){
			
			for (var index = 0; index < this.meshLine_array.length; index++) {
				this.meshLine_array[index].render(this.time)
			}
		}
	
		if (passes.length > 0) {
			this.composer.reset()
			this.composer.render(this.scene, this.camera)
			for (let i = 0, n = passes.length - 1; i < n; i++) {
				let pass = passes[i]
				this.composer.pass(pass)
			}
			this.composer.toScreen(passes[passes.length - 1])
		} else {
			this.renderer.render(this.scene, this.camera)
		}
	}


	// -------------------------------------------------------------------------------------------------- RESIZE
	onResize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.composer.setSize(this.renderer.domElement.width, this.renderer.domElement.height)
	}

}

export default new Main()
