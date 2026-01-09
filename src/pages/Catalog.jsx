import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useDeferredValue,
} from "react";
import { useSelector } from "react-redux";
import ProductCart from "../components/ProductCart";
import { scrollToElement } from "../../utils/functions";

const norm = (v) => String(v ?? "").trim().toLowerCase();

const asArray = (goods) => {
  if (!goods) return [];
  if (Array.isArray(goods)) return goods.filter(Boolean);
  if (typeof goods === "object") return Object.values(goods).filter(Boolean);
  return [];
};

const productHasColorByName = (product, colorName) => {
  if (!colorName || colorName === "all") return true;
  const list = Array.isArray(product?.color) ? product.color : [];
  return list.some((c) => norm(c?.name) === norm(colorName));
};

// гибкий поиск: ищем по title/name/material/tipes/view/color и т.д.
function matchSearch(product, query) {
  const q = norm(query);
  if (!q) return true;

  const tokens = q.split(/\s+/).filter(Boolean);
  if (!tokens.length) return true;

  const colors = Array.isArray(product?.color) ? product.color : [];
  const colorNames = colors.map((c) => c?.name).filter(Boolean).join(" ");

  const hay = norm(
    [
      product?.title,
      product?.name,
      product?.material,
      product?.tipes,
      product?.view,
      product?.type,
      product?.profile,
      product?.garant,
      product?.garantiya,
      product?.warranty,
      colorNames,
      product?.price,
      product?.cost,
    ].join(" ")
  );

  return tokens.every((t) => hay.includes(t));
}

function buildOptionsFromProducts(products, getter) {
  const map = new Map();

  for (const p of products) {
    const val = getter(p);
    if (!val) continue;

    if (Array.isArray(val)) {
      for (const v of val) {
        if (!v) continue;
        const key = String(v);
        map.set(key, (map.get(key) || 0) + 1);
      }
    } else {
      const key = String(val);
      map.set(key, (map.get(key) || 0) + 1);
    }
  }

  const items = Array.from(map.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value, "ru"));

  return [{ value: "all", count: products.length }, ...items];
}

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-black/10 pb-3">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-base font-extrabold text-neutral-900">{title}</span>
        <span className="text-xl font-black text-neutral-900">{open ? "−" : "+"}</span>
      </button>
      {open ? <div className="pb-2">{children}</div> : null}
    </div>
  );
}

function OptionBtn({ active, disabled, onClick, children, right }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition",
        "border border-black/10",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-neutral-50",
        active ? "bg-black text-white hover:bg-black" : "bg-white text-neutral-900",
      ].join(" ")}
    >
      <span className="truncate">{children}</span>
      {right ? (
        <span className={active ? "text-white/80" : "text-neutral-500"}>{right}</span>
      ) : null}
    </button>
  );
}

