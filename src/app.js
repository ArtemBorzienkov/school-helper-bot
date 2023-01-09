const { Client } = require('pg')
const TelegramBot = require('node-telegram-bot-api');

const childBotToken = '5840880445:AAGGsOmoRDvBmzahL_CFtymso6ZAxdb1w3A';
const teacherBotToken = '5816908726:AAF1ZC9chK27u0CloRrMkQnZ8wF7uPDm4UE';

const createSchoolsDB = `CREATE TABLE IF NOT EXISTS schools (
  id text not null PRIMARY KEY,
  name text not null,
  region text not null
);`
const createGroupsDB = `CREATE TABLE IF NOT EXISTS groups (
  id text not null,
  school_id text not null,
  name text not null,
  subjects text not null,
  PRIMARY KEY (id, school_id)
);`
const createTeachersDB = `CREATE TABLE IF NOT EXISTS teachers (
  id text not null,
  school_id text not null,
  name text not null,
  subjects text not null,
  groups text not null,
  PRIMARY KEY (school_id, id)
);`
const createSubjectsDB = `CREATE TABLE IF NOT EXISTS subjects (
  school_id text not null,
  group_id text not null,
  teacher_id text not null,
  name text not null,
  home_task text not null,
  updated_at integer not null,
  PRIMARY KEY (school_id, group_id, teacher_id, name)
);`

const queryGetSchools = 'SELECT id, name, region FROM schools'
const queryGetGroupsBySchool = 'SELECT id, school_id, name, subjects FROM groups WHERE school_id=$1'
const queyGetSubjectsByGroupAndSchool = 'SELECT school_id, group_id, teacher_id, name, home_task, updated_at FROM subjects WHERE school_id=$1 AND group_id=$2'
const queryGetCurrTeacherById = 'SELECT id, school_id, name, subjects, groups FROM teachers WHERE id=$1'
const queryGetGroupByIds = 'SELECT id, school_id, name, subjects FROM groups WHERE id IN ('
const queryGetSubjectsByParams = 'SELECT school_id, group_id, teacher_id, name, home_task, updated_at FROM subjects WHERE school_id=$1 AND group_id=$2 AND teacher_id=$3'
const queryGetSubjectsByKey= 'SELECT school_id, group_id, teacher_id, name, home_task, updated_at FROM subjects WHERE school_id=$1 AND group_id=$2 AND teacher_id=$3 AND name=$4'
const queryUpdSubjectHW = 'UPDATE subjects SET home_task=$1, updated_at=$2 WHERE school_id=$3 AND group_id=$4 AND teacher_id=$5 AND name=$6'

let teacherMemoryMap = null
let childMemoryMap = null

const server = {
  childBot: null,
  teacherBot: null,
  pgClient: null,
}

async function ensureDbsCreated() {
  await server.client.query(createSchoolsDB)
  await server.client.query(createGroupsDB)
  await server.client.query(createTeachersDB)
  await server.client.query(createSubjectsDB)
}

async function init() {
  try {
    server.childBot = new TelegramBot(childBotToken, {polling: true});
    server.teacherBot = new TelegramBot(teacherBotToken, {polling: true});
    console.log("🚀 ~ file: app.js:68 ~ init ~ process.env.DB_USER", process.env.DB_USER)
    console.log("🚀 ~ file: app.js:69 ~ init ~ process.env.DB_NAME", process.env.DB_NAME)
    console.log("🚀 ~ file: app.js:69 ~ init ~ process.env.DB_HOST", process.env.DB_HOST)
    console.log("🚀 ~ file: app.js:69 ~ init ~ process.env.DB_PASS", process.env.DB_PASS)
    server.client = new Client({
      connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
    })
  
    teacherMemoryMap = new Map()
    childMemoryMap = new Map()
    await server.client.connect()
    await ensureDbsCreated()
  } catch (e) {
    console.log('error:', e)
  }
  // await seedMockedData()
}

init()

server.childBot.onText(/\/start$/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    console.log(`[childBot] user, with first_name: ${msg.from.first_name} last_name: ${msg.from.last_name} username: ${msg.from.username} id: ${msg.from.id} typed /start`)

    if (childMemoryMap.has(chatId)) {
      childMemoryMap.delete(chatId)
    }

    const res = await server.client.query(queryGetSchools)
    const options = res.rows.map(el => ({
      text: `${el.name} (${el.region})`, 
      callback_data: JSON.stringify({
        school: el.id,
      })
    }))
  
    server.childBot.sendMessage(chatId, `Вітаю ${msg.from.first_name}, виберіть школу`, {
      reply_markup: {
        inline_keyboard: [options]
      }
    })
  } catch (e) {
    console.log('error:', e)
  }
});

