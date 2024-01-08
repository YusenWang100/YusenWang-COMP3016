#version 430

layout (location = 0) in vec3 position;
layout (location = 1) in vec2 texcoord;

uniform sampler2D albedoMap;

out vec4 fragColor;

void main()
{
    fragColor = texture(albedoMap, texcoord);
}
