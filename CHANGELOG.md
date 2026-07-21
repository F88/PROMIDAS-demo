# Changelog

<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [CalVer](https://calver.org/).

## [Unreleased]

### Added

- Footer: add a data attribution notice ("This site uses data from ProtoPedia
  (CC BY 4.0)") with links to ProtoPedia and the CC BY 4.0 license.
- README: add a "Data Source & License" section documenting that the app uses
  ProtoPedia data retrieved through the ProtoPedia API (v2), and that ProtoPedia
  applies the CC BY 4.0 license to registered work information by default
  (English and Japanese).

## 2026-07-15

### Fixed

- Keep the input field editable when its value is emptied in the
  `getPrototypeFromSnapshotByPrototypeId` and `getRandomSampleFromSnapshot`
  sections. Previously clearing the value disabled the field itself and
  trapped the user.
- Disable the execute button while the input is empty in the
  `getRandomSampleFromSnapshot` section, matching
  `getPrototypeFromSnapshotByPrototypeId`.

## 2026-07-07

### PROMIDAS versions

- Upgraded `promidas` to `v3.0.1`.
- Upgraded `promidas-utils` to `v3.2.1`.

### Changed

- Adopted `parseUsername` from `promidas-utils` (added in v3.2.0) to decode each
  prototype author into `displayName (profileId)` on the prototype card.

## [2026.01.28] - 2026-01-28

### Changed

- Changed versioning scheme from SemVer to CalVer.

## 3.0.0] - 2026-01-28

### PROMIDAS versions

- Upgraded `promidas` to `v3.0.0`.
- Upgraded `promidas-utils` to `v3.0.0`.

### Changed

- Migrated ESLint configuration from `eslint.config.js` to `eslint.config.mjs`
- Enhanced import ordering rules:
    - Grouped parent and sibling imports together to reduce newline conflicts
    - Added object and type import groups
    - Added `import/first` rule to enforce imports at file top

### Added

- `eslint-plugin-unused-imports` for automatic detection and removal of unused imports
- ESLint import management tools:
    - `eslint-plugin-import` - Import statement linting and auto-fixing
    - `eslint-import-resolver-typescript` - TypeScript path alias resolution

## 2.0.0 - 2026-01-16

### PROMIDAS versions

- Migrated `@f88/promidas` from GitHub packages to npm registry as `promidas` (v2.0.0).
- Migrated `@f88/promidas-utils` from GitHub packages to npm registry as `promidas-utils` (v2.0.0).

### Changed

- Updated all imports to use new package names.
- Enhanced build configuration to split promidas packages into separate chunks for better caching.

### Added

- Snapshot export/import UI components and wiring in the repository page.

## 1.1.0 - 2026-01-13

### PROMIDAS versions

- Upgraded `@f88/promidas` to `v1.1.0`.
- Upgraded `@f88/promidas-utils` to `v1.0.0`.

### Added

- Support for PROMIDAS-1.1.0 and PROMIDAS-Utils-1.0.0.

### Changed

- Updated Node.js engine requirement to `>=22`.

## 1.0.0 - 2025-12-24

### Added

- Support for PROMIDAS-1.0.0
