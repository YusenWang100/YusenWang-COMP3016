#version 430

layout (location = 0) in vec3 inNormal;
layout (location = 1) in vec2 texcoord;
layout (location = 2) in vec3 fragPosition;

layout (location = 0) out vec4 fragColor;

uniform vec3 color = vec3(1.0);

uniform sampler2D albedoMap;
uniform sampler2D secondTexture;

uniform vec3 lightPosition;
uniform vec3 movingLightPosition;
uniform vec3 viewPosition;

uniform vec3 ambientColor;
uniform vec3 lightColor;
uniform vec3 movingLightColor = vec3(1.0);
uniform vec3 directionalLightColor;

uniform float shininess;

uniform bool enableSpecular = false;
uniform bool useSpecularMap = false;
uniform bool onlyEmission = false;

uniform bool enableToonShading = false;

vec3 computeSpecular(vec3 lightDirection, vec3 viewDirection, vec3 normal)
{
    vec3 halfVector = normalize(lightDirection + viewDirection);

    float specular = 0.0;

    float specularIntensity = 1.0;

    if (useSpecularMap)
    {
        specularIntensity = texture(secondTexture, texcoord).r * 2.0;
    }

    specular = pow(max(0.0, dot(halfVector, normal)), shininess) * specularIntensity;

    return vec3(specular);
}

vec3 computeDiffuse(vec3 albedoColor, vec3 normal, vec3 lightDirection)
{
    float diffuse = max(0.,dot(normal, lightDirection));
    
    return vec3(diffuse * albedoColor);
}

vec3 toonShading(vec3 lightDirection, vec3 normal)
{
    float intensity;
	vec3 color;
	intensity = max(0.0, dot(lightDirection, normal));

	if (intensity > 0.7)
		color = vec3(1.0, 0.5, 0.5);
	else if (intensity > 0.5)
		color = vec3(0.6, 0.3, 0.3);
	else if (intensity > 0.25)
		color = vec3(0.4, 0.2, 0.2);
	else
		color = vec3(0.2, 0.1, 0.1);
	return color;
}

void main()
{
    vec4 albedoColor = texture(albedoMap, texcoord);

    vec3 lightDirection0 = normalize(lightPosition - fragPosition);
    vec3 lightDirection1 = normalize(movingLightPosition - fragPosition);
    vec3 lightDirection2 = normalize(vec3(-1.0, -1.0, -1.0));

    vec3 normal = normalize(inNormal);

    vec3 diffuse0 = computeDiffuse(albedoColor.rgb, normal, lightDirection0) * lightColor;
    vec3 diffuse1 = computeDiffuse(albedoColor.rgb, normal, lightDirection1) * movingLightColor;
    vec3 diffuse2 = computeDiffuse(albedoColor.rgb, normal, -lightDirection2) * directionalLightColor;

    vec3 finalColor = diffuse0 * 0.25 + diffuse1 * 0.25 + diffuse2 * 0.5;

    if (enableSpecular)
    {
        vec3 viewDirection = normalize(viewPosition - fragPosition);

        vec3 specular0 = computeSpecular(lightDirection0, viewDirection, normal);
        vec3 specular1 = computeSpecular(lightDirection1, viewDirection, normal);
        vec3 specular2 = computeSpecular(-lightDirection2, viewDirection, normal);
    
        finalColor += specular0 * 0.25 + specular1 * 0.25 + specular2 * 0.5;
    }

    fragColor = vec4(finalColor * color + ambientColor, albedoColor.a);

    if (onlyEmission)
    {
        fragColor = vec4(color, 1.0);
    }

    if (enableToonShading)
    {
        fragColor = vec4(finalColor * toonShading(lightDirection2, normal), 1.0);
    }

    fragColor.a = albedoColor.a;
}
