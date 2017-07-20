import Box from './Box'
export default class {

	constructor(id){
    this.id = id
		this.canvas = document.createElement('canvas')
    this.canvas.width = 1024/4
    this.canvas.height = 1024/4
		this.context = this.canvas.getContext('2d')
    this.box_array = []
    this._init()
		
	}
 
	_init(){
    let num = 10
    if(this.id === 1)num = 30
    if(this.id === 2)num = 50
		for (var index = 0; index < num; index++) {
      this.box_array.push(new Box(index,this.id))
		}
	}

  render(){
    this.context.clearRect(0,0,1024/4,1024/4)
    for (var index = 0; index < this.box_array.length; index++) {
      this.box_array[index].render()
      this.context.fillStyle = this.box_array[index].c
      this.context.fillRect(this.box_array[index].x,this.box_array[index].y,this.box_array[index].w,this.box_array[index].h)
    }
  }
}