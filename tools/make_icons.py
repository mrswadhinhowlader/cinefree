"""Draws the PWA icons (no third-party libraries).

Run after changing the brand colours:  python3 tools/make_icons.py
Outputs assets/icons/icon-192.png, icon-512.png and icon-maskable-512.png.
"""

import math
import os
import struct
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "assets", "icons")

A = (255, 180, 69)   # accent
B = (255, 90, 110)   # accent-2
INK = (26, 18, 7)


def lerp(a, b, t):
    return a + (b - a) * t


def inside_rounded(x, y, radius):
    cx = min(max(x, radius), 1 - radius)
    cy = min(max(y, radius), 1 - radius)
    dx, dy = x - cx, y - cy
    return dx * dx + dy * dy <= radius * radius


def inside_triangle(x, y):
    if x < 0.30 or x > 0.78:
        return False
    t = (x - 0.30) / (0.78 - 0.30)
    return abs(y - 0.5) <= 0.24 * (1 - t)


def sample(x, y, maskable):
    if maskable:
        # keep the mark inside the maskable safe zone
        ax = 0.5 + (x - 0.5) / 0.62
        ay = 0.5 + (y - 0.5) / 0.62
        if inside_triangle(ax, ay):
            return INK + (255,)
    else:
        if not inside_rounded(x, y, 0.24):
            return (0, 0, 0, 0)
        if inside_triangle(x, y):
            return INK + (255,)
    t = (x + y) / 2
    return (255, int(lerp(A[1], B[1], t)), int(lerp(A[2], B[2], t)), 255)


def render(size, maskable=False, ss=3):
    rows = []
    step = 1.0 / (size * ss)
    for y in range(size):
        row = bytearray()
        for x in range(size):
            acc_r = acc_g = acc_b = acc_a = 0.0
            for sy in range(ss):
                for sx in range(ss):
                    ux = (x * ss + sx + 0.5) * step
                    uy = (y * ss + sy + 0.5) * step
                    r, g, b, a = sample(ux, uy, maskable)
                    f = a / 255.0
                    acc_r += r * f
                    acc_g += g * f
                    acc_b += b * f
                    acc_a += f
            n = ss * ss
            alpha = acc_a / n
            if acc_a <= 0:
                row += b"\x00\x00\x00\x00"
            else:
                row += bytes(
                    (
                        round(acc_r / acc_a),
                        round(acc_g / acc_a),
                        round(acc_b / acc_a),
                        round(alpha * 255),
                    )
                )
        rows.append(bytes(row))
    return rows


def write_png(path, size, rows):
    raw = b"".join(b"\x00" + r for r in rows)

    def chunk(tag, data):
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", ihdr)
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )
    with open(path, "wb") as fh:
        fh.write(png)
    print("wrote", os.path.relpath(path, os.path.dirname(HERE)), len(png), "bytes")


def main():
    os.makedirs(OUT, exist_ok=True)
    for size in (192, 512):
        write_png(os.path.join(OUT, "icon-%d.png" % size), size, render(size))
    write_png(os.path.join(OUT, "icon-maskable-512.png"), 512, render(512, maskable=True))


if __name__ == "__main__":
    main()
