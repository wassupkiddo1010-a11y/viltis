(function () {
  'use strict';

  /**
   * DigitalLoomBackground — flowing WebGL line animation for the hero.
   */
  var VS_SOURCE = [
    'attribute vec4 aVertexPosition;',
    'void main() {',
    '  gl_Position = aVertexPosition;',
    '}'
  ].join('\n');

  var FS_SOURCE = [
    'precision highp float;',
    'uniform vec2 iResolution;',
    'uniform float iTime;',
    'const float overallSpeed = 0.16;',
    'const float gridSmoothWidth = 0.015;',
    'const float axisWidth = 0.05;',
    'const float majorLineWidth = 0.025;',
    'const float minorLineWidth = 0.0125;',
    'const float majorLineFrequency = 5.0;',
    'const float minorLineFrequency = 1.0;',
    'const float scale = 5.0;',
    'const vec4 lineColorTeal = vec4(0.125, 0.780, 0.710, 0.92);',
    'const vec4 lineColorViolet = vec4(0.486, 0.361, 1.0, 0.58);',
    'const float minLineWidth = 0.01;',
    'const float maxLineWidth = 0.2;',
    'const float lineSpeed = 1.0 * overallSpeed;',
    'const float lineAmplitude = 1.0;',
    'const float lineFrequency = 0.2;',
    'const float warpSpeed = 0.2 * overallSpeed;',
    'const float warpFrequency = 0.5;',
    'const float warpAmplitude = 1.0;',
    'const float offsetFrequency = 0.5;',
    'const float offsetSpeed = 1.33 * overallSpeed;',
    'const float minOffsetSpread = 0.6;',
    'const float maxOffsetSpread = 2.0;',
    'const int linesPerGroup = 16;',
    '#define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))',
    '#define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))',
    '#define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))',
    'float random(float t) {',
    '  return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;',
    '}',
    'float getPlasmaY(float x, float horizontalFade, float offset) {',
    '  return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;',
    '}',
    'void main() {',
    '  vec2 fragCoord = gl_FragCoord.xy;',
    '  vec4 fragColor;',
    '  vec2 uv = fragCoord.xy / iResolution.xy;',
    '  vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;',
    '  float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);',
    '  float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);',
    '  space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);',
    '  space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;',
    '  vec4 lines = vec4(0.0);',
    '  vec4 bgColor1 = vec4(0.020, 0.040, 0.080, 1.0);',
    '  vec4 bgColor2 = vec4(0.035, 0.055, 0.120, 1.0);',
    '  for (int l = 0; l < linesPerGroup; l++) {',
    '    float normalizedLineIndex = float(l) / float(linesPerGroup);',
    '    float offsetTime = iTime * offsetSpeed;',
    '    float offsetPosition = float(l) + space.x * offsetFrequency;',
    '    float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;',
    '    float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;',
    '    float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);',
    '    float linePosition = getPlasmaY(space.x, horizontalFade, offset);',
    '    float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);',
    '    float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;',
    '    vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));',
    '    float circle = drawCircle(circlePosition, 0.01, space) * 4.0;',
    '    line = line + circle;',
    '    vec4 lineCol = mix(lineColorTeal, lineColorViolet, normalizedLineIndex * 0.65);',
    '    lines += line * lineCol * rand * 1.05;',
    '  }',
    '  fragColor = mix(bgColor1, bgColor2, uv.x);',
    '  fragColor *= verticalFade;',
    '  fragColor.a = 1.0;',
    '  fragColor += lines;',
    '  gl_FragColor = fragColor;',
    '}'
  ].join('\n');

  function loadShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('DigitalLoomBackground shader compile error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  function initShaderProgram(gl, vsSource, fsSource) {
    var vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    var fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return null;

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('DigitalLoomBackground program link error:', gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  function initDigitalLoomBackground(canvas) {
    var section = canvas.closest('.hero');
    if (!section) return null;

    var gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) {
      console.warn('DigitalLoomBackground: WebGL not supported.');
      section.classList.add('hero--no-webgl');
      return null;
    }

    var shaderProgram = initShaderProgram(gl, VS_SOURCE, FS_SOURCE);
    if (!shaderProgram) {
      section.classList.add('hero--no-webgl');
      return null;
    }

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    var programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition')
      },
      uniformLocations: {
        resolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
        time: gl.getUniformLocation(shaderProgram, 'iTime')
      }
    };

    var animationId = 0;
    var startTime = Date.now();
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resizeCanvas() {
      var width = section.clientWidth;
      var height = section.clientHeight;
      if (width === 0 || height === 0) return;

      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    function render() {
      var currentTime = reducedMotion ? 0 : (Date.now() - startTime) / 1000;

      gl.clearColor(0.02, 0.04, 0.08, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(programInfo.program);
      gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
      gl.uniform1f(programInfo.uniformLocations.time, currentTime);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!reducedMotion) {
        animationId = window.requestAnimationFrame(render);
      }
    }

    resizeCanvas();
    render();

    var resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(resizeCanvas)
      : null;

    if (resizeObserver) {
      resizeObserver.observe(section);
    } else {
      window.addEventListener('resize', resizeCanvas);
    }

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    function onMotionChange(e) {
      reducedMotion = e.matches;
      if (!reducedMotion && !animationId) {
        startTime = Date.now();
        render();
      }
    }

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', onMotionChange);
    }

    return function destroy() {
      if (animationId) window.cancelAnimationFrame(animationId);
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', resizeCanvas);
      if (motionQuery.removeEventListener) motionQuery.removeEventListener('change', onMotionChange);
    };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var canvas = document.getElementById('digital-loom-background');
    if (canvas) initDigitalLoomBackground(canvas);
  });
})();
