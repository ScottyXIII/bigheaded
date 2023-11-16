# Using Tiled

## Tiled Map Editor

https://www.mapeditor.org/
https://github.com/mapeditor/tiled

on Linux you may need to:

```sh
sudo apt install libfuse2
chmod +x Tiled-1.10.2_Linux_Qt-6_x86_64.AppImage
./Tiled-1.10.2_Linux_Qt-6_x86_64.AppImage
```

### Notes

- in Tiled staticbodies must be drawn with polygon tool
- in Tiled staticbodies must not be concave
- in Tiled staticbodies must be drawn starting from top left corner, with points going clockwise

if these rules are not followed;

the staticbody may break, it's shape could be wrong or wrongly positioned

## Texture Packer

https://www.codeandweb.com/texturepacker/ to create spritesheet atlases
