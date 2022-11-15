nova.commands.register('submerge.submerge', _ => {
	if (!nova.workspace.path) {
		nova.workspace.showInformativeMessage(nova.localize('This workspace has no path for Sublime Merge to open.'));
		return;
	}

	/* if there is no .git folder, raise an error  */
	workspacePath = nova.workspace.path;
	const files = nova.fs.listdir(workspacePath);
	if (!files.includes('.git')) {
		throw new Error('Workspace is not a git repository');
	}
	var process = new Process('/usr/local/bin/smerge', {
		/* define constant PWD to refer to current directory  */
		args: [nova.workspace.path],
	});

	var lines = [];
	process.onStderr(function(data) {
		if (data) {
			lines.push(data);
		}
	});

	process.onDidExit(function(status) {
		if (status != 0) {
			nova.workspace.showInformativeMessage(nova.localize('Error Launching Sublime Merge:') + '\n\n' + lines.join(''));
		}
	});

	process.start();
});
