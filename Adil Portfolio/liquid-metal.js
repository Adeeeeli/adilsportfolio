/**
 * Liquid metal ring — shared WebGL chrome ring (matches Home.html bottom nav).
 * Usage: initLiquidMetalRing(ringEl, targetEl, containerEl)
 */
(function () {
  'use strict';

  var VERT = [
    'attribute vec2 a_pos;',
    'void main(){gl_Position=vec4(a_pos,0,1);}'
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    'uniform vec2  u_res;',
    'uniform float u_t;',
    'vec2 hash2(vec2 p){',
    '  p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));',
    '  return -1.0+2.0*fract(sin(p)*43758.5453);',
    '}',
    'float noise(vec2 p){',
    '  vec2 i=floor(p),f=fract(p);',
    '  vec2 u=f*f*(3.0-2.0*f);',
    '  return mix(mix(dot(hash2(i+vec2(0,0)),f-vec2(0,0)),',
    '                 dot(hash2(i+vec2(1,0)),f-vec2(1,0)),u.x),',
    '             mix(dot(hash2(i+vec2(0,1)),f-vec2(0,1)),',
    '                 dot(hash2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);',
    '}',
    'float fbm(vec2 p){',
    '  return noise(p)*0.5+noise(p*2.0+vec2(1.7,9.2))*0.25',
    '        +noise(p*4.0+vec2(8.3,2.8))*0.125;',
    '}',
    'vec3 chromePalette(float t, float n){',
    '  vec3 a=vec3(0.55,0.50,0.45);',
    '  vec3 b=vec3(0.50,0.50,0.50);',
    '  vec3 c=vec3(1.00,1.00,0.90);',
    '  vec3 d=vec3(0.00,0.15,0.40);',
    '  vec3 chrome=a+b*cos(6.2832*(c*(t+n*0.18)+d));',
    '  float gold=smoothstep(0.55,0.85,t+n*0.12);',
    '  float violet=smoothstep(0.0,0.3,1.0-t+n*0.1);',
    '  chrome=mix(chrome,vec3(1.0,0.78,0.2),gold*0.7);',
    '  chrome=mix(chrome,vec3(0.35,0.30,0.95),violet*0.55);',
    '  return clamp(chrome,0.0,1.0);',
    '}',
    'void main(){',
    '  vec2 uv=(gl_FragCoord.xy/u_res)*2.0-1.0;',
    '  float asp=u_res.x/u_res.y;',
    '  uv.x*=asp;',
    '  float r=length(uv);',
    '  float theta=atan(uv.y,uv.x);',
    '  float midR=0.82;',
    '  float ringHalf=0.105;',
    '  float ringDist=abs(r-midR);',
    '  float ring=1.0-smoothstep(ringHalf-0.020,ringHalf+0.020,ringDist);',
    '  float t=u_t*0.55;',
    '  vec2 noiseUV=vec2(theta/(2.0*3.14159)+0.5, r);',
    '  noiseUV+=vec2(t*0.65, t*0.22);',
    '  float n=fbm(noiseUV*3.5);',
    '  float n2=fbm(noiseUV*6.0-vec2(t*0.9,0.0));',
    '  float a=fract((theta+1.5707)/(2.0*3.14159)+u_t*0.12);',
    '  vec3 col=chromePalette(a, n*0.5+n2*0.25);',
    '  float specAngle=fract(u_t*0.16);',
    '  float specDist=abs(fract(a-specAngle+0.5)-0.5)*2.0;',
    '  float spec=pow(max(0.0,1.0-specDist),3.0)*2.4;',
    '  col+=vec3(spec*0.9,spec*0.85,spec*0.7);',
    '  float alpha=ring;',
    '  gl_FragColor=vec4(col*alpha,alpha);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function initLiquidMetalRing(ringEl, targetEl, containerEl) {
    if (!ringEl || !targetEl || !containerEl) return null;

    var cv = document.createElement('canvas');
    ringEl.appendChild(cv);
    var gl = cv.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) return null;

    var prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var uRes = gl.getUniformLocation(prog, 'u_res');
    var uT = gl.getUniformLocation(prog, 'u_t');
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    var W = 0;
    var H = 0;
    var raf = 0;
    var start = performance.now();
    var running = true;

    function setSize(w, h) {
      var pr = Math.min(window.devicePixelRatio || 1, 2);
      var side = Math.round(Math.max(w, h) * pr);
      W = side;
      H = side;
      cv.width = W;
      cv.height = H;
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      gl.viewport(0, 0, W, H);
    }

    function snapRing() {
      var r = targetEl.getBoundingClientRect();
      var c = containerEl.getBoundingClientRect();
      var pad = 3;
      var side = Math.max(r.width, r.height) + pad * 2;
      var w = side;
      var h = side;
      ringEl.style.left = (r.left - c.left - (side - r.width) / 2) + 'px';
      ringEl.style.top = (r.top - c.top - (side - r.height) / 2) + 'px';
      ringEl.style.width = w + 'px';
      ringEl.style.height = h + 'px';
      ringEl.style.opacity = '1';
      setSize(w, h);
    }

    function draw() {
      if (!running) return;
      if (W && H) {
        gl.uniform2f(uRes, W, H);
        gl.uniform1f(uT, (performance.now() - start) * 0.001);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(draw);
    }

    function onResize() {
      snapRing();
    }

    window.setTimeout(function () {
      snapRing();
      draw();
    }, 80);

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !running) {
        running = true;
        draw();
      }
    });

    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(onResize);
      ro.observe(targetEl);
      ro.observe(containerEl);
    }

    return {
      refresh: snapRing,
      destroy: function () {
        running = false;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
      }
    };
  }

  window.initLiquidMetalRing = initLiquidMetalRing;
})();
