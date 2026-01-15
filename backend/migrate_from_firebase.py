import json
import os
import sqlite3
from pathlib import Path
from typing import Any

import requests

FIREBASE_BASE_URL = os.environ.get(
    "FIREBASE_BASE_URL",
    "https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app",
)

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("PRODUCTS_DB_PATH", BASE_DIR / "products.db"))


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db(connection: sqlite3.Connection) -> None:
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            material TEXT NOT NULL,
            view TEXT NOT NULL,
            tipes TEXT,
            category TEXT,
            profile TEXT,
            thickness TEXT,
            price REAL,
            guarantee INTEGER,
            sizes TEXT,
            calcwidth REAL,
            coating TEXT,
            color_json TEXT,
            blueprint TEXT,
            material_img TEXT,
            view_img TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS colors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rgba TEXT,
            color TEXT,
            name TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS coatings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            slug TEXT UNIQUE,
            icon_url TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS subcategories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            slug TEXT UNIQUE,
            icon_url TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS category_subcategories (
            category_id INTEGER NOT NULL,
            subcategory_id INTEGER NOT NULL,
            PRIMARY KEY (category_id, subcategory_id),
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
            FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
        )
        """
    )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS product_subcategories (
            product_id INTEGER NOT NULL,
            subcategory_id INTEGER NOT NULL,
            PRIMARY KEY (product_id, subcategory_id),
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
            FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE CASCADE
        )
        """
    )
    connection.commit()


def fetch_json(path: str) -> Any:
    response = requests.get(f"{FIREBASE_BASE_URL}/{path}.json", timeout=30)
    response.raise_for_status()
    return response.json()


def normalize_products(raw: Any) -> list[dict[str, Any]]:
    if not raw:
        return []
    if isinstance(raw, list):
        return [item for item in raw if item]
    if isinstance(raw, dict):
        return [value for value in raw.values() if value]
    return []


def normalize_color_item(item: Any, palette: dict[str, dict[str, Any]]) -> dict[str, Any]:
    if isinstance(item, dict):
        color_value = item.get("color") or item.get("RGBA") or item.get("name")
        palette_item = palette.get(str(color_value).lower()) if color_value else None
        return {
            "RGBA": item.get("RGBA") or (palette_item or {}).get("RGBA"),
            "color": item.get("color") or (palette_item or {}).get("color"),
            "name": item.get("name") or (palette_item or {}).get("name"),
            "src": item.get("src") or item.get("img") or item.get("image"),
        }
    if isinstance(item, str):
        palette_item = palette.get(item.lower())
        if palette_item:
            return {
                "RGBA": palette_item.get("RGBA"),
                "color": palette_item.get("color"),
                "name": palette_item.get("name"),
                "src": None,
            }
    return {"RGBA": None, "color": None, "name": None, "src": None}


def normalize_taxonomy_name(value: Any) -> str | None:
    if value is None:
        return None
    normalized = " ".join(str(value).strip().split())
    return normalized or None


def get_or_create_category(
    connection: sqlite3.Connection, name: str, icon_url: str | None = None
) -> int:
    normalized_name = normalize_taxonomy_name(name)
    if not normalized_name:
        return 0
    connection.execute(
        """
        INSERT OR IGNORE INTO categories (name, icon_url)
        VALUES (?, ?)
        """,
        (normalized_name, icon_url),
    )
    row = connection.execute(
        "SELECT id, icon_url FROM categories WHERE name = ?", (normalized_name,)
    ).fetchone()
    if row and icon_url and not row["icon_url"]:
        connection.execute(
            "UPDATE categories SET icon_url = ? WHERE id = ?",
            (icon_url, row["id"]),
        )
    return row["id"]


def get_or_create_subcategory(
    connection: sqlite3.Connection, name: str, icon_url: str | None = None
) -> int:
    normalized_name = normalize_taxonomy_name(name)
    if not normalized_name:
        return 0
    connection.execute(
        """
        INSERT OR IGNORE INTO subcategories (name, icon_url)
        VALUES (?, ?)
        """,
        (normalized_name, icon_url),
    )
    row = connection.execute(
        "SELECT id, icon_url FROM subcategories WHERE name = ?", (normalized_name,)
    ).fetchone()
    if row and icon_url and not row["icon_url"]:
        connection.execute(
            "UPDATE subcategories SET icon_url = ? WHERE id = ?",
            (icon_url, row["id"]),
        )
    return row["id"]


def link_category_subcategory(
    connection: sqlite3.Connection, category_id: int, subcategory_id: int
) -> None:
    connection.execute(
        """
        INSERT OR IGNORE INTO category_subcategories (category_id, subcategory_id)
        VALUES (?, ?)
        """,
        (category_id, subcategory_id),
    )


def link_product_subcategory(
    connection: sqlite3.Connection, product_id: int, subcategory_id: int
) -> None:
    connection.execute(
        """
        INSERT OR IGNORE INTO product_subcategories (product_id, subcategory_id)
        VALUES (?, ?)
        """,
        (product_id, subcategory_id),
    )


