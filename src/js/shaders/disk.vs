precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec2 uv;
varying vec3 vPos;
varying vec2 vUv;
void main() {
	vUv = uv;
	vPos = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
