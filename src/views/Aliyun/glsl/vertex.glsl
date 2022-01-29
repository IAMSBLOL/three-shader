varying vec2 vUv;

void main() {
	vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

	vUv = uv;
	
	vec3 pos = position;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
