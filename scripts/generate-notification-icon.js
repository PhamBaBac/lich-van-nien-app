const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

// Sử dụng supersampling 4x để khử răng cưa (anti-aliasing) mượt mà tuyệt đối
const SCALE = 4;
const TARGET_SIZE = 96;
const W = TARGET_SIZE * SCALE;
const H = TARGET_SIZE * SCALE;

const buffer = new Float32Array(W * H);

function drawPixel(x, y, v) {
  if (x >= 0 && x < W && y >= 0 && y < H) {
    buffer[y * W + x] = Math.max(buffer[y * W + x], v);
  }
}

// 1. Quai treo lịch (2 vòng khuyên trên đỉnh)
for (let y = 48; y < 96; y++) {
  for (let x = 104; x < 140; x++) {
    const dx = Math.abs(x - 122);
    if (dx <= 16) drawPixel(x, y, 1);
  }
  for (let x = 244; x < 280; x++) {
    const dx = Math.abs(x - 262);
    if (dx <= 16) drawPixel(x, y, 1);
  }
}

// 2. Nẹp gáy lịch trên (Header block) - Bo góc tròn mềm mại
const topHeader = { x: 60, y: 84, w: 264, h: 64, r: 24 };
for (let y = topHeader.y; y < topHeader.y + topHeader.h; y++) {
  for (let x = topHeader.x; x < topHeader.x + topHeader.w; x++) {
    let dx = 0, dy = 0;
    if (x < topHeader.x + topHeader.r) dx = topHeader.x + topHeader.r - x;
    else if (x > topHeader.x + topHeader.w - topHeader.r) dx = x - (topHeader.x + topHeader.w - topHeader.r);

    if (y < topHeader.y + topHeader.r) dy = topHeader.y + topHeader.r - y;
    else if (y > topHeader.y + topHeader.h - topHeader.r) dy = y - (topHeader.y + topHeader.h - topHeader.r);

    if (Math.hypot(dx, dy) <= topHeader.r) {
      drawPixel(x, y, 1);
    }
  }
}

// 3. Khung thân tờ lịch (Calendar Page Body)
const body = { x: 60, y: 152, w: 264, h: 184, r: 24, stroke: 22 };
for (let y = body.y; y < body.y + body.h; y++) {
  for (let x = body.x; x < body.x + body.w; x++) {
    let dx = 0, dy = 0;
    if (x < body.x + body.r) dx = body.x + body.r - x;
    else if (x > body.x + body.w - body.r) dx = x - (body.x + body.w - body.r);

    if (y < body.y + body.r) dy = body.y + body.r - y;
    else if (y > body.y + body.h - body.r) dy = y - (body.y + body.h - body.r);

    const cornerDist = Math.hypot(dx, dy);
    if (cornerDist <= body.r) {
      const isBorder = (x < body.x + body.stroke || x > body.x + body.w - body.stroke || y > body.y + body.h - body.stroke);
      if (isBorder) {
        drawPixel(x, y, 1);
      }
    }
  }
}

// 4. Vầng trăng khuyết nghệ thuật ở giữa tờ lịch (Crescent Moon)
const moonCenter = { x: 192, y: 240 };
const rOuter = 58;
const rInner = 48;
const innerOffset = { x: 18, y: -10 };

for (let y = moonCenter.y - rOuter - 6; y <= moonCenter.y + rOuter + 6; y++) {
  for (let x = moonCenter.x - rOuter - 6; x <= moonCenter.x + rOuter + 6; x++) {
    const dOuter = Math.hypot(x - moonCenter.x, y - moonCenter.y);
    const dInner = Math.hypot(x - (moonCenter.x + innerOffset.x), y - (moonCenter.y + innerOffset.y));
    if (dOuter <= rOuter && dInner >= rInner) {
      drawPixel(x, y, 1);
    }
  }
}

// 5. Ngôi sao 4 cánh cát tường bên cạnh trăng
const star = { x: 148, y: 202, size: 16 };
for (let y = star.y - star.size; y <= star.y + star.size; y++) {
  for (let x = star.x - star.size; x <= star.x + star.size; x++) {
    const dx = Math.abs(x - star.x) / star.size;
    const dy = Math.abs(y - star.y) / star.size;
    // Phương trình astroid 4 cánh: dx^0.5 + dy^0.5 <= 1
    if (Math.sqrt(dx) + Math.sqrt(dy) <= 1) {
      drawPixel(x, y, 1);
    }
  }
}

// Downsample với bộ lọc Box Filter (Supersampling 4x -> 1x)
const png = new PNG({ width: TARGET_SIZE, height: TARGET_SIZE });
for (let ty = 0; ty < TARGET_SIZE; ty++) {
  for (let tx = 0; tx < TARGET_SIZE; tx++) {
    let sum = 0;
    for (let sy = 0; sy < SCALE; sy++) {
      for (let sx = 0; sx < SCALE; sx++) {
        sum += buffer[(ty * SCALE + sy) * W + (tx * SCALE + sx)];
      }
    }
    const avgAlpha = sum / (SCALE * SCALE);
    const idx = (ty * TARGET_SIZE + tx) << 2;
    png.data[idx] = 255;
    png.data[idx + 1] = 255;
    png.data[idx + 2] = 255;
    png.data[idx + 3] = Math.round(avgAlpha * 255);
  }
}

const outputPath = path.join(__dirname, '..', 'assets', 'notification-icon.png');
png.pack().pipe(fs.createWriteStream(outputPath)).on('finish', () => {
  console.log('✅ Đã tạo icon thông báo khử răng cưa siêu nét:', outputPath);
});
