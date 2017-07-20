precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

void main() {
	vec3 pos = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
