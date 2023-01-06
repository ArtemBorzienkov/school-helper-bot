const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5840880445:AAGGsOmoRDvBmzahL_CFtymso6ZAxdb1w3A';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const db_mock = {
  'SHOOL_test_1': {
    '5A': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '5Б': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '5В': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '5Г': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '6A': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '6Б': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '6В': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '6Г': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '7A': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '7Б': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '7В': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '7Г': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '8A': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '8Б': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '8В': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '8Г': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '9A': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '9Б': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '9В': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '9Г': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '10A': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '10Б': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '10В': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '10Г': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '11A': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '11Б': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '11В': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
    '11Г': {
      'math': '1 - calculate 2+2',
      'physics': '1 - what is electricity',
      'music': '1 - sing some song',
    },
  },
}

db_mock['SHOOL_test_2'] = db_mock['SHOOL_test_1']



const classes5 = ['5A', '5Б', '5B', '5Г']
const classes6 = ['6A', '6Б', '6B', '6Г']
const classes7 = ['7A', '7Б', '7B', '7Г']
const classes8 = ['8A', '8Б', '8B', '8Г']
const classes9 = ['9A', '9Б', '9B', '9Г']
const classes10 = ['10A', '10Б', '10B', '10Г']
const classes11 = ['11A', '11Б', '11B', '11Г']

bot.onText(/\/start$/, (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, `Вітаю ${msg.from.first_name}, виберіть школу`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Shool 1', 
            callback_data: JSON.stringify({
              shool: 'SHOOL_test_1',
              group: '',
              subject: ''
            }),
          }, 
          {
            text: 'Shool 2', 
            callback_data: JSON.stringify({
              shool: 'SHOOL_test_2',
              group: '',
              subject: ''
            }),
          }
        ],
      ]
    }
  });
});

bot.on('callback_query', (q) => {
  try {
    const chatId = q.message.chat.id
    const option = JSON.parse(q.data)
    const isShoolChosen = !!option.shool
    const isGroupChosen = !!option.group
    const isSubjectChosen = !!option.subject
    const testArr = getGroups(option)

    if (isShoolChosen && !isGroupChosen && !isSubjectChosen) {
      bot.sendMessage(chatId, `виберіть класс`, {
        reply_markup: {
          inline_keyboard: getGroups(option)
        }
      });
      return
    }

    if (isShoolChosen && isGroupChosen && !isSubjectChosen) {
      bot.sendMessage(chatId, `виберіть предмет`, {
        reply_markup: {
          inline_keyboard: [getSubjects(option)]
        }
      });
      return
    }

    if (isShoolChosen && isGroupChosen && isSubjectChosen) {
      bot.sendMessage(chatId, `домашнє завддання: ${db_mock[option.shool][option.group][option.subject] || 'немає інформації'}`);
      return
    }

    bot.sendMessage(chatId, 'query received')
  } catch (e) {
    console.warn(e)
  }
})

function getSubjects(option) {
  return [
    {text: 'Математика', callback_data: getCallbackBySubject(option, 'math')},
    {text: 'Фізика', callback_data: getCallbackBySubject(option, 'physics')},
    {text: 'Музика', callback_data: getCallbackBySubject(option, 'music')},
  ]
}

function getCallbackBySubject(data, subject) {
  return JSON.stringify({...data, subject})
} 

function getGroups(option) {
  return [
    classes5.map((item) => ({text: item, callback_data: getCallbackByClass(option, item)})),
    classes6.map((item) => ({text: item, callback_data: getCallbackByClass(option, item)})),
    classes7.map((item) => ({text: item, callback_data: getCallbackByClass(option, item)})),
    classes8.map((item) => ({text: item, callback_data: getCallbackByClass(option, item)})),
    classes9.map((item) => ({text: item, callback_data: getCallbackByClass(option, item)})),
    classes10.map((item) => ({text: item, callback_data: getCallbackByClass(option, item)})),
    classes11.map((item) => ({text: item, callback_data: getCallbackByClass(option, item)}))
  ]
}

function getCallbackByClass(data, group) {
  return JSON.stringify({...data, group})
} 