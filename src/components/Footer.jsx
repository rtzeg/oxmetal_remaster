
const Footer = () => {
    return (
        <footer className="mx-auto max-w-[1920px] ">
        <ul>
          <li>
            <h1>Каталог</h1>
            <div className="footerLinks">
              <a className="hover:text-[#C5E500]" href="#">
                <p>Продукция</p>
              </a>
              <a className="hover:text-[#C5E500]" href="#">
                <p>Производство</p>
              </a>
              <a className="hover:text-[#C5E500]" href="#">
                <p>Услуги</p>
              </a>
            </div>
          </li>
          <li>
            <h1>Клиентам</h1>
            <div className="footerLinks">
              <a className="hover:text-[#C5E500]" href="#">
                <p>О компании</p>
              </a>
              <a className="hover:text-[#C5E500]" href="#">
                <p>Новости</p>
              </a>
            </div>
          </li>
          <li>
            <h1>Документы</h1>
            <div className="footerLinks">
              <a className="hover:text-[#C5E500]" href="#">
                <p>Сертификат</p>
              </a>
              <a className="hover:text-[#C5E500]" href="#">
                <p>Награды</p>
              </a>
            </div>
          </li>
          <li>
            <h1>Контакты</h1>
            <div className="footerLinks">
              <a className="hover:text-[#C5E500]" href="tel:+998910130013"
                ><img src="/icons/phone.png" alt="" />
                <p>+998 91 013 00 13</p>
              </a>
              <a className="hover:text-[#C5E500]" href="mailto:"
                ><img src="/icons/mail.png" alt="" />
                <p>oxriverconstruction@info.com</p>
              </a>
              <a className="hover:text-[#C5E500]" href="https://yandex.uz/maps/-/CCUOjBx~2B"
                ><img src="/icons/marker.png" alt="" />
                <p>г.Ташкент</p>
              </a>
            </div>
          </li>
        </ul>
      </footer>
    );
};

export default Footer;