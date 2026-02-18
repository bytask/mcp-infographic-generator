/**
 * Infographic style presets with design specifications
 */
export interface InfographicStyle {
    name: string;
    description: string;
    colors: string[];
    background: string;
    typography: string;
    layout: string;
    bestFor: string;
}
export declare const INFOGRAPHIC_STYLES: Record<string, InfographicStyle>;
export declare const DEFAULT_STYLE = "notebooklm";
export declare function getStyleTemplate(styleName: string): InfographicStyle;
export declare function listAllStyles(): InfographicStyle[];
//# sourceMappingURL=infographic-styles.d.ts.map