float nse3d(in vec3 x)
{
	vec3 p = floor(x);
	vec3 f = fract(x);
	f = f * f * (3.0 - 2.0 * f);
	vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
	vec2 rg = texture2D(iChannel1, (uv + 0.5) / 256.0, -100.0).yx;
	return mix(rg.x, rg.y, f.z);
}

float fbm(vec3 p)
{
	p += (nse3d(p * 3.0) - 0.5) * 0.3;

	float mtn = iGlobalTime * 0.15;
	float v = 0.0, fq = 1.0, am = 0.5;

	for(int i = 0; i < 6; i++)
	{
		v += nse3d(p * fq + mtn * fq) * am;
		fq *= 2.0;
		am *= 0.5;
	}
	return v;
}
