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


def migrate_products(connection: sqlite3.Connection, products: list[dict[str, Any]]) -> None:
    for product in products:
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
            "color_json": json.dumps(product.get("color") or []),
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
        else:
            connection.execute(
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

        migrate_products(connection, products)
        migrate_colors(connection, colors)
        migrate_coatings(connection, coatings)

        connection.commit()

    print(
        f"Migrated {len(products)} products, {len(colors)} colors, {len(coatings)} coatings "
        f"from {FIREBASE_BASE_URL} into {DB_PATH}"
    )


if __name__ == "__main__":
    main()
