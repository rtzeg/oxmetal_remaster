import telebot
import requests
import threading
import json



Token = '6544146847:AAG8Qs8ExdWlnzo_FItxBXMt9aTaNdbKOvE'
# Создаем объект бота
bot = telebot.TeleBot(Token)

url_item = 'https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app/id.json'
url_arr = 'https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app/arr.json'


# Обработчик команды /start
@bot.message_handler(commands=['start'])
def start_handler(message):
    
    
    
    
    def start():
        res = requests.get(url_arr)
        myArr = json.loads(res.text)
        arr = []
        res_items = requests.get(url_item)
        item = json.loads(res_items.text)
        let = list(myArr.keys())
        for i in let:
            arr.append(myArr[i])

        if item != len(arr):

            obj = arr[-1]
            
            bot.send_message(message.chat.id, '____________________' )
            bot.send_message(message.chat.id, f' Имя: {obj["name"]}' )
            bot.send_message(message.chat.id, f' Номер: {obj["tel"]}' )
            bot.send_message(message.chat.id, '____________________' )
            # bot.send_message(message.chat.id, f' коменнтарий: {obj["comment"]}' )
            requests.put(url_item, json=len(arr))
        
    def repeat():
        start()
        threading.Timer(1.0, repeat).start()

    repeat()
    

# Обработчик всех остальных сообщений


# Запускаем бота
bot.polling(non_stop=True)