import { VariableText, Symbol } from "./variableText";

export class VariableCollection {
    private readonly MARKERS: Array<string> = ['$', '!', '#', '*', '@', '+', '&', '%'];

    private variableTexts: Array<VariableText>;
    private collectionString: string;
    private marker: string;

    public constructor(texts: Array<string>) {
        this.variableTexts = new Array<VariableText>();
        this.collectionString = "";

        if (this.findAvailableMarker(texts)) {
            texts.forEach(t => this.variableTexts.push(new VariableText(t)));
            this.initializeSymbols();
        }
    }

    public getCollectionString(): string {
        return this.collectionString;
    }

    public getMarker(): string {
        return this.marker;
    }

    public updateFromCollectionString(collectionString: string): void {
        // TODO
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
                console.log(marker);
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

        let collectionString = "";
        for (const s of this.variableTexts[0].getSymbols()) {
            if (s.isAssigned) {
                if (s.isVariable) {
                    if (s.id > -1) {
                        collectionString = collectionString.concat(this.marker.concat(s.id.toString()));
                    }
                }
                else {
                    collectionString = collectionString.concat(s.text);
                }
            }
        }

        this.collectionString = collectionString;
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