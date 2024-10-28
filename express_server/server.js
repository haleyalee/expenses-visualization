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

// Helper to get the next month’s start date
const getNextMonth = (dateString) => {
  const [year, month] = dateString.split("-");
  const nextMonth = new Date(year, parseInt(month), 1);
  nextMonth.setMonth(nextMonth.getMonth());
  return `${nextMonth.getFullYear()}-${(nextMonth.getMonth() + 1).toString().padStart(2, '0')}-01`;
};

app.get('/getExpenses', async(req, res) => {
  try {

    const { month } = req.query;

    // Validate month parameter
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).send("Invalid month format. Expected YYYY-MM.");
    }

    // Check if data for the requested month is cached
    const cachedMonthKey = `expenses_${month}`;
    const cachedMonthData = cache.get(cachedMonthKey);

    if (cachedMonthData) {
      return res.send({ title: "Haley's Monthly Expenses", expenses: [cachedMonthData] });
    }

    // Define date range for the month
    const startDate = `${month}-01`;
    const endDate = getNextMonth(month);


    // Query Notion API for the specified month 
    const row = await notion.databases.query({
      database_id: dbId,
      filter: {
        and: [
          {
            property: "Date",
            date: { "on_or_after": startDate },
          },
          {
            property: "Date",
            date: { "before": endDate },
          },
        ],
      },
      sorts: [
        { property: 'Date', direction: 'ascending' },
        { timestamp: 'created_time', direction: 'ascending' },
      ],
    });

    const { results } = row;

    // Extract and transform data for the requested month
    const expenses = results.map((e) => ({
      name: e.properties.Source.title[0]?.plain_text || "Unnamed",
      category: e.properties.Category.multi_select[0]?.name || "",
      date: e.properties.Date.date.start || "No date",
      amount: e.properties.Amount.number || 0,
    }));

    const monthData = {
      date: month, // YYYY-MM
      expenses: expenses,
    };

    // Cache the result for this month
    cache.set(cachedMonthKey, monthData);

    // Return the data for the requested month
    res.send({ title: "Haley's Monthly Expenses", expenses: [monthData] });
  } catch (error) {
    console.log(`Error getting database: ${error}`);
    res.status(500).send("Error retrieving expenses data");
  }
});

app.listen(port, () => {
  console.log('server listening on port 8000');
})
