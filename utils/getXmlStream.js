import {default as sfs} from 'fs'

export async function getXmlStream(res, datafilePath) {
    try {
        res.setHeader('Content-Type', 'text/xml');
        res.setHeader('Content-Disposition', 'inline; filename="feed.xml"');
        
        const readStream = sfs.createReadStream(datafilePath, 'utf8');
    
        readStream.on('error', (err) => {
          console.error('Ошибка при чтении файла:', err);
          res.status(500).send('Ошибка сервера');
        });
    
        readStream.pipe(res);
      } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).send('Ошибка сервера');
      }
}