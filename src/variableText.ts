export class Symbol {
    public id: number;
    public text: string;
    public isVariable: boolean;

    public constructor(text: string, id = -1, isVariable = false) {
        this.id = id;
        this.text = text;
        this.isVariable = isVariable;
    }
}

export class VariableText {
    private symbols: Array<Symbol>;

    public constructor(text: string) {
        this.symbols = new Array<Symbol>();
        this.symbols.push(new Symbol(text));
    }

    public createSymbol(id: number, value: string): void {
        const newSymbols = new Array<Symbol>();
        let foundSymbol = false;
        this.symbols.forEach(s => {
            if (s.id > -1) {
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
                    newSymbols.push(new Symbol(s.text.substr(index, value.length), id));
                    newSymbols.push(new Symbol(s.text.substring(index + value.length, s.text.length)));
                }
            }
        });

        this.symbols = newSymbols;
    }

    public createVariableSymbol(id: number) {
        const unasigned = this.symbols.find(s => s.id < 0);
        if (unasigned != undefined) {
            unasigned.isVariable = true;
            unasigned.id = id;
        }
    }

    public getText(): string {
        return this.symbols.map(s => s.text).join();
    }

    public getFirstUnasignedSymbol(): string {
        const unasignedSymbols = this.symbols.filter(s => s.id < 0);
        return unasignedSymbols[0] != null ? unasignedSymbols[0].text : null;
    }

    public getSymbols(): Array<Symbol> {
        return this.symbols;
    }
}