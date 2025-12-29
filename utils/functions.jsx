export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" }); // Прокручиваем плавно
  }
};

export function checkCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    // Проверяем, начинается ли текущая cookie с указанного имени
    if (cookie.startsWith(name + "=")) {
      return true;
    }
  }
  return false;
}
