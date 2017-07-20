import {
	TweenMax
} from 'gsap'
import Canvas from '../canvas/Canvas'
import audio from "../mnf/audio"

export default class {
  COLORS_ARRAY = ['#FDAE37', '#FEBE33', '#FED434', '#F7F51D', '#CAF42B','#B6EB22', '#B1ED3A', '#A3E739', '#90CE31', '#47AC54', '#36A759', '#329C77', '#3476C7', '#374296', '#36388E', '#453F90', '#2E1673', '#371978', '#711878', '#681C68', '#710F64', '#960B5F', '#D10768', '#CF0558', '#E41364', '#E91969', '#D50440', '#F31655', '#EF1750', '#F11649', '#EF1114'];
	constructor(index,tunnelId) {
		this.tunnelId = tunnelId
    this.index = index
		this._init()
	}
	_init() {
    this._reset()
		this.y = (Math.random() - .5) * 3000/4;
	}
	_reset() {
		this.draw = true
    this.c = this.COLORS_ARRAY[Math.floor(Math.random()*this.COLORS_ARRAY.length)]

		this.x = Math.random() * 1000/4;
		this.y = 1024/4;
		this.w = 1 + Math.random() * 50/4 + ((2-this.tunnelId) * 100/4);
		this.h = 1 + Math.random() * 400/4 + (this.tunnelId * 100/4);
		if(this.tunnelId == 2){
			if(Math.round(Math.random() * 100) === 13){
				this.w = 1024/4;
				this.x = 0
				this.h = 1000/4;
			}
		}	
		if(this.tunnelId == 1){
			if(Math.round(Math.random() * 50) === 13){
				this.w = 1024/4;
				this.x = 0
				this.h = 50/4;
			}
		}
		if(this.tunnelId == 0){
			if(Math.round(Math.random() * 30) === 13){
				this.w = 1024/4;
				this.x = 0
				this.h = 20/4;
			}
		}
  
		this.s = Math.max(audio.volume * 2,5 + Math.round(Math.random() * 5))/4
	}

	render() {
		if (this.y+this.h > -1024/4) {
			this.y -= this.s;
		} else {
			if (this.draw) {
				this.draw = false
				setTimeout(() => this._reset(),  Math.random() * 5000)
			}
		}
	}
}
