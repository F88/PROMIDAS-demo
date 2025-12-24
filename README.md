# PROMIDAS Demo

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/F88/PROMIDAS-demo)
[![View Code Wiki](https://www.gstatic.com/_/boq-sdlc-agents-ui/_/r/YUi5dj2UWvE.svg)](https://codewiki.google/github.com/f88/PROMIDAS-demo)

React SPAデモサイト - PROMIDASを使用してProtoPediaデータを取得・表示します。

## 概要

[PROMIDAS](https://github.com/F88/promidas) のデモサイトです。

PROMIDASは、ProtoPedia API v2を利用したデータ取得とキャッシュ管理を簡素化するライブラリです。
PROMIDASを使用することで、API通信、インメモリキャッシュ、リポジトリ管理、データ表示の各コンポーネント間のデータフローを効率的に実装できます。

## デモサイトの特徴

### 🚀 PROMIDAS 統合

ProtoPedia API v2とPROMIDASライブラリを活用した効率的なデータ取得と管理

### 🧰 PROMIDAS を活用した主な機能

- 📊 **統計情報ダッシュボード** - キャッシュステータス、メモリ使用量、保存件数をヘッダーに常時表示
- 🔄 **リアルタイムデータフロー可視化** - Fetcher、Store、Repository、Displayの4つのコンポーネント間のデータフローをアニメーションで表示
- 📱 **レスポンシブデザイン** - Material-UIを使用したモダンで使いやすいUI、モバイルにも対応
- ⏱️ **インメモリキャッシュ管理** - TTL(Time To Live)による自動キャッシュ管理、残り時間をリアルタイム表示
- 📸 **スナップショット機能** - プロトタイプデータのスナップショット作成・更新、任意の件数(limit/offset)でデータ取得可能

## 使い方

1. Setup Snapshotでデータを取得
2. Repositoryセクションで各種機能を試す:
    - Random Prototype: ランダムに取得
    - Search by ID: ID指定で検索
    - All Prototypes: 全件取得
    - Analysis: データ分析
3. ヘッダーでキャッシュ状態とTTL残り時間を確認

### APIトークンの設定

アプリケーション起動後、以下の手順でAPIトークンを設定します:

1. [ProtoPedia設定ページ](https://protopedia.net/settings/application)でAPIトークンを取得
2. "Token Configuration"セクションの入力欄にトークンを入力
3. "Save Token"ボタンをクリック

トークンはブラウザのSessionStorageに保存されます(現在のタブセッション中のみ有効)。

### リポジトリ設定

"Repository Settings"セクションで以下を設定:

- **Limit**: スナップショット取得件数(0-10,000、デフォルト: 10)
- **Offset**: 取得開始位置(デフォルト: 0)

設定後、"Save Settings"をクリックすると自動的にストア情報が更新されます。

## 開発

開発者向けの情報は[DEVELOPMENT.md](DEVELOPMENT.md)を参照:

- 詳細な技術スタック
- プロジェクト構成
- アーキテクチャ
- 利用可能なスクリプト
- テスト戦略
- ビルドとデプロイ

## ライセンス

MIT

## 関連リンク

- [PROMIDAS](https://github.com/F88/promidas)
- [ProtoPedia](https://protopedia.net/)
- [ProtoPedia API v2](https://protopediav2.docs.apiary.io/)
