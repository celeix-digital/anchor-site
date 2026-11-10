/*
 * The water: a single full-screen fragment shader. Written for ANCHOR39.
 * Gradient by depth, two layers of domain-warped Voronoi-edge caustics,
 * god rays, a focused shaft on the resting anchor, a waterline glow,
 * vignette and dithering.
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uP;
uniform float uLift;
uniform vec2 uAnchor;
uniform float uWater;
uniform float uSurf;

const vec3 ABYSS_B = vec3(2.0, 11.0, 23.0) / 255.0;
const vec3 ABYSS_T = vec3(11.0, 42.0, 74.0) / 255.0;
const vec3 MID_B = vec3(4.0, 24.0, 45.0) / 255.0;
const vec3 MID_T = vec3(14.0, 74.0, 114.0) / 255.0;
const vec3 SHAL_B = vec3(8.0, 56.0, 90.0) / 255.0;
const vec3 SHAL_T = vec3(24.0, 122.0, 156.0) / 255.0;

float hash12(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
vec2 hash22(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy);
}

// Distance between nearest and second-nearest animated feature point.
float cellEdge(vec2 x, float t) {
  vec2 n = floor(x);
  vec2 f = fract(x);
  float d1 = 8.0;
  float d2 = 8.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(n + g);
      o = 0.5 + 0.42 * sin(t + 6.2831 * o);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < d1) { d2 = d1; d1 = d; }
      else if (d < d2) { d2 = d; }
    }
  }
  return sqrt(d2) - sqrt(d1);
}

float caustics(vec2 uv, float t) {
  vec2 w1 = uv + 0.32 * vec2(sin(uv.y * 1.7 + t * 0.7), cos(uv.x * 1.4 - t * 0.6));
  float e1 = cellEdge(w1, t * 0.8);
  vec2 w2 = uv * 1.55 + vec2(3.7, 1.3) + 0.38 * vec2(cos(uv.y * 2.2 - t * 0.5), sin(uv.x * 1.9 + t * 0.8));
  float e2 = cellEdge(w2, -t * 0.65 + 2.0);
  float c1 = 1.0 - smoothstep(0.0, 0.12, e1);
  float c2 = 1.0 - smoothstep(0.0, 0.09, e2);
  c1 *= c1 * c1;
  c2 *= c2 * c2;
  return c1 * 0.55 + c2 * 0.35 + c1 * c2 * 1.1;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float aspect = uRes.x / uRes.y;
  vec2 uv = vec2(frag.x / uRes.x, 1.0 - frag.y / uRes.y); // y down
  vec2 sp = vec2(uv.x * aspect, uv.y);                    // square space

  float p = uP;
  vec3 bot = p < 0.5 ? mix(ABYSS_B, MID_B, smoothstep(0.0, 0.5, p)) : mix(MID_B, SHAL_B, smoothstep(0.5, 1.0, p));
  vec3 top = p < 0.5 ? mix(ABYSS_T, MID_T, smoothstep(0.0, 0.5, p)) : mix(MID_T, SHAL_T, smoothstep(0.5, 1.0, p));

  float water = uWater;
  float wy = clamp((uv.y - max(water, 0.0)) / (1.0 - max(water, 0.0)), 0.0, 1.0);
  vec3 col = mix(top, bot, pow(wy, 0.8));

  float near = pow(1.0 - wy, 2.0);
  float shallow = smoothstep(0.05, 1.0, p);

  // Caustic network
  vec2 cuv = sp * 4.0 + vec2(0.0, p * 2.5);
  float cs = caustics(cuv, uTime * 0.5);
  float cAmt = mix(0.04, 0.16, shallow) * (0.2 + 0.8 * near) + uSurf * 0.06 * near;
  col += vec3(0.55, 0.86, 0.95) * cs * cAmt;

  // God rays from a source above the screen
  vec2 src = vec2(aspect * (0.5 + 0.12 * sin(uTime * 0.035)), -0.75);
  vec2 d = sp - src;
  float ang = atan(d.x, d.y);
  float r = 0.5 + 0.5 * sin(ang * 21.0 + uTime * 0.17);
  r *= 0.55 + 0.45 * sin(ang * 34.0 - uTime * 0.11 + 1.3);
  r += 0.35 * (0.5 + 0.5 * sin(ang * 9.0 + uTime * 0.07 + 0.6));
  r = r * r;
  float rAmt = mix(0.025, 0.12, shallow) * (1.0 - wy * 0.8);
  col += vec3(0.5, 0.8, 0.95) * r * rAmt;

  // Focused shaft on the resting anchor
  vec2 a = vec2(uAnchor.x * aspect, uAnchor.y);
  vec2 s0 = vec2(a.x - 0.22, -0.15);
  vec2 ba = a - s0;
  vec2 pa = sp - s0;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.3);
  float dist = length(pa - ba * h);
  float wdt = mix(0.035, 0.19, h);
  float shaft = (1.0 - smoothstep(0.0, wdt, dist)) * smoothstep(0.0, 0.5, h) * (1.0 - smoothstep(1.05, 1.3, h));
  shaft *= 0.5 + 0.5 * sin(uTime * 0.6 + uv.y * 4.0) * 0.4;
  float pool = exp(-length((sp - a) * vec2(1.0, 2.2)) * 4.5);
  float sAmt = 1.0 - uLift;
  col += vec3(0.6, 0.84, 0.95) * (shaft * 0.3 + pool * 0.16) * sAmt;

  // Glow just under the waterline
  if (water > -0.5) {
    float dw = max(uv.y - water, 0.0);
    col += vec3(0.62, 0.88, 0.94) * exp(-dw * 10.0) * 0.32 * uSurf;
  }

  // Vignette
  vec2 q = uv - 0.5;
  float vig = clamp(1.0 - dot(q * vec2(0.85, 1.05), q * vec2(0.85, 1.05)) * 1.15, 0.0, 1.0);
  col *= mix(0.7, 1.0, vig);

  // Dither
  col += (hash12(frag + fract(uTime * 7.0) * 113.0) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`

export type WaterUniforms = {
  time: number
  p: number
  lift: number
  anchorX: number
  anchorY: number
  water: number
  surf: number
}

export class Water {
  readonly canvas: HTMLCanvasElement
  private gl: WebGLRenderingContext
  private prog: WebGLProgram
  private loc: Record<string, WebGLUniformLocation | null> = {}
  lost = false

  static create(canvas: HTMLCanvasElement): Water | null {
    try {
      const gl = canvas.getContext('webgl', {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance',
      }) as WebGLRenderingContext | null
      if (!gl) return null
      return new Water(canvas, gl)
    } catch {
      return null
    }
  }

  private constructor(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
    this.canvas = canvas
    this.gl = gl
    const prog = gl.createProgram()!
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader')
      gl.attachShader(prog, s)
    }
    sh(gl.VERTEX_SHADER, VERT)
    sh(gl.FRAGMENT_SHADER, FRAG)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link')
    this.prog = prog
    gl.useProgram(prog)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    for (const n of ['uRes', 'uTime', 'uP', 'uLift', 'uAnchor', 'uWater', 'uSurf']) {
      this.loc[n] = gl.getUniformLocation(prog, n)
    }
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault()
      this.lost = true
    })
  }

  resize(w: number, h: number) {
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
    }
    this.gl.viewport(0, 0, w, h)
  }

  render(u: WaterUniforms) {
    if (this.lost) return
    const gl = this.gl
    const L = this.loc
    gl.uniform2f(L.uRes, this.canvas.width, this.canvas.height)
    gl.uniform1f(L.uTime, u.time)
    gl.uniform1f(L.uP, u.p)
    gl.uniform1f(L.uLift, u.lift)
    gl.uniform2f(L.uAnchor, u.anchorX, u.anchorY)
    gl.uniform1f(L.uWater, u.water)
    gl.uniform1f(L.uSurf, u.surf)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  destroy() {
    this.gl.deleteProgram(this.prog)
    this.gl.getExtension('WEBGL_lose_context')?.loseContext()
  }
}
