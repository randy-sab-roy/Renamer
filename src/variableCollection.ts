import { VariableText, Symbol } from "./variableText";

export class VariableCollection {
    private readonly MARKERS: Array<string> = ['$', '!', '#', '*', '@', '+', '&', '%'];

    private variableTexts: Array<VariableText>;
    private collectionSymbol: Array<Symbol>;
    private marker: string;

    public constructor(texts: Array<string>) {
        this.variableTexts = new Array<VariableText>();
        this.collectionSymbol = new Array<Symbol>();

        if (this.findAvailableMarker(texts)) {
            texts.forEach(t => this.variableTexts.push(new VariableText(t)));
            this.initializeSymbols();
        }
    }

    public getTexts() {
        return this.variableTexts;
    }

    public getCollectionString(): string {
        let collectionString = "";
        for (const s of this.variableTexts[0].getSymbols()) {
            if (s.isAssigned) {
                if (s.isVariable) {
                    if (s.id > -1) {
                        collectionString = collectionString.concat(this.marker.concat(s.id.toString().concat(this.marker)));
                    }
                }
                else {
                    collectionString = collectionString.concat(s.text);
                }
            }
        }

        return collectionString;
    }

    public getMarker(): string {
        return this.marker;
    }

    public updateFromCollectionString(collectionString: string): void {
        const symbols = this.parseToSymbols(collectionString);
        this.variableTexts.forEach(t => t.updateFromSymbols(symbols));
    }

    public parseToSymbols(str: string): Array<Symbol> {
        const symbols = new Array<Symbol>();

        let isVariable = false;
        let lastIndex = 0;

        for (let i = 0; i < str.length; i++) {
            if (str.charAt(i) == this.marker) {
                if (i - lastIndex > 0) {
                    if (isVariable) {
                        const text = str.substring(lastIndex, i + 1);
                        const id = text.length > 2 ? Number(text.substr(1, text.length - 2)) : -1;
                        symbols.push(new Symbol(str.substring(lastIndex, i + 1), true, isVariable, id));
                    }
                    else {
                        symbols.push(new Symbol(str.substring(lastIndex, i), true, isVariable));
                    }
                }
                lastIndex = isVariable ? i + 1 : i;
                isVariable = !isVariable;
            }
        }

        if (lastIndex < str.length) {
            console.log("ok");
            symbols.push(new Symbol(str.substring(lastIndex, str.length - 1), true, false));
        }

        return symbols;
    }

    private findAvailableMarker(texts: Array<string>): boolean {
        for (const marker of this.MARKERS) {
            let isAvailable = true;
            for (const text of texts) {
                if (text.indexOf(marker) > -1) {
                    isAvailable = false;
                    break;
                }
            }

            if (isAvailable) {
                this.marker = marker;
                return true;
            }
        }

        return false;
    }

    private initializeSymbols(): void {
        if (this.variableTexts.length < 2) {
            return;
        }

        let symbolIndex = 0;
        while (this.variableTexts[0].getFirstUnasignedSymbol() != null) {
            const symbols = this.variableTexts.map(t => t.getFirstUnasignedSymbol());
            const emptySymbols = symbols.filter(s => s.length < 1);

            // All symbols are empty
            if (emptySymbols.length == symbols.length) {
                this.variableTexts.forEach(t => t.assignEmptyVariableSymbol());
                continue;
            }

            // There is an ampty symbol
            if (emptySymbols.length > 0) {
                symbolIndex++;
                this.variableTexts.forEach(t => t.createVariableSymbol(symbolIndex));
                continue;
            }

            // Create a symbol from the longest common substring if it exists
            const substr = VariableCollection.longestCommonSubstring(symbols);
            if (substr == null) {
                symbolIndex++;
                this.variableTexts.forEach(t => t.createVariableSymbol(symbolIndex));
            }
            else {
                this.variableTexts.forEach(t => t.createCommonSymbol(substr));
            }
        }

        this.collectionSymbol = this.variableTexts[0].getSymbols();
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