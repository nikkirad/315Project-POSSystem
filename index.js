const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
// Create express app
const app = express();
app.use(express.json())
const PORT = process.env.PORT || 3030;
// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

app.get('/', (req, res) => {
     res.render('login');
}); 

app.get('/customer', (req, res) => {
  res.render('customer');
});

app.get('/server', (req, res) => {
  res.render('user');
}); 

app.get('/manager', (req, res) => {
  res.render('manager');
}); 

app.post('/', (req, res) => {

  var base = req.body.bas;
  var protein = req.body.pro;
  var dressing = req.body.dre;
  var extra = req.body.ext; 
  var id;
  var price;
  var priceE;
  var priceB;
  var priceP;
  var idEx;
  var idPr;
  var idBa;
  var idDr;

  //date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  
  //const q2 = "INSERT INTO orders1 (base, protein, dressing, hasrice, extra1, extra2, totalprice, day) VALUES ('" +  base + "', '" +  protein + "', '" +  dressing + "', 'rice', '" +  extra + "', 'null', '120.120', '3000-01-01');"
  //const inputOrders = "INSERT INTO orders (order_id, order_time, total_price) VALUES ("+ x +", '2022-11-09', 11.19);";
  const priceQ = "SELECT price FROM manager WHERE item = '"+ extra +"';";
  const priceBQ = "SELECT price FROM manager WHERE item = '"+ base +"';";
  const pricePQ = "SELECT price FROM manager WHERE item = '"+ protein +"';";

  const idE = "SELECT menu_id FROM menu_item WHERE item_name = '"+ extra +"';";
  const idB = "SELECT menu_id FROM menu_item WHERE item_name = '"+ base +"';";
  const idP = "SELECT menu_id FROM menu_item WHERE item_name = '"+ protein +"';";
  const idD = "SELECT menu_id FROM menu_item WHERE item_name = '"+ dressing +"';";

  const maxQ = "SELECT MAX(order_id) FROM orders;"
  
  pool.query(priceQ, (error, results) => {
    priceE = results.rows[0].price;
    
    pool.query(maxQ, (error, results) => {
      id = results.rows[0].max;
  
      id = id + 1;
      price = priceE + 7.69;
      const inputOrdersQ = "INSERT INTO orders (order_id, order_time, total_price) VALUES ("+ id +", '"+ today +"', '"+ price +"');";
      pool.query(inputOrdersQ, (error, results) => {

      });

      pool.query(idE, (error, results) => {
        idEx = results.rows[0].menu_id;
        const inputExtraQ = "INSERT INTO ordered_item (order_id, menu_id, item_name, category_name, item_price, order_time) VALUES ("+ id +", "+ idEx +", '"+ extra +"', 'Extra', '$"+ priceE +"', '"+ today +"');";
        pool.query(inputExtraQ, (error, results) => { 
        });
      });

      pool.query(idB, (error, results) => {
        idBa = results.rows[0].menu_id;
        pool.query(priceBQ, (error, results) => {
          priceB = results.rows[0].price;
          const inputBaseQ = "INSERT INTO ordered_item (order_id, menu_id, item_name, category_name, item_price, order_time) VALUES ("+ id +", "+ idBa +", '"+ base +"', 'Entree', '$"+ priceB +"', '"+ today +"');";
          pool.query(inputBaseQ, (error, results) => {
          });
        });
      });

      pool.query(idP, (error, results) => {
        idPr = results.rows[0].menu_id;
        pool.query(pricePQ, (error, results) => {
          priceP = results.rows[0].price;
          const inputProteinQ = "INSERT INTO ordered_item (order_id, menu_id, item_name, category_name, item_price, order_time) VALUES ("+ id +", "+ idPr +", '"+ protein +"', 'Protein', '$"+ priceP +"', '"+ today +"');";
          pool.query(inputProteinQ, (error, results) => {
          });
        });
      });

      pool.query(idD, (error, results) => {
        idDr = results.rows[0].menu_id;
        const inputDressingQ = "INSERT INTO ordered_item (order_id, menu_id, item_name, category_name, item_price, order_time) VALUES ("+ id +", "+ idDr +", '"+ dressing +"', 'Dressing', '$0.00', '"+ today +"');";
        pool.query(inputDressingQ, (error, results) => {
        });
      });
    });
  });
  res.render('user');
});

