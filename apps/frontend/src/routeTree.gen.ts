/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const IndexLazyImport = createFileRoute('/')()
const SeedsIndexLazyImport = createFileRoute('/seeds/')()
const BedsIndexLazyImport = createFileRoute('/beds/')()
const SeedsAddLazyImport = createFileRoute('/seeds/add')()
const BedsAddLazyImport = createFileRoute('/beds/add')()

// Create/Update Routes

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

const SeedsIndexLazyRoute = SeedsIndexLazyImport.update({
  id: '/seeds/',
  path: '/seeds/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/seeds/index.lazy').then((d) => d.Route))

const BedsIndexLazyRoute = BedsIndexLazyImport.update({
  id: '/beds/',
  path: '/beds/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/beds/index.lazy').then((d) => d.Route))

const SeedsAddLazyRoute = SeedsAddLazyImport.update({
  id: '/seeds/add',
  path: '/seeds/add',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/seeds/add.lazy').then((d) => d.Route))

const BedsAddLazyRoute = BedsAddLazyImport.update({
  id: '/beds/add',
  path: '/beds/add',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/beds/add.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/beds/add': {
      id: '/beds/add'
      path: '/beds/add'
      fullPath: '/beds/add'
      preLoaderRoute: typeof BedsAddLazyImport
      parentRoute: typeof rootRoute
    }
    '/seeds/add': {
      id: '/seeds/add'
      path: '/seeds/add'
      fullPath: '/seeds/add'
      preLoaderRoute: typeof SeedsAddLazyImport
      parentRoute: typeof rootRoute
    }
    '/beds/': {
      id: '/beds/'
      path: '/beds'
      fullPath: '/beds'
      preLoaderRoute: typeof BedsIndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/seeds/': {
      id: '/seeds/'
      path: '/seeds'
      fullPath: '/seeds'
      preLoaderRoute: typeof SeedsIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/beds/add': typeof BedsAddLazyRoute
  '/seeds/add': typeof SeedsAddLazyRoute
  '/beds': typeof BedsIndexLazyRoute
  '/seeds': typeof SeedsIndexLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/beds/add': typeof BedsAddLazyRoute
  '/seeds/add': typeof SeedsAddLazyRoute
  '/beds': typeof BedsIndexLazyRoute
  '/seeds': typeof SeedsIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/beds/add': typeof BedsAddLazyRoute
  '/seeds/add': typeof SeedsAddLazyRoute
  '/beds/': typeof BedsIndexLazyRoute
  '/seeds/': typeof SeedsIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/beds/add' | '/seeds/add' | '/beds' | '/seeds'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/beds/add' | '/seeds/add' | '/beds' | '/seeds'
  id: '__root__' | '/' | '/beds/add' | '/seeds/add' | '/beds/' | '/seeds/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  BedsAddLazyRoute: typeof BedsAddLazyRoute
  SeedsAddLazyRoute: typeof SeedsAddLazyRoute
  BedsIndexLazyRoute: typeof BedsIndexLazyRoute
  SeedsIndexLazyRoute: typeof SeedsIndexLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  BedsAddLazyRoute: BedsAddLazyRoute,
  SeedsAddLazyRoute: SeedsAddLazyRoute,
  BedsIndexLazyRoute: BedsIndexLazyRoute,
  SeedsIndexLazyRoute: SeedsIndexLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/beds/add",
        "/seeds/add",
        "/beds/",
        "/seeds/"
      ]
    },
    "/": {
      "filePath": "index.lazy.tsx"
    },
    "/beds/add": {
      "filePath": "beds/add.lazy.tsx"
    },
    "/seeds/add": {
      "filePath": "seeds/add.lazy.tsx"
    },
    "/beds/": {
      "filePath": "beds/index.lazy.tsx"
    },
    "/seeds/": {
      "filePath": "seeds/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
