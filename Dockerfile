FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL="postgres://root:1234@db:5432/medium?connect_timeout=300"

RUN npm install @prisma/client
RUN npx prisma generate

CMD ["npm", "run", "start"]
