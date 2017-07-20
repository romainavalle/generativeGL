// Everyday006 - hangover01
// By David Ronai / @Makio64
precision highp float;

//------------------------------------------------------------------ VISUAL QUALITY
#define POSTPROCESS
#define RAYMARCHING_STEP 45
#define RAYMARCHING_JUMP 1.
//------------------------------------------------------------------ DEBUG
//#define RENDER_DEPTH
//#define RENDER_NORMAL

const float PI = 3.14159265359;
const float PI2 = 6.28318530718;

vec3 orbit(float phi, float theta, float radius)
{
	return vec3(
		radius * sin( phi ) * cos( theta ),
		radius * cos( phi ),
		radius * sin( phi ) * sin( theta )
	);
}

//------------------------------------------------------------------  SIGNED PRIMITIVES
//http://mercury.sexy/hg_sdf/

#define saturate(x) clamp(x, 0., 1.)

vec3 pMod3(inout vec3 p, vec3 size) {
	vec3 c = floor((p + size*0.5)/size);
	p = mod(p + size*0.5, size) - size*0.5;
	return c;
}

// Distance to line segment between <a> and <b>, used for fCapsule() version 2below
float fLineSegment(vec3 p, vec3 a, vec3 b) {
	vec3 ab = b - a;
	float t = saturate(dot(p - a, ab) / dot(ab, ab));
	return length((ab*t + a) - p);
}

// Capsule version 2: between two end points <a> and <b> with radius r
float fCapsule(vec3 p, vec3 a, vec3 b, float r) {
	return fLineSegment(p, a, b) - r;
}
float vmax(vec3 v) {return max(max(v.x, v.y), v.z);}
float fBox(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return length(max(d, vec3(0))) + vmax(min(d, vec3(0)));
}

vec3 color;

//------------------------------------------------------------------ MAP
float map( in vec3 pos ) {
	vec3 q = pos;
	vec3 o = orbit(sin(iGlobalTime)*PI2,cos(iGlobalTime)*PI2,8.);
	pMod3(q, vec3(50.,40.,50.));
	float d = fCapsule(q,o,-o,5.);
	float dist = distance(-o,q);
	float dist2 = distance(o,q);
	if(dist>dist2){color = vec3(1.,1.1,1.1);}
	if(dist<=dist2){color = vec3(1.,0.,1.);}
	return d;
}

//------------------------------------------------------------------ RAYMARCHING
float castRay( in vec3 ro, in vec3 rd, inout float depth )
{
	float t = 15.0;
	float res;
	for( int i=0; i<RAYMARCHING_STEP; i++ )
	{
		vec3 pos = ro+rd*t;
		res = map( pos );
		if( res < 0.01 || t > 150. ) break;
		t += res*RAYMARCHING_JUMP;
		depth += 1./float(RAYMARCHING_STEP);
	}
	return t;
}

vec3 calcNormal(vec3 p) {
	float eps = 0.001;
	const vec3 v1 = vec3( 1.0,-1.0,-1.0);
	const vec3 v2 = vec3(-1.0,-1.0, 1.0);
	const vec3 v3 = vec3(-1.0, 1.0,-1.0);
	const vec3 v4 = vec3( 1.0, 1.0, 1.0);
	return normalize( v1 * map( p + v1*eps ) +
					  v2 * map( p + v2*eps ) +
					  v3 * map( p + v3*eps ) +
					  v4 * map( p + v4*eps ) );
}

//------------------------------------------------------------------ POSTEFFECTS

#ifdef POSTPROCESS
vec3 postEffects( in vec3 col, in vec2 uv, in float time )
{
	// vigneting
	col *= 0.4+0.6*pow( 16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), 0.5 );
	return col;
}
#endif

vec3 addLight(in vec3 lpos, inout vec3 col, in vec3 pos, in vec3 nor, in vec3 rd, in float thi){
	vec3 ldir = normalize(lpos-pos);
	float latt = pow( length(lpos-pos)*.03, .5 );
	float trans =  pow( clamp( max(0.,dot(-rd, -ldir+nor)), 0., 1.), 1.) + 1.;
	//col = vec3(.2,.1,.1) * (max(dot(nor,ldir),0.) ) / latt;
	col += vec3(.3,.3,.1) * (trans/latt)*thi;
	return col;

}

vec3 render( in vec3 ro, in vec3 rd, in vec2 uv )
{
	float depth = 0.;
	float t = castRay(ro,rd,depth);

	#ifdef RENDER_DEPTH
	return vec3(depth/10.,depth/5.,depth);
	#endif

	vec3 pos = ro + t * rd;
	vec3 nor = calcNormal(pos);

	#ifdef RENDER_NORMAL
	return nor;
	#endif

	// lighitng
	vec3 lig = vec3(-0.6, 0.7, -0.5);
	vec3 ref = reflect( rd, nor );
	float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
	float specular = pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);

	vec3 bg = vec3(sin(uv.x),cos(uv.y),1.+abs(sin(iGlobalTime)));
	vec3 col = bg;
	if(t<150.){
		col /= 3.;
		col += max(0.,dot(nor,lig))*color;
		col += specular*.2;
		col += fre*.2;
	}
	col = max(vec3(.05),col);
	col += depth*vec3(1.,1.,1.)*.2;
	col = mix( col, bg, 1.0-exp( -0.000001*t*t*t ));
	return col;
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv = normalize( cross(cu,cw) );
	return mat3( cu, cv, cw );
}


//------------------------------------------------------------------ MAIN
void main(  )
{
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	uv.y+=sin(iGlobalTime*5.+uv.x*25.)*mod(uv.x+iGlobalTime/3.,.5)*.15+.1;
	uv.x+=cos(iGlobalTime/2.+uv.y*2.)*.1+.1;
	uv/=1.3;

	vec2 p = -1. + 2. * uv;
	p.x *= iResolution.x / iResolution.y;

	//Camera
	float radius = 50.;
	vec3 ro = orbit(PI/2.-.4,PI/2.+iGlobalTime/5.,radius);
	vec3 ta  = vec3(0.);
	mat3 ca = setCamera( ro, ta, 0. );
	vec3 rd = ca * normalize( vec3(p.xy,1.) );

	// Raymarching
	vec3 color = render( ro, rd, uv );
	#ifdef POSTPROCESS
	color = postEffects( color, uv, iGlobalTime );
	#endif
	gl_FragColor = vec4(color,1.0);
}