def build_palette(colors: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    palette: dict[str, dict[str, Any]] = {}
    for color in colors:
        for key in [color.get("RGBA"), color.get("color"), color.get("name")]:
            if key:
                palette[str(key).lower()] = color
    return palette


def migrate_products(
    connection: sqlite3.Connection,
    products: list[dict[str, Any]],
    palette: dict[str, dict[str, Any]],
) -> None:
    for product in products:
        raw_colors = product.get("color") or []
        colors = [normalize_color_item(item, palette) for item in raw_colors]
        payload = {
            "name": product.get("name"),
            "material": product.get("material") or "",
            "view": product.get("view") or "",
            "tipes": product.get("tipes"),
            "category": product.get("category"),
            "profile": product.get("profile"),
            "thickness": product.get("thickness"),
            "price": product.get("price"),
            "guarantee": product.get("Guarantee"),
            "sizes": product.get("sizes"),
            "calcwidth": product.get("calcwidth"),
            "coating": product.get("coating"),
            "color_json": json.dumps(colors),
            "blueprint": product.get("blueprint"),
            "material_img": product.get("materialImg"),
            "view_img": product.get("viewImg"),
        }
        product_id = product.get("id")
        if isinstance(product_id, int):
            connection.execute(
                """
                INSERT OR REPLACE INTO products (
                    id,
                    name,
                    material,
                    view,
                    tipes,
                    category,
                    profile,
                    thickness,
                    price,
                    guarantee,
                    sizes,
                    calcwidth,
                    coating,
                    color_json,
                    blueprint,
                    material_img,
                    view_img
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    product_id,
                    payload["name"],
                    payload["material"],
                    payload["view"],
                    payload["tipes"],
                    payload["category"],
                    payload["profile"],
                    payload["thickness"],
                    payload["price"],
                    payload["guarantee"],
                    payload["sizes"],
                    payload["calcwidth"],
                    payload["coating"],
                    payload["color_json"],
                    payload["blueprint"],
                    payload["material_img"],
                    payload["view_img"],
                ),
            )
            current_product_id = product_id
        else:
            cursor = connection.execute(
                """
                INSERT INTO products (
                    name,
                    material,
                    view,
                    tipes,
                    category,
                    profile,
                    thickness,
                    price,
                    guarantee,
                    sizes,
                    calcwidth,
                    coating,
                    color_json,
                    blueprint,
                    material_img,
                    view_img
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    payload["name"],
                    payload["material"],
                    payload["view"],
                    payload["tipes"],
                    payload["category"],
                    payload["profile"],
                    payload["thickness"],
                    payload["price"],
                    payload["guarantee"],
                    payload["sizes"],
                    payload["calcwidth"],
                    payload["coating"],
                    payload["color_json"],
                    payload["blueprint"],
                    payload["material_img"],
                    payload["view_img"],
                ),
            )
            current_product_id = cursor.lastrowid
        category_name = product.get("view") or product.get("category")
        subcategory_name = product.get("material")
        category_icon = product.get("viewImg") or product.get("view_img")
        subcategory_icon = product.get("materialImg") or product.get("material_img")
        if category_name:
            category_id = get_or_create_category(connection, str(category_name), category_icon)
        else:
            category_id = None
        if subcategory_name:
            subcategory_id = get_or_create_subcategory(
                connection, str(subcategory_name), subcategory_icon
            )
        else:
            subcategory_id = None
        if category_id and subcategory_id:
            link_category_subcategory(connection, category_id, subcategory_id)
        if current_product_id and subcategory_id:
            link_product_subcategory(connection, current_product_id, subcategory_id)


def migrate_colors(connection: sqlite3.Connection, colors: list[dict[str, Any]]) -> None:
    for color in colors:
        connection.execute(
            """
            INSERT INTO colors (rgba, color, name)
            VALUES (?, ?, ?)
            """,
            (color.get("RGBA"), color.get("color"), color.get("name")),
        )


def migrate_coatings(connection: sqlite3.Connection, coatings: list[Any]) -> None:
    for coating in coatings:
        if not coating:
            continue
        connection.execute(
            """
            INSERT OR IGNORE INTO coatings (name)
            VALUES (?)
            """,
            (str(coating),),
        )


def main() -> None:
    with get_connection() as connection:
        init_db(connection)

        products = normalize_products(fetch_json("Products"))
        colors = normalize_products(fetch_json("Colors"))
        coatings = normalize_products(fetch_json("Coating"))
        palette = build_palette(colors)

        migrate_products(connection, products, palette)
        migrate_colors(connection, colors)
        migrate_coatings(connection, coatings)

        connection.commit()

    print(
        f"Migrated {len(products)} products, {len(colors)} colors, {len(coatings)} coatings "
        f"from {FIREBASE_BASE_URL} into {DB_PATH}"
    )


if __name__ == "__main__":
    main()
