import axios from "axios";
import { checkCookie } from "./functions";

export function sendmessage(evt, message, message2) {
  evt.preventDefault();

  let mes = message.current.value;
  let mes2 = message2.current.state.formattedNumber;
  let chatId = "6296201390"
  let botToken = "6544146847:AAG8Qs8ExdWlnzo_FItxBXMt9aTaNdbKOvE"
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  // Проверяем наличие cookie с именем 'myCookie'
  if (checkCookie("ChangeForm")) {
    // console.log('Cookie "myCookie" существует.');
    // let form = document.querySelectorAll(".form-control");
    // form.forEach((i) => {
    //   i.value = "+998";
    // });
    // message.current.value = "";
    // message2.current.state.formattedNumber = "+998";
    
  } else {
    if (mes.length > 0 && mes2.length > 0) {
      const now = new Date();
      const time = now.getTime();
      const expireTime = time + 1 * 60 * 1000; // 10 минут в миллисекундах
      const message3 = `Имя: ${mes}\nНомер: ${mes2}`;
      const params = {
        chat_id: chatId,
        text: message3,
        parse_mode: "Markdown", // Указываем, что текст содержит разметку Markdown
      };
      axios.post(apiUrl, params).then(() => {
        now.setTime(expireTime);
        document.cookie = `ChangeForm=ChangeForm; expires=${now.toUTCString()}; path=/`;
        let form = document.querySelectorAll(".form-control");
        setTimeout(() => {
          form.forEach((i) => {
            i.value = "+998";
          });
          message.current.value = "";
          message2.current.state.formattedNumber = "+998";
        }, 1000);
      });
    }
  }
}