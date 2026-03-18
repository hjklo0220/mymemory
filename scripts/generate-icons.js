#!/usr/bin/env node
/**
 * PWA 아이콘 생성 스크립트 (외부 의존성 없음)
 * 실행: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 테이블
function makeCRCTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  return table;
}
const CRC_TABLE = makeCRCTable();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

function createPNG(size) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // RGB

  // 픽셀 데이터 (dark bg + 간단한 "M" 그리기)
  const BG = [17, 24, 39];    // #111827
  const FG = [99, 102, 241];  // #6366f1 (indigo)

  const rowSize = 1 + size * 3;
  const rawData = Buffer.alloc(size * rowSize, 0);

  // 배경 채우기
  for (let y = 0; y < size; y++) {
    rawData[y * rowSize] = 0; // filter
    for (let x = 0; x < size; x++) {
      const i = y * rowSize + 1 + x * 3;
      rawData[i]     = BG[0];
      rawData[i + 1] = BG[1];
      rawData[i + 2] = BG[2];
    }
  }

  // 둥근 사각형 테두리 효과 (단순히 안쪽 영역을 조금 밝게)
  const pad = Math.floor(size * 0.1);
  for (let y = pad; y < size - pad; y++) {
    for (let x = pad; x < size - pad; x++) {
      const i = y * rowSize + 1 + x * 3;
      rawData[i]     = 30;
      rawData[i + 1] = 41;
      rawData[i + 2] = 59;
    }
  }

  // "M" 글자 그리기 (픽셀 폰트 방식)
  const letterSize = Math.floor(size * 0.5);
  const startX = Math.floor((size - letterSize) / 2);
  const startY = Math.floor((size - letterSize) / 2);
  const strokeW = Math.max(2, Math.floor(letterSize * 0.12));

  // M 왼쪽 수직선
  for (let y = 0; y < letterSize; y++) {
    for (let s = 0; s < strokeW; s++) {
      const px = startX + s;
      const py = startY + y;
      const i = py * rowSize + 1 + px * 3;
      rawData[i] = FG[0]; rawData[i+1] = FG[1]; rawData[i+2] = FG[2];
    }
  }
  // M 오른쪽 수직선
  for (let y = 0; y < letterSize; y++) {
    for (let s = 0; s < strokeW; s++) {
      const px = startX + letterSize - strokeW + s;
      const py = startY + y;
      const i = py * rowSize + 1 + px * 3;
      rawData[i] = FG[0]; rawData[i+1] = FG[1]; rawData[i+2] = FG[2];
    }
  }
  // M 왼쪽 대각선 (위 → 중앙)
  for (let y = 0; y < Math.floor(letterSize * 0.5); y++) {
    const x = startX + Math.floor(y * 0.5);
    for (let s = 0; s < strokeW; s++) {
      const py = startY + y;
      const px = x + s;
      if (px < size && py < size) {
        const i = py * rowSize + 1 + px * 3;
        rawData[i] = FG[0]; rawData[i+1] = FG[1]; rawData[i+2] = FG[2];
      }
    }
  }
  // M 오른쪽 대각선 (중앙 → 위)
  for (let y = 0; y < Math.floor(letterSize * 0.5); y++) {
    const x = startX + letterSize - Math.floor(y * 0.5) - strokeW;
    for (let s = 0; s < strokeW; s++) {
      const py = startY + y;
      const px = x + s;
      if (px >= 0 && px < size && py < size) {
        const i = py * rowSize + 1 + px * 3;
        rawData[i] = FG[0]; rawData[i+1] = FG[1]; rawData[i+2] = FG[2];
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  return Buffer.concat([sig, makeChunk('IHDR', ihdr), makeChunk('IDAT', compressed), makeChunk('IEND', Buffer.alloc(0))]);
}

const iconsDir = path.join(__dirname, '../web/public/icons');
fs.mkdirSync(iconsDir, { recursive: true });

fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), createPNG(192));
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), createPNG(512));

console.log('✓ icon-192.png 생성 완료');
console.log('✓ icon-512.png 생성 완료');
