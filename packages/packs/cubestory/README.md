# Cubestory pack

Voxel 3D "what if" escalation videos rendered locally with Remotion and react-three-fiber.

Setup (on your machine, once): `npm install` in this folder. Remotion is free for individuals and companies with up to 3 people; larger companies need a company license (confirm at remotion.dev/license).

Props = a `video_spec.v1` file. `npm run render` renders a half-scale preview; `npm run render:final` renders the 1080x1920 master. The loop seal works by making the last range's `VoxelStack` state equal to frame 0 (see `getLoopState` in `VoxelStack.tsx`).

Fonts: Bangers, Inter and Rubik Mono One (all OFL via Google Fonts, loaded with `@remotion/google-fonts` or local files you add to `public/fonts`).
