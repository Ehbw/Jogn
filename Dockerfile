FROM node:16

WORKDIR /usr/src/app

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

COPY package*.json ./
RUN pnpm install 

COPY . .

EXPOSE 8420
CMD ["pnpm", "dev"]