app.post('/cust', (req, res) => {

  var base = req.body.bas;
  var protein = req.body.pro;
  var dressing = req.body.dre;
  var extra = req.body.ext; 
  var id;
  var price;
  var priceE;
  var priceB;
  var priceP;
  var idEx;
  var idPr;
  var idBa;
  var idDr;

  //date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); 
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  
  //const q2 = "INSERT INTO orders1 (base, protein, dressing, hasrice, extra1, extra2, totalprice, day) VALUES ('" +  base + "', '" +  protein + "', '" +  dressing + "', 'rice', '" +  extra + "', 'null', '120.120', '3000-01-01');"
  //const inputOrders = "INSERT INTO orders (order_id, order_time, total_price) VALUES ("+ x +", '2022-11-09', 11.19);";
  const priceQ = "SELECT price FROM manager WHERE item = '"+ extra +"';";
  const priceBQ = "SELECT price FROM manager WHERE item = '"+ base +"';";
  const pricePQ = "SELECT price FROM manager WHERE item = '"+ protein +"';";

  const idE = "SELECT menu_id FROM menu_item WHERE item_name = '"+ extra +"';";
  const idB = "SELECT menu_id FROM menu_item WHERE item_name = '"+ base +"';";
  const idP = "SELECT menu_id FROM menu_item WHERE item_name = '"+ protein +"';";
  const idD = "SELECT menu_id FROM menu_item WHERE item_name = '"+ dressing +"';";

  const maxQ = "SELECT MAX(order_id) FROM orders;"
  
  pool.query(priceQ, (error, results) => {
    priceE = results.rows[0].price;
    
    pool.query(maxQ, (error, results) => {
      id = results.rows[0].max;
  
      id = id + 1;
      price = priceE + 7.69;
      const inputOrdersQ = "INSERT INTO orders (order_id, order_time, total_price) VALUES ("+ id +", '"+ today +"', '"+ price +"');";
      pool.query(inputOrdersQ, (error, results) => {

      });

      pool.query(idE, (error, results) => {
        idEx = results.rows[0].menu_id;
        const inputExtraQ = "INSERT INTO ordered_item (order_id, menu_id, item_name, category_name, item_price, order_time) VALUES ("+ id +", "+ idEx +", '"+ extra +"', 'Extra', '$"+ priceE +"', '"+ today +"');";
        pool.query(inputExtraQ, (error, results) => { 
        });
      });

      pool.query(idB, (error, results) => {
        idBa = results.rows[0].menu_id;
        pool.query(priceBQ, (error, results) => {
          priceB = results.rows[0].price;
          const inputBaseQ = "INSERT INTO ordered_item (order_id, menu_id, item_name, category_name, item_price, order_time) VALUES ("+ id +", "+ idBa +", '"+ base +"', 'Entree', '$"+ priceB +"', '"+ today +"');";
          pool.query(inputBaseQ, (error, results) => {
          });
        });
      });

      pool.query(idP, (error, results) => {
        idPr = results.rows[0].menu_id;
        pool.query(pricePQ, (error, results) => {
          priceP = results.rows[0].price;
          const inputProteinQ = "INSERT INTO ordered_item (order_id, menu_id, item_name, category_name, item_price, order_time) VALUES ("+ id +", "+ idPr +", '"+ protein +"', 'Protein', '$"+ priceP +"', '"+ today +"');";
          pool.query(inputProteinQ, (error, results) => {
          });
        });
      });

      pool.query(idD, (error, results) => {
        idDr = results.rows[0].menu_id;
        const inputDressingQ = "INSERT INTO ordered_item (order_id, menu_id, item_name, category_name, item_price, order_time) VALUES ("+ id +", "+ idDr +", '"+ dressing +"', 'Dressing', '$0.00', '"+ today +"');";
        pool.query(inputDressingQ, (error, results) => {
        });
      });
    });
  });
  res.render('customer');
});

