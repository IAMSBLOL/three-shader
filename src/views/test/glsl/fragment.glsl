const int numbers = 4;

uniform sampler2D image;
uniform sampler2D image_beifen;
uniform float aspect;
uniform float radius;
uniform float amp;
uniform float band;
uniform float waves;
uniform float speed;
uniform float u_time;
uniform float progress[numbers];
uniform vec2 centres[numbers];
uniform vec2 mouse_xy;

varying vec2 vUv;

vec2 mirrored(vec2 v) {
  vec2 m = mod(v,2.);
  return mix(m,2.0 - m, step(1.0 ,m));
}





void main() {
  vec2 tc = vUv.xy;
  vec2 uv = vec2(0.0, 0.0);
  vec2 p;
  float len;
  vec2 uv_offset;
  float wave_width = band * radius;

  for (int i = 0; i < numbers; i += 1) {
    if (progress[i] == -1.0) {
      continue;
    }

    p = (tc - centres[i]);
    p.x = p.x * aspect;
    len = length(p);

    float current_progress = progress[i];
    float current_radius = radius * current_progress;
    float damp_factor = 1.0;
    if (current_progress > .5) {
      damp_factor = (1.0 - current_progress) * 2.0;
    }

    float cut_factor = clamp(wave_width * damp_factor - abs(current_radius - len), 0.0, 1.0);
    float waves_factor = waves * len / radius;
    uv_offset = (p / len) * cos((waves_factor - current_progress * speed) * 3.14) * amp * cut_factor;

    uv += uv_offset;
  
  }
  vec2 now_xy = tc + uv;

  if(uv!=vec2(0.0,0.0)){
    vec4 depth = texture2D(image_beifen, now_xy);
    vec2 fake3d = vec2(now_xy.x + (depth.g - 0.5)*mouse_xy.x/35.0, now_xy.y + (depth.r - 0.5)*mouse_xy.y/15.0);

    vec4 t_image = texture2D(image, mirrored(fake3d));
    gl_FragColor = t_image;
  } else {
      vec4 depth = texture2D(image_beifen, now_xy);

      vec2 fake3d = vec2(now_xy.x + (depth.g - 0.5)*mouse_xy.x/35.0, now_xy.y + (depth.r - 0.5)*mouse_xy.y/15.0);

      vec4 t_image = texture2D(image, mirrored(fake3d));
      gl_FragColor = t_image;
  }

}



