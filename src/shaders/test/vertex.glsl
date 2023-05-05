uniform vec2 uFrequency;
uniform float uTime;

attribute float aRandom;

varying float vRandom;
varying vec2 vUv;
varying vec2 vUv2;
varying float vElevation;

void main()
{
    // Flag
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.07;
    elevation +=  sin(modelPosition.y * uFrequency.y + uTime) * 0.07;
    modelPosition.z += elevation;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;

    // // Moon
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // vUv2 = uv;
}