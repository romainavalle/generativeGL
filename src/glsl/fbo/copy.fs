varying vec2 vUv;

uniform sampler2D t_pos;

void main() {
    vec3 pos = texture2D( t_pos, vUv ).rgb;
    gl_FragColor = vec4( pos, 1.0 );
}
