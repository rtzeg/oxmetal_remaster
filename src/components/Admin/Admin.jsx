import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGoodAPI } from '../../features/goods/thunk';
import styles from './Admin.module.scss';
import Loading from '../Loading';
import AdminItem from './AdminItem';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Test from './Test';

export default function Admin() {
  const data = useSelector((state) => state.goods.data);
  const convertedArr = Object.keys(data);

  const load = useSelector((state) => state.goods.status);
  const newArray = Object.values(data);
  const navigate = useNavigate();

  const combinedArr = newArray.map((item, index) => ({
    value1: item,
    value2: convertedArr[index],
  }));

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(getGoodAPI());
  }, []);

  const navigateHome = () => {
    navigate('/');
  };

  // console.log(data);
  if (load === 'loading') {
    return <Loading />;
  }
  return (
    <section className={styles.admin}>
      <div
        className={`${styles.adminHeader} top-0 flex items-center justify-between h-[80px] w-full bg-white z-[9997] border-b-2 border-[#DBFF00] px-5`}>
        <img onClick={navigateHome} src="../logo.svg" alt="logo" />
        <div className={`${styles.adminHeaderButton} button w-[150px] h-[70px] flex items-center justify-center`}>
          <Link to="/admin/control/add-item">
            <button>Добавить</button>
          </Link>
        </div>
      </div>
      <div className={styles.adminWrapper}>
        {combinedArr?.map((item, idx) => (
          <AdminItem
            key={idx}
            arr={item.value1}
            arr2={item.value2}
            // idx={Math.floor(Math.random() * item.value1?.color?.length)}
          />
        ))}
      </div>
    </section>
  );
}
