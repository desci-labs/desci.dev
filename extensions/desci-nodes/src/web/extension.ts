// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ColorsViewProvider from './ColorsViewProvider';
// import ColorsViewProvider from "./ColorsViewProvider";

let lastUrl = '';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "desci-nodes" is now active in the web extension host!');

	// vscode
	// setTimeout(() => {
	//   vscode.commands.executeCommand("workbench.action.decreaseViewSize");
	// }, 4000);

	// vscode.commands.executeCommand(
	//   "vscode.open",
	//   vscode.Uri.parse(
	//     "https://ipfs.desci.com/ipfs/bafkreien5tefogkg2tgxbibesspagorkfjkdo77j6ha3srgcb6pocgu6ke"
	//   )
	// );

	// vscode.commands.executeCommand("vscode.")

	setInterval(async () => {
		const out: string = await vscode.commands.executeCommand('github1s.commands.vscode.getBrowserUrl');
		if (out != lastUrl) {
			console.log('OUT', out, 'LAST', lastUrl);
			lastUrl = out;
			function getParameterByName(name: string) {
				name = name.replace(/[\[\]]/g, '\\$&');
				var regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
					results = regex.exec(out);
				if (!results) {
					return null;
				}
				if (!results[2]) {
					return '';
				}
				return decodeURIComponent(results[2].replace(/\+/g, ' '));
			}
			const path = getParameterByName('folder');
			const file = getParameterByName('file');
			const line = getParameterByName('line');
			const exec = getParameterByName('exec');

			const isNotebook = file && file.indexOf('.ipynb') > -1;

			console.log('debug-desci', { path, file, line, exec, isNotebook });

			// setTimeout(async () => {
			// vscode.commands.executeCommand(
			//   "vscode.open",
			//   `file://${path}/requirements.txt`
			// );
			if (isNotebook) {
				const a = await vscode.workspace.findFiles('*');
				const notebookUri = vscode.Uri.parse(
					`${a[a.length - 1].scheme || 'vscode-remote'}:/${a[a.length - 1].authority}${[path, file]
						.filter(Boolean)
						.join('/')}`
				);
				const s = await vscode.workspace.openNotebookDocument(
					notebookUri
					// vscode.Uri.parse(`vscode-remote://${file}`)
				);
				const st = await vscode.window.showNotebookDocument(s);
				// await vscode.commands.executeCommand('notebook.clearAllCellsOutputs');
				// await vscode.commands.executeCommand("notebook.focusBottom");
				// if (exec) {
				//   await vscode.commands.executeCommand("notebook.clearAllCellsOutputs");
				//   await vscode.commands.executeCommand("notebook.execute", notebookUri);
				// }

				if (line) {
					console.log('GOT LINE', line);
					const newLine = parseInt(line);
					console.log('NEWLINE', newLine);
					// const range = new vscode.NotebookRange(newLine - 1, newLine);
					// st.revealRange(range);
					// st.selections = [new vscode.NotebookRange(newLine - 1, newLine)];
					// vscode.commands.execute;
					for (let i = 0; i < Math.min(newLine, 256); i++) {
						await vscode.commands.executeCommand('notebook.focusNextEditor');
					}
					await vscode.commands.executeCommand('notebook.cell.focusOutOutput');
				}

				// setTimeout(async () => {
				//   await vscode.commands.executeCommand(
				//     "notebook.execute",
				//     vscode.Uri.parse(`vscode-remote://${file}`)
				//   );
				// }, 5000);
			} else if (file) {
				const a = await vscode.workspace.findFiles('*');
				console.log('A', a);
				const notebookUri = vscode.Uri.parse(
					`${a[a.length - 1].scheme || 'vscode-remote'}:/${a[a.length - 1].authority}${[path, file]
						.filter(Boolean)
						.join('/')}`
				);
				const s = await vscode.workspace.openTextDocument(
					notebookUri
					// vscode.Uri.parse(`vscode-remote://${file}`)
				);
				const st = await vscode.window.showTextDocument(s);
				if (line) {
					console.log('GOT LINE', line);
					const newLine = parseInt(line);
					console.log('NEWLINE', newLine);
					const range = new vscode.Range(new vscode.Position(newLine - 1, 0), new vscode.Position(newLine, 0));
					const decoration = vscode.window.createTextEditorDecorationType({
						backgroundColor: 'rgba(0, 150, 150, 0.2)',
					});
					st.revealRange(range);
					console.log('range', range);
					st.setDecorations(decoration, [range]);
				}
			}
		}
	}, 10);

	// vscode.commands.executeCommand("calicoColors.colorsView.focus");

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('helloworld-web-sample.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from helloworld-web-sample in a web extension host!');
	});

	context.subscriptions.push(disposable);

	const provider = new ColorsViewProvider(context.extensionUri);

	context.subscriptions.push(vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider));

	context.subscriptions.push(
		vscode.commands.registerCommand('calicoColors.addColor', () => {
			provider.addColor();
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('calicoColors.clearColors', () => {
			provider.clearColors();
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
