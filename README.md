# default

## Project setup
### Install dependencies

```
pnpm install
```

### Compiles and hot-reloads for development

```
pnpm run dev
```

### Compiles and minifies for production

```
pnpm build
```

## Project Architecture
### Models
The application use models, you can view them in the ``src/models`` folder. It uses Typescript Decorators, to view them you can open one model, and check what is used.
### Store
The application use store using Pinia in ``src/store``. There's a store for each model ``Category, Theme, Card`` to create, edit and update each instance.

## Deployment
You can access the web app in this [link](https://project-memory.vercel.app).
