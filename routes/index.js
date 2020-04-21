const router = require('express').Router();
const { MongoClient } = require('mongodb');

const employees = require('./employeelist.json');
// const todolist = require('./todolist.json');

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


router.get('/', (req, res) => {
    res.redirect('/employeeList');
});

router.get('/employeeList', (req, res) => {
    res.render('homepage', {
        employeelist: employees
    })
});

router.get('/todoList', async (req, res) => {
    const todolist = await getTodos();
    res.render('list', {
        employees,
        todolist
    })
})

module.exports = router;