app.get('/Menu-Edit1', (req, res) => {
    
    const q = "SELECT * FROM manager";
    pool.query(q, (error, results) => {
      if (error) {
        console.log(error);
      } else {
        console.log(results);
      }
    });
    res.render('manager');
}); 

//
app.post('/rev', (req, res) => {
  revenueReport = []
  var startDate = req.body.date1;
  var endDate = req.body.date2;
  var queryReport = "SELECT SUM(total_price) FROM orders WHERE order_time >= '" + startDate + "' and order_time <= '" + endDate + "';";
  pool
      .query(queryReport)
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              revenueReport.push(query_res.rows[i]);
          }
          const data = {revenueReport: revenueReport};
          res.render('revenueReport', data);
          
      });
});

//
app.post('/s', (req, res) => {
  salesReport = []
  var startDate = req.body.date1;
  var endDate = req.body.date2;
  console.log('yuhhh');
  var queryReport = "SELECT item_name, SUM(item_price) FROM ordered_item WHERE order_time >= '" + startDate + "' and order_time <= '" + endDate + "' GROUP BY item_name;";
  pool
      .query(queryReport)
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              salesReport.push(query_res.rows[i]);
          }
          const data = {salesReport: salesReport};
          res.render('salesReport', data);
          
      });
});




//
app.post('/e', (req, res) => {
  excessReport = []
  var queryReport = "SELECT item, quantity_sold FROM manager WHERE quantity_sold < inventory * 0.1;";
  pool
      .query(queryReport)
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              excessReport.push(query_res.rows[i]);
          }
          const data = {excessReport: excessReport};
          res.render('excessReport', data);
          
      });
});

//
app.post('/rst', (req, res) => {
  restockReport = []
  var queryReport = "SELECT item, minimum_quantity, quantity_sold FROM manager WHERE minimum_quantity > inventory;";
  pool
      .query(queryReport)
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              restockReport.push(query_res.rows[i]);
          }
          const data = {restockReport: restockReport};
          res.render('restockReport', data);
          
      });
});

//
app.post('/w', (req, res) => {
  whatSellsReport = []
  var startDate = req.body.date1;
  var endDate = req.body.date2;
  var queryReport = "SELECT LEAST(base, protein) AS protein, GREATEST(base, protein) AS base, COUNT(*) AS Frequency FROM orders1 WHERE day >= '" + startDate + "' AND day < '"+ endDate +"' GROUP BY base, protein ORDER BY Frequency DESC;";
  pool
      .query(queryReport)
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              whatSellsReport.push(query_res.rows[i]);
          }
          const data = {whatSellsReport: whatSellsReport};
          res.render('whatSellsReport', data);
          
      });
});

//
app.post('/i', (req, res) => {
  inventoryUpdate = []
  var itemname = req.body.itemName;
  var quant = req.body.inventory;
  var queryReport = "UPDATE manager SET inventory = '" + quant + "' WHERE item = '"+ itemname +"';";
  pool
      .query(queryReport)
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              inventoryUpdate.push(query_res.rows[i]);
          }
          const data = {inventoryUpdate: inventoryUpdate};
          res.render('inventoryUpdate', data);
          
      });
});

app.post('/p', (req, res) => {
  pricingUpdate = []
  var itemname = req.body.itemName;
  var pricing = req.body.cost;
  
  var queryReport = "UPDATE manager SET price = '" + pricing + "' WHERE item = '"+ itemname +"';";
  pool
      .query(queryReport)
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              pricingUpdate.push(query_res.rows[i]);
          }
          const data = {pricingUpdate: pricingUpdate};
          res.render('pricingUpdate', data);
          
      });
}); 

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