server.childBot.on('callback_query', async (q) => {
  try {
    const option = JSON.parse(q.data)
    if (!option) {
      return
    }

    const chatId = q.message.chat.id
    const isShoolChosen = !!option.school
    const isGroupChosen = !!option.group
    const isSubjectChosen = !!option.subject
    const isChooseGroupStage = isShoolChosen && !isGroupChosen && !isSubjectChosen
    const isChooseSubjectStage = isShoolChosen && isGroupChosen && !isSubjectChosen

    if (isChooseGroupStage) {
      const res = await server.client.query(queryGetGroupsBySchool, [option.school])
      const options = res.rows.map(el => ({
        text: el.name, 
        callback_data: JSON.stringify({
          school: option.school,
          group: el.id
        })
      }))

      server.childBot.sendMessage(chatId, `виберіть клас`, {
        reply_markup: {
          inline_keyboard: [options]
        }
      });
      return
    }

    if (isChooseSubjectStage) {
      const res = await server.client.query(queyGetSubjectsByGroupAndSchool, [option.school, option.group])
      childMemoryMap.set(chatId, {
        shool_id: option.school,
        group_id: option.group
      })

      const options = res.rows.map(el => ({
        text: el.name, 
        callback_data: JSON.stringify({
          teacher_id: el.teacher_id,
          subject: el.name
        })
      }))

      server.childBot.sendMessage(chatId, `виберіть предмет`, {
        reply_markup: {
          inline_keyboard: [options]
        }
      });
      return
    }

    const {shool_id, group_id} = childMemoryMap.get(chatId)
    const resSbj = await server.client.query(queryGetSubjectsByKey, [shool_id, group_id, option.teacher_id, option.subject])
    const {home_task = '', updated_at = 0} = resSbj.rows[0]
    const homeTaskMsg = home_task ? `домашнє завдання: ${home_task} (від ${parseDate(updated_at)})` : 'немає інформації'

    server.childBot.sendMessage(chatId, homeTaskMsg);
    server.childBot.sendMessage(chatId, 'для початку роботи відправте повідомлення /start');
    return

  } catch (e) {
    console.log('error:', e)
  }
})

server.childBot.on('message', async (msg) => {
  if (msg.text === '/start') {
    return
  }

  const chatId = msg.chat.id;
  server.childBot.sendMessage(chatId, 'для початку роботи відправте повідомлення /start');
})

server.teacherBot.onText(/\/start$/, async (msg) => {
  try {
    const chatId = msg.chat.id;
    const teacherId = String(msg.from.id);

    console.log(`[teacherBot] user, with first_name: ${msg.from.first_name} last_name: ${msg.from.last_name} username: ${msg.from.username} id: ${msg.from.id} typed /start`)

    if (teacherMemoryMap.has(teacherId)) {
      teacherMemoryMap.delete(teacherId)
    }

    const res = await server.client.query(queryGetCurrTeacherById, [teacherId])
    
    if (res.rows.length !== 1) {
      server.teacherBot.sendMessage(chatId, 'щось пішло не так')
      return 
    }

    const groupIds = res.rows[0].groups.split(',')
    let getGroupsStmt = queryGetGroupByIds
    groupIds.forEach((id, index) => {
      const isLastEl = index + 1 === groupIds.length
      getGroupsStmt = `${getGroupsStmt}'${id}'${isLastEl ? ')' : ','}`
    })

    const groupsRes = await server.client.query(getGroupsStmt)
    const groupsOptions = groupsRes.rows.map(el => ({
      text: el.name, 
      callback_data: JSON.stringify({
        group_id: el.id,
        group: el.name
      })
    }))
  
    server.teacherBot.sendMessage(chatId, `Вітаю ${msg.from.first_name}, виберіть клас`, {
      reply_markup: {
        inline_keyboard: [groupsOptions]
      }
    })
  } catch (e) {
    console.log('error:', e)
  }
});

server.teacherBot.on('callback_query', async (q) => {
  try {
    const option = JSON.parse(q.data)
    if (!option) {
      return
    }

    const chatId = q.message.chat.id
    const teacherId = String(q.from.id);
    const isGroupChosen = !!option.group || !!option.group_id

    const teacherRes = await server.client.query(queryGetCurrTeacherById, [teacherId])
    const schoolId = teacherRes.rows[0].school_id

    if (isGroupChosen) {
      const subjectRes = await server.client.query(queryGetSubjectsByParams, [schoolId, option.group_id, teacherId])
      const subjectOptions = subjectRes.rows.map(el => ({
        text: el.name, 
        callback_data: JSON.stringify({
          subject: el.name,
        })
      }))

      teacherMemoryMap.set(teacherId, {
        school_id: schoolId,
        group_id: option.group_id
      })

      server.teacherBot.sendMessage(chatId, `виберіть предмет`, {
        reply_markup: {
          inline_keyboard: [subjectOptions]
        }
      });
      return
    }

    teacherMemoryMap.set(teacherId, {
      ...teacherMemoryMap.get(teacherId),
      subject: option.subject
    })

    server.teacherBot.sendMessage(chatId, `задайте домашнє завдання`);
    return

  } catch (e) {
    console.log('error:', e)
  }
})

