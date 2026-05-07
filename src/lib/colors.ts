// Minimal K-Means implementation to extract distinct palettes from a scaled down image
export const extractPalettes = async (imgFile: Blob): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(imgFile);

        img.onload = () => {
            URL.revokeObjectURL(url);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('No canvas context');

            // Scale down image for fast processing
            const MAX_SIZE = 100;
            let width = img.width;
            let height = img.height;
            if (width > height) {
                if (width > MAX_SIZE) {
                    height = Math.round((height * MAX_SIZE) / width);
                    width = MAX_SIZE;
                }
            } else {
                if (height > MAX_SIZE) {
                    width = Math.round((width * MAX_SIZE) / height);
                    height = MAX_SIZE;
                }
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const imgData = ctx.getImageData(0, 0, width, height).data;
            const pixels: [number, number, number][] = [];

            for (let i = 0; i < imgData.length; i += 4) {
                // Skip highly transparent pixels or pure white/black to avoid muted palettes if possible
                if (imgData[i + 3] > 128) {
                    pixels.push([imgData[i], imgData[i + 1], imgData[i + 2]]);
                }
            }

            // Generate 3 palettes: a 3-color, 4-color, and 5-color palette
            const palettes: string[][] = [];

            const p3 = kMeans(pixels, 3);
            const p4 = kMeans(pixels, 4);
            const p5 = kMeans(pixels, 5);

            palettes.push(p3.map(c => rgbToHex(c[0], c[1], c[2])));
            // Sometimes kMeans returns fewer if color space is small, so we use max available
            if (p4.length > 3) palettes.push(p4.map(c => rgbToHex(c[0], c[1], c[2])));
            if (p5.length > 4) palettes.push(p5.map(c => rgbToHex(c[0], c[1], c[2])));

            // Fallback
            if (palettes.length === 0) {
                palettes.push(['#ff0000', '#00ff00', '#0000ff']);
            }
            resolve(palettes);
        };

        img.onerror = () => reject('Failed to load image');
        img.src = url;
    });
};

const distSq = (p1: number[], p2: number[]) => {
    return Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2) + Math.pow(p1[2] - p2[2], 2);
};

const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};

const kMeans = (pixels: number[][], k: number, maxIter: number = 10): number[][] => {
    if (pixels.length < k) return pixels;

    // Randomly initialize centroids
    let centroids: number[][] = [];
    let available = [...pixels];
    for (let i = 0; i < k; i++) {
        const idx = Math.floor(Math.random() * available.length);
        centroids.push(available[idx]);
        available.splice(idx, 1);
    }

    let assignments = new Array(pixels.length).fill(0);

    for (let iter = 0; iter < maxIter; iter++) {
        let changed = false;

        // Assign pixels to nearest centroid
        for (let i = 0; i < pixels.length; i++) {
            let minDist = Infinity;
            let minIdx = 0;
            for (let j = 0; j < k; j++) {
                const d = distSq(pixels[i], centroids[j]);
                if (d < minDist) {
                    minDist = d;
                    minIdx = j;
                }
            }
            if (assignments[i] !== minIdx) {
                assignments[i] = minIdx;
                changed = true;
            }
        }

        if (!changed) break;

        // Update centroids
        const sums = Array.from({ length: k }, () => [0, 0, 0, 0]); // r, g, b, count
        for (let i = 0; i < pixels.length; i++) {
            const cIdx = assignments[i];
            sums[cIdx][0] += pixels[i][0];
            sums[cIdx][1] += pixels[i][1];
            sums[cIdx][2] += pixels[i][2];
            sums[cIdx][3]++;
        }

        for (let i = 0; i < k; i++) {
            if (sums[i][3] > 0) {
                centroids[i] = [
                    sums[i][0] / sums[i][3],
                    sums[i][1] / sums[i][3],
                    sums[i][2] / sums[i][3]
                ];
            }
        }
    }

    // Return non-empty centroids
    return centroids.filter((c, i) => assignments.includes(i));
};
