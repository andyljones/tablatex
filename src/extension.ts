import * as vscode from 'vscode';
import * as SYMBOLS from './latex-unicode.json';

class Provider {

	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.CompletionItem[]> {
		var completions: vscode.CompletionItem[] = [];
		Object.entries(SYMBOLS).forEach((entry) => {

			let item = new vscode.CompletionItem(entry[0], vscode.CompletionItemKind.Text);
			item.insertText = entry[1];

			// I have no idea what a good regex for LaTeX symbol codes looks like.
			let word = document.getWordRangeAtPosition(position, /(?=\\)[\w\\]+/)

			// Cut off at the current cursor position, so that I can tab-complete when inserting
			// latex into an existing word.
			let start = new vscode.Position(position.line, 0);
			let upto = new vscode.Range(start, position);

			item.range = word?.intersection(upto);

			completions.push(item);
		});
		return completions;
	}
}

export function activate(context: vscode.ExtensionContext) {

	console.log('tablatex is now active');

    vscode.languages.getLanguages().then((languages) => {
		languages.push('*');
        context.subscriptions.push(
			vscode.languages.registerCompletionItemProvider(languages, new Provider()));
    });
};

export function deactivate() {};