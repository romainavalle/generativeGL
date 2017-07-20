uniform float time;
uniform float displacement;
varying vec3 vNormal;

#ifndef PI
#define PI 3.141592653589793
#endif

float backOut(float t) {
	float f= 1.0 - t;
	return 1.0 - (pow(f, 3.0) - f * sin(f * PI));
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

void main() {
	vNormal = normal;
	vec3 pos = position;
	for(int i = 0; i < 20; i++)
	{
		vec4 ball = balls[i];
		float f = exponentialOut(1.-smoothstep(.5, 1., distance(ball.xyz, normalize(position))));
		pos += normal * displacement * ball.w * pow(f,4.2);
	}
	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
}
