const express = require('express')
const axios = require('axios')
const qs = require('querystring')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000

app.use(cors())

const clientId = 'sq0idp-EW1WaiYmOhb_G_wm9o_1Qw'
const clientSecret = 'sq0csp-bgX-J9e9tq79-qSOBZact2IGzJvg9AgiffCTOQ_MbO4'
const redirectUri = 'http://localhost:8080/callback'

app.get('/login', (req, res) => {
  const authUrl = `https://connect.squareup.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=MERCHANT_PROFILE_READ,ITEMS_READ&redirect_uri=${redirectUri}`
  console.log('Redirecting to:', authUrl) // Логирование перенаправления
  res.redirect(authUrl)
})

app.get('/callback', async (req, res) => {
  const code = req.headers['x-access-code']

  console.log(`Received code: ${code}`) // Логирование полученного кода
  try {
    const response = await axios.post(
      'https://connect.squareup.com/oauth2/token',
      qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
    console.log('Response from Square:', response.data) // Логирование ответа от Square
    const { access_token } = response.data
    console.log(`Received access token: ${access_token}`) // Логирование полученного токена

    res.send(access_token)
  } catch (error) {
    console.error('An error occurred during OAuth process:', error) // Логирование ошибки
    res.status(500).send('An error occurred during OAuth process')
  }
})

app.get('/dashboard', (req, res) => {
  const { access_token } = req.query
  console.log(`Access token in dashboard: ${access_token}`) // Логирование токена на /dashboard

  // Здесь вы можете отобразить пользовательскую информацию, используя access_token для запросов к Square API
  res.send(`User is logged in with access token: ${access_token}`)
})

// Получение списка ресторанов
app.get('/restaurants', async (req, res) => {
  const accessToken = req.headers['x-access-token']

  if (!accessToken) {
    return res.status(401).send('Access token is missing')
  }

  try {
    const response = await axios.get(
      'https://connect.squareup.com/v2/locations',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.json(response.data.locations)
  } catch (error) {
    if (error?.response?.status === 401) {
      res.status(401).send('Unauthorized')
    } else {
      console.error('Error fetching restaurants:', error.message)
      res.status(500).send(error)
    }
  }
})

app.get('/menus', async (req, res) => {
  const accessToken = req.headers['x-access-token']

  if (!accessToken) {
    return res.status(401).send('Access token is missing')
  }

  try {
    const response = await axios.get(
      `https://connect.squareup.com/v2/catalog/list?types=MENU&cursor=`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.json(response.data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/menuItems', async (req, res) => {
  const accessToken = req.headers['x-access-token']

  if (!accessToken) {
    return res.status(401).send('Access token is missing')
  }

  try {
    const response = await axios.get(
      `https://connect.squareup.com/v2/catalog/list?types=ITEM&cursor=`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.json(response.data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/categories', async (req, res) => {
  const accessToken = req.headers['x-access-token']

  if (!accessToken) {
    return res.status(401).send('Access token is missing')
  }

  try {
    const response = await axios.get(
      `https://connect.squareup.com/v2/catalog/object/${req.query.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.json(response.data)
  } catch (error) {
    res.send(error)
  }
})

app.get('/currencies', async (req, res) => {
  try {
    const response = await axios.get(
      'https://currate.ru/api/?get=rates&pairs=USDRUB,USDEUR&key=fa9232b7a732c0a0df343b7f9f656639',
      {}
    )
    res.json(response.data)
  } catch (error) {
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
