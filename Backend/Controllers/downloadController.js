import https from 'https';

export const downloadPDF = (req, res) => {
    console.log('hey');
    const fileUrl = decodeURIComponent(req.query.url);
    console.log('filepath',fileUrl)
    if (!fileUrl) {
        return res.status(400).send('File URL is required');
    }

    https.get(fileUrl, (fileStream) => {
        res.setHeader('Content-Disposition', 'attachment; filename="downloaded.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        fileStream.pipe(res);
    }).on('error', (err) => {
        console.error('Error fetching file:', err);
        res.status(500).send('Error downloading file');
    });
};

