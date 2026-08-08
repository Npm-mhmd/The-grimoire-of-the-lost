/**
 * Compact 2D/3D Simplex Noise implementation
 * Adapted for The Grimoire of the Forbidden
 * Used for organic potion movement paths
 */

// Permutation table
const perm = new Uint8Array(512)
const gradP = new Array(512)

const grad3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
]

function seed(s) {
  if (s > 0 && s < 1) s *= 65536
  s = Math.floor(s)
  if (s < 256) s |= s << 8
  for (let i = 0; i < 256; i++) {
    // Simple hash
    const v = ((i * 168 + 17) * s + i * 31) & 255
    perm[i] = perm[i + 256] = v
    gradP[i] = gradP[i + 256] = grad3[v % 12]
  }
}

seed(Math.random() * 65536)

const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6
const F3 = 1 / 3
const G3 = 1 / 6

function dot2(g, x, y) {
  return g[0] * x + g[1] * y
}

function dot3(g, x, y, z) {
  return g[0] * x + g[1] * y + g[2] * z
}

/**
 * 2D Simplex Noise — returns value in [-1, 1]
 */
export function simplex2D(xin, yin) {
  let n0, n1, n2
  const s = (xin + yin) * F2
  let i = Math.floor(xin + s)
  let j = Math.floor(yin + s)
  const t = (i + j) * G2
  const x0 = xin - i + t
  const y0 = yin - j + t

  let i1, j1
  if (x0 > y0) { i1 = 1; j1 = 0 }
  else { i1 = 0; j1 = 1 }

  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2
  const y2 = y0 - 1 + 2 * G2

  i &= 255
  j &= 255
  const gi0 = gradP[i + perm[j]] || grad3[0]
  const gi1 = gradP[i + i1 + perm[j + j1]] || grad3[0]
  const gi2 = gradP[i + 1 + perm[j + 1]] || grad3[0]

  let t0 = 0.5 - x0 * x0 - y0 * y0
  if (t0 < 0) n0 = 0
  else { t0 *= t0; n0 = t0 * t0 * dot2(gi0, x0, y0) }

  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 < 0) n1 = 0
  else { t1 *= t1; n1 = t1 * t1 * dot2(gi1, x1, y1) }

  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 < 0) n2 = 0
  else { t2 *= t2; n2 = t2 * t2 * dot2(gi2, x2, y2) }

  return 70 * (n0 + n1 + n2)
}

/**
 * 3D Simplex Noise — returns value in [-1, 1]
 */
export function simplex3D(xin, yin, zin) {
  let n0, n1, n2, n3
  const s = (xin + yin + zin) * F3
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const k = Math.floor(zin + s)
  const t = (i + j + k) * G3
  const x0 = xin - i + t
  const y0 = yin - j + t
  const z0 = zin - k + t

  let i1, j1, k1, i2, j2, k2
  if (x0 >= y0) {
    if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0 }
    else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1 }
    else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1 }
  } else {
    if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1 }
    else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1 }
    else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0 }
  }

  const x1 = x0 - i1 + G3
  const y1 = y0 - j1 + G3
  const z1 = z0 - k1 + G3
  const x2 = x0 - i2 + 2 * G3
  const y2 = y0 - j2 + 2 * G3
  const z2 = z0 - k2 + 2 * G3
  const x3 = x0 - 1 + 3 * G3
  const y3 = y0 - 1 + 3 * G3
  const z3 = z0 - 1 + 3 * G3

  const ii = i & 255
  const jj = j & 255
  const kk = k & 255
  const gi0 = gradP[ii + perm[jj + perm[kk]]] || grad3[0]
  const gi1 = gradP[ii + i1 + perm[jj + j1 + perm[kk + k1]]] || grad3[0]
  const gi2 = gradP[ii + i2 + perm[jj + j2 + perm[kk + k2]]] || grad3[0]
  const gi3 = gradP[ii + 1 + perm[jj + 1 + perm[kk + 1]]] || grad3[0]

  let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0
  if (t0 < 0) n0 = 0
  else { t0 *= t0; n0 = t0 * t0 * dot3(gi0, x0, y0, z0) }

  let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1
  if (t1 < 0) n1 = 0
  else { t1 *= t1; n1 = t1 * t1 * dot3(gi1, x1, y1, z1) }

  let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2
  if (t2 < 0) n2 = 0
  else { t2 *= t2; n2 = t2 * t2 * dot3(gi2, x2, y2, z2) }

  let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3
  if (t3 < 0) n3 = 0
  else { t3 *= t3; n3 = t3 * t3 * dot3(gi3, x3, y3, z3) }

  return 32 * (n0 + n1 + n2 + n3)
}
