# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Local image migration (profimg -> backend uploads)

If your database still references legacy `profimg/...` paths (including color images in `color_json`), and you want
everything to work locally without using `VITE_ASSET_BASE_URL`, follow this guide.

### 1) Ensure you have the assets locally

Place the legacy images in:

```
public/profimg
```

### 2) Copy assets and rewrite DB URLs

Run the migration script to copy assets into the backend uploads folder and rewrite DB paths to `/uploads/profimg/...`:

```bash
python utils/migrate_images.py
```

This does:
- Copies `public/profimg` into `backend/uploads/profimg`.
- Updates `products.material_img`, `products.view_img`, `products.blueprint`,
  and any `color_json` entries referencing `profimg/` to `/uploads/profimg/`.

### 3) Start backend and frontend

```bash
uvicorn backend.app:app --reload --port 8000
npm run dev
```

### Optional flags

If you already copied the assets and only need DB updates:

```bash
python utils/migrate_images.py --skip-copy
```

To point to a different DB or source directory:

```bash
python utils/migrate_images.py --db /path/to/products.db --source /path/to/profimg
```
