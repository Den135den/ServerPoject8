const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2/promise'); 
const fs = require('fs');
const { error } = require('console');


app.use(cors());
app.use(express.json({ limit: '10mb' }));

const connection = mysql.createPool({
    user: 'Den135',
    host: 'localhost',
    database: 'people',
    password: '123',
  
});

if(connection){
    console.log('Connection in DB')
}



// const img3 = fs.readFileSync('D:/img/users2/img3.jpg');

// //Assuming 'users' is the name of your table, and 'id' is the column to identify the user
// connection.query('UPDATE users SET img = ?  WHERE id = ?', [img, 3], (error, results, fields) => {
//     if (error) throw error;
//     console.log('Зображення успішно оновлене в базі даних.');
// });


// connection.query('INSERT INTO users (id, name, age, email, history, url, img) VALUES (?, ?, ?, ?, ?, ?, ?)', 
// [12, 'BORYS', 27, 'b@gmail.com', 'User information 12', 'http://localhost:5000/12', img12],
//   (error, results, fields) => {
//     if (error) throw error;
//     console.log('Зображення успішно оновлене в базі даних.');
//   }
// );

// app.get('/people', async (req, res) => {
//     try {
//         const userId = req.query.id;

//         let rows;

//         if (!userId) {
//             res.status(400).json({ error: 'Missing user ID parameter' });
//             return;
//         } else if (userId === '1') {
//             [rows] = await connection.execute('SELECT * FROM users');
//         } else if (userId === '2') {
//             [rows] = await connection.execute('SELECT * FROM users2');
//         } else {
//             res.status(400).json({ error: 'Invalid user ID parameter' });
//             return;
//         }

//         if (!rows || !rows.length) {
//             res.status(404).json({ error: 'Data not found' });
//             return;
//         }

//         res.status(200).json(rows);
//         console.log('Combined Rows:', rows);
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });



