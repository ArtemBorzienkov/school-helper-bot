-- CREATE TABLE IF NOT EXISTS groups (
--   id text not null,
--   school_id text not null,
--   name text not null,
--   subjects text not null,
--   PRIMARY KEY (id, school_id)
-- );

-- CREATE TABLE IF NOT EXISTS schools (
--   id text not null PRIMARY KEY,
--   name text not null,
--   region text not null
-- );

-- CREATE TABLE IF NOT EXISTS teachers (
--   id text not null,
--   school_id text not null,
--   name text not null,
--   subjects text not null,
--   groups text not null,
--   PRIMARY KEY (school_id, id)
-- );

-- CREATE TABLE IF NOT EXISTS subjects (
--   school_id text not null,
--   group_id text not null,
--   teacher_id text not null,
--   name text not null,
--   home_task text not null,
--   updated_at integer not null,
--   PRIMARY KEY (school_id, group_id, teacher_id, name)
-- );

-- DELETE FROM schools;
-- DELETE FROM groups;
-- DELETE FROM teachers;
-- DELETE FROM subjects;

-- DROP TABLE subjects

-- INSERT INTO schools (id, name, region) values (
--   '2826700811663785001', 
--   'school 1',
--   'Харків'
-- );

-- INSERT INTO schools (id, name, region) values (
--   '2826700811663785002', 
--   'school 2',
--   'Київ'
-- );

-- INSERT INTO groups (id, school_id, name, subjects) values (
--   '2826700811663785111', 
--   '2826700811663785001',
--   '11Г',
--   'алгебра,геометрія'
-- );

-- INSERT INTO groups (id, school_id, name, subjects) values (
--   '2826700811663785112', 
--   '2826700811663785001',
--   '10А',
--   'алгебра,геометрія'
-- );

-- INSERT INTO groups (id, school_id, name, subjects) values (
--   '2826700811663785121', 
--   '2826700811663785002',
--   '5Г',
--   'алгебра,геометрія'
-- );

-- INSERT INTO groups (id, school_id, name, subjects) values (
--   '2826700811663785122', 
--   '2826700811663785002',
--   '6А',
--   'алгебра,геометрія'
-- );

-- INSERT INTO teachers (id, school_id, name, subjects, groups) values (
--   '658142569',
--   '2826700811663785001', 
--   'Артем Едуардович',
--   'алгебра,геометрія',
--   '2826700811663785111,2826700811663785112'
-- );

-- INSERT INTO teachers (id, school_id, name, subjects, groups) values (
--   '255286100',
--   '2826700811663785002', 
--   'Анна Петрівна',
--   'алгебра,геометрія',
--   '2826700811663785121,2826700811663785122'
-- );


-- INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
--   '2826700811663785002',
--   '2826700811663785122', 
--   '255286100',
--   'алгебра',
--   'вивчить хочаб шось',
--   1673262317
-- );

-- INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
--   '2826700811663785002',
--   '2826700811663785121', 
--   '255286100',
--   'алгебра',
--   'вивчить хочаб шось',
--   1673262317
-- );

-- INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
--   '2826700811663785002',
--   '2826700811663785122', 
--   '255286100',
--   'геометрія',
--   'вивчить хочаб шось',
--   1673262317
-- );

-- INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
--   '2826700811663785002',
--   '2826700811663785121', 
--   '255286100',
--   'геометрія',
--   'вивчить хочаб шось',
--   1673262317
-- );

-- INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
--   '2826700811663785001',
--   '2826700811663785112', 
--   '658142569',
--   'алгебра',
--   'вивчить хочаб шось',
--   1673262317
-- );

-- INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
--   '2826700811663785001',
--   '2826700811663785111', 
--   '658142569',
--   'алгебра',
--   'вивчить хочаб шось',
--   1673262317
-- );

-- INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
--   '2826700811663785001',
--   '2826700811663785112', 
--   '658142569',
--   'геометрія',
--   'вивчить хочаб шось',
--   1673262317
-- );

-- INSERT INTO subjects (school_id, group_id, teacher_id, name, home_task, updated_at) values (
--   '2826700811663785001',
--   '2826700811663785111', 
--   '658142569',
--   'геометрія',
--   'вивчить хочаб шось',
--   1673262317
-- );

-- UPDATE subjects SET teacher_id = '658142569' WHERE teacher_id = '2826700811663785331'
-- ALTER TABLE subjects ADD updated_at integers