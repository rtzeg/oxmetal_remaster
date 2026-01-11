import json
import os
import sqlite3
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("PRODUCTS_DB_PATH", BASE_DIR / "products.db"))


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
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
        connection.commit()
        ensure_columns(connection)


def ensure_columns(connection: sqlite3.Connection) -> None:
    cursor = connection.execute("PRAGMA table_info(products)")
    existing_columns = {row["name"] for row in cursor.fetchall()}
    required_columns = {
        "category": "TEXT",
        "profile": "TEXT",
        "thickness": "TEXT",
    }
    for column, column_type in required_columns.items():
        if column not in existing_columns:
            connection.execute(f"ALTER TABLE products ADD COLUMN {column} {column_type}")
    connection.commit()


class Color(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    src: Optional[str] = None


class ProductBase(BaseModel):
    name: Optional[str] = None
    material: str
    view: str
    tipes: Optional[str] = None
    category: Optional[str] = None
    profile: Optional[str] = None
    thickness: Optional[str] = None
    price: Optional[float] = None
    guarantee: Optional[int] = Field(None, alias="Guarantee")
    sizes: Optional[str] = None
    calcwidth: Optional[float] = None
    coating: Optional[str] = None
    color: List[Color] = []
    blueprint: Optional[str] = None
    materialImg: Optional[str] = None
    viewImg: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    material: Optional[str] = None
    view: Optional[str] = None
    tipes: Optional[str] = None
    category: Optional[str] = None
    profile: Optional[str] = None
    thickness: Optional[str] = None
    price: Optional[float] = None
    guarantee: Optional[int] = Field(None, alias="Guarantee")
    sizes: Optional[str] = None
    calcwidth: Optional[float] = None
    coating: Optional[str] = None
    color: Optional[List[Color]] = None
    blueprint: Optional[str] = None
    materialImg: Optional[str] = None
    viewImg: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class Product(ProductBase):
    id: int


app = FastAPI(title="Oxmetal Products API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


def row_to_product(row: sqlite3.Row) -> Product:
    return Product(
        id=row["id"],
        name=row["name"],
        material=row["material"],
        view=row["view"],
        tipes=row["tipes"],
        category=row["category"],
        profile=row["profile"],
        thickness=row["thickness"],
        price=row["price"],
        guarantee=row["guarantee"],
        sizes=row["sizes"],
        calcwidth=row["calcwidth"],
        coating=row["coating"],
        color=json.loads(row["color_json"]) if row["color_json"] else [],
        blueprint=row["blueprint"],
        materialImg=row["material_img"],
        viewImg=row["view_img"],
    )


@app.get("/products", response_model=list[Product], response_model_by_alias=True)
def list_products(
    category: Optional[str] = None,
    profile: Optional[str] = None,
    coating: Optional[str] = None,
    color: Optional[str] = None,
) -> list[Product]:
    filters = []
    params: list[object] = []
    if category:
        filters.append("category = ?")
        params.append(category)
    if profile:
        filters.append("profile = ?")
        params.append(profile)
    if coating:
        filters.append("coating = ?")
        params.append(coating)
    if filters:
        where_clause = "WHERE " + " AND ".join(filters)
    else:
        where_clause = ""
    with get_connection() as connection:
        rows = connection.execute(
            f"SELECT * FROM products {where_clause} ORDER BY id DESC",
            params,
        ).fetchall()
    products = [row_to_product(row) for row in rows]
    if color:
        products = [
            product
            for product in products
            if any(item.name == color or item.color == color for item in product.color)
        ]
    return products


@app.get("/products/{product_id}", response_model=Product, response_model_by_alias=True)
def get_product(product_id: int) -> Product:
    with get_connection() as connection:
        row = connection.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return row_to_product(row)


@app.post("/products", response_model=Product, status_code=201, response_model_by_alias=True)
def create_product(payload: ProductCreate) -> Product:
    with get_connection() as connection:
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
                payload.name,
                payload.material,
                payload.view,
                payload.tipes,
                payload.category,
                payload.profile,
                payload.thickness,
                payload.price,
                payload.guarantee,
                payload.sizes,
                payload.calcwidth,
                payload.coating,
                json.dumps([item.dict() for item in payload.color]),
                payload.blueprint,
                payload.materialImg,
                payload.viewImg,
            ),
        )
        connection.commit()
        new_id = cursor.lastrowid
        row = connection.execute("SELECT * FROM products WHERE id = ?", (new_id,)).fetchone()
    return row_to_product(row)


@app.put("/products/{product_id}", response_model=Product, response_model_by_alias=True)
def update_product(product_id: int, payload: ProductUpdate) -> Product:
    data = payload.dict(exclude_unset=True, by_alias=False)
    with get_connection() as connection:
        row = connection.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")

        updated = {
            "name": row["name"],
            "material": row["material"],
            "view": row["view"],
            "tipes": row["tipes"],
            "category": row["category"],
            "profile": row["profile"],
            "thickness": row["thickness"],
            "price": row["price"],
            "guarantee": row["guarantee"],
            "sizes": row["sizes"],
            "calcwidth": row["calcwidth"],
            "coating": row["coating"],
            "color_json": row["color_json"],
            "blueprint": row["blueprint"],
            "material_img": row["material_img"],
            "view_img": row["view_img"],
        }

        if "color" in data:
            updated["color_json"] = json.dumps([item.dict() for item in data["color"]])
            data.pop("color")

        key_map = {
            "materialImg": "material_img",
            "viewImg": "view_img",
        }
        for key, value in data.items():
            column = key_map.get(key, key)
            updated[column] = value

        connection.execute(
            """
            UPDATE products
            SET
                name = ?,
                material = ?,
                view = ?,
                tipes = ?,
                category = ?,
                profile = ?,
                thickness = ?,
                price = ?,
                guarantee = ?,
                sizes = ?,
                calcwidth = ?,
                coating = ?,
                color_json = ?,
                blueprint = ?,
                material_img = ?,
                view_img = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (
                updated["name"],
                updated["material"],
                updated["view"],
                updated["tipes"],
                updated["category"],
                updated["profile"],
                updated["thickness"],
                updated["price"],
                updated["guarantee"],
                updated["sizes"],
                updated["calcwidth"],
                updated["coating"],
                updated["color_json"],
                updated["blueprint"],
                updated["material_img"],
                updated["view_img"],
                product_id,
            ),
        )
        connection.commit()
        row = connection.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    return row_to_product(row)


@app.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: int) -> None:
    with get_connection() as connection:
        cursor = connection.execute("DELETE FROM products WHERE id = ?", (product_id,))
        connection.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Product not found")


@app.get("/admin/summary")
def admin_summary() -> dict:
    with get_connection() as connection:
        total = connection.execute("SELECT COUNT(*) as total FROM products").fetchone()
        categories = connection.execute(
            """
            SELECT category, COUNT(*) as count
            FROM products
            WHERE category IS NOT NULL AND category != ''
            GROUP BY category
            ORDER BY count DESC
            """
        ).fetchall()
    return {
        "total": total["total"],
        "categories": [{"category": row["category"], "count": row["count"]} for row in categories],
    }
