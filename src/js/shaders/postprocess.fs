uniform sampler2D tInput;
uniform vec2 resolution;
varying vec2 vUv;

uniform float gamma;
uniform float contrast;
uniform float brightness;
uniform float vignetteFallOff;
uniform float vignetteAmount;
uniform float invertRatio;
uniform float bw;

vec3 toGamma( vec3 rgb ) {
	return pow( rgb, vec3( 1.0 / gamma ) );
}

void main() {
	vec3 rgb = texture2D(tInput, vUv).rgb;

	//Vignette
	float dist = distance(vUv, vec2(0.5, 0.5));
	rgb *= smoothstep(0.8, vignetteFallOff * 0.799, dist * (vignetteAmount + vignetteFallOff));

	//Color Correction
	rgb = (toGamma( rgb ) - .5) * contrast + .5 + vec3( brightness );

	//BW
	rgb = mix(rgb,vec3( dot( rgb, vec3( .299, 0.587, 0.114 ) ) ), bw);

	//Invert
	rgb = mix(rgb, (1. - rgb), invertRatio);

	gl_FragColor = vec4(rgb, 1.);
}
