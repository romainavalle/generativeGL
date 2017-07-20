precision highp float;

uniform vec3 aColor;
uniform float aSpace;
uniform float aType;
varying vec3 vPos;
varying vec2 vUv;


void main() {
	float m = 1.;
	if(aType == 1.){
		m = mod(vPos.x  , aSpace );
	}else if(aType == 2.){
		m = mod(vPos.y , aSpace )	 ;
	}else if(aType == 3.){
		m = mod(vPos.x + vPos.y , aSpace )	 ;
	}else if(aType == 4.){
		m = cos(vPos.x)  * sin(vPos.y) * aSpace;
	}else if(aType == 5.){
		m = cos(vPos.x)  * sin(vPos.y) * aSpace * 2.;
	}else if(aType == 6.){
		m = distance(mod(vPos.xy,vec2(aSpace))  , vec2(0.5) ) ;
	}
	
	gl_FragColor = vec4(aColor, step(m , aSpace/2.) ) ;
 
	
}
