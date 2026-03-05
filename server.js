const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
    res.render('index', { imageUrl: null });
});

app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) return res.redirect('/');
    const filename = `resized-${Date.now()}.png`;
    const outputPath = path.join(__dirname, 'uploads', filename);

    const TARGET_WIDTH = 1129 - 4; // margine 2px per lato
    const TARGET_HEIGHT = 1080 - 4;

    await sharp(req.file.path)
        .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'inside', withoutEnlargement: true })
        .toFile(outputPath);

    fs.unlinkSync(req.file.path);

    res.render('index', { imageUrl: '/uploads/' + filename });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
