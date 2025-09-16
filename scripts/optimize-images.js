const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 이미지 최적화 함수
async function optimizeImage(inputPath, outputPath, format = 'webp', options = {}) {
  try {
    const { width = 800, height = 600, quality = 80, effort = 6 } = options;

    await sharp(inputPath)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toFormat(format, {
        quality,
        effort,
      })
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const savings = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1);

    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% 절약)`);
    return { originalSize, optimizedSize, savings: parseFloat(savings) };
  } catch (error) {
    console.error(`❌ ${inputPath} 최적화 실패:`, error.message);
    return null;
  }
}

// 다중 포맷 최적화 함수
async function optimizeImageMultipleFormats(inputPath, baseOutputPath) {
  const results = [];

  // WebP 최적화
  const webpPath = baseOutputPath.replace(/\.[^.]+$/, '.webp');
  const webpResult = await optimizeImage(inputPath, webpPath, 'webp', { quality: 85 });
  if (webpResult) results.push({ format: 'webp', ...webpResult });

  // AVIF 최적화 (더 나은 압축률)
  const avifPath = baseOutputPath.replace(/\.[^.]+$/, '.avif');
  const avifResult = await optimizeImage(inputPath, avifPath, 'avif', { quality: 80 });
  if (avifResult) results.push({ format: 'avif', ...avifResult });

  return results;
}

// 배너 이미지들 최적화
const bannerImages = ['tuny1.png', 'tuny2.png', 'tuny3.png', 'tuny4.png', 'tuny5.png'];

// 프로필 이미지들 최적화
const profileImages = [
  'default-profile.png',
  'cat-profile.png',
  'dog-profile.png',
  'duck-profile.png',
  'elephant-profile.png',
  'penguin-profile.png',
  'rabbit-profiile.png',
];

// 아이콘들 최적화
const iconImages = [
  'bell.png',
  'notification-new.png',
  'notification-normal.png',
  'friends.png',
  'matching.png',
  'report.png',
  'sorry.png',
  'talking.png',
];

async function optimizeAllImages() {
  console.log('🚀 이미지 최적화 시작...\n');

  const allResults = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  // 배너 이미지들 (높은 품질)
  console.log('📸 배너 이미지 최적화:');
  for (const image of bannerImages) {
    const inputPath = `public/images/${image}`;
    if (fs.existsSync(inputPath)) {
      const results = await optimizeImageMultipleFormats(inputPath, inputPath);
      allResults.push(...results);
      if (results.length > 0) {
        totalOriginalSize += results[0].originalSize;
        totalOptimizedSize += results[0].optimizedSize;
      }
    }
  }

  // 프로필 이미지들 (중간 품질)
  console.log('\n👤 프로필 이미지 최적화:');
  for (const image of profileImages) {
    const inputPath = `public/images/${image}`;
    if (fs.existsSync(inputPath)) {
      const results = await optimizeImageMultipleFormats(inputPath, inputPath);
      allResults.push(...results);
      if (results.length > 0) {
        totalOriginalSize += results[0].originalSize;
        totalOptimizedSize += results[0].optimizedSize;
      }
    }
  }

  // 아이콘들 (낮은 품질, 작은 크기)
  console.log('\n🔔 아이콘 최적화:');
  for (const image of iconImages) {
    const inputPath = `public/images/${image}`;
    if (fs.existsSync(inputPath)) {
      const results = await optimizeImageMultipleFormats(inputPath, inputPath);
      allResults.push(...results);
      if (results.length > 0) {
        totalOriginalSize += results[0].originalSize;
        totalOptimizedSize += results[0].optimizedSize;
      }
    }
  }

  // 배경 이미지 (높은 품질)
  console.log('\n🎨 배경 이미지 최적화:');
  const bgInputPath = 'public/images/bg.png';
  if (fs.existsSync(bgInputPath)) {
    const results = await optimizeImageMultipleFormats(bgInputPath, bgInputPath);
    allResults.push(...results);
    if (results.length > 0) {
      totalOriginalSize += results[0].originalSize;
      totalOptimizedSize += results[0].optimizedSize;
    }
  }

  // 결과 요약
  const totalSavings =
    totalOriginalSize > 0
      ? (((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)
      : 0;

  console.log('\n📊 최적화 결과 요약:');
  console.log(`📁 원본 총 크기: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📁 최적화 후 크기: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 총 절약: ${totalSavings}%`);
  console.log(`🎯 생성된 포맷: WebP, AVIF`);

  console.log('\n🎉 이미지 최적화 완료!');
  console.log('💡 이제 컴포넌트에서 .webp 또는 .avif 확장자로 변경하세요.');
  console.log('🔧 Next.js가 자동으로 최적의 포맷을 선택합니다.');
}

// 스크립트 실행
if (require.main === module) {
  optimizeAllImages().catch(console.error);
}

module.exports = { optimizeImage, optimizeAllImages };
