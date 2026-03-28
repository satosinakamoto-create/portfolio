# images/

ポートフォリオで使用する画像を管理するフォルダです。

## フォルダ構成

```
images/
├── poster/      ポスター・POP作品
├── menu/        メニューデザイン作品
├── logo/        ロゴデザイン作品
├── web/         Webサイト・アプリのスクリーンショット
└── spatial/     空間デザイン・撮影作品
```

## 画像の命名規則

```
{カテゴリ}_{番号}_{説明}.jpg
例: poster_01_takoyaki-a1.jpg
    menu_01_grand-menu-inside.jpg
    logo_01_takosuke-variations.jpg
```

## 推奨サイズ

| 用途               | サイズ      | 容量目安   |
|--------------------|-------------|------------|
| サムネイル          | 800×600px   | 100KB以下  |
| ライトボックス表示  | 1600×1200px | 300KB以下  |
| Webスクリーンショット | 1920×1080px | 300KB以下  |

## Cloudinaryを使う場合

画像をCloudinaryにアップロードしてURLを取得し、
main.js の GALLERY_DATA に記述してください。
このフォルダには画像を置かなくてもOKです。
