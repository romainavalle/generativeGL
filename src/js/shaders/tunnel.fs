precision highp float;

uniform sampler2D aTexture;
uniform float aOpacity;
varying vec2 vUv;

void main() {
	vec4 color = texture2D(aTexture, vUv).rgba;
	//gl_FragColor = aOpacity * color;
	gl_FragColor = color;
	
}
