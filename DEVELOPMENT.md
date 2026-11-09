# Development Guide

PROMIDAS Playground の開発者向けドキュメント

## 技術スタック

### Core

- **React 19** - UIライブラリ
- **TypeScript 5.9** - 型安全な開発
- **Vite 8** - 高速ビルドツール

### UI Framework

- **Material-UI (MUI) 9** - Reactコンポーネントライブラリ
- **Emotion** - CSS-in-JS

### Data Management

- **PROMIDAS** - ProtoPediaデータ管理ライブラリ
- **ProtoPedia API v2 Client** - APIクライアント

### Testing & Documentation

- **Vitest 5** - テストフレームワーク
- **Testing Library** - Reactコンポーネントテスト
- **Storybook 10** - UIコンポーネントドキュメント

### Code Quality

- **Prettier** - コードフォーマッター
- **ESLint 10** - 静的解析
- **TypeScript ESLint** - TypeScript用Lintルール

## セットアップ

### 前提条件

- Node.js >= 22

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで <http://localhost:5173/PROMIDAS-demo/> を開きます。

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

`main` ブランチに push すると、GitHub Actions が GitHub Pages に自動でデプロイします。詳しくは [ビルドとデプロイ](#ビルドとデプロイ) を参照してください。

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
│   ├── repository/         # Repositoryコンポーネント
│   └── management/         # リポジトリ管理コンポーネント
├── constants/              # 定数
│   └── snapshot.ts                # スナップショット取得件数(limit/offset)
├── hooks/                  # カスタムReact Hooks
│   ├── repository-context.tsx     # リポジトリの生成と共有
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
│   │   ├── create-fetch.ts          # API通信用のfetch
│   │   ├── init-error.ts            # 初期化エラー
│   │   └── constants.ts             # 設定の既定値
│   ├── settings/           # ユーザー設定
│   │   └── user-settings-storage.ts # 設定のlocalStorage保存
│   └── token/             # トークン管理
│       └── in-memory-token-storage.ts # メモリ上のトークン保持
├── utils/                  # ユーティリティ
│   ├── link.ts                    # リンク生成
│   ├── number-utils.ts            # 数値フォーマット
│   └── time-utils.ts              # 時刻フォーマット
├── test/                   # テストの共通設定
│   └── setup.ts
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

ストアの設定の既定値は[src/lib/repository/constants.ts](src/lib/repository/constants.ts)で定義:

```typescript
DEFAULT_REPOSITORY_TTL_MS = 60 * 1_000; // キャッシュTTL: 60秒
DEFAULT_REPOSITORY_MAX_DATA_SIZE = 10 * 1024 * 1024; // 最大データサイズ: 10 MiB
```

Repository Settingsで変更した値はlocalStorageに保存されます。

スナップショット取得件数の既定値は[src/constants/snapshot.ts](src/constants/snapshot.ts)で定義:

```typescript
LIMIT: { MAX: 10_000, MIN: 0, DEFAULT: 10 }, // 取得件数
OFFSET: { MIN: 0, DEFAULT: 0 },              // 取得開始位置
```

### イベントシステム

PROMIDASリポジトリは以下のイベントを発火:

- `snapshotStarted` - スナップショットの取得開始
- `snapshotCompleted` - スナップショットの取得完了
- `snapshotFailed` - スナップショットの取得失敗

これらのイベントは`useRepositoryEvents`でリッスンし、データフロー可視化に利用されます。

## テスト戦略

### 単体テスト

- カスタムフックのテスト: `hooks/__tests__/`
- ユーティリティ関数のテスト: `utils/__tests__/`
- リポジトリロジックと設定のテスト: `lib/*/__tests__/`

### コンポーネントテスト

- React Testing Libraryを使用
- コンポーネントと同じディレクトリに`*.test.tsx`として配置
- 共通設定は`test/setup.ts`

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

- ヘッダー背景: `#263238` (ダークグレー)
- PromidasInfoSection背景: `#0288d1`
- フッター背景: `#0288d1`

## ビルドとデプロイ

### GitHub Pages

`main` ブランチに push すると、GitHub Actions のワークフロー (`.github/workflows/deploy.yml`) が `npm run build` でビルドし、`dist/` を GitHub Pages にデプロイします。

### 環境変数

特別な環境変数は不要です。APIトークンはメモリにだけ保持し、ブラウザのストレージには保存しません。Repository Settingsの値はlocalStorageに保存します。

## トラブルシューティング

### APIトークンが消える

ページを再読み込みするとトークンは消えます。メモリにだけ保持しているためで、不具合ではありません。もう一度入力してください。

### 設定を保存したらスナップショットが消えた

Repository Settingsで保存すると、新しい設定でリポジトリを作り直します。それまでのスナップショットは使えなくなるので、もう一度Setup Snapshotを実行してください。

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
