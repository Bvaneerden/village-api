const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001

app.listen(port, () => console.log(`listening on port ${port}`))

app.use(express.json())
app.use(cors())

app.use('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});

let children = []

app.get('/children', (req, res) => {
  res.json({ children })
})

app.post('/children', (req, res) => {
  children = req.body.children
  res.json({ children })
})

app.get('/findmedications', (req, res) => {
  fetch(`https://pds.chemistwarehouse.com.au/search?identifier=AU&fh_location=//catalog01/en_AU/categories%3C{catalog01_chemau}/$s=${req.query.name}&fh_start_index=0`).then(response => response.json()).then(response => {
    if(!response.universes) {
      res.json([])
      return
    }

    const items = response.universes.universe[0]['items-section'].items.item.map(medication => medication.attribute.reduce((acc, item) => {
      switch (item.name) {
        case 'name':
        case '_thumburl':
          return {
            ...acc,
            [item.name]: item.value[0].value
          }

        default:
          return acc
      }
    }, {}))

    res.json(items)
  })
})

// if (process.env.NODE_ENV === 'production') {
  const path = require('path')
  app.use(express.static(path.join(__dirname, 'build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
// }