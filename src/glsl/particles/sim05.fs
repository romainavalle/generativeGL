varying vec2 vUv;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_target;

void main() {
    vec3 pos = texture2D( t_pos, vUv ).xyz;
    vec3 old = texture2D( t_oPos, vUv ).xyz;
	diff = (t_target-t_pos)*.08;
    vec3 maxSpeed = vec3(5.);
    diff = clamp(diff, -maxSpeed, maxSpeed);
	pos += diff;
    gl_FragColor = vec4( pos.xyz, 1.0 );
}
