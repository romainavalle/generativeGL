// varying vec2 vUv;
// varying vec3 vPos;
varying vec3 vNormal;
uniform vec3 uCamera;

void main(void) {
	float d = 1.-dot(normalize(uCamera+0.0001),normalize(vNormal));
	vec3 color = vec3(d/6.)*vec3(.1,.1,1.);
	gl_FragColor = vec4(color, 1.0);
}
