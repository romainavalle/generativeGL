varying vec2 vUv;
uniform float offset;
uniform sampler2D boneTexture;
uniform int boneTextureWidth;
uniform int boneTextureHeight;

mat4 getBoneMatrix( const in float i ) {
	float j = i * 4.0;
	float x = mod( j, float( boneTextureWidth ) );
	float y = floor( j / float( boneTextureWidth ) );
	float dx = 1.0 / float( boneTextureWidth );
	float dy = 1.0 / float( boneTextureHeight );
	y = dy * ( y + 0.5 );
	vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
	vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
	vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
	vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
	mat4 bone = mat4( v1, v2, v3, v4 );
	return bone;
}

void main() {
	vUv = uv;
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
	vec4 skinVertex = vec4( position + normal * offset, 1.0 );
	vec4 skinned  = boneMatX * skinVertex * skinWeight.x;
	skinned      += boneMatY * skinVertex * skinWeight.y;
	skinned      += boneMatZ * skinVertex * skinWeight.z;
	skinned      += boneMatW * skinVertex * skinWeight.w;
	vec4 mvPosition = modelViewMatrix * (vec4( skinned.xyz + normal * offset, 1.0 ));
	gl_Position = projectionMatrix * mvPosition;
}
