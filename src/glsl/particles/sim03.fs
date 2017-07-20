varying vec2 vUv;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform float a_power[20];
uniform float a_radius[20];
uniform vec3 a_pos[20];

void main() {
    vec3 pos = texture2D( t_pos, vUv ).xyz;
    vec3 old = texture2D( t_oPos, vUv ).xyz;

	vec3 maxSpeed = vec3(1.);
	vec3 velocity = pos.xyz-old.xyz;

	vec3 diff = vec3(0.);
	for(int i = 0; i < 20; i++)
	{
		float d = distance(pos, a_pos[i]);
		float s = 1.-smoothstep(0.,a_radius[i], d);
		s *= a_power[i];
		diff += (a_pos[i]-pos) * s;
	}
	// diff /= 10.;
	diff = clamp(diff,-maxSpeed,maxSpeed);
	pos += diff;

    gl_FragColor = vec4( pos.xyz, 1.0 );
}
