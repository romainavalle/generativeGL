precision highp float;

varying vec3 vColor;
varying float vPourc;

void main() {
	float alpha = smoothstep(0.,.3,vPourc);
	alpha *= 1. - smoothstep(.7,1.,vPourc);
	gl_FragColor = vec4( vColor, alpha );
}