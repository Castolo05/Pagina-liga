const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.static('public'));
app.use(express.json());

// Cargar datos
app.get('/api/cargar', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.json(null);
        } else {
            console.error('Error al cargar datos:', error);
            res.status(500).json({ error: 'Error al cargar datos' });
        }
    }
});

// Guardar datos
app.post('/api/guardar', async (req, res) => {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error al guardar datos:', error);
        res.status(500).json({ error: 'Error al guardar datos' });
    }
});

// Borrar datos
app.post('/api/borrar', async (req, res) => {
    try {
        await fs.unlink(DATA_FILE);
        res.json({ success: true });
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.json({ success: true });
        } else {
            console.error('Error al borrar datos:', error);
            res.status(500).json({ error: 'Error al borrar datos' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});