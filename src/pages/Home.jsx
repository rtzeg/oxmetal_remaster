// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useRef, useState } from 'react';
import ProductCart from '../components/ProductCart';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { FreeMode, Pagination, Navigation } from 'swiper/modules';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '../contexts/Modal';
import PhoneInput from 'react-phone-input-2';
import axios from 'axios';
import { sendmessage } from '../../utils/sendTgBot';
import { checkCookie, scrollToElement } from '../../utils/functions';

const Home = () => {
  const goods = useSelector((state) => state.goods.data);
  const newArr = Object.values(goods);

  const { OpenModal, setOpenModal } = useContext(Modal);
  const [SelectArr, setSelectArr] = useState([]);
  const [SelectIdx, setSelectIdx] = useState(0);
  const [FormData, setFormData] = useState({});
  const message = useRef(null);
  const message2 = useRef(null);
  const navigate = useNavigate();
  const [CheckForm, setCheckForm] = useState(false);
  const [CheckCokkie, setCheckCokkie] = useState(false);
  useEffect(() => {
    let View = [];
    function create_category(arr, key, new_arr) {
      for (let item of arr) {
        new_arr.push(item[key]);
      }
    }
    create_category(newArr, 'view', View);
   
    View = [...new Set(View)];
    let ProductsArr = [];

    function getSelects() {
      for (let view of View) {
        let fillSelectMater = newArr.filter(
          (item) => item.view.toLowerCase() === view.toLowerCase(),
        );
        let materObj = [];
        for (let mater of fillSelectMater) {
          materObj.push({
            icon: mater.materialImg,
            name: mater.material,
          });
        }
        const table = {};
        const res = materObj.filter(({ name }) => !table[name] && (table[name] = 1));
        ProductsArr.push({
          type: view,
          img: fillSelectMater[0].viewImg,
          arr: res,
        });
      }
      ProductsArr = [...new Set(ProductsArr)];
      
    
      
      const filtredArr = ProductsArr.filter((item)=> item.img !== '') 
        setSelectArr(filtredArr);
     
       
        
      
      
    }

    getSelects();
  }, []);

  useEffect(() => {
    scrollToElement('main_page_preview');
  }, []);

  //нарастаюшие цифры
  ///////////////////////////////////////////////////////////////////////////////////
  let time = 2000;
  let s = false;
  function numbers(num, el, step) {
    if (s === false) {
      let n = document.querySelector(`#${el}`);
      let chislo = 0;
      let timing = Math.floor(time / (num / step));
      let interval = setInterval(() => {
        chislo = chislo + step;
        if (chislo >= num) {
          clearInterval(interval);
          if (chislo > num) {
            chislo = num;
          }
        }
        n.textContent = chislo;
      }, timing);
    }
  }
  function isElementInViewport(element) {
    var rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function handleScroll() {
    var animatedElements = document.querySelectorAll('.numbers');
    animatedElements.forEach(function (element) {
      if (isElementInViewport(element)) {
        numbers(1500, 'chislo1', 30);
        numbers(27147, 'chislo2', 140);
        numbers(50, 'chislo3', 1);
        numbers(20, 'chislo4', 1);
        s = true;
      }
    });
  }
  window.addEventListener('scroll', handleScroll);
  console.log(SelectArr)
  ///////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {/* <div className="flex items-center justify-between ">
        <div className="w-[49%] ">
          <img src="/fonOxMetal.png" className="w-[100%]" alt="" />
        </div>

        <div className="max-w-[49%] pr-5">
          <img
            src="/logoTitle.svg"
            className="w-[244px] mb-[30px] mb:w-[80%] mb:mb-5"
            alt=""
          />
          <h1
            className="text-[68px] text-[#1e1e1e] font-[900] leading-[7 5px] 
                mb:text-[20px] mb:leading-[35px] md:text-[39px] md:leading-[75px]
                lg:text-[45px] lg:leading-[75px] exl:text-[68px] exl:leading-[75px] 
                "
          >
            СТРОЙ ЖИЗНЬ С КАЧЕСТВОМ
          </h1>
          <p className="text-[32px] text-[#6A6A6A] font-[400] leading-[40px] lg:hidden ">
            Ведущая компания в Узбекистане по производству строительных
            компонентов.
          </p>
        </div>
      </div> */}
      <div id="main_page_preview">
        <div className="prewiew_mask" data-aos="fade-right"></div>
        <div className="prewiew_left_side" data-aos="fade-left">
          <img src="/icons/main_Page_logo.png" className="main_page_logo" alt="" />
          <h1>СТРОЙ ЖИЗНЬ С КАЧЕСТВОМ</h1>

          <p>Ведущая компания в Узбекистане по поставкам кровельных и фасадных систем.</p>
        </div>
      </div>
      <div id="GoTOCatalog" className="flex w-full h-[450px] sm:h-fit justify-between">
        <div className=" w-[30%] sm:w-full h-full flex flex-col gap-4 items-center justify-center">
          <p className="leading-[120%] lg:text-2xl font-black text-center text-[53px] w-fit">
            ЧТО ВЫ <wbr /> ИЩИТЕ?
          </p>
          <Link to={'/catalog'}>
            <div className="flex py-[15px] w-fit text-base font-bold button px-[60px]">КАТАЛОГ</div>
          </Link>
        </div>
        <div className="flex items-start gap-5 w-[60%] sm:w-full    py-5  h-full">
          {newArr.length > 0 ? (
            <Swiper
              style={
                {
                  // "--swiper-navigation-color": "red !important",
                  // "--swiper-pagination-color": "#00000",
                }
              }
              breakpoints={{
                0: {
                  slidesPerView: 1,
                },
                400: {
                  slidesPerView: 1,
                },
                639: {
                  slidesPerView: 1.5,
                },
                950: {
                  slidesPerView: 1.5,
                },
                1000: {
                  slidesPerView: 2.5,
                },
                1250: {
                  slidesPerView: 3,
                },
                1500: {
                  slidesPerView: 3,
                },
                1700: {
                  slidesPerView: 3,
                },
                2000: {
                  slidesPerView: 4,
                },
                2500: {
                  slidesPerView: 4.5,
                },
              }}
              slidesPerView={2.9}
              spaceBetween={30}
              freeMode={true}
              navigation={true}
              modules={[FreeMode, Navigation, Pagination]}
              className="h-full overflow-hidden w-fit">
              {newArr.map((item, idx) => (
                <SwiperSlide key={idx}>
                  {' '}
                  <ProductCart Product={item} idx={Math.floor(Math.random() * item.color.length)} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
        </div>
      </div>
      <div id="ProductsMain" className="mt-10 ">
        <h1>ПРОДУКЦИЯ ОXMETAL</h1>

        <div className="ProductsCreate">
          <div className="ProductsCreateSelects">
            <div className="MainSelectsCreate">
              {SelectArr.length > 0
                ? SelectArr.map((item, idx) => (
                    <div
                      className="MainSelects"
                      onClick={() => {
                        setSelectIdx(idx);
                      }}
                      key={item.type + idx}>
                      <div className="SelectsImg">
                        <img
                          className={
                            SelectIdx == idx ? 'SelectsImgBg SelectsImgBgActive ' : 'SelectsImgBg  '
                          }
                          src="/icons/Star 7.svg"
                          alt=""
                        />
                        <img className="SelectsImgIcon" src={item.img} alt="" />
                      </div>
                      <p>{item.type}</p>
                    </div>
                  ))
                : null}
            </div>
          </div>

          <div className="ProductsCreateOptions">
            {SelectArr.length > 0
              ? SelectArr[SelectIdx].arr.map((item, idx) => (
                  <Link
                    to={'/catalog'}
                    onClick={() => {
                      localStorage.setItem('fillGood', item.name);
                    }}
                    key={item.name + idx}>
                    <div className="ProductsCreateOptionsElem ">
                      <img src={item.icon} alt="" />
                      <p>{item.name}</p>
                    </div>
                  </Link>
                ))
              : null}

            {/* <div className="ProductsCreateOptionsElem">
              <img src="/icons/free-icon-roof-63505241.svg" alt="" />
              <p>Крепеж</p>
            </div> */}
          </div>
        </div>
      </div>

      <div id="about_company">
        <h1 className="logo_about">КАК МЫ РАБОТАЕМ</h1>

        <div className="gap-5 about_company_numbers xl:grid xl:grid-cols-2 xl:justify-items-center ss:grid-cols-1">
          <div className="numbers">
            <span id="chislo1">0</span>
            <p className="a">
              Отгруженных <br />
              товаров
            </p>
          </div>
          {/* <div className="border border1"></div> */}
          <div className="numbers">
            <span id="chislo2">0</span>
            <p className="a">
              Квадратных <br />
              метров
            </p>
          </div>
          {/* <div className="border border2"></div> */}

          <div className="numbers">
            <span id="chislo3">0</span>
            <p className="a">Контрагентов</p>
          </div>
          {/* <div className="border border3"></div> */}

          <div className="numbers">
            <span id="chislo4">0</span>
            <p className="a">
              Крупных компаний <br />
              поставщиков
            </p>
          </div>
        </div>
        <div className="about_company_pros">
          <div className="about_company_pros_top">
            <div className="pros_item" data-aos="fade-down" data-aos-duration="1000">
              <img src="./img/aboutImg2.svg" width="73px" alt="" />
              <h1>Быстрая доставка</h1>
              <p>
                В крупных городах работают филиалы компании. Некоторые заказы можно забрать напрямую
                со склада или мы доставим на терминал ТК.
              </p>
            </div>
            <div className="pros_item" data-aos="fade-down" data-aos-duration="1000">
              <img src="./img/aboutImg1.svg" width="73px" alt="" />
              <h1>Выгодное сотрудничество</h1>
              <p>
                Мы нацелены на долгое сотрудничество с клиентами и партнерами, поэтому создаем
                максимально комфортные условия для совместной работы.
              </p>
            </div>
          </div>
          <div className="about_company_pros_bottom">
            <div className="pros_item" data-aos="fade-up" data-aos-duration="1000">
              <img src="/icons/aboutImg4.svg" width="73px" alt="" />
              <h1>Индивидуальная цена</h1>
              <p>
                Снизим цену специально для Вас! Мы следим за ценами и удерживаем конкурентные. Для
                постоянных партнеров присутствует скидка на дальнейшие заказы.
              </p>
            </div>
            <div className="pros_item" data-aos="fade-up" data-aos-duration="1000">
              <img src="./img/aboutImg3.svg" width="73px" alt="" />
              <h1>Высокое качество</h1>
              <p>
                Ведущая компания по решениям фасадных и кровельных систем. Офицальная гарантия на
                каждую продукцую. По современным Российским технологияи и ГОСТ-стандартам
              </p>
            </div>
          </div>
        </div>
      </div>
      <h1 className="logo_about">Наши партнеры</h1>
      <div
        id="slider"
        className="w-[90%] mx-auto relative  my-5 border-[#C5E500] border-solid overflow-hidden border-[2px] h-[120px] ">
        <div className="absolute flex items-center justify-between h-full gap-10 p-5 w-fit ">
          <div className="flex items-center gap-10 sliderWraper">
            <div className="w-fit">
              <img src="/slider/slide1.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide2.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide3.webp" className=" max-w-[150px] w-[100px] h-hull" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide4.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide5.svg" className=" max-w-[150px] " alt="" />
            </div>
          </div>

          <div className="flex items-center gap-10 sliderWraper">
            <div className="w-fit">
              <img src="/slider/slide1.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide2.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide3.webp" className=" max-w-[150px] w-[100px] h-hull" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide4.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide5.svg" className=" max-w-[150px] " alt="" />
            </div>
          </div>

          <div className="flex items-center gap-10 sliderWraper">
            <div className="w-fit">
              <img src="/slider/slide1.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide2.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide3.webp" className=" max-w-[150px] w-[100px] h-hull" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide4.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide5.svg" className=" max-w-[150px] " alt="" />
            </div>
          </div>

          <div className="flex items-center gap-10 sliderWraper">
            <div className="w-fit">
              <img src="/slider/slide1.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide2.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide3.webp" className=" max-w-[150px] w-[100px] h-hull" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide4.png" className=" max-w-[150px]" alt="" />
            </div>
            <div className="w-fit">
              <img src="/slider/slide5.svg" className=" max-w-[150px] " alt="" />
            </div>
          </div>
        </div>
      </div>
      <div id="AnyQuestionsOrderConsultation">
        <div className="AnyQuestionsMain">
          <div className="AnyQuestions">
            <h1 className="AnyQuestionsLogo">Остались вопросы?</h1>
          </div>
          <div id="AnyQuestionsSelect">
            <div className="acor-container">
              <input type="checkbox" name="chacor" id="chacor1" />
              <label htmlFor="chacor1">Как вы подсчитываете стоимость конструкции?</label>
              <div className="acor-body">
                <p>
                  У нас есть два способа подсчета стоимости конструкции.
                  <br />
                  <br />
                  Во-первых, у нас есть каталог, в котором представлены наши товары с указанием цен.
                  Вы можете ознакомиться с каталогом и выбрать необходимые материалы, а затем
                  умножить их стоимость на нужное количество.
                  <br />
                  <br />
                  Во-вторых, на нашем сайте доступен калькулятор цен, который позволяет вам
                  самостоятельно рассчитать стоимость товара. Вы можете выбрать нужные параметры и
                  указать необходимые размеры или количество, и калькулятор автоматически вычислит
                  общую стоимость конструкции на основе текущих цен.
                </p>
              </div>

              <input type="checkbox" name="chacor" id="chacor2" />
              <label htmlFor="chacor2">
                Могу ли я заказать индивидуальные товары с выбором толщины материала и цены?
              </label>
              <div className="acor-body">
                <p>
                  Да, у нас есть возможность заказать индивидуальные товары по вашим требованиям. Мы
                  предлагаем широкий выбор материалов с разной толщиной, и вы можете выбрать
                  наиболее подходящую для ваших потребностей.
                  <br />
                  <br />
                  Кроме того, вы также можете указать желаемую цену для этих индивидуальных товаров.
                  Наша команда свяжется с вами для обсуждения подробностей и предоставит вам точную
                  информацию о возможностях и ценах для вашего заказа.
                </p>
              </div>
              {/* 
                <!-- <input type="checkbox" name="chacor" id="chacor3" />
              <label for="chacor3">Rock</label>
              <div class="acor-body">
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia nostrum qui consequuntur ullam quisquam error harum rerum, minus sunt nobis ut eveniet totam assumenda. Veritatis harum molestias laborum eligendi repellat?</p>
              </div> --> */}

              {/* <!-- <img src="/icons/134224_add_plus_new_icon.svg" alt="" srcset=""> --> */}
              <input type="checkbox" name="chacor" id="chacor4" />
              <label className="" htmlFor="chacor4">
                Как с нами связаться?
              </label>
              <div className="acor-body">
                <p>
                  Наша компания, специализирующаяся на тонколистовой отрасли, предлагает бесплатную
                  консультацию для всех клиентов. <br />
                  <br />
                  Обратившись к нам, вы получите профессиональные рекомендации и советы по выбору и
                  использованию металлпрофиля для ваших проектов.
                  <br />
                  <br />
                  Не упустите возможность получить бесплатную консультацию от опытных экспертов в
                  области металлпрофиля и достигните успеха в ваших строительных задачах.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="OrderConsultationMain">
          <div className="OrderConsultation">
            <h1 className="OrderConsultationLogo">Заказать консультацию</h1>
          </div>

          <div className="OrderConsultationForm">
            <form
              onSubmit={(e) => {
                if (checkCookie('ChangeForm')) {
                  setCheckCokkie(true);
                } else {
                  setCheckCokkie(false);
                }
                sendmessage(e, message, message2);
                setCheckForm(true);
                setTimeout(() => {
                  setCheckForm(false);
                }, 5000);
              }}>
              <label className="inputs">
                <input
                  ref={message}
                  className="ConsultationInpName"
                  type="text"
                  name="Name"
                  placeholder="Ваше имя"
                />

                <div className="inp">
                  <PhoneInput
                    ref={message2}
                    className="ConsultationInpPhone"
                    country={'uz'} // Укажите страну по умолчанию (например, 'us' для США)
                    value={''}
                  />
                </div>
              </label>
              {CheckForm ? (
                <>
                  {message.current.value.length > 0 &&
                  message2.current.state.formattedNumber.length > 5 ? (
                    <>
                      {CheckCokkie ? (
                        <p className="my-5 opacity-50 ">
                          Вы уже отправляли заявку повторите позже
                        </p>
                      ) : (
                        <p className="my-5 opacity-50 ">
                          Заявка отправлена . Мы свяжемся с вами в течении 2х рабочих дней
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="my-5 opacity-50 ">Заполните поля</p>
                    </>
                  )}
                </>
              ) : null}

              <label className="FormBtn">
                <button id="ConsultationSubmit">ОТПРАВИТЬ</button>
                <span>
                  Нажимая кнопку «Отправить», я даю своё согласие на обработку и распространение
                  персональных данных.
                </span>
              </label>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
