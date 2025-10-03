import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const portfolioPath = path.resolve(__dirname, 'public', 'data', 'portfolio.json');

const adminMiddleware = () => ({
  name: 'portfolio-admin-middleware',
  configureServer(server) {
    server.middlewares.use('/admin/portfolio', (req, res, next) => {
      if (req.method === 'GET') {
        try {
          const contents = fs.readFileSync(portfolioPath, 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(contents);
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Unable to read portfolio.json' }));
        }
        return;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            fs.writeFileSync(portfolioPath, JSON.stringify(parsed, null, 2));
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ status: 'ok' }));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Unable to write portfolio.json' }));
          }
        });
        return;
      }

      return next();
    });
  },
});

export default defineConfig({
  plugins: [react(), adminMiddleware()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
