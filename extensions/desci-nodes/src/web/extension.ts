// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ColorsViewProvider from './ColorsViewProvider';

let lastUrl = '';
let lastLine = '';
let busy = false;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "desci-nodes" is now active in the web extension host!');

	const origin: string = await vscode.commands.executeCommand('github1s.commands.vscode.getBrowserOrigin');

	const DEFAULT_IPFS_DOMAIN = origin === 'http://localhost:5000' ? 'http://localhost:8089' : 'https://ipfs.desci.com';
	console.log('DEFAULT_IPFS_DOMAIN', DEFAULT_IPFS_DOMAIN, origin);
	function getParameterByName(url: string, name: string) {
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&#]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) {
			return null;
		}
		if (!results[2]) {
			return '';
		}
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	setInterval(async () => {
		const out: string = await vscode.commands.executeCommand('desci.commands.vscode.checkCid');
		const cid = out ? out.split('#')[0] : null;
		const line = getParameterByName(out, 'line');
		if (out !== lastUrl || ((line || lastLine) && line !== lastLine && !busy)) {
			try {
				busy = true;
				if (out !== lastUrl) {
					await vscode.commands.executeCommand('workbench.action.closeAllEditors');
					await new Promise((resolve) => setTimeout(resolve, 500));
				}

				console.log('OUT', out, 'LAST', lastUrl);
				lastUrl = out;
				lastLine = line || '';

				// await vscode.commands.executeCommand('github1s.commands.vscode.replaceBrowserUrl', lastUrl);
				// await vscode.commands.executeCommand('desci.commands.vscode.clear');

				const path = getParameterByName(out, 'folder');
				const file = getParameterByName(out, 'file');

				const exec = getParameterByName(out, 'exec');
				const sidePanel = getParameterByName(out, 'panel');
				const isExternal = getParameterByName(out, 'external') === '1';

				const isNotebook = file && file.indexOf('.ipynb') > -1;

				console.log('debug-desci', { path, file, line, exec, isNotebook, sidePanel });

				// if (sidePanel === '0') {
				// 	vscode.commands.executeCommand('workbench.action.closeSidebar');
				// } else if (sidePanel === '1') {
				// 	vscode.commands.executeCommand('workbench.files.action.showActiveFileInExplorer');
				// }

				if (!file) {
					return;
				}
				if (isNotebook) {
					let shouldRetry = true;
					const MAX_ATTEMPTS = 3;
					let attempts = 0;
					while (shouldRetry && attempts < MAX_ATTEMPTS) {
						let uri: string = 'nouri';
						try {
							await vscode.commands.executeCommand('workbench.action.closeOtherEditors');
							const uri = vscode.Uri.parse(`${DEFAULT_IPFS_DOMAIN}/ipfs/${cid}`);
							// const msg = vscode.window.showInformationMessage(`Loading2 ${cid}`);
							// const s = await vscode.workspace.openNotebookDocument(
							// 	uri
							// 	// vscode.Uri.parse(`vscode-remote://${file}`)
							// );
							await vscode.commands.executeCommand('vscode.openWith', uri, 'jupyter-notebook');
							// let selections:vscode.NotebookRange[] = [];
							// if (line) {
							// let newLine = parseInt(line);
							// const notebookRange = new vscode.NotebookRange(newLine-1, newLine);
							// selections=[notebookRange];
							// }
							// notebookDocument = await vscode.window.showNotebookDocument(s);
							await vscode.commands.executeCommand('workbench.action.closeOtherEditors');
							shouldRetry = false;
						} catch (err) {
							console.error('CAUGHT');
							console.error(err);

							attempts++;
						}
					}

					// vscode.window.showInformationMessage(`3 l${line} s${shouldRetry} ${out}`);

					if (line && !shouldRetry) {
						// vscode.window.showInformationMessage('Loading Reproducibility');

						setTimeout(async () => {
							// vscode.window.showInformationMessage('did open');

							console.log('GOT LINE', line);
							const shiftKeys: { [k: string]: number } = {
								make_table_01: 1,
								make_table_02: 1,
								make_table_03: 2,
								plot_figure_06: 3,
								plot_figure_07: 2,
								plot_figure_08: 2,
								plot_figure_02: -2,
								make_table_04: 1,
								plot_figure_10: 0,
								lllllllllllllnone: 0,
								eps_plotting_script_DeSci: -8,
								grid_resolution_analysis_DeSci: -25,
								'ruu - domain': 20,
							};
							const shiftRes = Object.keys(shiftKeys).find((k) => file.includes(k));
							const shiftDown: number = shiftKeys[shiftRes ? shiftRes : 'lllllllllllllnone'];
							console.log('SHIFT', shiftRes, shiftDown);
							let newLine = parseInt(line);
							if (shiftDown === 0) {
								newLine -= 1;
							} else {
								newLine += shiftDown;
							}
							console.log('NEWLINE', newLine);

							const activeNotebook = vscode.window.activeNotebookEditor;
							console.log(activeNotebook?.selection);
							//   debugger

							// vscode.window.showInformationMessage(`line: ${newLine}`);

							// setTimeout(async () => {
							// 	await vscode.commands.executeCommand(`workbench.action.openEditorAtIndex${newLine}`);
							// }, 500);

							await vscode.commands.executeCommand('notebook.focusTop');
							setTimeout(async () => {
								for (let i = 0; i < newLine + shiftDown; i++) {
									await vscode.commands.executeCommand('notebook.focusNextEditor');
								}

								if (!shiftDown) {
									await vscode.commands.executeCommand('notebook.focusPreviousEditor');
								}

								await vscode.commands.executeCommand('notebook.cell.collapseCellInput');
								await vscode.commands.executeCommand('notebook.centerActiveCell');
								await vscode.commands.executeCommand('notebook.cell.focusInOutput');

								const notebookRange = new vscode.NotebookRange(newLine, newLine);
								console.log('notebookRange', notebookRange);

								// vscode.window.showInformationMessage(
								// 	`range: ${JSON.stringify(notebookRange)} ${JSON.stringify(notebookDocument)}`
								// );
								// notebookDocument!.revealRange(notebookRange, vscode.NotebookEditorRevealType.InCenter);
								// notebookDocument!.selection = notebookRange;
								await vscode.commands.executeCommand('notebook.cell.collapseCellInput');
								await vscode.commands.executeCommand('notebook.cell.focusInOutput');
								// setTimeout(() => {
								// 	vscode.commands.executeCommand('desci.commands.vscode.clear');
								// }, 50);
							}, 100);

							// notebookDocument!.revealRange(notebookRange, vscode.NotebookEditorRevealType.AtTop);
							// notebookDocument!.revealRange(notebookRange, vscode.NotebookEditorRevealType.InCenterIfOutsideViewport);
							// notebookDocument!.revealRange(notebookRange, vscode.NotebookEditorRevealType.Default);
							// notebookDocument!.selection = notebookRange;
							// await vscode.commands.executeCommand('notebook.centerActiveCell');

							// vscode.window.showInformationMessage('bye');
						}, 1000);
						// const range = new vscode.NotebookRange(newLine - 1, newLine);
						// st.revealRange(range);
						// st.selections = [new vscode.NotebookRange(newLine - 1, newLine)];
						// vscode.commands.execute;
						// await vscode.commands.executeCommand('notebook.focusTop');
						// await vscode.commands.executeCommand('notebook.centerActiveCell');
						// for (let i = 0; i < Math.min(newLine, 256); i++) {
						// 	await vscode.commands.executeCommand('notebook.focusNextEditor');
						// 	console.log('focus', i);
						// }
						// setTimeout(async () => {
						// 	await vscode.commands.executeCommand('notebook.cell.focusOutOutput');
						// 	console.log('focusOutOutput');
						// 	setTimeout(async () => {
						// 		await vscode.commands.executeCommand('notebook.centerActiveCell');
						// 		console.log('centerActiveCell');
						// 	});
						// });
					}
				} else if (file) {
					await vscode.commands.executeCommand('workbench.action.closeOtherEditors');
					let tries = 0;
					const MAX_TRIES = 3;
					while (tries < MAX_TRIES) {
						try {
							const IPFS_DOMAIN = isExternal ? 'https://ipfs.io' : DEFAULT_IPFS_DOMAIN;
							const uri = vscode.Uri.parse(`${IPFS_DOMAIN}/ipfs/${cid}`);
							const s = await vscode.workspace.openTextDocument(
								uri
								// vscode.Uri.parse(`vscode-remote://${file}`)
							);
							const st = await vscode.window.showTextDocument(s);

							const ext = file.split('.').pop();
							const langTable: { [k: string]: string } = {
								py: 'python',
								r: 'r',
								R: 'r',
								csv: 'csv',
								txt: 'plaintext',
								md: 'plaintext',
								json: 'json',
								ipynb: 'jupyter-notebook',
								tex: 'tex',
							};

							vscode.languages.setTextDocumentLanguage(s, langTable[ext || 'txt'] || 'plaintext');
							await vscode.commands.executeCommand('workbench.action.closeOtherEditors');

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
							tries = MAX_TRIES + 1;
						} catch (err) {
							tries += 1;
						}
					}
				}
			} catch (err) {
			} finally {
				busy = false;
			}
		}
	}, 10);

	// // The command has been defined in the package.json file
	// // Now provide the implementation of the command with registerCommand
	// // The commandId parameter must match the command field in package.json
	// let disposable = vscode.commands.registerCommand('helloworld-web-sample.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed

	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from helloworld-web-sample in a web extension host!');
	// });

	// context.subscriptions.push(disposable);

	const provider = new ColorsViewProvider(context.extensionUri);

	// context.subscriptions.push(vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider));
	// context.subscriptions.push(
	// 	// vscode.window.createWebviewPanel(ColorsViewProvider.viewType, 'desci', vscode.ViewColumn.One, {})
	// 	vscode.window.registerWebviewViewProvider(ColorsViewProvider.viewType, provider)
	// );
}

// this method is called when your extension is deactivated
export function deactivate() {}
