const express = require('express');
const app = express();

const PORT = 3000;

// Identifiants Basic Auth
const USERNAME = 'admin';
const PASSWORD = 'secret123';

// Middleware pour parser le JSON
app.use(express.json());

// Middleware Basic Auth
function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="API"');
    return res.status(401).json({ error: 'Authentification requise' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== USERNAME || password !== PASSWORD) {
    res.setHeader('WWW-Authenticate', 'Basic realm="API"');
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  next();
}

// Appliquer Basic Auth à toutes les routes
app.use(basicAuth);

// Route GET - Renvoie les paramètres de query
app.get('/api/query', (req, res) => {
  const queryParams = req.query;
  res.json({
    message: 'Paramètres reçus',
    data: queryParams
  });
});

// Route POST - Renvoie le body de la requête
app.post('/api/data', (req, res) => {
  const bodyData = req.body;
  res.json({
    message: 'Données reçues',
    data: bodyData
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
