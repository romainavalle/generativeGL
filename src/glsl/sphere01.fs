varying vec3 vNormal;
uniform float opacity;
void main(void) {
	vec3 color = vec3(0.);
	vec3 light = vec3(.5,.1,.1);
	color += max(0.,dot(vNormal,light))*vec3(0.,1.,0.);
	light = vec3(-.2,.4,.2);
	color += max(0.,dot(vNormal,light))*vec3(0.,1.,.5);
	light = vec3(0.,-.5,-.5);
	color += max(0.,dot(vNormal,light))*vec3(1.,0.,1.);
	color *= 1.7;
	if(!gl_FrontFacing)
		color*=.3;

	gl_FragColor = vec4(color, opacity);
}
