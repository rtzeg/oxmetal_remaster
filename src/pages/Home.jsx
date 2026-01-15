// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import ProductCart from "../components/ProductCart";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FreeMode, Pagination, Navigation } from "swiper/modules";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";

import { sendmessage } from "../../utils/sendTgBot";
import { checkCookie, scrollToElement } from "../../utils/functions";
import { goodsToArray } from "../utils/goods";
import { apiClient } from "../utils/api";
import { resolveImageUrl } from "../utils/image";

const Home = () => {
  const goods = useSelector((state) => state.goods.data);

  // SAFE goods -> array
  const newArr = useMemo(() => goodsToArray(goods), [goods]);

  // стабильный цвет вместо Math.random()
  const getStableColorIdx = useCallback((product, fallbackIdx = 0) => {
    const len = Array.isArray(product?.color) ? product.color.length : 0;
    if (!len) return 0;

    const seed = String(product?.id ?? product?._id ?? product?.name ?? fallbackIdx);
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return hash % len;
  }, []);

  const [selectIdx, setSelectIdx] = useState(0);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (selectIdx >= categories.length) setSelectIdx(0);
  }, [selectIdx, categories.length]);

  useEffect(() => {
    const loadCategories = async () => {
      const { data } = await apiClient.get("/categories");
      setCategories(data || []);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    scrollToElement("main_page_preview");
  }, []);

  // numbers animation (без scroll listener)
  const hasAnimated = useRef(false);

  const animateNumber = useCallback((to, elId, duration = 1200) => {
    const el = document.getElementById(elId);
    if (!el) return;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion) {
      el.textContent = String(to);
      return;
    }

    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const value = Math.floor(from + (to - from) * p);
      el.textContent = String(value);
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const first = document.querySelector(".numbers");
    if (!first) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (hasAnimated.current) return;

        hasAnimated.current = true;
        animateNumber(1500, "chislo1", 900);
        animateNumber(27147, "chislo2", 1200);
        animateNumber(50, "chislo3", 900);
        animateNumber(20, "chislo4", 900);
        obs.disconnect();
      },
      { threshold: 0.35 }
    );

    obs.observe(first);
    return () => obs.disconnect();
  }, [animateNumber]);

  // Form
  const message = useRef(null);
  const message2 = useRef(null);
  const [phone, setPhone] = useState("");
  const [checkForm, setCheckForm] = useState(false);
  const [checkCookieSent, setCheckCookieSent] = useState(false);
  const submitTimer = useRef(null);

  const isValidForm = useMemo(() => {
    const name = String(message.current?.value ?? "").trim();
    const formatted = String(message2.current?.state?.formattedNumber ?? "").trim();
    const digits = formatted.replace(/\D/g, "");
    return name.length > 0 && digits.length > 5;
  }, [phone, checkForm]);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const already = !!checkCookie("ChangeForm");
      setCheckCookieSent(already);
      setCheckForm(true);

      if (submitTimer.current) clearTimeout(submitTimer.current);

      if (!isValidForm || already) {
        submitTimer.current = setTimeout(() => setCheckForm(false), 5000);
        return;
      }

      sendmessage(e, message, message2);
      submitTimer.current = setTimeout(() => setCheckForm(false), 5000);
    },
    [isValidForm]
  );

  useEffect(() => {
    return () => {
      if (submitTimer.current) clearTimeout(submitTimer.current);
    };
  }, []);

  // Partners
  const partners = useMemo(
    () => [
      { src: "/slider/slide1.png", alt: "МК" },
      { src: "/slider/slide2.png", alt: "Металл Профиль" },
      { src: "/slider/slide3.webp", alt: "Технониколь" },
      { src: "/slider/slide4.png", alt: "ArcelorMittal" },
      { src: "/slider/slide5.svg", alt: "Северсталь" },
    ],
    []
  );
  const marquee = useMemo(() => [...partners, ...partners], [partners]);

  const currentSelect = categories[selectIdx];

  return (
    <>
      {/* ===== HERO / MAIN PREVIEW (нормальная верстка под 1920 + fonOxMetal.png) ===== */}
      <section id="main_page_preview" className="relative isolate w-full overflow-hidden">
        {/* BG */}
        <img
          src="/fonOxMetal.png"
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover object-left"
          loading="eager"
          fetchPriority="high"
        />

        {/* overlay: слева почти прозрачный, справа белый */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/0 via-white/10 to-white/95 lg:to-white/98" />

        {/* content */}
        <div className="mx-auto flex min-h-[520px] items-center justify-center px-4 sm:min-h-[580px] sm:px-6 lg:min-h-[640px] lg:justify-end lg:px-8">
          <div className="w-full max-w-xl rounded-3xl bg-white/85 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.10)] backdrop-blur-md lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-0">
            <div className="flex items-center gap-3 lg:justify-start justify-center">
              <img src="/logo.svg" alt="Oxmetal" className="h-7 w-auto" />
            </div>

            <h1 className="mt-5 text-center text-4xl font-black leading-[1.05] text-neutral-900 sm:text-5xl lg:text-left">
              СТРОЙ ЖИЗНЬ С{" "}
              <span className="text-neutral-900">КАЧЕСТВОМ</span>
            </h1>

            <p className="mt-4 text-center text-base leading-relaxed text-neutral-700 sm:text-lg lg:text-left">
              Ведущая компания в Узбекистане по поставкам кровельных и фасадных систем.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link
                to="/catalog"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-[#B7D300] px-8 py-4 text-sm font-black text-black transition hover:brightness-95 sm:w-[260px]"
              >
                Открыть каталог
              </Link>

              <button
                type="button"
                onClick={() => scrollToElement("AnyQuestionsOrderConsultation")}
                className="inline-flex w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-8 py-4 text-sm font-black text-neutral-900 shadow-sm transition hover:bg-neutral-50 sm:w-[260px]"
              >
                Получить консультацию
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-neutral-600 lg:text-left">
              Ответим в рабочее время. Без “перезвоним через неделю”.
            </p>
          </div>
        </div>
      </section>


      {/* Каталог + слайдер */}
      <div id="GoTOCatalog" className="flex w-full h-[450px] sm:h-fit justify-between">
        <div className="w-[30%] sm:w-full h-full flex flex-col gap-4 items-center justify-center">
          <p className="leading-[120%] lg:text-2xl font-black text-center text-[53px] w-fit">
            ЧТО ВЫ <wbr /> ИЩИТЕ?
          </p>
          <Link to="/catalog">
            <div className="flex py-[15px] w-fit text-base font-bold button px-[60px]">КАТАЛОГ</div>
          </Link>
        </div>

        <div className="flex items-start gap-5 w-[60%] sm:w-full py-5 h-full">
          {newArr.length > 0 ? (
            <Swiper
              breakpoints={{
                0: { slidesPerView: 1 },
                400: { slidesPerView: 1 },
                639: { slidesPerView: 1.5 },
                950: { slidesPerView: 1.5 },
                1000: { slidesPerView: 2.5 },
                1250: { slidesPerView: 3 },
                1500: { slidesPerView: 3 },
                1700: { slidesPerView: 3 },
                2000: { slidesPerView: 4 },
                2500: { slidesPerView: 4.5 },
              }}
              slidesPerView={2.9}
              spaceBetween={30}
              freeMode
              navigation
              modules={[FreeMode, Navigation, Pagination]}
              className="h-full overflow-hidden w-fit"
            >
              {newArr.map((item, idx) => (
                <SwiperSlide key={item?.id ?? item?._id ?? `${item?.name ?? "item"}-${idx}`}>
                  <ProductCart Product={item} idx={getStableColorIdx(item, idx)} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
        </div>
      </div>

      {/* Продукция */}
      <div id="ProductsMain" className="mt-10">
        <h1>ПРОДУКЦИЯ ОXMETAL</h1>

        <div className="ProductsCreate">
          <div className="ProductsCreateSelects">
            <div className="MainSelectsCreate">
              {categories.length > 0
                ? categories.map((item, idx) => (
                  <div className="MainSelects" onClick={() => setSelectIdx(idx)} key={item.name + idx}>
                    <div className="SelectsImg">
                      <img
                        className={selectIdx === idx ? "SelectsImgBg SelectsImgBgActive" : "SelectsImgBg"}
                        src="/icons/Star 7.svg"
                        alt=""
                      />
                      {item.iconUrl && (
                        <img className="SelectsImgIcon" src={resolveImageUrl(item.iconUrl)} alt="" />
                      )}
                    </div>
                    <p>{item.name}</p>
                  </div>
                ))
                : null}
            </div>
          </div>

          <div className="ProductsCreateOptions">
            {currentSelect
              ? currentSelect.subcategories?.map((item, idx) => (
                <button
                  type="button"
                  className="ProductsCreateOptionsElem"
                  onClick={() => navigate(`/catalog?subcategory=${item.id}`)}
                  key={item.name + idx}
                >
                  {item.iconUrl && <img src={resolveImageUrl(item.iconUrl)} alt="" />}
                  <p>{item.name}</p>
                </button>
              ))
              : null}
          </div>
        </div>
      </div>

      {/* Как мы работаем */}
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

          <div className="numbers">
            <span id="chislo2">0</span>
            <p className="a">
              Квадратных <br />
              метров
            </p>
          </div>

          <div className="numbers">
            <span id="chislo3">0</span>
            <p className="a">Контрагентов</p>
          </div>

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
                В крупных городах работают филиалы компании. Некоторые заказы можно забрать напрямую со
                склада или мы доставим на терминал ТК.
              </p>
            </div>

            <div className="pros_item" data-aos="fade-down" data-aos-duration="1000">
              <img src="./img/aboutImg1.svg" width="73px" alt="" />
              <h1>Выгодное сотрудничество</h1>
              <p>
                Мы нацелены на долгое сотрудничество с клиентами и партнерами, поэтому создаем максимально
                комфортные условия для совместной работы.
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
                Ведущая компания по решениям фасадных и кровельных систем. Офицальная гарантия на каждую
                продукцую. По современным Российским технологияи и ГОСТ-стандартам
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Партнёры (marquee) */}
      <h1 className="logo_about">Наши партнеры</h1>
      <section className="w-[90%] mx-auto my-5">
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="group overflow-hidden py-6">
            <div
              className="flex items-center gap-7 w-max px-6"
              style={{ animation: "oxMarquee 22s linear infinite" }}
            >
              {marquee.map((p, idx) => (
                <div
                  key={`${p.alt}-${idx}`}
                  className="flex items-center justify-center h-[72px] w-[180px] rounded-2xl border border-black/10 bg-white shadow-[0_6px_20px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-[2px] hover:border-black/20 hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]"
                >
                  <img
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    className="max-h-[38px] w-auto opacity-70 grayscale transition-all duration-200 hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              ))}
            </div>

            <style>{`
              @keyframes oxMarquee { 
                from { transform: translateX(0); } 
                to { transform: translateX(-50%); } 
              }
              .group:hover > div { animation-play-state: paused !important; }
            `}</style>
          </div>
        </div>
      </section>

      {/* FAQ + консультация */}
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
                  <br /><br />
                  Во-первых, у нас есть каталог, в котором представлены наши товары с указанием цен.
                  Вы можете ознакомиться с каталогом и выбрать необходимые материалы, а затем умножить их
                  стоимость на нужное количество.
                  <br /><br />
                  Во-вторых, на нашем сайте доступен калькулятор цен, который позволяет вам самостоятельно
                  рассчитать стоимость товара. Вы можете выбрать нужные параметры и указать необходимые
                  размеры или количество, и калькулятор автоматически вычислит общую стоимость конструкции
                  на основе текущих цен.
                </p>
              </div>

              <input type="checkbox" name="chacor" id="chacor2" />
              <label htmlFor="chacor2">
                Могу ли я заказать индивидуальные товары с выбором толщины материала и цены?
              </label>
              <div className="acor-body">
                <p>
                  Да, у нас есть возможность заказать индивидуальные товары по вашим требованиям. Мы
                  предлагаем широкий выбор материалов с разной толщиной, и вы можете выбрать наиболее
                  подходящую для ваших потребностей.
                  <br /><br />
                  Кроме того, вы также можете указать желаемую цену для этих индивидуальных товаров.
                  Наша команда свяжется с вами для обсуждения подробностей.
                </p>
              </div>

              <input type="checkbox" name="chacor" id="chacor4" />
              <label htmlFor="chacor4">Как с нами связаться?</label>
              <div className="acor-body">
                <p>
                  Наша компания предлагает бесплатную консультацию для всех клиентов.
                  <br /><br />
                  Обратившись к нам, вы получите рекомендации по выбору и использованию металлпрофиля для ваших проектов.
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
            <form onSubmit={onSubmit}>
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
                    country="uz"
                    value={phone}
                    onChange={(val) => setPhone(val)}
                  />
                </div>
              </label>

              {checkForm ? (
                <>
                  {isValidForm ? (
                    <>
                      {checkCookieSent ? (
                        <p className="my-5 opacity-50">Вы уже отправляли заявку повторите позже</p>
                      ) : (
                        <p className="my-5 opacity-50">Заявка отправлена. Мы свяжемся с вами в течение 2х рабочих дней</p>
                      )}
                    </>
                  ) : (
                    <p className="my-5 opacity-50">Заполните поля</p>
                  )}
                </>
              ) : null}

              <label className="FormBtn">
                <button id="ConsultationSubmit">ОТПРАВИТЬ</button>
                <span>
                  Нажимая кнопку «Отправить», я даю своё согласие на обработку и распространение персональных данных.
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
