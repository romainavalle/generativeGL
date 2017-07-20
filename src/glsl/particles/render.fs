uniform float time;
uniform float opacity;
uniform vec3 color;
uniform sampler2D texture;

void main()
{
    gl_FragColor = vec4( vec3(1.), opacity ) * texture2D( texture, gl_PointCoord );
}
