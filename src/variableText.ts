export class Symbol {
    public id: number;
    public text: string;
    public isVariable: boolean;
    public isAssigned: boolean;

    public constructor(text: string, isAssigned = false, isVariable = false) {
        this.text = text;
        this.isVariable = isVariable;
        this.isAssigned = isAssigned;
    }
}

export class VariableText {
    private symbols: Array<Symbol>;

    public constructor(text: string) {
        this.symbols = new Array<Symbol>();
        this.symbols.push(new Symbol(text));
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
        }
    }

    public assignEmptyVariableSymbol() {
        const unasigned = this.symbols.find(s => !s.isAssigned);
        if (unasigned != undefined && unasigned.text.length < 1) {
            unasigned.isVariable = true;
            unasigned.isAssigned = true;
        }
    }

    public getText(): string {
        return this.symbols.map(s => s.text).join();
    }

    public getFirstUnasignedSymbol(): string {
        const unasignedSymbols = this.symbols.find(s => !s.isAssigned);
        return unasignedSymbols != null ? unasignedSymbols.text : null;
    }

    public getSymbols(): Array<Symbol> {
        return this.symbols;
    }
}