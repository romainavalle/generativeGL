varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

/////////////

uniform mat4 bindMatrix;
uniform mat4 bindMatrixInverse;

#ifdef BONE_TEXTURE

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

#else

	uniform mat4 boneGlobalMatrices[ MAX_BONES ];

	mat4 getBoneMatrix( const in float i ) {

		mat4 bone = boneGlobalMatrices[ int(i) ];
		return bone;

	}

#endif

void main() {

	vec4 skinVertex = bindMatrix * vec4( position, 1.0 );
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );

	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	skinned  = bindMatrixInverse * skinned;

	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;

	vUv = uv;
	vNormal = vec4( skinMatrix * vec4( normal, 0.0 ) ).xyz;
	vPosition = skinned.xyz + normal;
	vec4 worldPosition = modelMatrix * skinned;

	vec4 mvPosition = modelViewMatrix * worldPosition;
	gl_Position = projectionMatrix * mvPosition;
}
