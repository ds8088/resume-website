import fontStyles from '../css/_fonts.scss?inline';

let fontsLoaded = false;

export const loadFonts = () => {
    if (!fontsLoaded) {
        const fontSheet = new CSSStyleSheet();
        fontSheet.replaceSync(fontStyles);
        document.adoptedStyleSheets.push(fontSheet);
        fontsLoaded = true;
    }
};
