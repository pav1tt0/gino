# sustAId Architecture Overview

This document summarizes the current application structure and where key
responsibilities live.

## App Entry

- `src/index.jsx`: React entry point and global providers (router + auth).
- `src/App.jsx`: App shell logic (auth state, Supabase load, upload/import,
  preview/confirm modals, and route definitions).

## Layout

- `src/layouts/MainLayout.jsx`: Common layout after login (header, navigation,
  content outlet, footer).

## Views (Pages)

- `src/components/views/Dashboard.jsx`: Summary stats and the landing hero.
- `src/components/views/MaterialsDatabase.jsx`: Search/filter/sort, table view,
  material detail modal, export CSV/JSON.
- `src/components/views/Compare.jsx`: Comparison table + radar chart + export.
- `src/components/views/Analytics.jsx`: LCA analysis charts, selection UI,
  export PNG/PDF for charts.
- `src/components/views/Methodology.jsx`: PDF reader and download.
- `src/components/views/DownloadApp.jsx`: App download page.

## Shared UI

- `src/components/common/Header.jsx`: Upload, Supabase load/reload, user info.
- `src/components/common/Navigation.jsx`: Main nav + AI assistant link.
- `src/components/common/ChartExportButtons.jsx`: Export chart to PNG/PDF.
- `src/components/common/CustomTooltip.jsx`: Chart tooltip formatting.
- `src/components/common/MissingDataWarning.jsx`: Missing data notice.

## Auth & Data

- `src/context/AuthContext.jsx`: Supabase auth, invite flow, session state.
- `src/supabaseClient.js`: Supabase client, schema/table selection,
  column mapping, data fetch.

## Utilities

- `src/utils/fileParsing.js`: CSV/SQL parsing and column normalization.
- `src/utils/exportUtils.js`: Export datasets as CSV/JSON.
- `src/utils/materialUtils.js`: Helpers (e.g., sustainability color).

## Notes

- Supabase schema/table are configurable via `.env`:
  `VITE_SUPABASE_SCHEMA` and `VITE_SUPABASE_TABLE`.
- Auto-load from Supabase runs after authentication if no materials are loaded.
