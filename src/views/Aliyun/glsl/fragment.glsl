
uniform sampler2D image;
varying vec2 vUv;

// float myRandom(vec2 v) {
//   return fract(sin(dot(v.xy, vec2(12.9898 ,78.233))) * 43758.5453123);
// };

void main() {

  vec2 tc = vUv.xy;
  vec2 uv = vec2(0.0, 0.0);
  vec2 now_xy = tc + uv;

  gl_FragColor = texture2D(image, now_xy);
}
