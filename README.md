<h1 align="center">
  <img src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" alt="React Logo" height="24" style="vertical-align: text-bottom; margin-right: 8px;">
  <img src="https://raw.githubusercontent.com/imgul/imgul/refs/heads/main/logos/Tailwind-CSS-Logo.webp" alt="Tailwind CSS Logo" height="24" style="vertical-align: text-bottom; margin-right: 8px;">
  Portfolio Website
</h1>

Built with ❤️ using <img src="https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png" alt="React Logo" height="16" style="vertical-align: text-bottom; margin-right: 4px;"> React and <img src="https://seeklogo.com/images/T/tailwind-css-logo-5AD4175897-seeklogo.com.png" alt="Tailwind CSS Logo" height="16" style="vertical-align: text-bottom; margin-right: 4px;"> Tailwind CSS.

## Rich Blog Blocks

Blog posts in `public/posts/*.md` support custom fenced blocks:

~~~md
```image
src: /posts/images/example.jpg
alt: Example image
caption: Optional caption
layout: wide # full|wide|narrow|left|right
```

```youtube
id: dQw4w9WgXcQ
title: Optional iframe title
caption: Optional caption
height: 420
layout: narrow
```

```textandimage
title: Optional heading
text: Left column markdown text. Use \\n for new lines.\n\nSecond paragraph.
src: /posts/images/example.jpg
alt: Example visual
position: right # right|left (image side on desktop)
valign: middle # top|middle|bottom
layout: wide
caption: Optional caption
```

```twoimages
src1: /posts/images/one.jpg
alt1: First image
src2: /posts/images/two.jpg
alt2: Second image
justify: end # start|center|end|between|around|evenly (default: end)
valign: end # top|middle|bottom (default: end)
itemwidth: md # sm|md|lg
layout: wide
caption: Optional caption
```

```iframe
src: https://www.youtube-nocookie.com/embed/VIDEO_ID
title: Optional title
caption: Optional caption
height: 460
layout: full
```

```mermaid
graph TD
  A --> B
```
~~~
