uniform float time;
uniform vec2 iResolution;

void main() {
	vec2 uv = gl_FragCoord.xy/iResolution.xy;
	float aspect = iResolution.x/iResolution.y;
	vec3 color = vec3(uv.x,uv.y,sin(uv.x)*cos(uv.y));

	gl_FragColor = vec4(color, 1.0);
}
