# PROMIDAS Demo

React SPAデモサイト - PROMIDASを使用してProtoPediaデータを取得・表示します。

## 概要

このプロジェクトは、[PROMIDAS](https://github.com/F88/promidas) (ProtoPedia Resource Organized Management In-memory Data Access Store)を使用したデモアプリケーションです。

PROMIDASの`createProtopediaInMemoryRepository`を利用して、ProtoPedia APIからプロトタイプデータを取得し、インメモリキャッシュで管理します。

## 技術スタック

- **React** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Vite** - 高速ビルドツール
- **Vitest** - テストフレームワーク
- **PROMIDAS** - ProtoPediaデータ管理ライブラリ

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで <http://localhost:5173/> を開きます。

### 3. APIトークンの設定

初回起動時に設定画面が表示されます。

1. [ProtoPedia設定ページ](https://protopedia.net/settings/application)でAPIトークンを取得
2. 設定画面の入力欄にトークンを貼り付け
3. "Save Token"ボタンをクリック

トークンはブラウザのLocalStorageに保存されます。設定画面は右上の⚙️ボタンからいつでも開けます。

## 使い方

1. "Show Random Prototype"ボタンをクリック
2. ProtoPediaからランダムにプロトタイプを取得して表示
3. プロトタイプの詳細情報(画像、タグ、チーム名など)を確認
4. "View on ProtoPedia"リンクから元のページへアクセス可能

## 主な機能

### APIトークン管理

- LocalStorageでトークンを安全に保存
- 設定画面からトークンの登録・削除が可能
- トークン未設定時は自動的に設定画面を表示

### データ取得とキャッシング

- `createProtopediaInMemoryRepository`によるインメモリストレージ
- TTL: 30分
- 最大ペイロードサイズ: 30 MiB
- 自動的なスナップショット管理

### カスタムフック

- `useRandomPrototype` - ランダムなプロトタイプ取得
- `usePrototypeById` - IDによるプロトタイプ取得

## テスト

```bash
# テスト実行
npm test

# UIモードでテスト
npm run test:ui

# カバレッジ確認
npm run test:coverage
```

## ビルド

```bash
npm run build
```

ビルドされたファイルは`dist/`ディレクトリに出力されます。

## プロジェクト構成

```text
src/
├── components/          # Reactコンポーネント
│   ├── PrototypeCard.tsx
│   ├── PrototypeCard.css
│   ├── Settings.tsx
│   └── Settings.css
├── hooks/              # カスタムReact Hooks
│   └── usePrototype.ts
├── lib/                # ユーティリティ
│   ├── protopedia-repository.ts
│   └── token-storage.ts
├── test/               # テストファイル
│   ├── setup.ts
│   └── PrototypeCard.test.tsx
├── App.tsx             # メインアプリ
├── App.css
├── main.tsx            # エントリーポイント
└── index.css
```

## ライセンス

MIT

## 関連リンク

- [PROMIDAS](https://github.com/F88/promidas)
- [ProtoPedia](https://protopedia.net/)
- [ProtoPedia API v2](https://protopediav2.docs.apiary.io/)
