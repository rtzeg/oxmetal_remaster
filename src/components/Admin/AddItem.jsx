import React, { useEffect } from 'react';
import styles from './Admin.module.scss';
import { aaa } from '../arr';
import { coat } from '../arr';
import AdminColors from './AdminColors';
import Coating from './Coating';
import Input from './Input';
import { useDispatch, useSelector } from 'react-redux';
import { getGoodAPI } from '../../features/goods/thunk';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../utils/api';
import { fetchColors } from '../../features/colorsSlice';
import ColorModal from './ColorModal';
import CoatingModal from './CoatingModal';
import { fetchCoating } from '../../features/coatingSlice';
import { goodsToArray } from '../../utils/goods';

export default function AddItem() {
  const { productId } = useParams();

  const [product, setProduct] = React.useState([]);
  const goods = useSelector((state) => state.goods.data);
  const colors = useSelector((state) => state.colors.colors);
  const coating = useSelector((state) => state.coating.coating);
  const [subcategories, setSubcategories] = React.useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = React.useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = React.useRef(null);
  const [pathData, setPathData] = React.useState([]);
  const [img, setImg] = React.useState('');
  const [activeColor, setActiveColor] = React.useState(null);
  const [activeCoat, setActiveCoat] = React.useState();
  const [colorModal, setColorModal] = React.useState(false);
  const [addNewColorModal, setAddNewColorModal] = React.useState(false);
  const [isCoatingModal, setIsCoatingModal] = React.useState(false);
  const [showNewDiv, setShowNewDiv] = React.useState(true);
  const newArray = goodsToArray(goods);
  const newColors = Object.values(colors);

  const newCoating = Object.values(coating);
  console.log(newCoating);
  const [data, setData] = React.useState({
    Guarantee: Number,
    blueprint: '',
    calcwidth: Number,
    coating: '',
    color: [],
    id: 0,
    key: '',
    material: '',
    materialImg: '',
    name: '',
    category: '',
    profile: '',
    thickness: '',
    price: Number,
    sizes: '',
    tipes: '',
    view: '',
    viewImg: '',
  });

  useEffect(() => {
    if (productId !== undefined) {
      setProduct([...newArray.filter((i) => String(i.id ?? i.key) == String(productId))]);
      setData((prev) => ({
        ...prev,
        Guarantee: product[0]?.Guarantee,
        calcwidth: product[0]?.calcwidth,
        price: product[0]?.price,
        coating: product[0]?.coating,
        color: [],
        id: product[0]?.id,
        key: product[0]?.key,
        material: product[0]?.material,
        blueprint: product[0]?.blueprint,
        materialImg: product[0]?.materialImg,
        //   name: product[0]?.name,
        category: product[0]?.category,
        profile: product[0]?.profile,
        thickness: product[0]?.thickness,
        sizes: product[0]?.sizes,
        tipes: product[0]?.tipes,
        view: product[0]?.view,
        viewImg: product[0]?.viewImg,
      }));
      setImg(product[0]?.blueprint);
      const selectedIndexOfCoat = coat.indexOf(product[0]?.coating);
      product[0]?.color.map((item) =>
        setData((prev) => ({ ...prev, color: [...prev.color, item] })),
      );

      setActiveCoat(selectedIndexOfCoat);
      setShowNewDiv(true);

      // console.log(product[0]?.color);
      // console.log(product[0]);
    }
  }, [goods, productId]);

  useEffect(() => {
    const loadSubcategories = async () => {
      const { data } = await apiClient.get('/subcategories');
      setSubcategories(data || []);
    };
    loadSubcategories();
  }, []);

  useEffect(() => {
    const loadProductSubcategories = async () => {
      if (!productId) return;
      const { data } = await apiClient.get(`/products/${productId}/subcategories`);
      setSelectedSubcategoryId(data?.[0]?.id ? String(data[0].id) : '');
    };
    loadProductSubcategories();
  }, [productId]);

  // onChange для материал
  const handleMaterialChange = (event) => {
    setData({ ...data, material: event.target.value });
  };
  // onChange для вид
  const handleViewChange = (event) => {
    setData({ ...data, view: event.target.value });
  };
  // onChange для типа
  const handleTypesChange = (event) => {
    setData({ ...data, tipes: event.target.value });
  };

  // onChange для цены
  const handlePriceChange = (event) => {
    const value = event.target.value.trim() !== '' ? parseFloat(event.target.value) : null;
    setData({ ...data, price: value });
  };
  // onChange для ширины
  const handleWidthChange = (event) => {
    const value = event.target.value.trim() !== '' ? parseFloat(event.target.value) : null;
    setData({ ...data, calcwidth: value });
  };

  // onChange для размера
  const handleSizeChange = (event) => {
    setData({ ...data, sizes: event.target.value });
  };
  // onChange для размера

  const handleNameChange = (event) => {
    setData({ ...data, name: event.target.value });
  };

  const handleCategoryInputChange = (event) => {
    setData({ ...data, category: event.target.value });
  };

  const handleProfileChange = (event) => {
    setData({ ...data, profile: event.target.value });
  };

  const handleThicknessChange = (event) => {
    setData({ ...data, thickness: event.target.value });
  };

  // onChange для data.Guarantee
  const handleGuaranteeChange = (event) => {
    const value = event.target.value.trim() !== '' ? parseFloat(event.target.value) : null;
    setData({ ...data, Guarantee: value });
  };

  // выбор покрытие

  function addSelectCoating(name) {
    setData({ ...data, coating: name });
  }

  // открыть file input
  function onFocus(e) {
    e.preventDefault();
    inputRef.current.click();
  }

  const addSelectColor = (colorData, event) => {
    if (event) {
      event.preventDefault();
    }
    if (colorData.src === '' || colorData.color.length === 0) {
      alert('Добавьте фото и цвет');
    } else {
      setData((prev) => ({
        ...prev,
        color: [...prev.color, colorData],
      }));
      setShowNewDiv(true);
      setColorModal(false);
      setActiveColor(null);
    }
  };

  // const handleChangeFile = (event) => {
  //   const file = event.target.files[0];
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   if (file) {
  //     console.log(file);
  //     const imageUrl = URL.createObjectURL(file);
  //     setData((prevData) => ({
  //       ...prevData,
  //       blueprint: imageUrl,
  //     }));

  //     // setImgUrl(imageUrl);
  //   }
  // };

  // загрузка фото проекта

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.error('Файл не выбран');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = response.data?.url || '';
      setData((prevData) => ({
        ...prevData,
        blueprint: url,
      }));
      setImg(url);
    } catch (error) {
      console.error('Ошибка при загрузке файла', error);
    }
  };

  const onPatch = async (e) => {
    e.preventDefault();

    try {
      const currentId = productId;
      const payload = { ...data };
      delete payload.key;
      await apiClient.put(`/products/${currentId}`, payload);
      await apiClient.put(`/products/${currentId}/subcategories`, {
        subcategory_ids: selectedSubcategoryId ? [Number(selectedSubcategoryId)] : [],
      });
      alert('Изменено');

      navigate('/admin/control');
    } catch (err) {
      alert('Не удалось изменить файл');
    }
    // const keys = Object.keys(data);
    // console.log(keys);
  };

  // useEffect(()=>{
  //    onPatch()
  // },[])

  const onSend = async (e) => {
    // console.log('sss');
    e.preventDefault();

    // setData([...data, item]);

    try {
      const payload = { ...data };
      delete payload.key;
      const response = await apiClient.post('/products', payload);
      const createdId = response?.data?.id;
      if (createdId) {
        await apiClient.put(`/products/${createdId}/subcategories`, {
          subcategory_ids: selectedSubcategoryId ? [Number(selectedSubcategoryId)] : [],
        });
      }
      alert('Добавлено');

      navigate('/admin/control');
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    dispatch(getGoodAPI());
    dispatch(fetchColors());
    dispatch(fetchCoating());
  }, [dispatch]);
  /// преобразование в массив
  const test = () => {
    const newId = newArray[newArray?.length - 1];

    setData((prev) => ({
      ...prev,
      id: newId?.id + 1,
    }));
  };
  const onDeleteColor = (id, event) => {
    if (event) {
      event.preventDefault();
    }
    if (confirm('Вы действительно хотите удалить цвет')) {
      const filtred = data.color.filter((item) => item.color !== id);
      setData((prev) => ({
        ...prev,
        color: filtred,
      }));
    }
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategoryId(event.target.value);
  };
  // console.log(newArray);
  // console.log(productKey);
  // console.log(data);
  // console.log(location);

  return (
    <div className={styles.addItem}>
      <form action="">
        {/* добавить название */}

        {/* добавить фото */}
        <div className={`${styles.formRow} flex items-center py-2`}>
          <div className="button w-[170px] h-[70px] flex items-center justify-center">
            <button onClick={onFocus}>Фото чертежа</button>
          </div>
          {img && <img className="w-[250px] h-[150px] ml-4" src={img} alt="проект" />}
        </div>

        <div>
          <input ref={inputRef} type="file" hidden onChange={(e) => handleUpload(e)} />
        </div>
        {/* добавить цвет */}
        <h2>
          {' '}
          <h2 className="opacity-[60%] text-[20px]">Добавьте цвета с фото</h2>
        </h2>
        <div className="flex gap-3">
          {/* {productKey === undefined ? (
            <div
              onClick={() => setColorModal(true)}
              className="w-[50px] flex mt-[15px] text-[20px] font-bold bg-[#c5e500] cursor-pointer items-center justify-center h-[50px] border rounded-[50%]">
              +
            </div>
          ) : (
            <h1>Данные не загрузились</h1>
          )} */}
          {/* {data?.color.length == 0 ? (
            <div
              onClick={() => setColorModal(true)}
              className="w-[50px] flex mt-[15px] text-[20px] font-bold bg-[#c5e500] cursor-pointer items-center justify-center h-[50px] border rounded-[50%]">
              +
            </div>
          ) : ( */}
          {data?.color.map((item, idx) => (
            <div className="flex items-center flex-col" key={idx}>
              <div
                style={{
                  width: '80px',
                  height: '60px',
                  borderRadius: '8px',
                  backgroundColor: item?.color,
                  gap: '25px',
                  cursor: 'pointer',
                }}></div>
              <button
                onClick={(event) => onDeleteColor(item.color, event)}
                className="w-[35px] flex mt-[15px] text-[20px] font-bold bg-[#c5e500] cursor-pointer items-center justify-center h-[35px] border rounded-[50%]">
                x
              </button>
            </div>
          ))}

          <div className="flex items-center justify-center">
            <div
              onClick={() => setColorModal(true)}
              className={`${
                showNewDiv ? 'block' : 'hidden'
              } w-[50px] flex  text-[20px] font-bold bg-[#c5e500] cursor-pointer items-center justify-center h-[50px] border rounded-[50%]`}>
              +
            </div>
          </div>
        </div>

        <AdminColors
          addSelectColor={addSelectColor}
          activeColor={activeColor}
          setActiveColor={setActiveColor}
          arr={newColors}
          colorModal={colorModal}
          setColorModal={setColorModal}
          setAddNewColorModal={setAddNewColorModal}
        />
        <ColorModal
          colors={newColors}
          addNewColorModal={addNewColorModal}
          setAddNewColorModal={setAddNewColorModal}
        />

        {/* Покрытие */}
        <Coating
          coating={newCoating}
          addSelectCoating={addSelectCoating}
          activeCoat={activeCoat}
          setActiveCoat={setActiveCoat}
          setIsCoatingModal={setIsCoatingModal}
        />
        <CoatingModal
          arr={newCoating}
          isCoatingModal={isCoatingModal}
          setIsCoatingModal={setIsCoatingModal}
        />

        <div className={`${styles.formRow} flex justify-between mt-[25px]`}>
          {/* материал */}
          <Input
            placeholder="Материал"
            onChange={handleMaterialChange}
            value={data.material}
            type="text"
            width="40%"
          />
          {/* вид */}
          <Input
            placeholder="Вид"
            value={data.view}
            onChange={handleViewChange}
            type="text"
            width="40%"
          />
        </div>
        <div className={`${styles.formRow} flex justify-between items-center`}>
          {' '}
          {/* цена */}
          <Input
            width="40%"
            value={data.price === null ? '' : data.price}
            onChange={handlePriceChange}
            placeholder="Цена"
            type="number"
          />
          {/* Срок */}
          <Input
            width="40%"
            onClick={test}
            onChange={handleGuaranteeChange}
            value={data.Guarantee === null ? '' : data.Guarantee}
            placeholder="Срок"
            type="number"
          />
        </div>
        <div className={`${styles.formRow} flex justify-between mt-[25px]`}>
          {/* размер */}

          <Input
            placeholder="Размер"
            value={data.sizes}
            onChange={handleSizeChange}
            type="number"
            width="40%"
          />
          {/* ширина */}

          <Input
            width="40%"
            value={data.calcwidth === null ? '' : data.calcwidth}
            onChange={handleWidthChange}
            placeholder="Ширина"
            type="number"
          />
        </div>

        <div className={`${styles.formRow} flex justify-between mt-[25px]`}>
          <Input
            placeholder="Имя (не обязательно поле)"
            onChange={handleNameChange}
            type="text"
            width="40%"
          />

          <Input
            width="40%"
            value={data.tipes}
            onChange={handleTypesChange}
            placeholder="Тип"
            type="text"
          />
        </div>

        <div className={`${styles.formRow} flex justify-between mt-[25px]`}>
          <Input
            placeholder="Категория"
            value={data.category}
            onChange={handleCategoryInputChange}
            type="text"
            width="40%"
          />

          <Input
            width="40%"
            value={data.profile}
            onChange={handleProfileChange}
            placeholder="Профиль"
            type="text"
          />
        </div>

        <div className={`${styles.formRow} flex justify-between mt-[25px]`}>
          <Input
            placeholder="Толщина/модель"
            value={data.thickness}
            onChange={handleThicknessChange}
            type="text"
            width="40%"
          />
        </div>

        <div className={`${styles.formRow} flex flex-col mt-[25px]`}>
          <p className="opacity-[60%] text-[16px]">Подкатегория</p>
          <select
            className={styles.adminSelect}
            value={selectedSubcategoryId}
            onChange={handleSubcategoryChange}>
            <option value="">Выберите подкатегорию</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>
        </div>

        {productId ? (
          <div className="flex items-center py-2">
            <div className="button w-[170px] h-[70px] flex items-center justify-center">
              <button onClick={onPatch}>Изменить</button>
            </div>
          </div>
        ) : (
          <div className="flex items-center py-2">
            <div className="button w-[170px] h-[70px] flex items-center justify-center">
              <button onClick={onSend}>Отправить</button>
            </div>
          </div>
        )}
      </form>
      {/* <button onClick={onSendColors}>color</button> */}
    </div>
  );
}
