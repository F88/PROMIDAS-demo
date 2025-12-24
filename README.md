# PROMIDAS Demo

React SPAデモサイト - PROMIDASを使用してProtoPediaデータを取得・表示します。

## 概要

このプロジェクトは、[PROMIDAS](https://github.com/F88/promidas) (ProtoPedia Resource Organized Management In-memory Data Access Store)を使用したデモアプリケーションです。

PROMIDASの`createProtopediaInMemoryRepository`を利用して、ProtoPedia APIからプロトタイプデータを取得し、インメモリキャッシュで管理します。

## デモサイトの特徴

- **リアルタイムデータフロー可視化** - Fetcher、Store、Repository、Displayの4つのコンポーネント間のデータフローをアニメーションで表示
- **インメモリキャッシュ管理** - TTL(Time To Live)による自動キャッシュ管理、残り時間をリアルタイム表示
- **スナップショット機能** - プロトタイプデータのスナップショット作成・更新、任意の件数(limit/offset)でデータ取得可能
- **多様な検索機能** - ランダム取得、ID検索、全件取得、分析機能など豊富な検索オプション
- **統計情報ダッシュボード** - キャッシュステータス、メモリ使用量、保存件数をヘッダーに常時表示
- **レスポンシブデザイン** - Material-UIを使用したモダンで使いやすいUI、モバイルにも対応

## 主な機能

### ヘッダー統計ダッシュボード

- **キャッシュステータス**: Stored/Expired/Not Setupの3状態
- **キャッシュ時刻**: データ取得時刻とTTL残り時間
- **データサイズ**: 件数とメモリ使用量(KB/MB)
- **データフローインジケーター**: 4つのコンポーネントの状態を可視化

### データフロー可視化

ヘッダー下部のインジケーターで、データの流れをリアルタイム表示:

- **Fetcher** 🔧: API通信中に点灯
- **Store** 💾: ストアへの書き込み中に点灯
- **Repository** 📚: リポジトリアクセス中に点灯
- **Display** 🖥️: データ表示中に点灯

### Store機能

- Get Config: リポジトリ設定情報の取得
- Get Stats: キャッシュ統計情報の取得
- 設定とステータスの詳細表示

### Repository機能

- **Random Prototype**: ランダムに1件取得
- **Single Random**: 指定件数をランダム取得
- **Search by ID**: プロトタイプIDで検索
- **All Prototypes**: 全件取得(ページネーション対応)
- **Analysis**: 統計分析とデータ概要
- **Snapshot Management**: スナップショットの作成・更新

### 設定機能

- **Token Configuration**: APIトークンの登録・削除
- **Repository Settings**: スナップショット設定(limit/offset、TTL、maxPayload)

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