app.get('/people/:id1', async function (req, res) {
    let id = req.params.id1;
    let rows;
    
    try {
      if (id ==='1') {
        [rows] = await connection.query(`SELECT * FROM users`);
      } else if (id ==='2') {
        [rows] = await connection.query(`SELECT * FROM users2`);
      } else {
        res.status(404).json('Error page');
        return; // Added return to exit the function if an invalid id is provided
      }
  
      if (rows && rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).json('No data found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });
  

  app.get('/people/:id1/:id2', async function (req, res) {
    let id1 = req.params.id1;
    let id2 = req.params.id2;
    let rows;
    
    try {

    let idData1 = ['1', '2'];

    let idData2 = Array.from({ length: 12 }, (_, i) => String(i + 1));


    let coordinates = {};
    
    for (let valueID1 of idData1) {
      for (let valueID2 of idData2) {
        // значення
        let query;
    
        if (valueID1 === '1') {
          query = 'SELECT * FROM users WHERE id = ?';
        } else if (valueID1 === '2') {
          query = 'SELECT * FROM users2 WHERE id = ?';
        } else {
          res.status(404).json('User data is not found');
          return;
        }
    
        
        let key = `${valueID1}-${valueID2}`;
    
        coordinates[key] = query;
      }
    }
   
    const query = coordinates[`${id1}-${id2}`];
    
    if (!query) {
      res.status(404).json('Користувача не знайдено');
      return;
    }
    
    const [rows] = await connection.query(query, [id2]);
    

      if (rows && rows.length > 0) {
        res.status(200).json(rows);
      } else {
        res.status(404).json('No data found');
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  });

app.post('/sendData', async function(req,res){

  try{
    const {oldState} = req.body;
   const request = await connection.query('INSERT INTO users3 (value) VALUES(?)', [ oldState])
       res.status(200).json(request)
   
  }

  catch{
      res.status(500).json('Data is not fined')
  }
    

})




app.get('/getData', async function(req,res){

  try{
   const [request] = await connection.query('SELECT * FROM users3')
       res.status(200).json(request)
   
  }

  catch{
      res.status(500).json('Data is not fined')
  }
    

})

 app.post('/favouritePost', async function (req, res) {
  const { request: info } = req.body;

  // Assuming `info` is an object with properties id, name, and img
  const query = 'INSERT INTO users4 (id, img, name) VALUES (?, ?, ?)';
  
  // Використовуйте info.img безпосередньо як дані для зображення
  const imageBuffer = Buffer.from(info.img.data);
  const values = [info.id, imageBuffer, info.name];
  

  try {
    const request = await connection.query(query, values);
    res.status(200).json(request);
  } catch (error) {
    console.error('Error inserting data into the database:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/favouriteGet', async function (req, res) {
  
  try{
    const [request] = await connection.query('SELECT * FROM users4')
        res.status(200).json(request)
    
   }
 
   catch{
       res.status(500).json('Data is not fined')
   }
})


app.delete('/favouriteDelete', async function (req, res) {
  const { request: info } = req.body;

  try {
    const [request] = await connection.query('DELETE FROM users4 WHERE id = ?', [info.id]);
    res.status(200).json(request);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json('Data is not found or deletion failed');
  }
});



app.delete('/favouriteDelete2', async function (req, res) {
  const {id} = req.body;

  try {
    const [request] = await connection.query('DELETE FROM users4 WHERE id = ?', [id]);
    res.status(200).json(request);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json('Data is not found or deletion failed');
  }
});



app.get('/users', async (req, res) => {
  try {
      const searchTerm = req.query.search;
      const query = `
   SELECT * FROM (
      SELECT * FROM  users 
      UNION
      SELECT * FROM users2
    ) AS combi_users 
    WHERE name LIKE '%${searchTerm}%'  
`;

      const [results] = await connection.query(query);
      res.json(results); // Результати розташовані у першому елементі масиву
  } catch (error) {
      console.error('Помилка отримання даних з бази даних:', error);
      res.status(500).send('Помилка отримання даних з бази даних');
  }
});


// app.get('/people/:id', async function(req, res) {
//     try {
//         const userId = req.query.id;
//         const id = req.params.id;
//         let rows;

//         if (userId === '2') {
//             [rows] = await connection.query(`SELECT * FROM users2 WHERE id = ${id}`);
//         }
//         if (userId === '1') {
//             [rows] = await connection.query(`SELECT * FROM users WHERE id = ${id}`);
//         }

//         if (rows && rows.length > 0) {
//             console.log(rows);
//             res.status(200).json(rows);
//         } else {
//             res.status(404).json({ error: 'Користувача не знайдено' });
//         }
//     } catch (error) {
//         console.error('Помилка:', error);
//         res.status(500).json({ error: 'Внутрішня помилка сервера' });
//     }
// });


// app.get('/people/:id', async function(req, res) {
//     try {
//         let id = req.params.id;
//         let [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);

//         if (rows && rows.length > 0) {
//             console.log(rows);
//             res.status(200).json(rows);
//         } else {
//             res.status(404).json({ error: 'User is not found' });
//         }
//     } catch (error) {
//         console.error('Error retrieving user:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


// app.get('/people', async (req, res) => {
//     try {
//         const query1 = 'SELECT * FROM users2';
//         // const query2 = 'SELECT * FROM users';

//         const [rows1] = await connection.execute(query1);
      

//         res.status(200).json(rows1);
//         console.log(rows1);
//     } catch (error) {
//         console.error('Error executing queries:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// app.post('/people', async function (req, res) {
//     try {
//         const query = 'INSERT INTO users2 (id, name, age, email, history, url, img) VALUES (?, ?, ?, ?, ?, ?, ?)';
//         const values = [3, 'BALU', 22, 'B@gmail.com', 'User information 23', 'http://localhost:5000/people?page=3', img3];

//         const [results, fields] = await connection.execute(query, values);

//         console.log('Зображення успішно додане в базу даних.');
//         res.status(200).json(results);
//         console.log(results);
//     } catch (error) {
//         console.error('Помилка виконання запиту:', error);
//         res.status(500).json({ error: 'Внутрішня помилка сервера' });
//     }
// });

app.listen(5000, function () {
    console.log('Server is running on port 5000');
});

// Close the database connection when the Node.js process exits
// process.on('exit', () => {
//     connection.end();
// });
