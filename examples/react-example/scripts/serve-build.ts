import express, { Request, Response } from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req: Request, res: Response) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(9000);
console.log('Server started on port 9000');
