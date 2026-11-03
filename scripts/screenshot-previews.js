import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const output = path.resolve(process.argv[2] || 'previews');
const browser = await chromium.launch();
try {
    for (const theme of ['light', 'dark']) {
        const page = await browser.newPage({ viewport: { width: 1040, height: 800 }, colorScheme: theme });
        await page.route('https://**/*', route => route.abort());
        for (const mode of ['list', 'table', 'svg', 'index']) {
            await page.goto(pathToFileURL(path.join(output, `${mode}.html`)).href);
            await page.evaluate(() => document.fonts.ready);
            if (mode === 'svg') assert.equal(await page.locator('img').evaluate(image => image.complete && image.naturalWidth > 0), true);
            await page.screenshot({ path: path.join(output, `${mode}-${theme}.png`), fullPage: true });
        }
        await page.goto(pathToFileURL(path.join(output, 'activity.svg')).href);
        const layout = await page.locator('svg').evaluate(svg => ({
            width: svg.viewBox.baseVal.width,
            height: svg.viewBox.baseVal.height,
            boxes: [...svg.querySelectorAll('text')].map(text => {
                const { x, y, width, height } = text.getBBox();
                return { x, y, width, height, text: text.textContent };
            })
        }));
        assert.ok(layout.boxes.every(box => box.x >= 0 && box.x + box.width <= layout.width && box.y >= 0 && box.y + box.height <= layout.height), 'SVG text must stay inside the image');
        for (let index = 1; index < layout.boxes.length; index++) {
            assert.ok(layout.boxes[index].y >= layout.boxes[index - 1].y + layout.boxes[index - 1].height, 'SVG lines must not overlap');
        }
        fs.writeFileSync(path.join(output, `svg-layout-${theme}.json`), JSON.stringify(layout, null, 2));
        await page.close();
    }
    console.log('Light/dark screenshots captured; SVG bounds and line spacing verified.');
} finally {
    await browser.close();
}