server.teacherBot.on('message', async (msg) => {
  if (msg.text === '/start') {
    return
  }

  const chatId = msg.chat.id;
  const teacherId = String(msg.from.id);

  if (teacherMemoryMap.has(teacherId)) {
    const {school_id, group_id, subject} = teacherMemoryMap.get(teacherId)
    await server.client.query(queryUpdSubjectHW, [msg.text, msg.date, school_id, group_id, teacherId, subject])

    server.teacherBot.sendMessage(chatId, 'домашнє завдання записано');
    server.teacherBot.sendMessage(chatId, 'для початку роботи відправте повідомлення /start');
    teacherMemoryMap.delete(teacherId)
    return
  }

  server.teacherBot.sendMessage(chatId, 'для початку роботи відправте повідомлення /start');
})

function parseDate(d) {
  const date = new Date(d * 1000)
  const months = ['Січня', 'Лютого', 'Березня', 'Квітня', 'Травня', 'Червня', 'Липня', 'Серпня', 'Вересня', 'Жовтня', 'Листопада']
  return `${date.getDate()} ${months[date.getMonth() || 0]} ${date.getFullYear()}`
}

const insertMockSchool1 = `INSERT INTO schools (id, name, region) values (
  '2826700811663785001', 
  'school 1',
  'Харків'
);`

const insertMockSchool2 = `INSERT INTO schools (id, name, region) values (
  '2826700811663785002', 
  'school 2',
  'Київ'
);`

const insertMockGroup1 = `INSERT INTO groups (id, school_id, name, subjects) values (
  '2826700811663785111', 
  '2826700811663785001',
  '11Г',
  'алгебра,геометрія'
);`

const insertMockGroup2 = `INSERT INTO groups (id, school_id, name, subjects) values (
  '2826700811663785112', 
  '2826700811663785001',
  '10А',
  'алгебра,геометрія'
);`

const insertMockGroup3 = `INSERT INTO groups (id, school_id, name, subjects) values (
  '2826700811663785121', 
  '2826700811663785002',
  '5Г',
  'алгебра,геометрія'
);`

const insertMockGroup4 = `INSERT INTO groups (id, school_id, name, subjects) values (
  '2826700811663785122', 
  '2826700811663785002',
  '6А',
  'алгебра,геометрія'
);`

const insertMockTeacher1 = `INSERT INTO teachers (id, school_id, name, subjects, groups) values (
  '658142569',
  '2826700811663785001', 
  'Артем Едуардович',
  'алгебра,геометрія',
  '2826700811663785111,2826700811663785112'
);`

const insertMockTeacher2 = `INSERT INTO teachers (id, school_id, name, subjects, groups) values (
  '255286100',
  '2826700811663785002', 
  'Анна Петрівна',
  'алгебра,геометрія',
  '2826700811663785121,2826700811663785122'
);`

const insertMockSubject1 = `INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
  '2826700811663785002',
  '2826700811663785122', 
  '255286100',
  'алгебра',
  'вивчить хочаб шось',
  1673262317
);`

const insertMockSubject2 = `INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
  '2826700811663785002',
  '2826700811663785121', 
  '255286100',
  'алгебра',
  'вивчить хочаб шось',
  1673262317
);`

const insertMockSubject3 = `INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
  '2826700811663785002',
  '2826700811663785122', 
  '255286100',
  'геометрія',
  'вивчить хочаб шось',
  1673262317
);`

const insertMockSubject4 = `INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
  '2826700811663785002',
  '2826700811663785121', 
  '255286100',
  'геометрія',
  'вивчить хочаб шось',
  1673262317
);`

const insertMockSubject5 = `INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
  '2826700811663785001',
  '2826700811663785112', 
  '658142569',
  'алгебра',
  'вивчить хочаб шось',
  1673262317
);`

const insertMockSubject6 = `INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
  '2826700811663785001',
  '2826700811663785111', 
  '658142569',
  'алгебра',
  'вивчить хочаб шось',
  1673262317
);`

const insertMockSubject7 = `INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
  '2826700811663785001',
  '2826700811663785112', 
  '658142569',
  'геометрія',
  'вивчить хочаб шось',
  1673262317
);`

const insertMockSubject8 = `INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
  '2826700811663785001',
  '2826700811663785111', 
  '658142569',
  'геометрія',
  'вивчить хочаб шось',
  1673262317
);`

async function seedMockedData() {
  await server.client.query(insertMockSchool1)
  await server.client.query(insertMockSchool2)
  await server.client.query(insertMockGroup1)
  await server.client.query(insertMockGroup2)
  await server.client.query(insertMockGroup3)
  await server.client.query(insertMockGroup4)
  await server.client.query(insertMockTeacher1)
  await server.client.query(insertMockTeacher2)
  await server.client.query(insertMockSubject1)
  await server.client.query(insertMockSubject2)
  await server.client.query(insertMockSubject3)
  await server.client.query(insertMockSubject4)
  await server.client.query(insertMockSubject5)
  await server.client.query(insertMockSubject6)
  await server.client.query(insertMockSubject7)
  await server.client.query(insertMockSubject8)
}