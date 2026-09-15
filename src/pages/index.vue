<template>
    <v-container fluid class="fill-height align-start">
        <v-row>
            <v-col cols="12" md="8">
                <v-card class="pa-4 text-center" elevation="2" min-height="400">
                    <v-card-title class="text-h6 font-weight-bold px-0 text-left">
                        シェルピンスキー・カーペット
                    </v-card-title>
                    <v-divider class="mb-4"></v-divider>
                    <div class="d-flex justify-center align-center fill-height mt-4" style="background-color: black;">
                        <svg ref="svgRef" :width="svgsize" :height="svgsize" :viewBox="viewBox">
                            <template v-for="p in elements">
                                <rect :x="p.x" :y="p.y" :width="p.width" :height="p.height" :fill="p.fill" />
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
                    <div class="text-caption mb-1">Depth : {{ depth }}</div>
                    <v-slider v-model="depth" :min="2" :max="7" step="1" thumb-label color="primary"
                        @update:modelValue="on_click" />
                    <button @click="download">ダウンロード</button>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import type { Circle, Rect } from '@/lib/consts';
import { useApplicationStore } from '@/stores/applicationStore';

const app = useApplicationStore();

const elements = ref<Rect[]>([]);
const svgsize = ref(600);
const viewBox = computed(() => {
    //return "-" + svgsize.value / 2 + " -" + svgsize.value / 2 +
    return "0 0  " + svgsize.value + " " + svgsize.value;
});
const svgRef = ref<SVGGraphicsElement | null>(null)

// 1. 設定値
const offset_x = 0;
const offset_y = 0;
const carpet_size = 600;
const depth = ref(4);

onMounted(() => {
    elements.value = [];
    draw(offset_x, offset_y, carpet_size, depth.value);
});

const on_click = () => {
    elements.value = [];
    draw(offset_x, offset_y, carpet_size, depth.value);
}

const download = () => {
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

// 再帰関数：正方形を9分割して中央を白でくり抜く
const draw = (x: number, y: number, size: number, depth: number) => {
    if (depth == 0)
        return;
    // 次の階層の1辺の長さを計算（3分割）
    const next_size = size / 3;
    // 中央の正方形の左上座標を計算
    const center_x = x + next_size;
    const center_y = y + next_size
    // 中央の正方形を白(#ffffff)で塗りつぶすタグを追加
    elements.value.push({ x: center_x, y: center_y, width: next_size, height: next_size, fill: "#ffffff", stroke: "white", stroke_width: 1 });

    // 上段3つ
    draw(x, y, next_size, depth - 1);
    draw(x + next_size, y, next_size, depth - 1);
    draw(x + next_size * 2, y, next_size, depth - 1);
    // 中段2つ（中央はくり抜いたので除く）
    draw(x, y + next_size, next_size, depth - 1)
    draw(x + next_size * 2, y + next_size, next_size, depth - 1)
    // 下段3つ
    draw(x, y + next_size * 2, next_size, depth - 1)
    draw(x + next_size, y + next_size * 2, next_size, depth - 1)
    draw(x + next_size * 2, y + next_size * 2, next_size, depth - 1)
}
</script>
