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
        while (this.variableTexts[0].getFirstUnasignedSymbol != null) {
            symbolIndex++;
            const symbols = this.variableTexts.map(t => t.getFirstUnasignedSymbol());
            console.log(symbols);
            if (symbols.find(s => s.length < 2)) {
                this.variableTexts.forEach(t => t.createVariableSymbol(symbolIndex));
                continue;
            }

            const lcss = new Array<string>();
            for (let i = 0; i < symbols.length - 1; i++) {
                lcss.push(VariableCollection.lcs(symbols[i], symbols[i + 1]));
            }

            const smallestLcs = lcss.sort((a, b) => a.length - b.length)[0];
            let isSmallestContainedInAll = true;
            
            for (let i = 0; i < symbols.length; i++) {
                if (symbols[i].indexOf(smallestLcs) < 0) {
                    isSmallestContainedInAll = false;
                    break;
                }
            }

            if (!isSmallestContainedInAll) {
                this.variableTexts.forEach(t => t.createVariableSymbol(symbolIndex));
                continue;
            }

            this.variableTexts.forEach(t => t.createSymbol(symbolIndex, smallestLcs));
        }

        console.log(this.variableTexts[0].getSymbols())
    }

    private static lcs(a: string, b: string): string {
        var m = a.length, n = b.length,
            C = [], i, j;
        for (i = 0; i <= m; i++) C.push([0]);
        for (j = 0; j < n; j++) C[0].push(0);
        for (i = 0; i < m; i++)
            for (j = 0; j < n; j++)
                C[i + 1][j + 1] = a[i] === b[j] ? C[i][j] + 1 : Math.max(C[i + 1][j], C[i][j + 1]);
        return (function bt(i, j): string {
            if (i * j === 0) { return ""; }
            if (a[i - 1] === b[j - 1]) { return bt(i - 1, j - 1) + a[i - 1]; }
            return (C[i][j - 1] > C[i - 1][j]) ? bt(i, j - 1) : bt(i - 1, j);
        }(m, n));
    }
}