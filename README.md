# Wedding Video - Netflix Style (Sample)

Remotion で作る Netflix 風ウェディングプロフィールムービーのサンプルです。
個人情報はすべて架空のサンプルデータに置き換えてあります。

## Demo

[![Demo](https://img.youtube.com/vi/m1QOu5P80R0/maxresdefault.jpg)](https://www.youtube.com/watch?v=m1QOu5P80R0)

## Getting Started

```bash
npm install
npm start          # Remotion Studio でプレビュー
npm run build      # 動画を out/v2-netflix-sample.mp4 に書き出し
npm run build:hq   # 高画質版 (CRF 18)
```

## カスタマイズ方法

自分たちの情報に書き換えて使う場合、編集するファイルは主に **2つ** です。

### 1. `src/videos/data/profile.json` — メインのデータファイル

すべての写真パス・コメント・名前・日付・ナビゲーション項目・ホーム画面の表示テキストがここに集約されています。
コンポーネントファイルの編集は基本的に不要で、このファイルだけでカスタマイズが完結します。

| セクション | 内容 | 編集ポイント |
|---|---|---|
| `act1.nav` | ナビゲーションバー | `items`（メニュー項目）、`avatarLabel` を変更 |
| `act1.signIn` | サインイン画面 | `email`, `checkboxLabel`, `gridImages` を編集 |
| `act1.profiles` | プロフィール選択画面 | `name` と `avatar`（アバター画像パス）を変更 |
| `act1.detailModal` | 新郎の詳細モーダル | `title`, `date`, `description`, `tags`, `backgroundImage` を編集 |
| `act1.brideDetailModal` | 新婦の詳細モーダル | 同上 |
| `act1.ourDetailModal` | 二人の詳細モーダル | 同上 |
| `act2` | 新郎パート | `home`（ホーム画面の表示名・説明）、`chapterName`, `photos` 配列を編集 |
| `act3` | 新婦パート | 同上 |
| `act4` | 二人パート | 同上 |
| `act5.credits` | エンディング | `messages`, `filmStripPhotos`, `backgroundPhoto` を編集 |
| `act5.toBeContinued` | 最後の1枚 | `photo` を変更 |
| `videoConfig` | 動画設定 | `durationInFrames` を写真枚数に応じて調整 |
| `audio` | BGM設定 | `bgm` のパスをフリー音源に差し替え |

#### 写真の追加方法

1. 写真を `public/photos/` 以下に配置（例: `public/photos/groom/photo1.jpg`）
2. `profile.json` の該当セクションの `photos` 配列にパスを追加（`public/photos/` 以降のパスを記載）

#### スライドの種類

`photos` 配列の各エントリは以下の形式をサポートしています:

```jsonc
// 単一写真 + コメント
{
  "photo": "groom/photo1.jpg",
  "comment": "コメントテキスト",
  "duration": 180  // フレーム数 (30fps なので 180 = 6秒)
}

// 動画 + コメント（背景にphotoを指定）
{
  "video": "groom/video1.mp4",
  "photo": "groom/photo1.jpg",  // 背景ぼかし用
  "comment": "コメントテキスト",
  "duration": 180
}

// 複数写真散らばり配置 (scattered)
{
  "type": "scattered",
  "photos": ["groom/p1.jpg", "groom/p2.jpg", "groom/p3.jpg", "groom/p4.jpg"],
  "comment": "コメントテキスト",
  "duration": 200
}

// 複数写真グリッド配置 (grid)
{
  "type": "grid",
  "photos": ["groom/p1.jpg", "groom/p2.jpg", "groom/p3.jpg", "groom/p4.jpg"],
  "comment": "コメントテキスト",
  "duration": 200
}
```

### 2. 音声ファイルの差し替え

| ファイル | 用途 | 差し替え方法 |
|---|---|---|
| `public/audio/click-sound.mp3` | ボタンクリック音 | お好みの効果音に差し替え |
| `public/audio/keyboard-sound.mp3` | タイピング音 | 同上 |
| `public/audio/intro-sound.mp3` | イントロ音楽 | 同上 |
| `public/audio/tv-power-on.mp3` | TV起動音 | 同上 |
| `public/sample/audio/groom-bgm.mp3` | 新郎BGM | フリー音源に差し替え |
| `public/sample/audio/bride-bgm.mp3` | 新婦BGM | フリー音源に差し替え |
| `public/sample/audio/couple-bgm.mp3` | 二人パートBGM | フリー音源に差し替え |
| `public/sample/audio/ending-bgm.mp3` | エンディングBGM | フリー音源に差し替え |
| `public/sample/audio/bgm.mp3` | 汎用BGM | フリー音源に差し替え |

### 3. ロゴの差し替え

`public/photos/logos/` 内の PNG ファイルを差し替えることで、タイトルロゴをカスタマイズできます。

| ファイル | 用途 |
|---|---|
| `wedding_flix.png` | メインロゴ（サインイン画面、ナビバー等） |
| `grooms_story.png` | 新郎ストーリーのタイトルロゴ |
| `brides_story.png` | 新婦ストーリーのタイトルロゴ |
| `our_story.png` | 二人のストーリーのタイトルロゴ |

### 4. イントロ動画

`public/sample/opening/living_room.mp4` を差し替えることで、冒頭のTV起動シーンをカスタマイズできます。

## durationInFrames の計算

写真を追加・削除した場合、`videoConfig.durationInFrames` の調整が必要です。
Remotion Studio (`npm start`) でプレビューし、動画の最終フレームを確認して設定してください。

## Tech Stack

- [Remotion](https://www.remotion.dev/) — React で動画を作るフレームワーク
- React + TypeScript

## License

MIT
