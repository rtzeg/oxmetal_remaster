import React from 'react';
import styles from './Admin.module.scss';
import { apiClient } from '../../utils/api';

const emptyCategory = { name: '', slug: '', iconUrl: '' };
const emptySubcategory = { name: '', slug: '', iconUrl: '' };

export default function AdminCategories() {
  const [categories, setCategories] = React.useState([]);
  const [subcategories, setSubcategories] = React.useState([]);
  const [categoryForm, setCategoryForm] = React.useState(emptyCategory);
  const [subcategoryForm, setSubcategoryForm] = React.useState(emptySubcategory);
  const [editingCategoryId, setEditingCategoryId] = React.useState(null);
  const [editingSubcategoryId, setEditingSubcategoryId] = React.useState(null);
  const [linkSelections, setLinkSelections] = React.useState({});
  const [isCategoryUploading, setIsCategoryUploading] = React.useState(false);
  const [isSubcategoryUploading, setIsSubcategoryUploading] = React.useState(false);

  const handleIconUpload = async (event, setForm, setUploading) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, iconUrl: response.data?.url || '' }));
    } catch (error) {
      console.error('Не удалось загрузить иконку', error);
      alert('Не удалось загрузить иконку');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const fetchData = React.useCallback(async () => {
    const [categoriesResponse, subcategoriesResponse] = await Promise.all([
      apiClient.get('/categories'),
      apiClient.get('/subcategories'),
    ]);
    setCategories(categoriesResponse.data);
    setSubcategories(subcategoriesResponse.data);
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (isCategoryUploading) return;
    await apiClient.post('/categories', categoryForm);
    setCategoryForm(emptyCategory);
    fetchData();
  };

  const handleCreateSubcategory = async (event) => {
    event.preventDefault();
    if (isSubcategoryUploading) return;
    await apiClient.post('/subcategories', subcategoryForm);
    setSubcategoryForm(emptySubcategory);
    fetchData();
  };

  const handleEditCategory = async (event, id) => {
    event.preventDefault();
    if (isCategoryUploading) return;
    await apiClient.put(`/categories/${id}`, categoryForm);
    setEditingCategoryId(null);
    setCategoryForm(emptyCategory);
    fetchData();
  };

  const handleEditSubcategory = async (event, id) => {
    event.preventDefault();
    if (isSubcategoryUploading) return;
    await apiClient.put(`/subcategories/${id}`, subcategoryForm);
    setEditingSubcategoryId(null);
    setSubcategoryForm(emptySubcategory);
    fetchData();
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Удалить категорию?')) return;
    await apiClient.delete(`/categories/${id}`);
    fetchData();
  };

  const handleDeleteSubcategory = async (id) => {
    if (!confirm('Удалить подкатегорию?')) return;
    await apiClient.delete(`/subcategories/${id}`);
    fetchData();
  };

  const handleLinkSubcategory = async (categoryId) => {
    const subcategoryId = linkSelections[categoryId];
    if (!subcategoryId) return;
    await apiClient.post(`/categories/${categoryId}/subcategories`, {
      subcategory_id: Number(subcategoryId),
    });
    fetchData();
  };

  const handleUnlinkSubcategory = async (categoryId, subcategoryId) => {
    await apiClient.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`);
    fetchData();
  };

  const startEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      name: category.name || '',
      slug: category.slug || '',
      iconUrl: category.iconUrl || '',
    });
  };

  const startEditSubcategory = (subcategory) => {
    setEditingSubcategoryId(subcategory.id);
    setSubcategoryForm({
      name: subcategory.name || '',
      slug: subcategory.slug || '',
      iconUrl: subcategory.iconUrl || '',
    });
  };

  return (
    <section className={styles.admin}>
      <div className={styles.adminWrapper}>
        <h2 className={styles.adminSectionTitle}>Категории</h2>
        <form className={styles.adminForm} onSubmit={handleCreateCategory}>
          <input
            className={styles.adminInput}
            placeholder="Название категории"
            value={categoryForm.name}
            onChange={(event) => setCategoryForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <input
            className={styles.adminInput}
            placeholder="Slug (опционально)"
            value={categoryForm.slug}
            onChange={(event) => setCategoryForm((prev) => ({ ...prev, slug: event.target.value }))}
          />
          <input
            className={styles.adminInput}
            type="file"
            accept="image/*"
            onChange={(event) =>
              handleIconUpload(event, setCategoryForm, setIsCategoryUploading)
            }
          />
          {categoryForm.iconUrl && (
            <img
              className={styles.adminIconPreview}
              src={categoryForm.iconUrl}
              alt="preview"
            />
          )}
          <button className="button" type="submit" disabled={isCategoryUploading}>
            {isCategoryUploading ? 'Загрузка...' : 'Добавить категорию'}
          </button>
        </form>

        <ul className={styles.adminList}>
          {categories.map((category) => (
            <li key={category.id} className={styles.adminCard}>
              <div className={styles.adminCardHeader}>
                <div>
                  <strong>{category.name}</strong>
                  {category.slug && <span className={styles.adminMeta}>/{category.slug}</span>}
                  {category.iconUrl && (
                    <img className={styles.adminIconPreview} src={category.iconUrl} alt="icon" />
                  )}
                </div>
                <div className={styles.adminActions}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => startEditCategory(category)}>
                    Редактировать
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => handleDeleteCategory(category.id)}>
                    Удалить
                  </button>
                </div>
              </div>

              {editingCategoryId === category.id && (
                <form className={styles.adminForm} onSubmit={(event) => handleEditCategory(event, category.id)}>
                  <input
                    className={styles.adminInput}
                    placeholder="Название категории"
                    value={categoryForm.name}
                    onChange={(event) =>
                      setCategoryForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                  <input
                    className={styles.adminInput}
                    placeholder="Slug (опционально)"
                    value={categoryForm.slug}
                    onChange={(event) =>
                      setCategoryForm((prev) => ({ ...prev, slug: event.target.value }))
                    }
                  />
                  <input
                    className={styles.adminInput}
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleIconUpload(event, setCategoryForm, setIsCategoryUploading)
                    }
                  />
                  {categoryForm.iconUrl && (
                    <img
                      className={styles.adminIconPreview}
                      src={categoryForm.iconUrl}
                      alt="preview"
                    />
                  )}
                  <button className="button" type="submit" disabled={isCategoryUploading}>
                    {isCategoryUploading ? 'Загрузка...' : 'Сохранить'}
                  </button>
                </form>
              )}

              <div className={styles.adminRow}>
                <select
                  className={styles.adminSelect}
                  value={linkSelections[category.id] || ''}
                  onChange={(event) =>
                    setLinkSelections((prev) => ({
                      ...prev,
                      [category.id]: event.target.value,
                    }))
                  }>
                  <option value="">Выберите подкатегорию</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="button"
                  onClick={() => handleLinkSubcategory(category.id)}>
                  Привязать
                </button>
              </div>

              <div className={styles.adminSublist}>
                {category.subcategories?.length ? (
                  category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className={styles.adminSubItem}>
                      <span>{subcategory.name}</span>
                      <button
                        type="button"
                        className="button"
                        onClick={() => handleUnlinkSubcategory(category.id, subcategory.id)}>
                        Удалить связь
                      </button>
                    </div>
                  ))
                ) : (
                  <p className={styles.adminHint}>Подкатегории пока не привязаны.</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <h2 className={styles.adminSectionTitle}>Подкатегории</h2>
        <form className={styles.adminForm} onSubmit={handleCreateSubcategory}>
          <input
            className={styles.adminInput}
            placeholder="Название подкатегории"
            value={subcategoryForm.name}
            onChange={(event) =>
              setSubcategoryForm((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <input
            className={styles.adminInput}
            placeholder="Slug (опционально)"
            value={subcategoryForm.slug}
            onChange={(event) =>
              setSubcategoryForm((prev) => ({ ...prev, slug: event.target.value }))
            }
          />
          <input
            className={styles.adminInput}
            type="file"
            accept="image/*"
            onChange={(event) =>
              handleIconUpload(event, setSubcategoryForm, setIsSubcategoryUploading)
            }
          />
          {subcategoryForm.iconUrl && (
            <img
              className={styles.adminIconPreview}
              src={subcategoryForm.iconUrl}
              alt="preview"
            />
          )}
          <button className="button" type="submit" disabled={isSubcategoryUploading}>
            {isSubcategoryUploading ? 'Загрузка...' : 'Добавить подкатегорию'}
          </button>
        </form>

        <ul className={styles.adminList}>
          {subcategories.map((subcategory) => (
            <li key={subcategory.id} className={styles.adminCard}>
              <div className={styles.adminCardHeader}>
                <div>
                  <strong>{subcategory.name}</strong>
                  {subcategory.slug && <span className={styles.adminMeta}>/{subcategory.slug}</span>}
                  {subcategory.iconUrl && (
                    <img className={styles.adminIconPreview} src={subcategory.iconUrl} alt="icon" />
                  )}
                </div>
                <div className={styles.adminActions}>
                  <button
                    type="button"
                    className="button"
                    onClick={() => startEditSubcategory(subcategory)}>
                    Редактировать
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => handleDeleteSubcategory(subcategory.id)}>
                    Удалить
                  </button>
                </div>
              </div>

              {editingSubcategoryId === subcategory.id && (
                <form
                  className={styles.adminForm}
                  onSubmit={(event) => handleEditSubcategory(event, subcategory.id)}>
                  <input
                    className={styles.adminInput}
                    placeholder="Название подкатегории"
                    value={subcategoryForm.name}
                    onChange={(event) =>
                      setSubcategoryForm((prev) => ({ ...prev, name: event.target.value }))
                    }
                  />
                  <input
                    className={styles.adminInput}
                    placeholder="Slug (опционально)"
                    value={subcategoryForm.slug}
                    onChange={(event) =>
                      setSubcategoryForm((prev) => ({ ...prev, slug: event.target.value }))
                    }
                  />
                  <input
                    className={styles.adminInput}
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      handleIconUpload(event, setSubcategoryForm, setIsSubcategoryUploading)
                    }
                  />
                  {subcategoryForm.iconUrl && (
                    <img
                      className={styles.adminIconPreview}
                      src={subcategoryForm.iconUrl}
                      alt="preview"
                    />
                  )}
                  <button className="button" type="submit" disabled={isSubcategoryUploading}>
                    {isSubcategoryUploading ? 'Загрузка...' : 'Сохранить'}
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
