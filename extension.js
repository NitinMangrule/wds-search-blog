// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const { XMLParser, XMLBuilder, XMLValidator} = require("fast-xml-parser");
/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

	const result = await axios.get('https://blog.webdevsimplified.com/rss.xml');
	const parser = new XMLParser();
	const articles = parser.parse(result.data).rss.channel.item.map((article)=> { 
		return {
					label: article.title,
					detail: article.description,
					link: article.link
				}
	});
	// console.log(articles);
	
	let disposable = vscode.commands.registerCommand('wds-search-blog.searchWdsBlog', async function () {
		 const article = await vscode.window.showQuickPick(articles, {
			matchOnDetail:true
		});
		// console.log(article);
		if(article === null) return;
		vscode.env.openExternal(article.link)
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
