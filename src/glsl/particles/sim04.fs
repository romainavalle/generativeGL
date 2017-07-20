varying vec2 vUv;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;
uniform sampler2D t_target;

uniform float dt; //-3 to 3

void main() {
    vec3 pos = texture2D( t_pos, vUv ).xyz;
	vec3 target = texture2D( t_target, vUv ).xyz;

    pos += (target-pos)*0.04;

    gl_FragColor = vec4( pos.xyz, 1.0 );
}
