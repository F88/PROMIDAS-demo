# Development Guide

PROMIDAS Playground の開発者向けドキュメント

## 技術スタック

### Core

- **React 19** - UIライブラリ
- **TypeScript 5.9** - 型安全な開発
- **Vite 7** - 高速ビルドツール

### UI Framework

- **Material-UI (MUI) 7** - Reactコンポーネントライブラリ
- **Emotion** - CSS-in-JS

### Data Management

- **PROMIDAS** - ProtoPediaデータ管理ライブラリ
- **ProtoPedia API v2 Client** - APIクライアント

### Testing & Documentation

- **Vitest 4** - テストフレームワーク
- **Testing Library** - Reactコンポーネントテスト
- **Storybook 10** - UIコンポーネントドキュメント

### Code Quality

- **Prettier** - コードフォーマッター
- **ESLint 9** - 静的解析
- **TypeScript ESLint** - TypeScript用Lintルール

## セットアップ

### 前提条件

- Node.js >= 20

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで <http://localhost:5173/> を開きます。

## 利用可能なスクリプト

### 開発

```bash
# 開発サーバー起動
npm run dev

# Storybook起動
npm run storybook
```

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドのプレビュー
npm run preview

# Storybookビルド
npm run build-storybook
```

### テスト

```bash
# テスト実行
npm test

# UIモードでテスト
npm run test:ui

# カバレッジ確認
npm run test:coverage
```

### コード品質

```bash
# フォーマット
npm run format

# フォーマットチェック
npm run format:check

# Lint
npm run lint

# Lint自動修正
npm run lint:fix
```

### デプロイ

```bash
# GitHub Pagesにデプロイ
npm run deploy
```

## プロジェクト構成

```text
src/
├── components/              # Reactコンポーネント
│   ├── common/             # 共通コンポーネント
│   │   ├── app-header.tsx          # ヘッダー(統計ダッシュボード)
│   │   ├── data-flow-indicator.tsx # データフローインジケーター
│   │   ├── stats-dashboard.tsx     # 統計情報表示
│   │   ├── prototype-card.tsx      # プロトタイプカード
│   │   ├── section-card.tsx        # セクションカード
│   │   └── *.stories.tsx           # Storybookストーリー
│   ├── config/             # 設定コンポーネント
│   │   ├── token-configuration.tsx # トークン設定
│   │   └── repository-settings.tsx # リポジトリ設定
│   ├── fetcher/            # Fetcherコンポーネント
│   ├── store/              # Storeコンポーネント
│   └── repository/         # Repositoryコンポーネント
├── hooks/                  # カスタムReact Hooks
│   ├── use-config.ts              # 設定取得
│   ├── use-header-stats.ts        # ヘッダー統計
│   ├── use-store-stats.ts         # Store統計
│   ├── use-random-prototype.ts    # ランダム取得
│   ├── use-prototype-search.ts    # ID検索
│   ├── use-all-prototypes.ts      # 全件取得
│   ├── use-prototype-analysis.ts  # 分析機能
│   ├── use-snapshot-management.ts # スナップショット管理
│   ├── use-data-flow-indicators.ts # データフロー状態管理
│   └── use-repository-events.ts   # リポジトリイベント監視
├── lib/                    # コアロジック
│   ├── repository/         # リポジトリ管理
│   │   ├── protopedia-repository.ts # PROMIDAS統合
│   │   ├── repository-config.ts     # 設定管理
│   │   └── repository-settings.ts   # 設定値定義
│   └── token/             # トークン管理
│       └── token-storage.ts        # SessionStorage操作
├── utils/                  # ユーティリティ
│   ├── number-utils.ts            # 数値フォーマット
│   ├── time-utils.ts              # 時刻フォーマット
│   ├── snapshot-error-utils.ts    # エラー処理
│   └── store-state-utils.ts       # ステート判定
├── test/                   # テストファイル
│   ├── setup.ts
│   └── *.test.tsx
├── App.tsx                 # メインアプリケーション
├── main.tsx                # エントリーポイント
└── theme.ts                # MUIテーマ設定
```

## アーキテクチャ

### データフロー

```text
Fetcher → Store → Repository → Display
  ↓        ↓         ↓           ↓
 API   InMemory   PROMIDAS      UI
       Cache      Repository
