varying vec2 vUv;
uniform sampler2D tInput;
uniform sampler2D iChannel1;
uniform float time;

void main() {
	vec2 uv = vUv;
	vec2 block = floor(vUv.xy / vec2(16));
	vec2 uv_noise = block / vec2(64);
	uv_noise += floor(vec2(time) * vec2(1234.0, 3543.0)) / vec2(64);

	float block_thresh = pow(fract(time * 1236.0453), 2.0) * .2;
	float line_thresh = pow(fract(time * 2236.0453), 3.0) * 1.3;

	vec2 uv_r = uv, uv_g = uv, uv_b = uv;

	// glitch some blocks and lines
	if (texture2D(iChannel1, uv_noise).r < block_thresh ||
		texture2D(iChannel1, vec2(uv_noise.y, 0.0)).g < line_thresh) {
		vec2 dist = (fract(uv_noise) - 0.5) * 0.3;
		uv_r += dist * 0.1;
		uv_g += dist * 0.2;
		uv_b += dist * 0.125;
	}

	vec3 color;
	color.r = texture2D(tInput, uv_r).r;
	color.g = texture2D(tInput, uv_g).g;
	color.b = texture2D(tInput, uv_b).b;

	// loose luma for some blocks
	if (texture2D(iChannel1, uv_noise).g < block_thresh)
		color.rgb = color.ggg;

	// discolor block lines
	if (texture2D(iChannel1, vec2(uv_noise.y, 0.0)).b * 3.5 < line_thresh)
		color.rgb = vec3(0.0, dot(color.rgb, vec3(1.0)), 0.0);

	// interleave lines in some blocks
	if (texture2D(iChannel1, uv_noise).g * 1.5 < block_thresh ||
		texture2D(iChannel1, vec2(uv_noise.y, 0.0)).g * 2.5 < line_thresh) {
		float line = fract(vUv.y / 3.0);
		vec3 mask = vec3(3.0, 0.0, 0.0);
		if (line > 0.333)
			mask = vec3(0.0, 3.0, 0.0);
		if (line > 0.666)
			mask = vec3(0.0, 0.0, 3.0);
		color.xyz *= mask;
	}

	gl_FragColor = vec4(color,1.);
}
