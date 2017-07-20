varying vec2 vUv;

uniform sampler2D t_pos;
uniform sampler2D t_oPos;

uniform float a; //-3 to 3

void main() {
    vec3 pos = texture2D( t_pos, vUv ).xyz;
    vec3 old = texture2D( t_oPos, vUv ).xyz;

    pos.x += sin(pos.y*a)+0.2*sin(pos.x*a);
    pos.y += sin(pos.x*a)+0.2*sin(pos.y*a);

    gl_FragColor = vec4( pos.xyz, 1.0 );
}
