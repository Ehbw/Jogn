FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN pnpm install

COPY . .

EXPOSE 8420

CMD ['pnpm', 'dev']