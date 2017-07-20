uniform sampler2D tInput;
uniform vec2 resolution;
varying vec2 vUv;

uniform float divide3;
uniform float divide4;
uniform float mirrorX;
uniform float mirrorY;

void main() {
	vec2 uv = vUv;
	if(divide4>0.){ uv *= 2.; uv = mod(uv,vec2(1.)); }
	// if(divide3>0.){ uv *= 2.; uv = mod(uv,vec2(1.)); }
	if(mirrorX>0.){ uv.x = abs(uv.x-.5)+.5; }
	if(mirrorY>0.){ uv.y = abs(uv.y-.5)+.5; }
	gl_FragColor = texture2D(tInput, uv);
}