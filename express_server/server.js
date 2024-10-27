/*
 * Local server that connects to Notion API
 * To run: `node server.js`
 */

const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const port = process.env.PORT || 8000;
require('dotenv').config();

const app = express();
app.use(cors());

const authToken = process.env.NOTION_API_KEY;
const dbId = process.env.NOTION_DATABASE_ID;

const notion = new Client({ auth: authToken });

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// TODO: make more robust
const months = ["2024-01-01", "2024-02-01", "2024-03-01", "2024-04-01", "2024-05-01", "2024-06-01", 
  "2024-07-01", "2024-08-01", "2024-09-01", "2024-10-01", "2024-11-01", "2024-12-01"];

app.get('/getExpenses', async(req, res) => {
  try {

    const cacheKey = "expensesData";
    const cachedData = cache.get(cacheKey);

    // check if data is cached
    if (cachedData) {
      return res.send({ 
        title: "2024", 
        expenses: cachedData
      });
    }

    // query Notion API if data is not cached
    const dbRows = await Promise.all(months.map(async (month, idx) => {          
      const startDate = month;
      const endDate = idx < months.length-1 ? months[idx+1] : "2025-01-01";

      // filter database by month
      const row = await notion.databases.query({
        database_id: dbId,
        filter: {
          and: [
            {
              property: "Date",
              date: {
                "on_or_after": startDate
              }
            }, { 
              property: "Date",
              date: {
                "before": endDate
              }
            }
          ]
        },
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

      const { results } = row;
      
      // for each month, extract and transform cirtical information about expense
      const expenses = results.map((e) => {
        return {
          name:  e.properties.Source.title[0].plain_text || "Unnamed",
          category: e.properties.Category.multi_select[0]?.name || "No category",
          date: e.properties.Date.date.start || "No date",
          amount: e.properties.Amount.number || 0
        }
      });

      const monthExpenses = {
        date: month.substring(0,7), // YYYY-MM
        expenses: expenses
      };

      return monthExpenses;
    }));

    // cache the result
    cache.set(cacheKey, dbRows); 

    res.send({ 
      title: "2024", 
      expenses: dbRows.length ? dbRows : [] // ensure `expenses` is always an array
    }); 
  } catch (error) {
    console.log(`Error getting database: ${error}`);
    res.status(500).send("Error retrieving expenses data");
  }
});

app.listen(port, () => {
  console.log('server listening on port 8000');
})
