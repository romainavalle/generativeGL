
uniform float parallaxScale; // ~0.1
uniform vec3 ambient;

//////////////////////////////////////////////////////
// Implements Parallax Mapping technique
// Returns modified texture coordinates, and last used depth

// parallaxMapping with Offset Limit
vec2 parallaxMapping(in vec3 eye, in vec2 uv, out float parallaxHeight)
{
	// get depth for this fragment
	float initialHeight = texture2D(heightMap, uv).r;

	// calculate amount of offset for Parallax Mapping
	vec2 texCoordOffset = parallaxScale * eye.xy / eye.z * initialHeight;

	// calculate amount of offset for Parallax Mapping With Offset Limiting
	texCoordOffset = parallaxScale * eye.xy * initialHeight;

	parallaxHeight = initialHeight;

	// return modified texture coordinates
	return uv - texCoordOffset;
}

// //Steep Parallax Mapping
vec2 steepParallaxMapping(in vec3 V, vec2 uv, out float parallaxHeight)
{
	// determine number of layers from angle between V and N
	const float minLayers = 5.;
	const float maxLayers = 15.;
	float numLayers = mix(maxLayers, minLayers, abs(dot(vec3(0., 0., 1.), V)));

	// height of each layer
	float layerHeight = 1.0 / numLayers;

	// depth of current layer
	float currentLayerHeight = 0.;

	// shift of texture coordinates for each iteration
	vec2 dtex = parallaxScale * V.xy / V.z / numLayers;
	dtex = clamp(dtex,vec2(0.00,0.00),vec2(0.01,0.01));

	// get first depth from heightmap
	float heightFromTexture = texture2D(heightMap, uv).r;

	// while point is above surface
	for (int i = 0 ; i < 64 ; i ++) {
		if(heightFromTexture <= currentLayerHeight){ break; }
		// to the next layer
		currentLayerHeight += layerHeight;
		// shift texture coordinates along vector V
		uv -= dtex;
		// get new depth from heightmap
		heightFromTexture = texture2D(heightMap, uv).r;
	}

	parallaxHeight = currentLayerHeight;
	return uv;
}

// // Relief
vec2 parallaxReliefMapping(in vec3 V, in vec2 T, out float parallaxHeight)
{
	// determine required number of layers
	const float minLayers = 10.;
	const float maxLayers = 15.;
	float numLayers = mix(maxLayers, minLayers, abs(dot(vec3(0., 0., 1.), V)));

	// height of each layer
	float layerHeight = 1.0 / numLayers;
	// depth of current layer
	float currentLayerHeight = 0.;
	// shift of texture coordinates for each iteration
	vec2 dtex = parallaxScale * V.xy / V.z / numLayers;

	// current texture coordinates
	vec2 currentTextureCoords = T;

	// depth from heightmap
	float heightFromTexture = texture2D(heightMap, currentTextureCoords).r;

	// while point is above surface
	for (int i = 0 ; i < 64 ; i ++) {
		if(heightFromTexture <= currentLayerHeight){ break; }
		// go to the next layer
		currentLayerHeight += layerHeight;
		// shift texture coordinates along V
		currentTextureCoords -= dtex;
		// new depth from heightmap
		heightFromTexture = texture2D(heightMap, currentTextureCoords).r;
	}

	///////////////////////////////////////////////////////////
	// Start of Relief Parallax Mapping

	// decrease shift and height of layer by half
	vec2 deltaTexCoord = dtex / 2.;
	float deltaHeight = layerHeight / 2.;

	// return to the mid point of previous layer
	currentTextureCoords += deltaTexCoord;
	currentLayerHeight -= deltaHeight;

	// binary search to increase precision of Steep Paralax Mapping
	const int numSearches = 5;
	for(int i=0; i<numSearches; i++)
	{
		// decrease shift and height of layer by half
		deltaTexCoord /= 2.;
		deltaHeight /= 2.;

		// new depth from heightmap
		heightFromTexture = texture2D(heightMap, currentTextureCoords).r;

		// shift along or agains vector V
		if(heightFromTexture > currentLayerHeight) // below the surface
		{
			currentTextureCoords -= deltaTexCoord;
			currentLayerHeight += deltaHeight;
		}
		else // above the surface
		{
			currentTextureCoords += deltaTexCoord;
			currentLayerHeight -= deltaHeight;
		}
	}

	// return results
	parallaxHeight = currentLayerHeight;
	return currentTextureCoords;
}

