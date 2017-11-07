# Tiles

## Splitting gifs

```
convert -coalesce input.gif output/%02d.png
```

## Making tiles

Eg:

```
montage -background transparent -geometry +0+0 -tile 12x1 background-laser-*.png ../background-laser.png
```
