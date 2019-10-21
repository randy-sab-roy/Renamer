import { VariableText, Symbol } from "./variableText";

export class VariableCollection {

    private variableTexts: Array<VariableText>;
    private collectionSymbols: Array<Symbol>;

    public constructor(texts: Array<string>) {
        this.variableTexts = new Array<VariableText>();
        texts.forEach(t => this.variableTexts.push(new VariableText(t)));
        this.initializeSymbols();
    }

    public getSymbols(): Array<Symbol> {
        return this.collectionSymbols;
    }

    public updateFromCollectionString(collectionString: string): void {
        // TODO
    }

    private initializeSymbols(): void {
        if (this.variableTexts.length < 2) {
            this.collectionSymbols = new Array<Symbol>();
            return;
        }

        let symbolIndex = 0;
        while (this.variableTexts[0].getFirstUnasignedSymbol() != null) {
            const symbols = this.variableTexts.map(t => t.getFirstUnasignedSymbol());
            if (symbols.find(s => s.length < 1) !== undefined) {
                symbolIndex++;
                this.variableTexts.forEach(t => t.createVariableSymbol(symbolIndex));
                continue;
            }

            const substr = VariableCollection.longestCommonSubstring(symbols);

            if (substr == null) {
                symbolIndex++;
                this.variableTexts.forEach(t => t.createVariableSymbol(symbolIndex));
            }
            else {
                this.variableTexts.forEach(t => t.createCommonSymbol(substr));
            }
        }

        this.collectionSymbols = this.variableTexts[0].getSymbols();
    }

    private static longestCommonSubstring(text: Array<string>): string {
        let substrings = this.getAllSubstrings(text[0]);
        substrings.sort((a, b) => b.length - a.length);

        let substring: string = null;
        for (const s of substrings) {
            let isEverywhere = true;
            for (const t of text) {
                if (t.indexOf(s) < 0) {
                    isEverywhere = false;
                    break;
                }
            }

            if (isEverywhere) {
                substring = s;
                break;
            }
        }

        return substring;
    }

    private static getAllSubstrings(str: string) {
        let i, j, result = [];
        for (i = 0; i < str.length; i++) {
            for (j = i + 1; j < str.length + 1; j++) {
                result.push(str.slice(i, j));
            }
        }
        return result;
    }
}