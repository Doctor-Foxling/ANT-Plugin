import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	timeInterval: number;	// Time interval in minutes
	wordCountThreshold: number;	// Word Count Threshold
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	timeInterval: 5,	// Default to 5 minutes
	wordCountThreshold: 500, // Default to 500 words
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
	timer: number | null = null;

	async onload() {
		await this.loadSettings();

		this.startTimer();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'ANT Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new MyPlugginSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

		this.registerEvent(this.app.vault.on('modify', (file: TFile) => {
			this.handleNoteChange(file);
		}));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async handleNoteChange(file: TFile) {
		// Get the content of the file
		const content = await this.app.vault.read(file);
		//Split the content into words and count them
		const wordCount = content.split(/\s+/).filter(Boolean).length;

		//Check if the word count exceeds the threshold
		if (wordCount >= this.settings.wordCountThreshold) {
			// Trigget the quiz
			this.triggerQuiz();
			// Reset or adjust logic as needed to prevent continous triggering
		}
	}
	
	startTimer() {
		// Clear any existing timer to avoid duplicates
		if(this.timer !== null) clearTimeout(this.timer);

		this.timer = window.setTimeout(() => {
			// Trigger the quiz
			this.triggerQuiz();
		}, this.settings.timeInterval * 60000);	// Convert minutes to milliseconds
	}

	triggerQuiz() {
		//Logic to generate or select a quiz question
		console.log("Quiz triggered!");

		// For now, just log a message. Replace this with actual quiz logic
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class MyPlugginSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// Time Interval Setting
		new Setting(containerEl)
			.setName('Time Interval for Quiz Trigger')
			.setDesc('Time Interval in minutes after which a quiz will be triggered.')
			.addText(text => text
				.setPlaceholder('Enter time in minutes')
				.setValue(this.plugin.settings.timeInterval.toString())
				.onChange(async (value) => {
					this.plugin.settings.timeInterval = parseInt(value);
					await this.plugin.saveSettings();
				}));

		// Word Count Threshold Setting
		new Setting(containerEl)
			.setName('Word Count Threshold for Quiz Trigger')
			.setDesc('Number of words added before a quiz is triggered')
			.addText(text => text
				.setPlaceholder('Enter word count')
				.setValue(this.plugin.settings.wordCountThreshold.toString())
				.onChange(async (value) => {
					this.plugin.settings.wordCountThreshold = parseInt(value);
					await this.plugin.saveSettings();
				}));
	}
}
