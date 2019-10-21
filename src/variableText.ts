export class Symbol {
    public id: number;
    public text: string;
    public isVariable: boolean;
    public isAssigned: boolean;

    public constructor(text: string, isAssigned = false, isVariable = false, id = -1) {
        this.text = text;
        this.isVariable = isVariable;
        this.isAssigned = isAssigned;
        this.id = id;
    }
}

export class VariableText {
    private originalText: string;
    private symbols: Array<Symbol>;
    private variableMap: Map<number, string>;

    public constructor(text: string) {
        this.originalText = text;
        this.symbols = new Array<Symbol>();
        this.symbols.push(new Symbol(text));
        this.variableMap = new Map<number, string>();
    }

    public createCommonSymbol(value: string): void {
        const newSymbols = new Array<Symbol>();
        let foundSymbol = false;
        this.symbols.forEach(s => {
            if (s.isAssigned) {
                newSymbols.push(s);
            }
            else {
                const index = s.text.indexOf(value);
                if (foundSymbol || index < 0) {
                    newSymbols.push(s);
                }
                else {
                    foundSymbol = true;
                    newSymbols.push(new Symbol(s.text.substring(0, index)));
                    newSymbols.push(new Symbol(s.text.substr(index, value.length), true));
                    newSymbols.push(new Symbol(s.text.substring(index + value.length, s.text.length)));
                }
            }
        });

        this.symbols = newSymbols;
    }

    public createVariableSymbol(id: number) {
        const unasigned = this.symbols.find(s => !s.isAssigned);
        if (unasigned != undefined) {
            unasigned.isVariable = true;
            unasigned.isAssigned = true;
            unasigned.id = id;
            this.variableMap.set(id, unasigned.text);
        }
    }

    public assignEmptyVariableSymbol() {
        const unasigned = this.symbols.find(s => !s.isAssigned);
        if (unasigned != undefined && unasigned.text.length < 1) {
            unasigned.isVariable = true;
            unasigned.isAssigned = true;
        }
    }

    public getOriginalText(): string {
        return this.originalText;
    }

    public getUpdatedText(): string {
        return this.symbols.map(s => s.text).join('');
    }

    public getFirstUnasignedSymbol(): string {
        const unasignedSymbols = this.symbols.find(s => !s.isAssigned);
        return unasignedSymbols != null ? unasignedSymbols.text : null;
    }

    public getSymbols(): Array<Symbol> {
        return this.symbols;
    }

    public updateFromSymbols(symbols: Array<Symbol>) {
        this.symbols = new Array<Symbol>();
        symbols.forEach(s => {
            const symbol = new Symbol(s.text, s.isAssigned, s.isVariable, s.id);
            if (symbol.isVariable && this.variableMap.has(symbol.id)) {
                symbol.text = this.variableMap.get(symbol.id);
            }
            this.symbols.push(symbol);
        });
    }
}