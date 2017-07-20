precision highp float;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uVolume;
uniform float uTime;

attribute vec3 position;
attribute float aScales;
attribute float aAngle;
attribute float aSpeed;
attribute vec3 aPositions;
attribute vec3 aColors;
attribute vec3 aVolumeRatio;

varying vec3 vColor;
varying float vPourc;

void main() {
	vColor = aColors;
	vec3 pos = position * ( aScales + uVolume * aVolumeRatio ) + aPositions; 
//	vec3 pos = position + aPositions; 
  pos.z = mod(aPositions.z + uTime/20. * aSpeed,100.) + position.z;
  vPourc =  pos.z/100.;
  //pos.x += cos( aAngle + uTime/100. ) * 10.;
  //pos.y += sin( aAngle + uTime/100. ) * 10.;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}