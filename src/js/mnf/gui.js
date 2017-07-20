const gui = new dat.GUI()
export default gui

setTimeout(()=>{
	let doms = document.querySelectorAll('.slider')
	for(let dom of doms){
		dom.addEventListener('mousedown',(e)=>{
			e.stopPropagation()
		},false)
	}
},500)
