#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
import sqlite3
from pathlib import Path


def migrate_db(db_path: Path) -> None:
    connection = sqlite3.connect(db_path)
    try:
        connection.execute(
            """
            UPDATE products
            SET
              material_img = REPLACE(material_img, 'profimg/', '/uploads/profimg/'),
              view_img     = REPLACE(view_img, 'profimg/', '/uploads/profimg/'),
              blueprint    = REPLACE(blueprint, 'profimg/', '/uploads/profimg/')
            WHERE material_img LIKE '%profimg/%'
               OR view_img LIKE '%profimg/%'
               OR blueprint LIKE '%profimg/%'
            """
        )
        connection.execute(
            """
            UPDATE products
            SET color_json = REPLACE(color_json, 'profimg/', '/uploads/profimg/')
            WHERE color_json LIKE '%profimg/%'
            """
        )
        connection.commit()
    finally:
        connection.close()


def copy_assets(source_dir: Path, uploads_dir: Path) -> None:
    if not source_dir.exists():
        raise FileNotFoundError(f"Source directory not found: {source_dir}")
    target = uploads_dir / "profimg"
    target.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source_dir, target, dirs_exist_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Copy profimg assets into backend uploads and rewrite DB URLs."
    )
    parser.add_argument(
        "--db",
        type=Path,
        default=Path("backend/products.db"),
        help="Path to SQLite database file.",
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=Path("public/profimg"),
        help="Source directory containing profimg assets.",
    )
    parser.add_argument(
        "--uploads",
        type=Path,
        default=Path("backend/uploads"),
        help="Backend uploads directory.",
    )
    parser.add_argument(
        "--skip-copy",
        action="store_true",
        help="Skip copying profimg assets into backend uploads.",
    )
    args = parser.parse_args()

    if not args.db.exists():
        raise FileNotFoundError(f"Database file not found: {args.db}")

    if not args.skip_copy:
        copy_assets(args.source, args.uploads)

    migrate_db(args.db)
    print("Migration complete.")


if __name__ == "__main__":
    main()
