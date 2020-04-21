const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');


const todo = require('./todolist.json');
const employees = require('./employeelist.json');

const url = 'mongodb://localhost:27017';
const dbName = 'employeedb';
const client = new MongoClient(url, { useUnifiedTopology: true });

let employeedb;
let todoCollection;

(async () => {

  await client.connect();
  employeedb = client.db(dbName);
  todoCollection = employeedb.collection('todo');

  // client.close();// close connection
})();


// this function will be called to insert todolist data into the database
async function createTodo(data) {
  try {
    const newTodo = await todoCollection.insertOne(data);
    return newTodo;
  }
  catch (error) {
    console.log(error.message);
  }
  finally {
    // client.close();
  }
}
// this function will be called to retrieve all todolist from the databse
async function getTodos() {
  try {
    const todolist = await todoCollection.find({}).toArray();
    return todolist;
  }
  catch (error) {
    console.log(error.message);
  }
  finally {
    // client.close();
  }
}



router.get('/', async (req, res) => {
  const todolist = await getTodos();
  res.render('admin', {
    todolist,
    employees
  });
});




router.post('/todolist', async (req, res) => {
  const data = {
    task: req.body.task,
    department: req.body.department
  }

  const todolist = await createTodo(data);
  res.redirect('/admin')
});

module.exports = router;