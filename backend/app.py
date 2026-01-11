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


class ColorRecord(BaseModel):
    id: int
    RGBA: Optional[str] = None
    color: Optional[str] = None
    name: Optional[str] = None


class ColorCreate(BaseModel):
    RGBA: Optional[str] = None
    color: Optional[str] = None
    name: Optional[str] = None


class CoatingRecord(BaseModel):
    id: int
    name: str


class CoatingCreate(BaseModel):
    name: str


class CategoryRecord(BaseModel):
    id: int
    name: str
    slug: Optional[str] = None
    subcategories: list["SubcategoryRecord"] = []


class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None


class SubcategoryRecord(BaseModel):
    id: int
    name: str
    slug: Optional[str] = None


class SubcategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None


class CategorySubcategoryLink(BaseModel):
    subcategory_id: int


class ProductSubcategoryLink(BaseModel):
    product_id: int


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


@app.get("/colors", response_model=list[ColorRecord])
def list_colors() -> list[ColorRecord]:
    with get_connection() as connection:
        rows = connection.execute("SELECT id, rgba, color, name FROM colors ORDER BY name").fetchall()
    return [
        ColorRecord(
            id=row["id"],
            RGBA=row["rgba"],
            color=row["color"],
            name=row["name"],
        )
        for row in rows
    ]


@app.post("/colors", response_model=ColorRecord, status_code=201)
def create_color(payload: ColorCreate) -> ColorRecord:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO colors (rgba, color, name)
            VALUES (?, ?, ?)
            """,
            (payload.RGBA, payload.color, payload.name),
        )
        connection.commit()
        row = connection.execute(
            "SELECT id, rgba, color, name FROM colors WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()
    return ColorRecord(
        id=row["id"],
        RGBA=row["rgba"],
        color=row["color"],
        name=row["name"],
    )


@app.get("/coatings", response_model=list[CoatingRecord])
def list_coatings() -> list[CoatingRecord]:
    with get_connection() as connection:
        rows = connection.execute("SELECT id, name FROM coatings ORDER BY name").fetchall()
    return [CoatingRecord(id=row["id"], name=row["name"]) for row in rows]


@app.post("/coatings", response_model=CoatingRecord, status_code=201)
def create_coating(payload: CoatingCreate) -> CoatingRecord:
    with get_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO coatings (name) VALUES (?)",
            (payload.name,),
        )
        connection.commit()
        row = connection.execute(
            "SELECT id, name FROM coatings WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()
    return CoatingRecord(id=row["id"], name=row["name"])


@app.get("/categories", response_model=list[CategoryRecord])
def list_categories() -> list[CategoryRecord]:
    with get_connection() as connection:
        categories = connection.execute(
            "SELECT id, name, slug FROM categories ORDER BY name"
        ).fetchall()
        links = connection.execute(
            """
            SELECT cs.category_id, s.id, s.name, s.slug
            FROM category_subcategories cs
            JOIN subcategories s ON s.id = cs.subcategory_id
            ORDER BY s.name
            """
        ).fetchall()
    by_category: dict[int, list[SubcategoryRecord]] = {}
    for row in links:
        by_category.setdefault(row["category_id"], []).append(
            SubcategoryRecord(id=row["id"], name=row["name"], slug=row["slug"])
        )
    return [
        CategoryRecord(
            id=row["id"],
            name=row["name"],
            slug=row["slug"],
            subcategories=by_category.get(row["id"], []),
        )
        for row in categories
    ]


@app.post("/categories", response_model=CategoryRecord, status_code=201)
def create_category(payload: CategoryCreate) -> CategoryRecord:
    with get_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO categories (name, slug) VALUES (?, ?)",
            (payload.name, payload.slug),
        )
        connection.commit()
        row = connection.execute(
            "SELECT id, name, slug FROM categories WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()
    return CategoryRecord(id=row["id"], name=row["name"], slug=row["slug"], subcategories=[])


@app.get("/subcategories", response_model=list[SubcategoryRecord])
def list_subcategories() -> list[SubcategoryRecord]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT id, name, slug FROM subcategories ORDER BY name"
        ).fetchall()
    return [SubcategoryRecord(id=row["id"], name=row["name"], slug=row["slug"]) for row in rows]


@app.post("/subcategories", response_model=SubcategoryRecord, status_code=201)
def create_subcategory(payload: SubcategoryCreate) -> SubcategoryRecord:
    with get_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO subcategories (name, slug) VALUES (?, ?)",
            (payload.name, payload.slug),
        )
        connection.commit()
        row = connection.execute(
            "SELECT id, name, slug FROM subcategories WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()
    return SubcategoryRecord(id=row["id"], name=row["name"], slug=row["slug"])


@app.post("/categories/{category_id}/subcategories", status_code=204)
def link_category_subcategory(category_id: int, payload: CategorySubcategoryLink) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT OR IGNORE INTO category_subcategories (category_id, subcategory_id)
            VALUES (?, ?)
            """,
            (category_id, payload.subcategory_id),
        )
        connection.commit()


@app.delete("/categories/{category_id}/subcategories/{subcategory_id}", status_code=204)
def unlink_category_subcategory(category_id: int, subcategory_id: int) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            DELETE FROM category_subcategories
            WHERE category_id = ? AND subcategory_id = ?
            """,
            (category_id, subcategory_id),
        )
        connection.commit()


@app.post("/subcategories/{subcategory_id}/products", status_code=204)
def link_product_subcategory(subcategory_id: int, payload: ProductSubcategoryLink) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT OR IGNORE INTO product_subcategories (product_id, subcategory_id)
            VALUES (?, ?)
            """,
            (payload.product_id, subcategory_id),
        )
        connection.commit()


@app.delete("/subcategories/{subcategory_id}/products/{product_id}", status_code=204)
def unlink_product_subcategory(subcategory_id: int, product_id: int) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            DELETE FROM product_subcategories
            WHERE product_id = ? AND subcategory_id = ?
            """,
            (product_id, subcategory_id),
        )
        connection.commit()


@app.get("/subcategories/{subcategory_id}/products", response_model=list[Product])
def list_products_by_subcategory(subcategory_id: int) -> list[Product]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT p.*
            FROM products p
            JOIN product_subcategories ps ON ps.product_id = p.id
            WHERE ps.subcategory_id = ?
            ORDER BY p.id DESC
            """,
            (subcategory_id,),
        ).fetchall()
    return [row_to_product(row) for row in rows]


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
        colors_count = connection.execute("SELECT COUNT(*) as total FROM colors").fetchone()
        coatings_count = connection.execute("SELECT COUNT(*) as total FROM coatings").fetchone()
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
        "colors": colors_count["total"],
        "coatings": coatings_count["total"],
        "categories": [{"category": row["category"], "count": row["count"]} for row in categories],
    }
