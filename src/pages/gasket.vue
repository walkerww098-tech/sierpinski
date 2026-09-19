<template>
    <v-container fluid class="fill-height align-start">
        <v-row>
            <v-col cols="12" md="8">
                <v-card class="pa-4 text-center" elevation="2" min-height="400">
                    <v-card-title class="text-h6 font-weight-bold px-0 text-left">
                        シェルピンスキー・ガスケット
                    </v-card-title>
                    <v-divider class="mb-4"></v-divider>
                    <div class="d-flex justify-center align-center fill-height mt-4" style="background-color: black;">
                        <svg ref="svgRef" :width="svgsize" :height="svgsize" :viewBox="viewBox">
                            <rect x="0" y="0" :width="svgsize" :height="svgsize" fill="white" />
                            <template v-for="p in elements">
                                <polygon :points="trianglePoints(p)" :stroke="p.stroke" :fill="p.fill" />
                            </template>
                        </svg>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card class="pa-4" elevation="2">
                    <v-card-title class="text-h6 font-weight-bold px-0">
                        🎨 パラメーター
                    </v-card-title>
                    <v-divider class="mb-4"></v-divider>
                    <div class="text-caption mb-1">画像サイズ: {{ svgsize }}</div>
                    <v-slider v-model="svgsize" :min="100" :max="1000" step="10" thumb-label color="primary"
                        @update:modelValue="on_click" />
                    <div class="text-caption mb-1">三角サイズ: {{ triangle_r }}</div>
                    <v-slider v-model="triangle_r" :min="100" :max="980" step="10" thumb-label color="primary"
                        @update:modelValue="on_click" />
                    <div class="text-caption mb-1">Depth : {{ depth }}</div>
                    <v-slider v-model="depth" :min="2" :max="7" step="1" thumb-label color="primary"
                        @update:modelValue="on_click" />
                    <v-row style="font-size: medium;">
                        <v-col cols="6">
                            ダウンロード
                        </v-col>
                        <v-col cols="3">
                            <v-btn @click="downloadSvg" color="primary" block>SVG</v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn @click="downloadPng" color="primary" block>PNG</v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useApplicationStore } from '@/stores/applicationStore';
import { trianglePoints, type Circle, type Point, type Rect, type Triangle } from '@/lib/consts';

const app = useApplicationStore();

const elements = ref<Triangle[]>([]);
const svgsize = ref(600);
const viewBox = computed(() => {
    //return "-" + svgsize.value / 2 + " -" + svgsize.value / 2 +
    return "0 0  " + svgsize.value + " " + svgsize.value;
});
const svgRef = ref<SVGGraphicsElement | null>(null)

const triangle_r = ref(580);
const depth = ref(5);

onMounted(() => {
    draw();
});

const on_click = () => {
    draw();
}

const get_midpoint = (p1: Point, p2: Point) => {
    return { x: ((p1.x + p2.x) / 2), y: ((p1.y + p2.y) / 2) }
}

const sierpinski = (p1: Point, p2: Point, p3: Point, depth: number) => {
    if (depth == 0)
        return;
    const mid1 = get_midpoint(p1, p2);
    const mid2 = get_midpoint(p2, p3);
    const mid3 = get_midpoint(p3, p1);
    const triangle = { p1: mid1, p2: mid2, p3: mid3, stroke: "#000000", fill: "#FFFFFF" };
    elements.value.push(triangle);

    sierpinski(p1, mid1, mid3, depth - 1)
    sierpinski(mid1, p2, mid2, depth - 1)
    sierpinski(mid3, mid2, p3, depth - 1)
}

// メイン処理
const draw = () => {
    elements.value = [];
    const dx = Math.sqrt(3) * (triangle_r.value / 2);
    const offset_x = svgsize.value / 2;
    const offset_y = (svgsize.value - dx) / 2;
    const p1: Point = { x: offset_x, y: offset_y };
    const p2: Point = { x: (offset_x - (triangle_r.value / 2)), y: (offset_y + dx) };
    const p3: Point = { x: (offset_x + (triangle_r.value / 2)), y: (offset_y + dx) };
    const triangle = { p1: p1, p2: p2, p3: p3, stroke: "black", fill: "#000000" };
    elements.value.push(triangle);
    sierpinski(p1, p2, p3, depth.value);
}
const downloadSvg = () => {
    if (!svgRef.value)
        return
    // 1. SVGのDOMを文字列（XML）に変換
    const serializer = new XMLSerializer()
    let svgString = serializer.serializeToString(svgRef.value)
    // 2. 正しいXML名前空間（xmlns）が付与されているか確認（なければ追加）
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://w3.org"');
    }
    // 3. Blob（バイナリデータ）を作成
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    // 4. 一時的なダウンロード用のリンクを作成してクリック
    const link = document.createElement('a')
    link.href = url
    link.download = `fol-${Date.now()}.svg` // ファイル名
    document.body.appendChild(link)
    link.click()
    // 5. 後片付け（メモリ解放と要素削除）
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
const downloadPng = () => {
    if (!svgRef.value)
        return

    // 1. SVGのDOMを文字列（XML）に変換
    const serializer = new XMLSerializer()
    let svgString = serializer.serializeToString(svgRef.value)
    // 名前の空間の修正（既存のコードの修正：正しいURLに変更）
    if (!svgString.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        svgString = svgString.replace(/^<svg/, '<svg xmlns="http://w3.org"');
    }
    // 2. サイズ
    const width = svgsize.value;
    const height = svgsize.value;
    // 3. BlobおよびURLを作成
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(blob)
    // 4. Imageオブジェクトを使ってCanvasに描画
    const img = new Image()
    img.onload = () => {
        // 仮想Canvasの作成
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
            // 背景を透明（または白）にしてSVGを描画
            ctx.drawImage(img, 0, 0, width, height)
            // 5. CanvasからPNGのData URLを生成
            const pngUrl = canvas.toDataURL('image/png')
            // 6. ダウンロード用のリンクを作成してクリック
            const link = document.createElement('a')
            link.href = pngUrl
            link.download = `fol-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            // 7. 後片付け
            document.body.removeChild(link)
        }
        URL.revokeObjectURL(svgUrl)
    }

    img.onerror = () => {
        console.error('画像の読み込みに失敗しました。')
        URL.revokeObjectURL(svgUrl)
    }
    // Imageの読み込みを開始
    img.src = svgUrl
}
</script>
