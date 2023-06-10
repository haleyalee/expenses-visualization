const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const port = process.env.PORT || 8000;
require('dotenv').config();

const app = express();
app.use(cors());

const authToken = process.env.NOTION_API_KEY;
const dbId1 = process.env.NOTION_DATABASE_ID_1;

const notion = new Client({ auth: authToken });

app.get('/getExpenses', async(req, res) => {
  try {
    const db = await notion.databases.retrieve({ database_id: dbId1 });
    const dbExpenses = {
      dbId: db.id,
      title: db.title[0].text.content
    }
    
    const dbRows = await notion.databases.query({
      database_id: dbId1,
      sorts: [
        {
          property: 'Date',
          direction: 'ascending'
        },
        {
          timestamp: 'created_time',
          direction: 'ascending'
        }
      ]
    });

    const { results } = dbRows;
    // extract and transform critical information about expense
    const expenses = results.map((e) => {
      return {
        name:  e.properties.Name.title[0].text.content,
        category: e.properties.Category.multi_select.map((cat) => cat.name),
        date: e.properties.Date.date.start,
        amount: e.properties.Amount.number
      }
    });
    
    dbExpenses.expenses = expenses;
    res.send(dbExpenses);
  } catch (error) {
    console.log(`Error getting database: ${error}`);
  }
});

app.listen(port, () => {
  console.log('server listening on port 8000');
})
