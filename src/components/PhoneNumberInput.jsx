// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
// import "react-phone-input-2/lib/style.css"; // импорт стилей, если необходимо
import PhoneInput from "react-phone-input-2";

const PhoneNumberInput = () => {
    const [phone, setPhone] = useState('');

    const handleOnChange = (value) => {
      setPhone(value);
    };
  
    return (
        <div>
          <h2>Ввод номера телефона</h2>
          <PhoneInput
            country={'uz'} // Укажите страну по умолчанию (например, 'us' для США)
            value={phone}
            onChange={handleOnChange}
          />
        </div>
      );
};

export default PhoneNumberInput;
