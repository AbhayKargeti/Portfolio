import { useEffect, useRef } from 'react'

const vertex = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}'

const fragment = `
precision highp float;
uniform vec2 uSize, uPointer;
uniform float uTime, uPull, uDrift, uHue, uSat, uVal, uBaseSat, uBaseVal, uSheen, uGrain;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * f * (f * (f * 6. - 15.) + 10.);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  return .72 * noise(p) + .2 * noise(mat2(1.62, 1.18, -1.18, 1.62) * p + 7.3);
}

float surface(vec2 p) {
  vec2 flow = vec2(fbm(p + uTime * .05), fbm(p + vec2(5.2, 1.3) - uTime * .04));
  return fbm(p + 1.9 * flow);
}

vec3 hsv(float h, float s, float v) {
  vec3 k = mod(vec3(5., 3., 1.) + h / 60., 6.);
  return v - v * s * clamp(min(k, 4. - k), 0., 1.);
}

void main() {
  vec2 ratio = vec2(uSize.x / uSize.y, 1.);
  vec2 p = gl_FragCoord.xy / uSize * ratio;
  vec2 toPointer = p - uPointer * ratio;
  p -= toPointer * uPull * exp(-dot(toPointer, toPointer) * 7.) * .45;
  p.y += uDrift;
  p = mat2(.76, .65, -.65, .76) * p * vec2(.55, 1.5);

  float height = surface(p);
  float step = .03;
  vec2 slope = vec2(surface(p + vec2(step, 0.)), surface(p + vec2(0., step))) - height;
  vec3 normal = normalize(vec3(-slope / step * .6, 1.));
  vec3 light = normalize(vec3(.45, .65, .6));

  float diffuse = clamp(dot(normal, light), 0., 1.);
  float sheen = pow(clamp(reflect(-light, normal).z, 0., 1.), 9.);
  vec3 base = hsv(uHue - 14., uSat * uBaseSat, min(uVal * uBaseVal, 1.));
  vec3 band = hsv(uHue + (height - .5) * 44., uSat, uVal);
  vec3 color = mix(base, band, clamp(smoothstep(.28, .72, height) * diffuse * 1.5, 0., 1.));
  color += hsv(uHue + 24., uSat * .4, 1.) * sheen * uSheen;
  gl_FragColor = vec4(color + (hash(gl_FragCoord.xy) - .5) * uGrain, 1.);
}`

export default function LiquidCanvas({ className, follow = false }: { className: string; follow?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const gl = canvas?.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
      failIfMajorPerformanceCaveat: true,
    })
    if (!canvas || !gl) return

    const program = gl.createProgram()
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(type)
      if (!shader) return
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      gl.attachShader(program, shader)
      gl.deleteShader(shader)
    }
    gl.bindAttribLocation(program, 0, 'a')
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string) => gl.getUniformLocation(program, name)
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const pointer = { x: -1, y: -1, currentX: 0.5, currentY: 0.5, pull: 0 }
    const scene = { hue: 0, sat: 0, val: 0 }
    const target = { hue: 0, sat: 0, val: 0 }
    let source: Element = canvas
    let first = true
    let frame = 0
    let last = 0

    const read = () => {
      const styles = getComputedStyle(source)
      const value = (name: string) => parseFloat(styles.getPropertyValue(`--liquid-${name}`))
      target.hue = value('hue')
      target.sat = value('sat')
      target.val = value('val')
      gl.uniform1f(uniform('uBaseSat'), value('base-sat'))
      gl.uniform1f(uniform('uBaseVal'), value('base-val'))
      gl.uniform1f(uniform('uSheen'), value('sheen'))
      gl.uniform1f(uniform('uGrain'), value('grain'))
      if (first || still) Object.assign(scene, target)
      first = false
    }

    const draw = (now: number) => {
      const { left, top, width, height } = canvas.getBoundingClientRect()
      const inside =
        !still && pointer.x >= left && pointer.x <= left + width && pointer.y >= top && pointer.y <= top + height
      if (inside) {
        pointer.currentX += ((pointer.x - left) / width - pointer.currentX) * 0.06
        pointer.currentY += (1 - (pointer.y - top) / height - pointer.currentY) * 0.06
      }
      pointer.pull += ((inside ? 1 : 0) - pointer.pull) * 0.05
      scene.hue += ((target.hue - scene.hue + 540) % 360 - 180) * 0.04
      scene.sat += (target.sat - scene.sat) * 0.04
      scene.val += (target.val - scene.val) * 0.04
      gl.uniform2f(uniform('uSize'), canvas.width, canvas.height)
      gl.uniform2f(uniform('uPointer'), pointer.currentX, pointer.currentY)
      gl.uniform1f(uniform('uPull'), pointer.pull)
      gl.uniform1f(uniform('uTime'), still ? 14 : now / 1000)
      gl.uniform1f(uniform('uDrift'), follow ? (scrollY / innerHeight) * 0.22 : 0)
      gl.uniform1f(uniform('uHue'), scene.hue)
      gl.uniform1f(uniform('uSat'), scene.sat)
      gl.uniform1f(uniform('uVal'), scene.val)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      canvas.classList.add('ready')
    }

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      if (now - last < 33) return
      last = now
      draw(now)
    }

    const resize = new ResizeObserver(() => {
      const scale = Math.min(0.5, 760 / Math.max(canvas.clientWidth, 1))
      canvas.width = Math.ceil(canvas.clientWidth * scale)
      canvas.height = Math.ceil(canvas.clientHeight * scale)
      gl.viewport(0, 0, canvas.width, canvas.height)
      draw(performance.now())
    })

    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      if (entry.isIntersecting && !still) frame = requestAnimationFrame(loop)
    })

    const scenes = new IntersectionObserver(
      (entries) => {
        const current = entries.find((entry) => entry.isIntersecting)
        if (!current) return
        source = current.target
        read()
        if (still) draw(performance.now())
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )

    const theme = new MutationObserver(() => {
      read()
      draw(performance.now())
    })

    const move = ({ clientX, clientY }: PointerEvent) => {
      pointer.x = clientX
      pointer.y = clientY
    }

    const lost = (event: Event) => {
      event.preventDefault()
      cancelAnimationFrame(frame)
      canvas.classList.remove('ready')
    }

    if (follow) {
      source = document.querySelector('.hero') ?? canvas
      document.querySelectorAll('.hero, main section').forEach((section) => scenes.observe(section))
    }
    read()
    resize.observe(canvas)
    visibility.observe(canvas)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    canvas.addEventListener('webglcontextlost', lost)
    if (matchMedia('(pointer: fine)').matches) addEventListener('pointermove', move, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      visibility.disconnect()
      scenes.disconnect()
      theme.disconnect()
      canvas.removeEventListener('webglcontextlost', lost)
      removeEventListener('pointermove', move)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
    }
  }, [follow])

  return <canvas className={`liquid ${className}`} ref={ref} aria-hidden="true" />
}
