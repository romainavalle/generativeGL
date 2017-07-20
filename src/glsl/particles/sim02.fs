varying vec2 vUv;

uniform sampler2D t_pos;
uniform float time;
uniform float a;
uniform float b;
uniform float c;
uniform float d;
uniform sampler2D t_oPos;


uniform float a3da; // generatee randomValue

void main() {
    vec3 pos = texture2D( t_pos, vUv ).xyz;
    vec3 old = texture2D( t_oPos, vUv ).xyz;

	pos.x+=sin(pos.y*b) + c*sin(pos.x*b);
    pos.y+=sin(pos.x*a) + d*sin(pos.y*a);
    pos.z+=sin(pos.y+pos.x);
    gl_FragColor = vec4( pos.xyz, 1.0 );
}