export default function Catalog() {
  const goods = useSelector((state) => state.goods.data);
  const products = useMemo(() => asArray(goods), [goods]);

  const [filters, setFilters] = useState({
    material: "all",
    tipes: "all",
    color: "all",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // поиск
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const [visibleCount, setVisibleCount] = useState(12);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ material: "all", tipes: "all", color: "all" });
    setSearch("");
  }, []);

  // переход с Home: localStorage
  useEffect(() => {
    const m = localStorage.getItem("fillGood");
    const t = localStorage.getItem("fillGoodProfile");
    if (m) setFilter("material", m);
    if (t) setFilter("tipes", t);

    if (m || t) {
      localStorage.removeItem("fillGood");
      localStorage.removeItem("fillGoodProfile");
    }
  }, [setFilter]);

  // 1) сначала поиск
  const searchedProducts = useMemo(() => {
    if (!deferredSearch.trim()) return products;
    return products.filter((p) => matchSearch(p, deferredSearch));
  }, [products, deferredSearch]);

  // 2) потом фильтры
  const filteredProducts = useMemo(() => {
    const m = filters.material;
    const t = filters.tipes;
    const c = filters.color;

    return searchedProducts.filter((p) => {
      const okM = m === "all" ? true : norm(p?.material) === norm(m);
      const okT = t === "all" ? true : norm(p?.tipes) === norm(t);
      const okC = productHasColorByName(p, c);
      return okM && okT && okC;
    });
  }, [searchedProducts, filters]);

  // сбрасываем “показать ещё” при смене фильтров/поиска
  useEffect(() => {
    setVisibleCount(12);
  }, [filters.material, filters.tipes, filters.color, deferredSearch]);

  // ФАСЕТЫ считаем на searchedProducts (чтобы поиск влиял на счетчики)
  const baseForMaterial = useMemo(() => {
    return searchedProducts.filter((p) => {
      const okT = filters.tipes === "all" ? true : norm(p?.tipes) === norm(filters.tipes);
      const okC = productHasColorByName(p, filters.color);
      return okT && okC;
    });
  }, [searchedProducts, filters.tipes, filters.color]);

  const baseForTipes = useMemo(() => {
    return searchedProducts.filter((p) => {
      const okM = filters.material === "all" ? true : norm(p?.material) === norm(filters.material);
      const okC = productHasColorByName(p, filters.color);
      return okM && okC;
    });
  }, [searchedProducts, filters.material, filters.color]);

  const baseForColor = useMemo(() => {
    return searchedProducts.filter((p) => {
      const okM = filters.material === "all" ? true : norm(p?.material) === norm(filters.material);
      const okT = filters.tipes === "all" ? true : norm(p?.tipes) === norm(filters.tipes);
      return okM && okT;
    });
  }, [searchedProducts, filters.material, filters.tipes]);

  const materialOptions = useMemo(() => {
    return buildOptionsFromProducts(baseForMaterial, (p) => p?.material);
  }, [baseForMaterial]);

  const tipesOptions = useMemo(() => {
    return buildOptionsFromProducts(baseForTipes, (p) => p?.tipes);
  }, [baseForTipes]);

  const colorOptions = useMemo(() => {
    const map = new Map();
    for (const p of baseForColor) {
      const colors = Array.isArray(p?.color) ? p.color : [];
      const uniq = new Set(colors.map((c) => c?.name).filter(Boolean));
      for (const name of uniq) {
        map.set(String(name), (map.get(String(name)) || 0) + 1);
      }
    }
    const items = Array.from(map.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => a.value.localeCompare(b.value, "ru"));

    return [{ value: "all", count: baseForColor.length }, ...items];
  }, [baseForColor]);

  // авто-сброс невозможных значений
  useEffect(() => {
    if (filters.material !== "all") {
      const ok = materialOptions.some(
        (o) => norm(o.value) === norm(filters.material) && o.count > 0
      );
      if (!ok) setFilter("material", "all");
    }
    if (filters.tipes !== "all") {
      const ok = tipesOptions.some(
        (o) => norm(o.value) === norm(filters.tipes) && o.count > 0
      );
      if (!ok) setFilter("tipes", "all");
    }
    if (filters.color !== "all") {
      const ok = colorOptions.some(
        (o) => norm(o.value) === norm(filters.color) && o.count > 0
      );
      if (!ok) setFilter("color", "all");
    }
  }, [filters, materialOptions, tipesOptions, colorOptions, setFilter]);

  useEffect(() => {
    scrollToElement("filter");
  }, []);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="bg-white pt-[60px]">
      <div className="mx-auto w-[90%] max-w-7xl pb-10">
        <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black text-neutral-900">Каталог товаров</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Подбирай по категории, профилю и цвету. Везде есть “Все”, чтобы не ловить пустоту.
          </p>
        </div>

        {/* ПОИСК ВСЕГДА ВИДЕН (как на странице поиска, только проще и правильнее) */}
        <div className="mt-5 rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2">
              <img src="/icons/search.svg" alt="" className="h-5 w-5 opacity-70" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск: название, материал, профиль, цвет..."
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-neutral-400"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-xl border border-black/10 px-2 py-1 text-xs font-black hover:bg-neutral-50"
                >
                  ✕
                </button>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-neutral-700">
                Найдено: <span className="font-black text-black">{filteredProducts.length}</span>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-bold text-neutral-600 underline underline-offset-4 hover:text-black"
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>

        <div id="filter" className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 scroll-mt-[110px]">
          {/* DESKTOP FILTER */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-lg font-black">Фильтр</div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-sm font-bold text-neutral-600 underline underline-offset-4 hover:text-black"
                >
                  Сбросить
                </button>
              </div>

              <div className="mt-4 space-y-3">
                <Section title="Категория товаров" defaultOpen>
                  <div className="space-y-2">
                    {materialOptions.map((o) => (
                      <OptionBtn
                        key={o.value}
                        active={norm(filters.material) === norm(o.value)}
                        disabled={o.value !== "all" && o.count === 0}
                        onClick={() => setFilter("material", o.value)}
                        right={String(o.count)}
                      >
                        {o.value === "all" ? "Все" : o.value}
                      </OptionBtn>
                    ))}
                  </div>
                </Section>

                <Section title="Профиль" defaultOpen>
                  <div className="space-y-2">
                    {tipesOptions.map((o) => (
                      <OptionBtn
                        key={o.value}
                        active={norm(filters.tipes) === norm(o.value)}
                        disabled={o.value !== "all" && o.count === 0}
                        onClick={() => setFilter("tipes", o.value)}
                        right={String(o.count)}
                      >
                        {o.value === "all" ? "Все" : o.value}
                      </OptionBtn>
                    ))}
                  </div>
                </Section>

                <Section title="Цвет" defaultOpen>
                  <div className="space-y-2">
                    {colorOptions.map((o) => (
                      <OptionBtn
                        key={o.value}
                        active={norm(filters.color) === norm(o.value)}
                        disabled={o.value !== "all" && o.count === 0}
                        onClick={() => setFilter("color", o.value)}
                        right={String(o.count)}
                      >
                        {o.value === "all" ? "Все" : o.value}
                      </OptionBtn>
                    ))}
                  </div>
                </Section>
              </div>
            </div>
          </aside>

          {/* MOBILE FILTER BUTTON + DRAWER */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-bold shadow-sm"
              >
                <img src="/icons/filter.png" alt="" className="h-5 w-5" />
                Фильтр
              </button>

              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-bold text-neutral-600 underline underline-offset-4"
              >
                Сбросить
              </button>
            </div>

            <div
              className={[
                "fixed inset-0 z-[60] transition",
                isFilterOpen ? "pointer-events-auto" : "pointer-events-none",
              ].join(" ")}
              aria-hidden={!isFilterOpen}
            >
              <div
                onClick={() => setIsFilterOpen(false)}
                className={[
                  "absolute inset-0 bg-black/40 transition-opacity",
                  isFilterOpen ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />

              <div
                className={[
                  "absolute left-0 top-0 h-full w-[88%] max-w-sm bg-white shadow-2xl transition-transform",
                  isFilterOpen ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
                role="dialog"
                aria-modal="true"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between border-b border-black/10 p-5">
                    <div className="text-lg font-black">Фильтр</div>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="rounded-xl border border-black/10 p-2"
                    >
                      <img src="/icons/close.png" alt="" className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-auto p-5">
                    <div className="space-y-3">
                      <Section title="Категория товаров" defaultOpen>
                        <div className="space-y-2">
                          {materialOptions.map((o) => (
                            <OptionBtn
                              key={o.value}
                              active={norm(filters.material) === norm(o.value)}
                              disabled={o.value !== "all" && o.count === 0}
                              onClick={() => setFilter("material", o.value)}
                              right={String(o.count)}
                            >
                              {o.value === "all" ? "Все" : o.value}
                            </OptionBtn>
                          ))}
                        </div>
                      </Section>

                      <Section title="Профиль" defaultOpen>
                        <div className="space-y-2">
                          {tipesOptions.map((o) => (
                            <OptionBtn
                              key={o.value}
                              active={norm(filters.tipes) === norm(o.value)}
                              disabled={o.value !== "all" && o.count === 0}
                              onClick={() => setFilter("tipes", o.value)}
                              right={String(o.count)}
                            >
                              {o.value === "all" ? "Все" : o.value}
                            </OptionBtn>
                          ))}
                        </div>
                      </Section>

                      <Section title="Цвет" defaultOpen>
                        <div className="space-y-2">
                          {colorOptions.map((o) => (
                            <OptionBtn
                              key={o.value}
                              active={norm(filters.color) === norm(o.value)}
                              disabled={o.value !== "all" && o.count === 0}
                              onClick={() => setFilter("color", o.value)}
                              right={String(o.count)}
                            >
                              {o.value === "all" ? "Все" : o.value}
                            </OptionBtn>
                          ))}
                        </div>
                      </Section>
                    </div>
                  </div>

                  <div className="border-t border-black/10 p-5">
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-black text-white"
                    >
                      Показать ({filteredProducts.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCTS */}
          <main className="lg:col-span-8 min-w-0">
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-sm">
                <div className="text-2xl font-black">Ничего не найдено</div>
                <div className="mt-2 text-neutral-600">
                  Сними часть фильтров или очисти поиск.
                </div>
              </div>
            ) : (
              <>
                {/* РЕЗИНОВАЯ СЕТКА: сама делает 2/3/4 колонки по ширине */}
                <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
                  {visibleProducts.map((item) => {
                    let idx = 0;
                    if (filters.color !== "all" && Array.isArray(item?.color)) {
                      const found = item.color.findIndex(
                        (c) => norm(c?.name) === norm(filters.color)
                      );
                      idx = found >= 0 ? found : 0;
                    }

                    return (
                      <div key={item.key ?? `${item.material}-${item.tipes}-${item.price ?? ""}`} className="min-w-0">
                        <ProductCart Product={item} idx={idx} />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-center gap-3">
                  {visibleCount < filteredProducts.length ? (
                    <button
                      type="button"
                      onClick={() => setVisibleCount((c) => c + 12)}
                      className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-black shadow-sm hover:bg-neutral-50"
                    >
                      Показать ещё
                    </button>
                  ) : filteredProducts.length > 12 ? (
                    <button
                      type="button"
                      onClick={() => setVisibleCount(12)}
                      className="rounded-2xl border border-black/10 bg-white px-6 py-3 text-sm font-black shadow-sm hover:bg-neutral-50"
                    >
                      Свернуть
                    </button>
                  ) : null}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
