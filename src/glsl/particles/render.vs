uniform sampler2D t_pos;
uniform float size;
uniform float sizeVariation;

float hash( float n ){return fract(sin(n)*3538.5453);}

void main() {
    vec3 pos = texture2D( t_pos, position.xy ).xyz;
    // vec4 mvPosition = vec4( modelViewMatrix * vec4( pos, 1.0 ) ); // this will transform the vertex into eyespace
    gl_PointSize = 2.*(size+floor(sizeVariation*hash(position.x+position.y)));
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
