# Changelog

<!-- markdownlint-disable MD024 -->

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [CalVer](https://calver.org/).

## [2026.01.28] - 2026-01-28

### Changed

- Changed versioning scheme from SemVer to CalVer.

## [3.0.0] - 2026-01-28

### Changed

- Upgraded `promidas` to `v3.0.0`.
- Upgraded `promidas-utils` to `v3.0.0`.
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

## [2.0.0] - 2026-01-16

### Changed

- Migrated `@f88/promidas` from GitHub packages to npm registry as `promidas` (v2.0.0).
- Migrated `@f88/promidas-utils` from GitHub packages to npm registry as `promidas-utils` (v2.0.0).
- Updated all imports to use new package names.
- Enhanced build configuration to split promidas packages into separate chunks for better caching.

### Added

- Snapshot export/import UI components and wiring in the repository page.

## [1.1.0] - 2026-01-13

### Added

- Support for PROMIDAS-1.1.0 and PROMIDAS-Utils-1.0.0.

### Changed

- Upgraded `@f88/promidas` to `v1.1.0`.
- Upgraded `@f88/promidas-utils` to `v1.0.0`.
- Updated Node.js engine requirement to `>=22`.

## [1.0.0] - 2025-12-24

### Added

- Support for PROMIDAS-1.0.0
