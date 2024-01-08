#version 430

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec2 inTexcoord;

out vec3 position;
out vec2 texcoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    texcoord = inTexcoord;
    gl_Position = projection * view * model * vec4(inPosition, 1.0);
}
