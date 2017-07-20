//https://www.shadertoy.com/view/lstGW2#
float rand1(in float a, in float b) {
	return fract((cos(dot(vec2(a,b) ,vec2(12.9898,78.233))) * 43758.5453));
}

float rand2(float frag_x, float frag_y) {
  return fract(sin(frag_y+frag_x)*iGlobalTime+sin(frag_y-frag_x)*iGlobalTime);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	float zoom = 0.;// abs(sin(iGlobalTime*3.))*.15;
	vec2 uv = fragCoord.xy / iResolution.xy;
	uv.x = abs(uv.x-.5)+.5;
	//uv.x *= 2.;
	uv += zoom/2.;
	uv = uv/(1.+zoom);
	vec2 p = uv;
	p.x = uv.y;
	p.y = 1.;
	vec4 t1 = texture2D(iChannel1, p);
	p.x /= 4.0;
	vec4 t2 = texture2D(iChannel1, p);
	t1.y -= (t1.y-0.5) * 0.5;
	t1.x += (t2.y-0.5) * 1.2;
	float shake = sin(rand2(t2.x, t1.x) * 0.5) * .001 * fract(t1.y * iResolution.y/(1.-zoom) / rand1(iGlobalTime, t2.x));
	shake += sin(shake - t1.r * t1.g) * t2.g * 0.14 * fract(uv.y * iResolution.y/(1.-zoom) / 2.0);
	shake *= .8;
	uv.x += shake / t1.g * 2.41;
	uv = mod(uv,1.);
	fragColor = texture2D(iChannel0, uv);
	float grey = (fragColor.r + fragColor.g + fragColor.b) / 2.1;
	fragColor.rgb += grey;
	fragColor.rgb *= .57;
	//fragColor /= mix(fragColor, texture2D(iChannel3, 0.9 * uv * -150.0), -shake * .09 * iGlobalTime / grey);
	fragColor *= mix(fragColor, texture2D(iChannel2, 0.9 * uv * -150.0), shake * .09 * iGlobalTime / grey * 0.08) + t1;
	//fragColor = mix(fragColor, texture2D(iChannel2, 0.9 * uv * -150.0), -shake * .09 * iGlobalTime / grey * 0.008);
	fragColor = mix(fragColor, texture2D(iChannel2, 0.9 * uv * -150.0), shake * 999.0 * iGlobalTime / t1.r);
}

//https://www.shadertoy.com/view/Md2GDw#
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	float zoom = 0.;//abs(sin(iGlobalTime*140.))*.5;
	vec2 uv = fragCoord.xy / iResolution.xy;
	uv += zoom/2.;
	uv = uv/(1.+zoom);
	vec2 block = floor(fragCoord.xy / vec2(16));
	vec2 uv_noise = block / vec2(64);
	uv_noise += floor(vec2(iGlobalTime) * vec2(1234.0, 3543.0)) / vec2(64);

	float block_thresh = pow(fract(iGlobalTime * 1236.0453), 2.0) * .4;
	float line_thresh = pow(fract(iGlobalTime * 2236.0453), 3.0) * 5.3;

	vec2 uv_r = uv, uv_g = uv, uv_b = uv;

	// glitch some blocks and lines
	if (texture2D(iChannel1, uv_noise).r < block_thresh ||
		texture2D(iChannel1, vec2(uv_noise.y, 0.0)).g < line_thresh) {

		vec2 dist = (fract(uv_noise) - 0.5) * 0.3;
		uv_r += dist * 0.1;
		uv_g += dist * 0.2;
		uv_b += dist * 0.125;
	}

	fragColor.r = texture2D(iChannel0, uv_r).r;
	fragColor.g = texture2D(iChannel0, uv_g).g;
	fragColor.b = texture2D(iChannel0, uv_b).b;

	// loose luma for some blocks
	if (texture2D(iChannel1, uv_noise).g < block_thresh)
		fragColor.rgb = fragColor.ggg;

	// discolor block lines
	if (texture2D(iChannel1, vec2(uv_noise.y, 0.0)).b * 3.5 < line_thresh)
		fragColor.rgb = vec3(0.0, dot(fragColor.rgb, vec3(1.0)), 0.0);

	// interleave lines in some blocks
	if (texture2D(iChannel1, uv_noise).g * 1.5 < block_thresh ||
		texture2D(iChannel1, vec2(uv_noise.y, 0.0)).g * 2.5 < line_thresh) {
		float line = fract(fragCoord.y / 3.0);
		vec3 mask = vec3(3.0, 0.0, 0.0);
		if (line > 0.333)
			mask = vec3(0.0, 3.0, 0.0);
		if (line > 0.666)
			mask = vec3(0.0, 0.0, 3.0);
		fragColor.xyz *= mask;
	}
}

//https://www.shadertoy.com/view/4t23Rc#
#define AMPLITUDE 0.1
#define SPEED .1

vec4 rgbShift( in vec2 p , in vec4 shift) {
	shift *= 2.*shift.w - 1.;
	vec2 rs = vec2(shift.x,-shift.y);
	vec2 gs = vec2(shift.y,-shift.z);
	vec2 bs = vec2(shift.z,-shift.x);
	float r = texture2D(iChannel0, p+rs).x;
	float g = texture2D(iChannel0, p+gs).y;
	float b = texture2D(iChannel0, p+bs).z;
	return vec4(r,g,b,1.0);
}

vec4 noise( in vec2 p ) { return texture2D(iChannel1, p, 0.0); }

vec4 vec4pow( in vec4 v, in float p ) { return vec4(pow(v.x,p),pow(v.y,p),pow(v.z,p),v.w); }

void mainImage( out vec4 fragColor, in vec2 fragCoord ){
	vec4 shift = vec4pow(noise(vec2(SPEED*iGlobalTime,2.0*SPEED*iGlobalTime/25.0 )),1.0)
				*vec4(AMPLITUDE,AMPLITUDE,AMPLITUDE,1.0);;
	fragColor = rgbShift(fragCoord.xy / iResolution.xy, shift);
}