// Parallax Occlusion Mapping
vec2 parallaxOcclusionMapping(in vec3 V, in vec2 T, out float parallaxHeight)
	{
	// determine optimal number of layers
	const float minLayers = 10.;
	const float maxLayers = 15.;

	float numLayers = mix(maxLayers, minLayers, abs(dot(vec3(0., 0., 1.), V)));

	// height of each layer
	float layerHeight = 1.0 / numLayers;
	// current depth of the layer
	float curLayerHeight = 0.;
	// shift of texture coordinates for each layer
	vec2 dtex = parallaxScale * V.xy / V.z / numLayers;

	// current texture coordinates
	vec2 currentTextureCoords = T;

	// depth from heightmap
	float heightFromTexture = texture2D(heightMap, currentTextureCoords).r;

	// while point is above the surface
	for (int i = 0 ; i < 64 ; i ++) {
		if(heightFromTexture <= curLayerHeight){ break; }
		// to the next layer
		curLayerHeight += layerHeight;
		// shift of texture coordinates
		currentTextureCoords -= dtex;
		// new depth from heightmap
		heightFromTexture = texture2D(heightMap, currentTextureCoords).r;
	}

	// previous texture coordinates
	vec2 prevTCoords = currentTextureCoords + dtex;

	// heights for linear interpolation
	float nextH	= heightFromTexture - curLayerHeight;
	float prevH	= texture2D(heightMap, prevTCoords).r
							- curLayerHeight + layerHeight;

	// proportions for linear interpolation
	float weight = nextH / (nextH - prevH);

	// interpolation of texture coordinates
	vec2 finalTexCoords = prevTCoords * weight + currentTextureCoords * (1.0-weight);

	// interpolation of depth values
	parallaxHeight = curLayerHeight + prevH * weight + nextH * (1.0 - weight);

	// return result
	return finalTexCoords;
}

//////////////////////////////////////////////////////
// Implements self-shadowing technique - hard or soft shadows
// Returns shadow factor
float parallaxSoftShadowMultiplier(in vec3 L, in vec2 initialTexCoord, in float initialHeight)
{
	float shadowMultiplier = 1.;

	const float minLayers = 15.;
	const float maxLayers = 30.;

	// calculate lighting only for surface oriented to the light source
	if(dot(vec3(0., 0., 1.), L) > 0.)
	{
		// calculate initial parameters
		float numSamplesUnderSurface = 0.;
		shadowMultiplier = 0.;
		float numLayers	= mix(maxLayers, minLayers, abs(dot(vec3(0., 0., 1.), L)));
		float layerHeight	= initialHeight / numLayers;
		vec2 texStep	= parallaxScale * L.xy / L.z / numLayers;

		// current parameters
		float currentLayerHeight	= initialHeight - layerHeight;
		vec2 currentTextureCoords	= initialTexCoord + texStep;
		float heightFromTexture		= texture2D(heightMap, currentTextureCoords).r;
		float stepIndex	= 1.;

		// while point is below depth 0.0 )
		for (int i = 0 ; i < 64 ; i ++) {
			if(currentLayerHeight < 0.){ break; }

			// if point is under the surface
			if(heightFromTexture < currentLayerHeight)
			{
				// calculate partial shadowing factor
				numSamplesUnderSurface += 1.;
				float newShadowMultiplier = (currentLayerHeight - heightFromTexture) *
												(1. - stepIndex / numLayers);
				shadowMultiplier	= max(shadowMultiplier, newShadowMultiplier);
			}

			// offset to the next layer
			stepIndex	+= 1.;
			currentLayerHeight	-= layerHeight;
			currentTextureCoords	+= texStep;
			heightFromTexture	= texture2D(heightMap, currentTextureCoords).r;
		}

		// Shadowing factor should be 1 if there were no points under the surface
		if(numSamplesUnderSurface < 1.)
		{
			shadowMultiplier = 1.;
		}
		else
		{
			shadowMultiplier = 1.0 - shadowMultiplier;
		}
	}
	return shadowMultiplier;
}



// Calculates lighting by Blinn-Phong model and Normal Mapping
// Returns color of the fragment
vec4 normalMappingLighting(in vec2 T, in vec3 L, in vec3 V, float shadowMultiplier)
{
	// restore normal from normal map
	vec3 N = normalize(texture2D(normalMap, T).xyz * 2. - 1.);
	vec3 D = texture2D(map, T).rgb;

	// ambient lighting
	float iamb = 0.1;
	// diffuse lighting
	float idiff = clamp(dot(N, L), 0., 1.);

	// specular lighting
	float ispec = 0.0;
	if(dot(N, L) > 0.2)
	{
		vec3 R = reflect(-L, N);
		ispec = pow(dot(R, V), 32.) / 1.5;
	}

	vec4 resColor;
	resColor.rgb = D * (ambient + (idiff + ispec) * pow(shadowMultiplier, 4.));
	resColor.a = 1.;

	return resColor;
}
