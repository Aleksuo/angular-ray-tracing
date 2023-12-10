# AngularRayTracing

Live demo at: [https://aleksuo.github.io/angular-ray-tracing/](https://aleksuo.github.io/angular-ray-tracing/)

A small project built following [_Ray Tracing in One Weekend_](https://raytracing.github.io/books/RayTracingInOneWeekend.html) using Angular and TypeScript. The ray tracer runs in the browser (runs on CPU) and has a simple UI for changing the rendering parameters.

## Current additional features

- GUI
- Simple scenes
- Parallelization of rendering using web workers
- Marble textures

## Todo features

- Fixing the camera defocus bug (defocus doesn't currently work correctly)
- GPU rendering
- Lights
- Surface textures

## Running locally

You need to have Node.js and npm installed. Then:

1. Install the project dependencies:

```
npm install
```

2. Start the development server:

```
npm run start
```

The application will be available at http://localhost:4200.

## Production build

To build the production build run:

```
npm run build
```

## Linting

To manually lint the project run:

```
npm run lint
```

To automatically fix all fixable linter errors, run:

```
npm run lint-fix
```

## Example renders

1. The default scene (final image of the Ray Tracing In One Weekend -book)

![Render of the default scene](readme_render.png) 2. The sphere-cube scene.
![Render of the sphere-cube scene](sphere-cube-example.png) 3. The marble scene.
![Render of the marble scene](marble-example.png)
