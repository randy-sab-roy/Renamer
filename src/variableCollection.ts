import { VariableText } from "./variableText";

export class VariableCollection {

    private variableTexts: Array<VariableText>;
    private collectionString: string;

    public constructor(texts: Array<string>) {
        this.variableTexts = new Array<VariableText>();
        texts.forEach(t => this.variableTexts.push(new VariableText(t)));
        this.initializeSymbols();
    }

    public getCollectionString(): string {
        return this.collectionString;
    }

    public updateFromCollectionString(collectionString: string): void {
        // TODO
    }

    private initializeSymbols(): void {
        if (this.variableTexts.length < 2) {
            this.collectionString = "";
            return;
        }

        let symbolIndex = 0;
        while (this.variableTexts[0].getFirstUnasignedSymbol() != null) {
            symbolIndex++;
            const symbols = this.variableTexts.map(t => t.getFirstUnasignedSymbol());
            if (symbols.find(s => s.length < 2)) {
                console.log("Iteration contains too small items");
                this.variableTexts.forEach(t => t.createVariableSymbol(symbolIndex));
                continue;
            }

            const commonSubstrings = new Array<string>();
            for (let i = 0; i < symbols.length - 1; i++) {
                commonSubstrings.push(...VariableCollection.longestCommonSubstring(symbols[i], symbols[i + 1]));
            }

            const smallestCommonSubstring = commonSubstrings.sort((a, b) => a.length - b.length)[0];
            let isSmallestContainedInAll = true;

            for (let i = 0; i < symbols.length; i++) {
                if (symbols[i].indexOf(smallestCommonSubstring) < 0) {
                    isSmallestContainedInAll = false;
                    break;
                }
            }

            if (!isSmallestContainedInAll) {
                this.variableTexts.forEach(t => t.createVariableSymbol(symbolIndex));
                continue;
            }

            this.variableTexts.forEach(t => t.createSymbol(symbolIndex, smallestCommonSubstring));
        }

        console.log(this.variableTexts[0].getSymbols());
    }

    private static longestCommonSubstring(a: string, b: string): Array<string> {
        const L = Array(a.length + 1).fill(null).map(() => Array(b.length + 1).fill(null));
        let c = new Array<string>();
        let z = 0;

        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
                if (a[i] === b[j]) {
                    if (i === 0 || j === 0) {
                        L[i][j] = 1;
                    }
                    else {
                        L[i][j] = L[i - 1][j - 1] + 1;
                    }
                    if (L[i][j] > z) {
                        z = L[i][j];
                        c = [a.substr(i - z + 1, z)];
                    }
                    else if (z == c.length) {
                        c.push(a.substr(i - z + 1, z));
                    }
                }
                else {
                    L[i][j] = 0;
                }
            }
        }

        return c;
    }
}