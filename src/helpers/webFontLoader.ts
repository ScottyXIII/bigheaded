export enum Fonts {
  BAGEL = 'Bagel Fat One',
  ICONS = 'Material Icons',
}

const fonts = Object.values(Fonts);

const src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';

const webFontLoader = () => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.onload = () => {
    // @ts-expect-error window.WebFont is defined after webfont.js is loaded (at this point)
    window.WebFont.load({
      google: {
        families: fonts,
      },
      active: () => {
        // eslint-disable-next-line no-console
        console.log('all google webfonts loaded!');
      },
    });
  };
  script.src = src;
  document.getElementsByTagName('head')[0].appendChild(script);
};

export default webFontLoader;