```

### 主要なカスタムフック

#### データ取得系

- `useRandomPrototype` - ランダムなプロトタイプ取得
- `useSingleRandom` - 複数のランダムプロトタイプ取得
- `usePrototypeSearch` - IDによるプロトタイプ検索
- `useAllPrototypes` - 全プロトタイプ取得
- `usePrototypeAnalysis` - データ分析

#### 管理系

- `useSnapshotManagement` - スナップショット管理
- `useConfig` - リポジトリ設定管理
- `useHeaderStats` - ヘッダー統計情報
- `useStoreStats` - ストア統計情報

#### イベント・状態管理

- `useRepositoryEvents` - リポジトリイベント監視
- `useDataFlowIndicators` - データフロー可視化
- `useDownloadProgress` - ダウンロード進捗管理

### PROMIDASリポジトリ設定

デフォルト設定は[src/lib/repository/repository-settings.ts](src/lib/repository/repository-settings.ts)で定義:

```typescript
{
  ttl: 30_000,           // キャッシュTTL: 30秒
  maxPayload: 30 * 1024, // 最大ペイロード: 30 MiB
  limit: 10,             // デフォルト取得件数
  offset: 0              // デフォルトオフセット
}
```

### イベントシステム

PROMIDASリポジトリは以下のイベントを発火:

- `request-start` - API リクエスト開始
- `request-end` - API リクエスト終了
- `snapshot-setup-complete` - スナップショット作成完了
- `snapshot-refresh-complete` - スナップショット更新完了

これらのイベントは`useRepositoryEvents`でリッスンし、データフロー可視化に利用されます。

## テスト戦略

### 単体テスト

- カスタムフックのテスト: `hooks/__tests__/`
- ユーティリティ関数のテスト: `utils/__tests__/`
- リポジトリロジックのテスト: `lib/__tests__/`

### コンポーネントテスト

- React Testing Libraryを使用
- `test/`ディレクトリに配置

### ビジュアルテスト

- Storybookでコンポーネントの視覚的な確認
- `*.stories.tsx`ファイルで定義

## スタイリング

### MUIテーマ

[src/theme.ts](src/theme.ts)でMUIテーマをカスタマイズ:

- プライマリカラー: `#667eea`
- セカンダリカラー: `#764ba2`
- ボタン: 角丸8px、テキスト変換なし
- Paper: 角丸12px

### カラースキーム

- ヘッダー背景: `#37474f` (ダークグレー)
- PromidasInfoSection背景: 設定可能
- フッター背景: 設定可能

## ビルドとデプロイ

### GitHub Pages

プロジェクトは自動的にGitHub Pagesにデプロイされます:

```bash
npm run deploy
```

ビルド成果物は`dist/`ディレクトリに生成され、`gh-pages`ブランチにプッシュされます。

### 環境変数

特別な環境変数は不要です。APIトークンはSessionStorageで管理されます。

## トラブルシューティング

### APIトークンが保存されない

SessionStorageはプライベートブラウジングモードで動作しない場合があります。通常のブラウジングモードで試してください。

### TTLの更新が反映されない

Repository Settingsを変更した後は、リポジトリを再初期化するためにページをリロードしてください。

### テストが失敗する

```bash
# キャッシュをクリア
npm run test -- --clearCache

# 再実行
npm test
```

## 貢献

1. フォークしてブランチを作成
2. 変更を加える
3. テストとLintを実行
4. プルリクエストを作成

## 関連ドキュメント

- [README.md](README.md) - ユーザー向けドキュメント
- [PROMIDAS](https://github.com/F88/promidas) - コアライブラリ
- [ProtoPedia API v2](https://protopediav2.docs.apiary.io/) - API仕様
