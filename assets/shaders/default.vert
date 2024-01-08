#version 430

layout (location = 0) in vec3 inPosition;
layout (location = 1) in vec3 inNormal;
layout (location = 2) in vec2 inTexcoord;

layout (location = 0) out vec3 normal;
layout (location = 1) out vec2 texcoord;
layout (location = 2) out vec3 fragPosition;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    fragPosition = (model * vec4(inPosition, 1.0)).xyz;
    texcoord = inTexcoord;
    normal = (transpose(inverse(model)) * vec4(inNormal, 0.0)).xyz;
    gl_Position = projection * view * model * vec4(inPosition, 1.0);
}
