uniform sampler2D texture;
uniform vec3 color;
uniform float opacity;

void main() {
	gl_FragColor = vec4( color, opacity ) * texture2D( texture, gl_PointCoord );
}
